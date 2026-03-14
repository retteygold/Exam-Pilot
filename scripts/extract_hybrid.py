#!/usr/bin/env python3
"""
Hybrid PDF question extractor - uses pdfplumber first, OCR as fallback.
Much faster than pure OCR for 892 PDFs.
"""

import os
import re
import json
from pathlib import Path
import pdfplumber
from PIL import Image
import pdf2image
import pytesseract

# Configure paths
POPPLER_PATH = r"C:\Users\maushaz.MADIHAA\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_pdfplumber(pdf_path):
    """Extract text using pdfplumber (fast)."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"    pdfplumber error: {e}")
    return text

def extract_text_ocr(pdf_path, poppler_path=None, max_pages=5):
    """Extract text using OCR (slow) - only first few pages for MCQs."""
    text = ""
    try:
        images = pdf2image.convert_from_path(
            pdf_path,
            dpi=150,  # Lower DPI for speed
            first_page=1,
            last_page=max_pages,  # Only process first few pages
            poppler_path=poppler_path
        )
        for img in images:
            page_text = pytesseract.image_to_string(img)
            text += page_text + "\n"
    except Exception as e:
        print(f"    OCR error: {e}")
    return text

def parse_questions(text, paper_info):
    """Parse MCQ questions from text - handles IGCSE and AS/A-Level formats."""
    questions = []
    if not text:
        return questions
    
    lines = text.split('\n')
    
    # Multiple patterns for flexibility
    patterns = [
        # AS/A-Level: "1 (a)", "1(a)", "1 a)", "1a)", "1 a."
        re.compile(r'^(\d{1,2})\s*(?:\(?([a-z])\)?)?[\.\)\s]*\s*(.+?)(?:\s*[A-D][\.\)\s]+|$)', re.IGNORECASE),
        # Simple: "1.", "1)", "1 "
        re.compile(r'^(\d{1,2})[\.\)\s]+\s*(.+?)(?:\s*[A-D][\.\)\s]+|$)', re.IGNORECASE),
    ]
    
    # Option patterns
    option_patterns = [
        re.compile(r'^[\s]*([A-D])[\.\)\s]+\s*(.+)', re.IGNORECASE),  # Line starts with option
        re.compile(r'\s([A-D])[\.\)]\s*([^A-D\n]{3,80})(?=\s[A-D][\.\)]|$)', re.IGNORECASE),  # Inline options
    ]
    
    current_q_num = None
    current_q_part = None
    current_options = []
    question_text = []
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 2:
            continue
        
        # Try to match question start
        q_match = None
        for pattern in patterns:
            q_match = pattern.match(line)
            if q_match:
                break
        
        if q_match:
            # Save previous question if valid
            if current_q_num and len(current_options) >= 2:
                q_id = f"{current_q_num}{current_q_part or ''}"
                questions.append({
                    'id': f"{paper_info['subject']}-y{paper_info['year']}-p{paper_info['paper']}-q{q_id}",
                    'subject': paper_info['subject'],
                    'yearGroup': paper_info['year_group'],
                    'difficulty': 'medium',
                    'topic': 'general',
                    'marks': 1,
                    'question': ' '.join(question_text).strip()[:500],
                    'options': [opt[1][:300] for opt in sorted(current_options, key=lambda x: x[0])[:4]],
                    'correctAnswer': 0,
                    'explanation': '',
                    'examStyle': True,
                    'timeLimit': 60,
                    'verified': False,
                    'source': {
                        'pdf': paper_info['pdf_name'],
                        'year': paper_info['year'],
                        'session': paper_info.get('session', 'Unknown'),
                        'paper': paper_info['paper'],
                        'question_number': q_id
                    }
                })
            
            # Start new question
            current_q_num = q_match.group(1)
            current_q_part = q_match.group(2) if len(q_match.groups()) > 1 else None
            question_text = [q_match.group()]
            current_options = []
        
        # Try to match options
        for opt_pattern in option_patterns:
            opt_matches = opt_pattern.findall(line)
            for opt_letter, opt_text in opt_matches:
                if opt_letter.upper() not in [o[0] for o in current_options]:
                    current_options.append((opt_letter.upper(), opt_text.strip()))
        
        # Continue question text if not option line
        if current_q_num and not any(p.match(line) for p in patterns):
            question_text.append(line)
    
    # Save last question
    if current_q_num and len(current_options) >= 2:
        q_id = f"{current_q_num}{current_q_part or ''}"
        questions.append({
            'id': f"{paper_info['subject']}-y{paper_info['year']}-p{paper_info['paper']}-q{q_id}",
            'subject': paper_info['subject'],
            'yearGroup': paper_info['year_group'],
            'difficulty': 'medium',
            'topic': 'general',
            'marks': 1,
            'question': ' '.join(question_text).strip()[:500],
            'options': [opt[1][:300] for opt in sorted(current_options, key=lambda x: x[0])[:4]],
            'correctAnswer': 0,
            'explanation': '',
            'examStyle': True,
            'timeLimit': 60,
            'verified': False,
            'source': {
                'pdf': paper_info['pdf_name'],
                'year': paper_info['year'],
                'session': paper_info.get('session', 'Unknown'),
                'paper': paper_info['paper'],
                'question_number': q_id
            }
        })
    
    # Filter to only questions with exactly 4 options
    return [q for q in questions if len(q['options']) == 4]

def extract_paper_info(pdf_path, subject, year_group):
    """Extract paper metadata from PDF filename."""
    pdf_name = os.path.basename(pdf_path)
    
    year_match = re.search(r'(20\d{2})', pdf_name)
    year = int(year_match.group(1)) if year_match else 2024
    
    # Extract unit/paper number
    unit_match = re.search(r'[uU]nit\s*(\d{1,2})', pdf_name)
    paper_match = re.search(r'[_\-][pP](\d{1,2})', pdf_name)
    paper = unit_match.group(1) if unit_match else (paper_match.group(1) if paper_match else '1')
    
    session = 'Unknown'
    if any(x in pdf_name.lower() for x in ['s', 'summer', 'may', 'jun', '06']):
        session = 'May/June'
    elif any(x in pdf_name.lower() for x in ['w', 'winter', 'nov', 'oct', '10']):
        session = 'Oct/Nov'
    elif any(x in pdf_name.lower() for x in ['m', 'march', 'mar', '03']):
        session = 'March'
    elif '01' in pdf_name:
        session = 'January'
    
    return {
        'pdf_name': pdf_name,
        'subject': subject,
        'year_group': year_group,
        'year': year,
        'paper': paper,
        'session': session
    }

def process_pdf(pdf_path, subject, year_group):
    """Process a single PDF - text first, OCR fallback."""
    paper_info = extract_paper_info(pdf_path, subject, year_group)
    
    # Skip mark schemes (ms files)
    if 'ms' in pdf_path.lower() or 'mark' in pdf_path.lower():
        return []
    
    # Try text extraction first (fast)
    text = extract_text_pdfplumber(pdf_path)
    questions = parse_questions(text, paper_info)
    
    if questions:
        return questions
    
    # Fallback to OCR (slow) if no questions found
    if len(text) < 100:  # Only OCR if text extraction was poor
        print(f"    Falling back to OCR...")
        text = extract_text_ocr(pdf_path, POPPLER_PATH if os.path.exists(POPPLER_PATH) else None)
        questions = parse_questions(text, paper_info)
    
    return questions

def process_subject_folder(folder_path, subject, year_group, output_json):
    """Process all PDFs in a subject folder."""
    folder = Path(folder_path)
    if not folder.exists():
        print(f"Folder not found: {folder}")
        return 0
    
    pdf_files = list(folder.rglob('*.pdf'))
    # Filter to only question papers (qp), not mark schemes (ms)
    qp_files = [p for p in pdf_files if 'qp' in p.name.lower() or 'question' in p.name.lower()]
    if not qp_files:
        qp_files = pdf_files  # Use all if no QP files found
    
    print(f"Found {len(qp_files)} question papers in {folder}")
    
    all_questions = []
    
    for i, pdf_path in enumerate(qp_files, 1):
        print(f"[{i}/{len(qp_files)}] {pdf_path.name}...", end=' ')
        questions = process_pdf(str(pdf_path), subject, year_group)
        print(f"{len(questions)} questions")
        all_questions.extend(questions)
    
    # Save to JSON
    output_data = {
        'metadata': {
            'subject': subject,
            'total_questions': len(all_questions),
            'description': f'{len(all_questions)} {subject} MCQs from past papers',
            'years': sorted(list(set(q['source']['year'] for q in all_questions))),
            'verified': False,
            'verified_count': 0,
            'accuracy': 'Auto-extracted - verification needed'
        },
        'questions': all_questions
    }
    
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"Saved {len(all_questions)} questions to {output_json}")
    print(f"{'='*60}")
    
    return len(all_questions)

if __name__ == '__main__':
    subjects = [
        {
            'folder': r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11',
            'subject': 'as_biology',
            'year_group': 'year12',
            'output': r'E:\Apps\past-paper\gcse-prep-app\public\as_biology_wbi11_questions_new.json'
        },
        {
            'folder': r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_O-Level\Biology',
            'subject': 'o_level_biology',
            'year_group': 'year11',
            'output': r'E:\Apps\past-paper\gcse-prep-app\public\o_level_biology_questions.json'
        },
        {
            'folder': r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_O-Level\Accounting 7707',
            'subject': 'o_level_accounting',
            'year_group': 'year11',
            'output': r'E:\Apps\past-paper\gcse-prep-app\public\o_level_accounting_7707_questions.json'
        },
        {
            'folder': r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Economics',
            'subject': 'as_economics',
            'year_group': 'year12',
            'output': r'E:\Apps\past-paper\gcse-prep-app\public\as_economics_questions.json'
        },
        {
            'folder': r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Mathematics',
            'subject': 'as_mathematics',
            'year_group': 'year12',
            'output': r'E:\Apps\past-paper\gcse-prep-app\public\as_mathematics_questions.json'
        },
        {
            'folder': r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Physics',
            'subject': 'as_physics',
            'year_group': 'year12',
            'output': r'E:\Apps\past-paper\gcse-prep-app\public\as_physics_questions.json'
        }
    ]
    
    total = 0
    for subj in subjects:
        print(f"\n{'='*60}")
        print(f"Processing {subj['subject']}...")
        print(f"{'='*60}")
        count = process_subject_folder(subj['folder'], subj['subject'], subj['year_group'], subj['output'])
        total += count
    
    print(f"\n{'='*60}")
    print(f"TOTAL QUESTIONS EXTRACTED: {total}")
    print(f"{'='*60}")

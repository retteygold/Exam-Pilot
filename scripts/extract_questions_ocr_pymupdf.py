#!/usr/bin/env python3
"""
OCR-based PDF question extractor using PyMuPDF (no poppler needed).
Renders PDF pages to images and uses Tesseract OCR.
"""

import os
import re
import json
import fitz  # PyMuPDF
from pathlib import Path
from PIL import Image
import pytesseract
import io

# Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def pdf_page_to_image(doc, page_num, zoom=2):
    """Convert PDF page to PIL Image using PyMuPDF."""
    page = doc[page_num]
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    img_data = pix.tobytes("png")
    img = Image.open(io.BytesIO(img_data))
    return img

def ocr_image(img):
    """Extract text from image using Tesseract OCR."""
    text = pytesseract.image_to_string(img)
    return text

def parse_questions_from_text(text, paper_info):
    """Parse MCQ questions from OCR text."""
    questions = []
    lines = text.split('\n')
    
    # Patterns for question detection
    question_pattern = re.compile(r'^(\d{1,2})[\s\.\)]\s*(.+)', re.IGNORECASE)
    option_pattern = re.compile(r'^[\s]*([A-D])[\s\.\)]\s*(.+)', re.IGNORECASE)
    
    current_question = None
    current_options = []
    question_text_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        
        # Check if this is a question start
        q_match = question_pattern.match(line)
        if q_match:
            # Save previous question if exists
            if current_question and len(current_options) == 4:
                questions.append({
                    'id': f"{paper_info['subject']}-y{paper_info['year']}-p{paper_info['paper']}-q{current_question}",
                    'subject': paper_info['subject'],
                    'yearGroup': paper_info['year_group'],
                    'difficulty': 'medium',
                    'topic': 'general',
                    'marks': 1,
                    'question': '\n'.join(question_text_lines).strip(),
                    'options': [opt[1] for opt in sorted(current_options, key=lambda x: x[0])],
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
                        'question_number': str(current_question)
                    }
                })
            
            # Start new question
            current_question = q_match.group(1)
            question_text_lines = [q_match.group(2)]
            current_options = []
        
        # Check if this is an option
        opt_match = option_pattern.match(line)
        if opt_match and current_question:
            option_letter = opt_match.group(1).upper()
            option_text = opt_match.group(2)
            current_options.append((option_letter, option_text))
        elif current_question and not q_match:
            # Continue question text
            question_text_lines.append(line)
        
        i += 1
    
    # Don't forget the last question
    if current_question and len(current_options) == 4:
        questions.append({
            'id': f"{paper_info['subject']}-y{paper_info['year']}-p{paper_info['paper']}-q{current_question}",
            'subject': paper_info['subject'],
            'yearGroup': paper_info['year_group'],
            'difficulty': 'medium',
            'topic': 'general',
            'marks': 1,
            'question': '\n'.join(question_text_lines).strip(),
            'options': [opt[1] for opt in sorted(current_options, key=lambda x: x[0])],
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
                'question_number': str(current_question)
            }
        })
    
    return questions

def extract_paper_info(pdf_path, subject, year_group):
    """Extract paper metadata from PDF filename."""
    pdf_name = os.path.basename(pdf_path)
    
    # Extract year
    year_match = re.search(r'(20\d{2})', pdf_name)
    year = int(year_match.group(1)) if year_match else 2024
    
    # Extract paper number
    paper_match = re.search(r'[pP](\d{1,2})', pdf_name)
    paper = paper_match.group(1) if paper_match else '1'
    
    # Extract session
    session = 'Unknown'
    if 's' in pdf_name.lower() or 'summer' in pdf_name.lower() or 'may' in pdf_name.lower() or 'jun' in pdf_name.lower():
        session = 'May/June'
    elif 'w' in pdf_name.lower() or 'winter' in pdf_name.lower() or 'nov' in pdf_name.lower() or 'oct' in pdf_name.lower():
        session = 'Oct/Nov'
    elif 'm' in pdf_name.lower() or 'march' in pdf_name.lower() or 'mar' in pdf_name.lower():
        session = 'March'
    elif 'jan' in pdf_name.lower():
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
    """Process a single PDF file using PyMuPDF."""
    paper_info = extract_paper_info(pdf_path, subject, year_group)
    
    try:
        # Open PDF with PyMuPDF
        doc = fitz.open(pdf_path)
        all_questions = []
        
        for page_num in range(len(doc)):
            # Convert page to image
            img = pdf_page_to_image(doc, page_num)
            # OCR the image
            text = ocr_image(img)
            # Parse questions from text
            questions = parse_questions_from_text(text, paper_info)
            all_questions.extend(questions)
        
        doc.close()
        return all_questions
    except Exception as e:
        print(f"  Error: {e}")
        return []

def process_subject_folder(folder_path, subject, year_group, output_json):
    """Process all PDFs in a subject folder."""
    folder = Path(folder_path)
    if not folder.exists():
        print(f"Folder not found: {folder}")
        return 0
    
    pdf_files = list(folder.rglob('*.pdf'))
    print(f"Found {len(pdf_files)} PDFs in {folder}")
    
    all_questions = []
    
    for i, pdf_path in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}] {pdf_path.name}")
        questions = process_pdf(str(pdf_path), subject, year_group)
        print(f"  Extracted {len(questions)} questions")
        all_questions.extend(questions)
    
    # Save to JSON
    output_data = {
        'metadata': {
            'subject': subject,
            'total_questions': len(all_questions),
            'description': f'{len(all_questions)} {subject} MCQs from past papers (OCR extracted)',
            'years': sorted(list(set(q['source']['year'] for q in all_questions))),
            'verified': False,
            'verified_count': 0,
            'accuracy': 'Auto-extracted via OCR - verification needed',
            'ocr_extracted': True
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
    # Define subjects to process
    subjects = [
        {
            'folder': r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11',
            'subject': 'as_biology',
            'year_group': 'year12',
            'output': r'E:\Apps\past-paper\gcse-prep-app\public\as_biology_wbi11_questions_ocr.json'
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
    
    # Process all subjects
    total_questions = 0
    for subj in subjects:
        print(f"\n{'='*60}")
        print(f"Processing {subj['subject']}...")
        print(f"{'='*60}")
        count = process_subject_folder(subj['folder'], subj['subject'], subj['year_group'], subj['output'])
        total_questions += count
    
    print(f"\n{'='*60}")
    print(f"TOTAL QUESTIONS EXTRACTED: {total_questions}")
    print(f"{'='*60}")

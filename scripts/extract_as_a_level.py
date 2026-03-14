#!/usr/bin/env python3
"""
AS/A-Level specific extractor - handles structured questions with parts.
"""

import os
import re
import json
from pathlib import Path
from PIL import Image
import pdf2image
import pytesseract

# Paths
POPPLER_PATH = r"C:\Users\maushaz.MADIHAA\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_pdf(pdf_path, start_page=3, end_page=12):
    """Extract text from PDF pages using OCR."""
    try:
        images = pdf2image.convert_from_path(
            pdf_path,
            dpi=150,
            first_page=start_page,
            last_page=end_page,
            poppler_path=POPPLER_PATH
        )
        
        all_text = ""
        for i, img in enumerate(images):
            page_text = pytesseract.image_to_string(img)
            all_text += f"\n--- Page {start_page + i} ---\n{page_text}"
        
        return all_text
    except Exception as e:
        print(f"    OCR error: {e}")
        return ""

def parse_structured_questions(text):
    """Parse AS/A-Level structured questions from OCR text."""
    questions = []
    lines = text.split('\n')
    
    current_main_q = None
    current_part = None
    current_text = []
    current_options = []
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line or len(line) < 2:
            continue
        
        # Skip watermarks and noise
        if any(skip in line for skip in ['DO-NOT', 'WRITEIN', 'THIS AREA', 'VANV', 'SIH', 'LON OG']):
            continue
        
        # Match main question: "2.", "3." etc
        main_match = re.match(r'^(\d{1,2})[\.\)]\s*(.+)', line)
        
        # Match part: "(a)", "(i)", "(ii)" etc
        part_match = re.match(r'^\(([a-z]+)\)\s*(.+)', line)
        
        # Match simple option lines (like "1:1", "A.", etc)
        opt_match = re.match(r'^([A-D]|\d+:\d+|[\d\.]+)\s*$', line)
        
        # If we have a complete question with 4 options, save it
        if (main_match or part_match) and current_options and len(current_options) >= 2:
            if current_part:
                q_id = f"{current_main_q}({current_part})"
            else:
                q_id = current_main_q
            
            if q_id and len(current_options) >= 2:
                questions.append({
                    'id': q_id,
                    'text': ' '.join(current_text)[:600],
                    'options': current_options[:4]
                })
            
            current_options = []
            current_text = []
        
        if main_match:
            current_main_q = main_match.group(1)
            current_part = None
            current_text = [main_match.group(2)]
        elif part_match:
            current_part = part_match.group(1)
            current_text.append(part_match.group(2))
        elif opt_match:
            # This is an option
            opt_val = line.strip()
            if opt_val not in current_options:
                current_options.append(opt_val)
        elif current_main_q:
            # Continue question text
            # Check for inline options pattern
            inline_opts = re.findall(r'([A-D])[\.\)]\s*([^A-D\n]{5,100}?)(?=\s+[A-D][\.\)]|$)', line)
            if inline_opts:
                for opt_letter, opt_text in inline_opts:
                    current_options.append(f"{opt_letter}. {opt_text.strip()}")
                # Remove option part from text
                clean_line = re.sub(r'\s[A-D][\.\)]\s*[^A-D]{5,100}', ' ', line)
                if clean_line.strip():
                    current_text.append(clean_line.strip())
            else:
                current_text.append(line)
    
    # Don't forget the last question
    if current_main_q and current_options and len(current_options) >= 2:
        q_id = f"{current_main_q}({current_part})" if current_part else current_main_q
        questions.append({
            'id': q_id,
            'text': ' '.join(current_text)[:600],
            'options': current_options[:4]
        })
    
    return questions

def process_pdf(pdf_path, subject, year_group):
    """Process a single PDF."""
    # Skip mark schemes
    if 'ms' in pdf_path.lower() or 'mark' in pdf_path.lower():
        return []
    
    pdf_name = os.path.basename(pdf_path)
    
    # Extract year and session from filename
    year_match = re.search(r'(20\d{2})', pdf_name)
    year = int(year_match.group(1)) if year_match else 2024
    
    session = 'Unknown'
    if 's' in pdf_name.lower() or '06' in pdf_name:
        session = 'May/June'
    elif 'w' in pdf_name.lower() or '10' in pdf_name or '11' in pdf_name:
        session = 'Oct/Nov'
    elif 'm' in pdf_name.lower() or '01' in pdf_name:
        session = 'January'
    
    unit_match = re.search(r'[uU]nit(\d)', pdf_name)
    unit = unit_match.group(1) if unit_match else '1'
    
    text = extract_text_from_pdf(pdf_path)
    questions = parse_structured_questions(text)
    
    # Format for upload
    formatted = []
    for q in questions:
        formatted.append({
            'id': f"{subject}-y{year}-u{unit}-q{q['id']}",
            'subject': subject,
            'yearGroup': year_group,
            'difficulty': 'medium',
            'topic': 'general',
            'marks': 1,
            'question': q['text'],
            'options': q['options'],
            'correctAnswer': 0,
            'explanation': '',
            'examStyle': True,
            'timeLimit': 60,
            'verified': False,
            'source': {
                'pdf': pdf_name,
                'year': year,
                'session': session,
                'unit': unit,
                'question_number': q['id']
            }
        })
    
    return formatted

def process_subject(name, folder, subject_key, year_group, output_file):
    """Process all PDFs in a subject folder."""
    print(f"\n{'='*60}")
    print(f"Processing {name}...")
    print(f"{'='*60}")
    
    pdf_files = list(Path(folder).rglob('*.pdf'))
    qp_files = [p for p in pdf_files if 'qp' in p.name.lower() and 'ms' not in p.name.lower()]
    
    print(f"Found {len(qp_files)} question papers")
    
    all_questions = []
    
    for i, pdf_path in enumerate(qp_files, 1):
        print(f"[{i}/{len(qp_files)}] {pdf_path.name}...", end=' ', flush=True)
        questions = process_pdf(str(pdf_path), subject_key, year_group)
        print(f"{len(questions)} questions")
        all_questions.extend(questions)
    
    # Save
    data = {
        'metadata': {
            'subject': name,
            'total_questions': len(all_questions),
            'years': sorted(list(set(q['source']['year'] for q in all_questions))),
            'verified': False,
            'verified_count': 0,
            'description': f'{len(all_questions)} {name} MCQs from past papers'
        },
        'questions': all_questions
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(all_questions)} questions to {output_file}")
    return len(all_questions)

if __name__ == '__main__':
    subjects = [
        ('AS Biology', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11', 
         'as_biology', 'year12', r'E:\Apps\past-paper\gcse-prep-app\public\as_biology_wbi11_questions_ocr.json'),
    ]
    
    total = 0
    for name, folder, key, year_group, output in subjects:
        count = process_subject(name, folder, key, year_group, output)
        total += count
    
    print(f"\n{'='*60}")
    print(f"TOTAL: {total} questions extracted")
    print(f"{'='*60}")

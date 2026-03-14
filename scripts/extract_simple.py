#!/usr/bin/env python3
"""
Simple OCR extractor - processes PDFs page by page with Tesseract.
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

def ocr_pdf(pdf_path, max_pages=10):
    """OCR first N pages of PDF."""
    try:
        images = pdf2image.convert_from_path(
            pdf_path,
            dpi=200,
            first_page=1,
            last_page=max_pages,
            poppler_path=POPPLER_PATH
        )
        
        text = ""
        for img in images:
            page_text = pytesseract.image_to_string(img)
            text += page_text + "\n"
        return text
    except Exception as e:
        print(f"OCR error: {e}")
        return ""

def parse_mcq(text):
    """Parse MCQ questions from OCR text."""
    questions = []
    
    # Look for patterns like "1. text" followed by "A. text B. text C. text D. text"
    # AS/A-Level format: questions 1-40 with parts (a), (b), etc.
    
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        # Match question number with optional part: "1", "1.", "1)", "1 (a)", "1(a)"
        q_match = re.match(r'^(\d{1,2})\s*(?:\(?([a-z])\)?)?[\.\)]?\s+(.+)', line)
        if q_match:
            q_num = q_match.group(1)
            q_part = q_match.group(2) or ''
            q_text = q_match.group(3)
            
            # Look for options in next few lines
            options = []
            for j in range(i+1, min(i+8, len(lines))):
                opt_line = lines[j].strip()
                opt_match = re.match(r'^([A-D])[\.\)]\s+(.+)', opt_line)
                if opt_match:
                    options.append((opt_match.group(1), opt_match.group(2)))
                elif opt_line and not opt_line.startswith('A') and not opt_line.startswith('B'):
                    # Check if options are inline
                    inline_opts = re.findall(r'([A-D])[\.\)]\s*([^A-D]{3,60}?)(?=\s+[A-D][\.\)]|$)', opt_line)
                    if len(inline_opts) >= 2:
                        options.extend(inline_opts)
                        break
            
            if len(options) == 4:
                q_id = f"{q_num}{q_part}"
                questions.append({
                    'number': q_id,
                    'text': q_text[:500],
                    'options': [o[1][:300] for o in sorted(options, key=lambda x: x[0])]
                })
    
    return questions

def process_subject(name, folder, output_file):
    """Process all PDFs in a subject folder."""
    print(f"\n{'='*60}")
    print(f"Processing {name}...")
    print(f"{'='*60}")
    
    pdf_files = list(Path(folder).rglob('*.pdf'))
    # Only process question papers (qp), not mark schemes (ms)
    qp_files = [p for p in pdf_files if 'qp' in p.name.lower() and 'ms' not in p.name.lower()]
    
    print(f"Found {len(qp_files)} question papers")
    
    all_questions = []
    
    for i, pdf_path in enumerate(qp_files[:50], 1):  # Process first 50 for testing
        print(f"[{i}/{len(qp_files[:50])}] {pdf_path.name}...", end=' ', flush=True)
        
        text = ocr_pdf(str(pdf_path), max_pages=8)
        questions = parse_mcq(text)
        
        print(f"{len(questions)} questions")
        
        for q in questions:
            all_questions.append({
                'id': f"{name.lower().replace(' ', '_')}-q{q['number']}-{i}",
                'subject': name.lower().replace(' ', '_'),
                'yearGroup': 'year12' if 'as_' in name.lower() else 'year11',
                'question': q['text'],
                'options': q['options'],
                'correctAnswer': 0,
                'verified': False,
                'source': {'pdf': pdf_path.name, 'question_number': q['number']}
            })
    
    # Save
    data = {
        'metadata': {
            'subject': name,
            'total_questions': len(all_questions),
            'description': f'{len(all_questions)} {name} MCQs'
        },
        'questions': all_questions
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"Saved {len(all_questions)} questions to {output_file}")
    return len(all_questions)

if __name__ == '__main__':
    subjects = [
        ('AS Biology', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11', 
         r'E:\Apps\past-paper\gcse-prep-app\public\as_biology_wbi11_questions_ocr.json'),
    ]
    
    total = 0
    for name, folder, output in subjects:
        count = process_subject(name, folder, output)
        total += count
    
    print(f"\nTotal: {total} questions extracted")

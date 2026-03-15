#!/usr/bin/env python3
"""
Simplified AS/A-Level extractor - focuses on clean MCQ extraction from saved images.
"""

import os
import re
import json
from pathlib import Path
from PIL import Image
import pdf2image
import pytesseract

POPPLER_PATH = r"C:\Users\maushaz.MADIHAA\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def pdf_to_images(pdf_path, output_folder, start_page=3, end_page=12):
    """Convert PDF pages to saved PNG images."""
    try:
        pdf_name = os.path.basename(pdf_path).replace('.pdf', '')
        pdf_folder = os.path.join(output_folder, pdf_name)
        os.makedirs(pdf_folder, exist_ok=True)
        
        images = pdf2image.convert_from_path(
            pdf_path, dpi=200,
            first_page=start_page, last_page=end_page,
            poppler_path=POPPLER_PATH
        )
        
        paths = []
        for i, img in enumerate(images):
            page = start_page + i
            path = os.path.join(pdf_folder, f"page_{page:03d}.png")
            img.save(path, "PNG")
            paths.append(path)
        return paths
    except Exception as e:
        print(f"  Error: {e}")
        return []

def ocr_image(img_path):
    """OCR a saved image."""
    try:
        img = Image.open(img_path)
        text = pytesseract.image_to_string(img, config='--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789().,;:!?-\'\"= ')
        img.close()
        return text
    except Exception as e:
        return ""

def clean_text(text):
    """Remove OCR noise."""
    # Remove mark indicators [1], [2], etc
    text = re.sub(r'\[\d+\]', '', text)
    # Remove lines of special chars
    text = re.sub(r'[=\-—_*]{3,}', ' ', text)
    # Normalize spaces
    text = re.sub(r'\s+', ' ', text)
    return text

def extract_mcqs(text):
    """Extract MCQs from OCR text - simple pattern matching."""
    questions = []
    text = clean_text(text)
    
    # Look for patterns like:
    # (a) question text... A. option B. option C. option D. option
    
    # Match sub-questions (a), (b), (c), (d), (i), (ii), etc
    pattern = r'\(([a-z]|i{1,3}|iv|vi{0,3})\)\s*(.*?)(?=(?=\([a-z]\)\s|\Z))'
    matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
    
    for part, content in matches:
        content = content.strip()
        if not content:
            continue
            
        # Look for options A-D in the content
        opts = re.findall(r'([A-D])[\.\)]\s*([^A-D]{3,100}?)(?=\s*[A-D][\.\)]|$)', content)
        
        if len(opts) >= 2:
            # Found options - extract question text (everything before first option)
            first_opt = content.find(opts[0][0] + '.')
            if first_opt == -1:
                first_opt = content.find(opts[0][0] + ')')
            
            q_text = content[:first_opt].strip() if first_opt > 0 else content
            
            # Clean up question text
            q_text = re.sub(r'^[^a-zA-Z]*', '', q_text)  # Remove leading non-letters
            
            options = [f"{letter}. {text.strip()}" for letter, text in opts[:4]]
            
            questions.append({
                'id': f'({part})',
                'text': q_text[:500],
                'options': options
            })
    
    return questions

def process_pdf(pdf_path, subject, year_group, image_folder):
    """Process single PDF."""
    if 'ms' in pdf_path.lower():
        return []
    
    pdf_name = os.path.basename(pdf_path)
    year_match = re.search(r'(20\d{2})', pdf_name)
    year = int(year_match.group(1)) if year_match else 2024
    
    session = 'May/June' if 's' in pdf_name.lower() or '06' in pdf_name else \
              'Oct/Nov' if 'w' in pdf_name.lower() or '10' in pdf_name else 'January'
    
    unit_match = re.search(r'[uU]nit(\d)', pdf_name)
    unit = unit_match.group(1) if unit_match else '1'
    
    # Convert to images
    img_paths = pdf_to_images(pdf_path, image_folder)
    if not img_paths:
        return []
    
    all_questions = []
    for img_path in img_paths:
        text = ocr_image(img_path)
        questions = extract_mcqs(text)
        all_questions.extend(questions)
    
    # Format
    formatted = []
    for q in all_questions:
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

if __name__ == '__main__':
    # Test with just 3 PDFs
    folder = r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11'
    image_folder = r'E:\Apps\past-paper\gcse-prep-app\public\pdf_images'
    
    pdf_files = list(Path(folder).rglob('*.pdf'))
    qp_files = [p for p in pdf_files if 'qp' in p.name.lower() and 'ms' not in p.name.lower()][:3]
    
    print(f"Processing {len(qp_files)} PDFs...\n")
    
    all_qs = []
    for pdf_path in qp_files:
        print(f"{pdf_path.name}...")
        qs = process_pdf(str(pdf_path), 'as_biology', 'year12', image_folder)
        print(f"  -> {len(qs)} questions")
        all_qs.extend(qs)
    
    print(f"\nTOTAL: {len(all_qs)} questions\n")
    
    # Show sample
    for q in all_qs[:3]:
        print(f"ID: {q['id']}")
        print(f"Q: {q['question'][:100]}...")
        print(f"Opts: {q['options']}")
        print()
    
    # Save test output
    with open('test_output.json', 'w') as f:
        json.dump(all_qs, f, indent=2)
    print("Saved to test_output.json")

#!/usr/bin/env python3
"""
AS/A-Level extractor using PSM 4 (single column) mode for better table handling.
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
    """Convert PDF to saved PNG images."""
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

def ocr_with_psm4(img_path):
    """OCR using PSM 4 (single column) mode."""
    try:
        img = Image.open(img_path)
        text = pytesseract.image_to_string(img, config='--oem 3 --psm 4')
        img.close()
        return text
    except Exception as e:
        return ""

def extract_questions(text):
    """Extract questions from OCR text."""
    questions = []
    
    # Clean text
    text = re.sub(r'\(Total for Question \d+ = \d+ marks?\)', '', text)
    text = re.sub(r'Turn over', '', text)
    text = re.sub(r'P60.*', '', text)
    text = re.sub(r'\s+', ' ', text)
    
    # Pattern: (letter) question text followed by A/B/C/D options
    # Match (a), (b), (c), (d) or (i), (ii), (iii), (iv) sections
    pattern = r'\(([a-d]|[i-v]+)\)\s*(.*?)\s+(?=[(][a-d][)]|[(][i-v]+[)]|A\s+[A-Za-z]|$)'
    
    # Alternative: Match question parts with options
    # Look for patterns like "(i) question text A option B option"
    parts = re.split(r'\s*\(([i-v]+)\)\s*', text)
    
    if len(parts) > 1:
        for i in range(1, len(parts), 2):
            part_id = parts[i]
            content = parts[i+1] if i+1 < len(parts) else ""
            
            # Look for A/B/C/D options in content
            opts = re.findall(r'([A-D])\s+([A-Za-z\-]+)', content)
            
            if len(opts) >= 2:
                # Extract question text (before first option)
                first_opt_pos = content.find(opts[0][0])
                q_text = content[:first_opt_pos].strip() if first_opt_pos > 0 else content
                
                # Clean question text
                q_text = re.sub(r'\d+\s*$', '', q_text)  # Remove trailing numbers
                q_text = re.sub(r'\s+', ' ', q_text)
                
                options = [f"{letter}. {text}" for letter, text in opts[:4]]
                
                questions.append({
                    'id': f'({part_id})',
                    'text': q_text[:400],
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
    
    session = 'May/June' if 's' in pdf_name.lower() else 'Oct/Nov' if 'w' in pdf_name.lower() else 'January'
    unit_match = re.search(r'[uU]nit(\d)', pdf_name)
    unit = unit_match.group(1) if unit_match else '1'
    
    # Convert to images
    img_paths = pdf_to_images(pdf_path, image_folder)
    if not img_paths:
        return []
    
    all_questions = []
    for img_path in img_paths:
        text = ocr_with_psm4(img_path)
        questions = extract_questions(text)
        all_questions.extend(questions)
    
    # Deduplicate
    seen = set()
    unique = []
    for q in all_questions:
        if q['id'] not in seen:
            seen.add(q['id'])
            unique.append(q)
    
    # Format
    formatted = []
    for q in unique:
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
    folder = r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11'
    image_folder = r'E:\Apps\past-paper\gcse-prep-app\public\pdf_images'
    
    pdf_files = list(Path(folder).rglob('*.pdf'))
    qp_files = [p for p in pdf_files if 'qp' in p.name.lower() and 'ms' not in p.name.lower()][:3]
    
    print(f"Processing {len(qp_files)} PDFs with PSM 4...\n")
    
    all_qs = []
    for pdf_path in qp_files:
        print(f"{pdf_path.name}...")
        qs = process_pdf(str(pdf_path), 'as_biology', 'year12', image_folder)
        print(f"  -> {len(qs)} questions")
        all_qs.extend(qs)
    
    print(f"\n=== TOTAL: {len(all_qs)} questions ===\n")
    
    for q in all_qs[:5]:
        print(f"ID: {q['id']}")
        print(f"Q: {q['question']}")
        print(f"Options: {q['options']}")
        print()
    
    with open('test_psm4.json', 'w') as f:
        json.dump(all_qs, f, indent=2)
    print("Saved to test_psm4.json")

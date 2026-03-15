#!/usr/bin/env python3
"""
AS/A-Level extractor - captures complete question with main stem + sub-parts.
Uses PSM 4 for better table handling.
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

def ocr_page(img_path):
    """OCR a single page."""
    try:
        img = Image.open(img_path)
        text = pytesseract.image_to_string(img, config='--oem 3 --psm 4')
        img.close()
        return text
    except:
        return ""

def clean_ocr(text):
    """Clean OCR artifacts."""
    # Remove watermarks and page markers
    text = re.sub(r'DO[\s\-]*NOT\s*WRITE\s*IN\s*THIS\s*AREA', '', text)
    text = re.sub(r'\(Total for Question \d+ = \d+ marks?\)', '', text)
    text = re.sub(r'Turn over', '', text)
    text = re.sub(r'P60[\d\sA]+', '', text)
    text = re.sub(r'[\-—_]{2,}', ' ', text)  # Remove lines
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_mcqs(text):
    """Extract MCQs from page text."""
    questions = []
    text = clean_ocr(text)
    
    # Look for question patterns:
    # 1. Question number at start: "1. " or "2. "
    # 2. Sub-parts: "(a)", "(b)", "(i)", "(ii)"
    # 3. Options: A/B/C/D followed by text
    
    # Split by question number (lines starting with number)
    parts = re.split(r'\s*(?=\b\d+\s*[\.\)])', text)
    
    for part in parts:
        part = part.strip()
        if not part or len(part) < 20:
            continue
            
        # Get main question number
        q_match = re.match(r'(\d+)\s*[\.\)]\s*(.*)', part)
        if not q_match:
            continue
            
        q_num = q_match.group(1)
        rest = q_match.group(2)
        
        # Find sub-parts within this question
        sub_pattern = r'\(([a-z]|i{1,3}|iv|vi{0,3})\)\s*([^\(]{10,500}?)(?=\([a-z]\)|\([i]+\)|\d+[\.\)]|$)'
        sub_parts = re.findall(sub_pattern, rest, re.DOTALL | re.IGNORECASE)
        
        if sub_parts:
            for sub_id, sub_content in sub_parts:
                sub_content = sub_content.strip()
                
                # Find options A/B/C/D in content
                opts = re.findall(r'\b([A-D])\b[\.\s]*([A-Za-z][A-Za-z\s\-]{2,50}?)(?=\s*\b[A-D]\b|$)', sub_content)
                
                if len(opts) >= 2:
                    # Get question text (before first option)
                    first_opt = sub_content.find(opts[0][0])
                    q_text = sub_content[:first_opt].strip() if first_opt > 0 else ""
                    
                    # Clean
                    q_text = re.sub(r'^[^A-Za-z]+', '', q_text)
                    
                    if q_text and len(q_text) > 10:
                        questions.append({
                            'main_num': q_num,
                            'sub_id': sub_id,
                            'id': f"{q_num}({sub_id})",
                            'text': q_text[:300],
                            'options': [f"{l}. {t.strip()}" for l, t in opts[:4]]
                        })
        else:
            # No sub-parts - check if whole thing is an MCQ
            opts = re.findall(r'\b([A-D])\b[\.\s]*([A-Za-z][A-Za-z\s\-]{2,50}?)(?=\s*\b[A-D]\b|$)', rest)
            if len(opts) >= 2:
                q_text = rest[:rest.find(opts[0][0])].strip()
                q_text = re.sub(r'^[^A-Za-z]+', '', q_text)
                
                if q_text and len(q_text) > 10:
                    questions.append({
                        'main_num': q_num,
                        'sub_id': '',
                        'id': q_num,
                        'text': q_text[:300],
                        'options': [f"{l}. {t.strip()}" for l, t in opts[:4]]
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
    
    img_paths = pdf_to_images(pdf_path, image_folder)
    if not img_paths:
        return []
    
    all_qs = []
    for img_path in img_paths:
        text = ocr_page(img_path)
        qs = extract_mcqs(text)
        all_qs.extend(qs)
    
    # Deduplicate
    seen = set()
    unique = []
    for q in all_qs:
        key = f"{pdf_name}_{q['id']}"
        if key not in seen:
            seen.add(key)
            unique.append(q)
    
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
    qp_files = [p for p in pdf_files if 'qp' in p.name.lower() and 'ms' not in p.name.lower()][:5]
    
    print(f"Processing {len(qp_files)} PDFs...\n")
    
    all_qs = []
    for pdf_path in qp_files:
        print(f"{pdf_path.name}...")
        qs = process_pdf(str(pdf_path), 'as_biology', 'year12', image_folder)
        print(f"  -> {len(qs)} MCQs")
        all_qs.extend(qs)
    
    print(f"\n=== TOTAL: {len(all_qs)} MCQs ===\n")
    
    for q in all_qs[:10]:
        print(f"ID: {q['id']}")
        print(f"Q: {q['question'][:80]}...")
        print(f"Options: {q['options']}")
        print()
    
    with open('extracted_mcqs.json', 'w') as f:
        json.dump(all_qs, f, indent=2)
    print(f"\nSaved {len(all_qs)} MCQs to extracted_mcqs.json")

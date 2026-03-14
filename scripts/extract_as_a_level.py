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

def pdf_to_saved_images(pdf_path, output_folder, start_page=3, end_page=12):
    """Convert PDF pages to saved image files, return list of image paths."""
    try:
        # Create output folder for this PDF
        pdf_name = os.path.basename(pdf_path).replace('.pdf', '')
        pdf_image_folder = os.path.join(output_folder, pdf_name)
        os.makedirs(pdf_image_folder, exist_ok=True)
        
        # Convert PDF to images
        images = pdf2image.convert_from_path(
            pdf_path,
            dpi=200,
            first_page=start_page,
            last_page=end_page,
            poppler_path=POPPLER_PATH
        )
        
        saved_paths = []
        for i, img in enumerate(images):
            page_num = start_page + i
            img_path = os.path.join(pdf_image_folder, f"page_{page_num:03d}.png")
            img.save(img_path, "PNG")
            saved_paths.append(img_path)
            print(f"    Saved: {img_path}")
        
        return saved_paths
    except Exception as e:
        print(f"    PDF conversion error: {e}")
        return []

def ocr_from_saved_image(img_path):
    """Run OCR on a saved image file."""
    try:
        img = Image.open(img_path)
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(img, config=custom_config)
        img.close()
        return text
    except Exception as e:
        print(f"    OCR error for {img_path}: {e}")
        return ""

def clean_ocr_text(text):
    """Clean up common OCR artifacts from exam papers."""
    # Remove common OCR noise patterns
    text = re.sub(r'[=\-—_*]{2,}', ' ', text)  # Remove lines of dashes/equals
    text = re.sub(r'\[\d+\]', ' ', text)  # Remove [1], [4] mark indicators
    text = re.sub(r'\s+', ' ', text)  # Normalize spaces
    
    lines = []
    for line in text.split('\n'):
        line = line.strip()
        if not line or len(line) < 2:
            continue
        # Skip watermarks and page markers
        if any(skip in line for skip in ['DO-NOT', 'WRITEIN', 'THIS AREA', 'Turn over', 'BLANK PAGE', 'Total for Question', 'P60', 'WBI11']):
            continue
        # Remove leading symbols
        line = re.sub(r'^[\s—=\-\[\]]+', '', line)
        lines.append(line)
    return '\n'.join(lines)

def parse_structured_questions(text, pdf_name):
    """Extract structured questions from OCR text - handles messy OCR."""
    questions = []
    
    # Clean the text first
    text = clean_ocr_text(text)
    lines = text.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        
        # Match question patterns - more flexible for messy OCR
        # Pattern: number + optional (letter) + optional (roman)
        match = re.match(r'^(\d+)[\.\s]*(?:\(([a-z])\))?\s*(?:\(([ivx]+)\))?\s*[\.\)]?\s*(.*)', line, re.IGNORECASE)
        
        # Also match lines that start with just (a), (b), (c) - sub-questions
        if not match:
            match = re.match(r'^\(([a-z])\)\s*(?:\(([ivx]+)\))?\s*(.*)', line, re.IGNORECASE)
            if match:
                # Fake a question number - we'll use previous context if available
                q_num = '1'
                q_part = match.group(1)
                q_sub = match.group(2) or ''
                q_text = match.group(3)
                match = None  # Reset to handle below
                # Check if next lines have options
                options = []
                full_text_parts = [q_text]
                
                j = i + 1
                while j < len(lines) and j < i + 20:  # Look ahead max 20 lines
                    next_line = lines[j].strip()
                    if not next_line:
                        j += 1
                        continue
                    # Stop if we hit another (letter) or number
                    if re.match(r'^\([a-z]\)|^\d+[\.\)]', next_line):
                        break
                    # Check for option pattern
                    opt_match = re.match(r'^([A-D])[\.\)\s]+(.+)', next_line)
                    if opt_match:
                        options.append(f"{opt_match.group(1)}. {opt_match.group(2)}")
                    elif re.match(r'^[A-D]$', next_line) and j + 1 < len(lines):
                        options.append(f"{next_line}. {lines[j+1].strip()}")
                        j += 1
                    else:
                        full_text_parts.append(next_line)
                    j += 1
                
                if 2 <= len(options) <= 4:
                    q_id = f"1({q_part})"
                    if q_sub:
                        q_id += f"({q_sub})"
                    questions.append({
                        'id': q_id,
                        'text': ' '.join(full_text_parts)[:800],
                        'options': options
                    })
                i = j
                continue
        
        if match:
            q_num = match.group(1)
            q_part = match.group(2) or ''
            q_sub = match.group(3) or ''
            q_text = match.group(4)
            
            q_id = q_num
            if q_part:
                q_id += f"({q_part})"
            if q_sub:
                q_id += f"({q_sub})"
            
            full_text_parts = [q_text]
            options = []
            
            j = i + 1
            while j < len(lines) and j < i + 25:
                next_line = lines[j].strip()
                if not next_line:
                    j += 1
                    continue
                # Stop at next question
                if re.match(r'^\d+[\.\)]|^\([a-z]\)', next_line):
                    break
                # Check for options
                opt_match = re.match(r'^([A-D])[\.\)\s]+(.+)', next_line)
                if opt_match:
                    options.append(f"{opt_match.group(1)}. {opt_match.group(2)}")
                elif re.match(r'^[A-D]$', next_line) and j + 1 < len(lines):
                    opt_text = lines[j + 1].strip()
                    if opt_text and not re.match(r'^\d|\([a-z]\)', opt_text):
                        options.append(f"{next_line}. {opt_text}")
                        j += 1
                else:
                    full_text_parts.append(next_line)
                j += 1
            
            if 2 <= len(options) <= 4:
                questions.append({
                    'id': q_id,
                    'text': ' '.join(full_text_parts)[:800],
                    'options': options
                })
            i = j
        else:
            i += 1
    
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
    
    # Convert PDF to saved images, then OCR each
    image_output_folder = r'E:\Apps\past-paper\gcse-prep-app\public\pdf_images'
    image_paths = pdf_to_saved_images(pdf_path, image_output_folder)
    
    if not image_paths:
        return []
    
    all_questions = []
    for img_path in image_paths:
        print(f"    OCR: {os.path.basename(img_path)}...", end=' ')
        text = ocr_from_saved_image(img_path)
        questions = parse_structured_questions(text, pdf_name)
        print(f"{len(questions)} questions")
        all_questions.extend(questions)
    
    # Deduplicate by question ID (keep first occurrence)
    seen_ids = set()
    unique_questions = []
    for q in all_questions:
        if q['id'] not in seen_ids:
            seen_ids.add(q['id'])
            unique_questions.append(q)
    all_questions = unique_questions
    
    # Format for upload
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
        ('O-Level Biology', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_O-Level\Biology',
         'o_level_biology', 'year11', r'E:\Apps\past-paper\gcse-prep-app\public\o_level_biology_questions.json'),
        ('O-Level Accounting', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_O-Level\Accounting 7707',
         'o_level_accounting', 'year11', r'E:\Apps\past-paper\gcse-prep-app\public\o_level_accounting_7707_questions.json'),
        ('AS Economics', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Economics',
         'as_economics', 'year12', r'E:\Apps\past-paper\gcse-prep-app\public\as_economics_questions.json'),
        ('AS Mathematics', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Mathematics',
         'as_mathematics', 'year12', r'E:\Apps\past-paper\gcse-prep-app\public\as_mathematics_questions.json'),
        ('AS Physics', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Physics',
         'as_physics', 'year12', r'E:\Apps\past-paper\gcse-prep-app\public\as_physics_questions.json'),
    ]
    
    total = 0
    for name, folder, key, year_group, output in subjects:
        count = process_subject(name, folder, key, year_group, output)
        total += count
    
    print(f"\n{'='*60}")
    print(f"TOTAL: {total} questions extracted")
    print(f"{'='*60}")

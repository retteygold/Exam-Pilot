#!/usr/bin/env python3
"""
Google Vision API extractor for AS/A-Level papers with tables.
Much better than Tesseract for structured documents.
"""

import os
import re
import json
from pathlib import Path
from PIL import Image
import pdf2image
from google.cloud import vision
from google.cloud.vision_v1 import types

# Poppler for PDF conversion
POPPLER_PATH = r"C:\Users\maushaz.MADIHAA\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"

# Google Vision client (reads from GOOGLE_APPLICATION_CREDENTIALS env var)
client = vision.ImageAnnotatorClient()

def pdf_to_images(pdf_path, output_folder, start_page=3, end_page=12):
    """Convert PDF to PNG images."""
    pdf_name = os.path.basename(pdf_path).replace('.pdf', '')
    pdf_folder = os.path.join(output_folder, pdf_name)
    os.makedirs(pdf_folder, exist_ok=True)
    
    images = pdf2image.convert_from_path(
        pdf_path, dpi=300,  # Higher DPI for Vision API
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

def vision_ocr(img_path):
    """OCR using Google Vision API with document text detection."""
    with open(img_path, 'rb') as f:
        content = f.read()
    
    image = types.Image(content=content)
    
    # Use document text detection for better layout understanding
    response = client.document_text_detection(image=image)
    
    if response.error.message:
        print(f"  Vision API error: {response.error.message}")
        return ""
    
    # Get full text with layout information
    document = response.full_text_annotation
    
    # Extract text preserving layout
    text = document.text
    
    return text

def parse_questions(text):
    """Parse questions from Vision API text output."""
    questions = []
    
    # Clean up
    text = re.sub(r'DO\s*NOT\s*WRITE\s*IN\s*THIS\s*AREA', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Turn over', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(Total for Question \d+.*?\)', '', text)
    
    # Look for main questions (1., 2., etc) with sub-parts (a)(i), (a)(ii)
    # Vision API preserves layout better, so patterns should be clearer
    
    # Split by main question numbers
    lines = text.split('\n')
    
    current_q = None
    current_stem = []
    current_parts = []
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Match main question: "1." or "2." at start
        main_match = re.match(r'^(\d+)\s*[\.\)]\s*(.*)', line)
        
        if main_match:
            # Save previous question if exists
            if current_q and current_parts:
                for part in current_parts:
                    stem = ' '.join(current_stem).strip()
                    q_text = f"{stem} {part['text']}".strip()
                    questions.append({
                        'id': f"{current_q}({part['id']})" if part['id'] else current_q,
                        'text': q_text[:400],
                        'options': part['options']
                    })
            
            # Start new question
            current_q = main_match.group(1)
            current_stem = [main_match.group(2)] if main_match.group(2) else []
            current_parts = []
            i += 1
            continue
        
        # Match sub-part: "(a)", "(i)", "(ii)"
        sub_match = re.match(r'^\(([a-z]|i{1,3}|iv)\)\s*[\.\)]?\s*(.*)', line, re.IGNORECASE)
        
        if sub_match and current_q:
            sub_id = sub_match.group(1)
            sub_text = sub_match.group(2)
            
            # Collect sub-part text and options
            part_lines = [sub_text]
            options = []
            
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                
                # Stop at next sub-part or main question
                if re.match(r'^\([a-z]\)|^\([i]+\)|^\d+[\.\)]', next_line):
                    break
                
                # Check for option
                opt_match = re.match(r'^([A-D])\s*[\.\)]\s*(.+)', next_line)
                if opt_match:
                    options.append(f"{opt_match.group(1)}. {opt_match.group(2)}")
                else:
                    part_lines.append(next_line)
                
                j += 1
            
            if len(options) >= 2:
                current_parts.append({
                    'id': sub_id,
                    'text': ' '.join(part_lines).strip(),
                    'options': options
                })
            
            i = j
            continue
        
        # Continue collecting stem text
        if current_q and not current_parts:
            current_stem.append(line)
        
        i += 1
    
    # Don't forget last question
    if current_q and current_parts:
        for part in current_parts:
            stem = ' '.join(current_stem).strip()
            q_text = f"{stem} {part['text']}".strip()
            questions.append({
                'id': f"{current_q}({part['id']})" if part['id'] else current_q,
                'text': q_text[:400],
                'options': part['options']
            })
    
    return questions

def process_pdf(pdf_path, subject, year_group, image_folder):
    """Process PDF with Vision API."""
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
    
    all_qs = []
    for img_path in img_paths:
        print(f"  Vision API: {os.path.basename(img_path)}...", end=' ', flush=True)
        text = vision_ocr(img_path)
        qs = parse_questions(text)
        print(f"{len(qs)} MCQs")
        all_qs.extend(qs)
    
    # Format
    formatted = []
    for q in all_qs:
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

def process_subject(name, folder, subject_key, year_group, output_file, image_folder):
    """Process all PDFs in subject folder."""
    print(f"\n{'='*60}")
    print(f"Processing {name} with Google Vision API...")
    print(f"{'='*60}")
    
    pdf_files = list(Path(folder).rglob('*.pdf'))
    qp_files = [p for p in pdf_files if 'qp' in p.name.lower() and 'ms' not in p.name.lower()]
    
    print(f"Found {len(qp_files)} question papers")
    
    all_questions = []
    for i, pdf_path in enumerate(qp_files, 1):
        print(f"[{i}/{len(qp_files)}] {pdf_path.name}...")
        questions = process_pdf(str(pdf_path), subject_key, year_group, image_folder)
        all_questions.extend(questions)
    
    # Save
    data = {
        'metadata': {
            'subject': name,
            'total_questions': len(all_questions),
            'years': sorted(list(set(q['source']['year'] for q in all_questions))),
            'verified': False,
            'verified_count': 0,
            'description': f'{len(all_questions)} {name} MCQs from past papers (Vision API)'
        },
        'questions': all_questions
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved {len(all_questions)} questions to {output_file}")
    return len(all_questions)

if __name__ == '__main__':
    # Check for credentials
    if not os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
        print("ERROR: Set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account JSON key file")
        print("\nTo set up:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a project or use existing")
        print("3. Enable Cloud Vision API")
        print("4. Create service account and download JSON key")
        print("5. In PowerShell:")
        print("   $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\\path\\to\\key.json'")
        print("6. Install library: pip install google-cloud-vision")
        exit(1)
    
    image_folder = r'E:\Apps\past-paper\gcse-prep-app\public\pdf_images'
    
    subjects = [
        ('AS Biology', r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11', 
         'as_biology', 'year12', r'E:\Apps\past-paper\gcse-prep-app\public\as_biology_wbi11_questions_vision.json'),
    ]
    
    total = 0
    for name, folder, key, year_group, output in subjects:
        count = process_subject(name, folder, key, year_group, output, image_folder)
        total += count
    
    print(f"\n{'='*60}")
    print(f"TOTAL: {total} questions extracted with Vision API")
    print(f"{'='*60}")

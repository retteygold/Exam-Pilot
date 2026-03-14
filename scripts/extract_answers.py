#!/usr/bin/env python3
"""
Extract correct answers from Cambridge IGCSE Biology mark scheme PDFs.
Mark scheme files have format: 0610_m25_ms_12.pdf (ms = mark scheme)
"""

import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    import os
    os.system("pip install pdfplumber")
    import pdfplumber

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error extracting {pdf_path}: {e}")
    return text

def parse_mark_scheme(text, paper_info):
    """Parse answers from mark scheme text."""
    answers = {}
    
    # Clean up text
    text = re.sub(r'©\s*UCLES\s*\d+[^\n]*', '', text)
    text = re.sub(r'Cambridge IGCSE.*?Mark Scheme', '', text, flags=re.DOTALL)
    
    # Cambridge mark scheme format:
    # Question | Answer | Marks
    # 1        | A      | 1
    
    # Look for question-answer pairs
    # Pattern: question number followed by answer letter
    
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Match patterns like "1 A", "1  A  1", "1 | A | 1"
        # Question number (1-40), then answer (A-D), optional marks
        match = re.match(r'^(\d{1,2})\s*[\|\s]\s*([A-D])\s*(?:[\|\s]\s*\d+)?$', line)
        if match:
            q_num = int(match.group(1))
            answer = match.group(2)
            # Convert A-D to 0-3
            answer_idx = ord(answer) - ord('A')
            answers[q_num] = answer_idx
            continue
        
        # Alternative: "1A" or "1. A" or "1) A"
        match = re.match(r'^(\d{1,2})[\.\)]?\s*([A-D])\b', line)
        if match:
            q_num = int(match.group(1))
            answer = match.group(2)
            answer_idx = ord(answer) - ord('A')
            answers[q_num] = answer_idx
            continue
        
        # Table format: look for lines with numbers and letters
        # e.g., "1 A 1" or "2 C 1"
        match = re.match(r'^(\d{1,2})\s+([A-D])\s+\d+$', line)
        if match:
            q_num = int(match.group(1))
            answer = match.group(2)
            answer_idx = ord(answer) - ord('A')
            answers[q_num] = answer_idx
    
    return answers

def parse_paper_info(filename):
    """Extract paper info from mark scheme filename."""
    info = {
        'filename': filename,
        'year': 2024,
        'paper': '11',
        'session': 'May/June'
    }
    
    # Format: 0610_m25_ms_12.pdf
    cambridge_match = re.match(r'0610_([msw])(\d{2})_', filename.lower())
    if cambridge_match:
        session_code = cambridge_match.group(1)
        year_suffix = cambridge_match.group(2)
        info['year'] = 2000 + int(year_suffix)
        
        if session_code == 'm':
            info['session'] = 'March'
        elif session_code == 's':
            info['session'] = 'May/June'
        elif session_code == 'w':
            info['session'] = 'Oct/Nov'
    
    # Parse paper number from ms_XX
    paper_match = re.search(r'ms[_-]?(\d{1,2})', filename.lower())
    if paper_match:
        info['paper'] = paper_match.group(1).zfill(2)
    
    return info

def process_all_mark_schemes(database_dir):
    """Process all mark scheme PDFs."""
    all_answers = {}  # (year, paper, q_num) -> answer_idx
    ms_files = []
    
    biology_dir = Path(database_dir) / 'Cambridge_IGCSE' / 'Biology'
    
    if not biology_dir.exists():
        print(f"Directory not found: {biology_dir}")
        return {}
    
    # Find all mark scheme PDFs
    for pdf_file in biology_dir.glob('*.pdf'):
        filename = pdf_file.name.lower()
        # Mark schemes: ms or mark in filename, not qp or question
        if ('ms' in filename or 'mark' in filename) and 'qp' not in filename and 'question' not in filename:
            ms_files.append(pdf_file)
    
    print(f"Found {len(ms_files)} mark schemes to process")
    
    for pdf_file in sorted(ms_files):
        print(f"\nProcessing: {pdf_file.name}")
        
        paper_info = parse_paper_info(pdf_file.name)
        print(f"  Year: {paper_info['year']}, Paper: {paper_info['paper']}, Session: {paper_info['session']}")
        
        text = extract_text_from_pdf(pdf_file)
        
        if text:
            answers = parse_mark_scheme(text, paper_info)
            print(f"  Extracted {len(answers)} answers")
            
            for q_num, answer_idx in answers.items():
                key = (paper_info['year'], paper_info['paper'], q_num)
                all_answers[key] = {
                    'answer': answer_idx,
                    'year': paper_info['year'],
                    'paper': paper_info['paper'],
                    'q_num': q_num
                }
        else:
            print(f"  No text extracted")
    
    return all_answers

def update_questions_with_answers(questions_file, answers):
    """Update questions database with extracted answers."""
    with open(questions_file, encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    already_verified = 0
    
    for q in data['questions']:
        if q.get('verified'):
            already_verified += 1
            continue
        
        source = q['source']
        key = (source['year'], source['paper'], int(source['question_number']))
        
        if key in answers:
            q['correctAnswer'] = answers[key]['answer']
            q['verified'] = True
            updated_count += 1
    
    # Update metadata
    total_verified = sum(1 for q in data['questions'] if q.get('verified'))
    data['metadata']['verified_count'] = total_verified
    data['metadata']['accuracy'] = f'{total_verified} answers verified from mark schemes'
    
    with open(questions_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    return updated_count, already_verified

if __name__ == '__main__':
    database_dir = Path(__file__).parent.parent / 'database'
    questions_file = Path(__file__).parent.parent / 'public' / 'igcse_biology_0610_questions.json'
    
    print("Extracting answers from mark schemes...")
    answers = process_all_mark_schemes(database_dir)
    print(f"\nTotal answers extracted: {len(answers)}")
    
    if answers:
        print("\nUpdating questions with answers...")
        updated, already = update_questions_with_answers(questions_file, answers)
        print(f"Updated {updated} questions with answers")
        print(f"Already verified: {already}")
        print(f"\nTotal verified: {updated + already}")

#!/usr/bin/env python3
"""Extract answers from AS-A-Level mark scheme PDFs."""
import pdfplumber
import re
import json
from pathlib import Path

def extract_text_from_pdf(pdf_path):
    """Extract text from all pages of a PDF."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"  Error reading {pdf_path}: {e}")
    return text

def parse_mark_scheme(text, paper_info):
    """Parse answers from AS-A-Level mark scheme text."""
    answers = {}
    
    # Clean text
    text = re.sub(r'©\s*Pearson[^\n]*', '', text)
    text = re.sub(r'©\s*Edexcel[^\n]*', '', text)
    
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        # Pattern: "3(a) The only correct answer is A" or "3(a) The answer is A"
        match = re.match(r'^(\d+)(?:\([a-z]\))?\s+The\s+(?:only correct\s+)?answer is ([A-D])', line, re.IGNORECASE)
        if match:
            q_num = int(match.group(1))
            answer = match.group(2)
            answer_idx = ord(answer) - ord('A')
            answers[q_num] = answer_idx
            continue
        
        # Pattern: "Question Answer" header followed by "3(a) The only correct answer is A"
        # Look at next line after finding question number
        match = re.match(r'^(\d+)(?:\([a-z]\))?\s+(.+)', line)
        if match:
            q_num = int(match.group(1))
            remainder = match.group(2)
            # Check if remainder contains "answer is X"
            ans_match = re.search(r'The\s+(?:only correct\s+)?answer is ([A-D])', remainder, re.IGNORECASE)
            if ans_match:
                answer = ans_match.group(1)
                answer_idx = ord(answer) - ord('A')
                answers[q_num] = answer_idx
    
    return answers

def extract_as_a_level_answers(base_dir):
    """Extract answers from all AS-A-Level mark schemes."""
    total_answers = 0
    subjects = ['Biology WBI11', 'Chemistry', 'Economics', 'Mathematics', 'Physics']
    
    for subject in subjects:
        subject_dir = Path(base_dir) / subject
        if not subject_dir.exists():
            continue
        
        print(f"\n=== Processing {subject} Mark Schemes ===")
        ms_files = []
        
        for pdf_file in subject_dir.glob('*.pdf'):
            filename = pdf_file.name.lower()
            if 'ms' in filename or 'rms' in filename or 'mark' in filename:
                ms_files.append(pdf_file)
        
        print(f"Found {len(ms_files)} mark schemes")
        
        for pdf_file in sorted(ms_files):
            print(f"Processing: {pdf_file.name}")
            
            text = extract_text_from_pdf(pdf_file)
            if text:
                paper_info = {}
                answers = parse_mark_scheme(text, paper_info)
                print(f"  Extracted {len(answers)} answers")
                total_answers += len(answers)
            else:
                print(f"  No text extracted")
    
    return total_answers

if __name__ == '__main__':
    database_dir = Path(__file__).parent.parent / 'database' / 'Cambridge_AS-A-Level'
    print("Starting AS-A-Level answer extraction...")
    total = extract_as_a_level_answers(database_dir)
    print(f"\n{'='*60}")
    print(f"Total answers extracted: {total}")

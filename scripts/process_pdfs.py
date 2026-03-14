#!/usr/bin/env python3
"""
Process Cambridge IGCSE Biology PDF past papers into structured JSON format.
This script extracts MCQ questions from PDF files.
"""

import json
import re
import os
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("Installing pdfplumber...")
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

def parse_questions(text, paper_info):
    """Parse MCQ questions from extracted text."""
    questions = []
    
    # Clean up text
    text = re.sub(r'©\s*UCLES\s*\d+[^\n]*', '', text)
    text = re.sub(r'\[Turn over\]', '', text)
    text = re.sub(r'\d+\s*/\s*\d+', '', text)
    text = re.sub(r'\d{4}_\d+_\d+/[A-Z]/[A-Z]/\d+', '', text)
    text = re.sub(r'IB\d+\s+\d+_\d+_\d+/\d+RP', '', text)
    text = re.sub(r'\*\d+\*', '', text)
    
    # Cambridge format questions start with number then text, options A-D follow
    # Pattern: N (where N is 1-40, actual question num), then question text, then A B C D options
    
    # First, identify likely question starts (numbers 1-40 followed by text)
    lines = text.split('\n')
    
    question_starts = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        # Question lines: number 1-40 followed by space and text
        if re.match(r'^\d{1,2}\s+\D', stripped):
            try:
                num = int(re.match(r'^(\d{1,2})', stripped).group(1))
                if 1 <= num <= 40:
                    question_starts.append((i, num, stripped))
            except:
                pass
    
    # Extract each question
    for idx, (start_line, q_num, first_line) in enumerate(question_starts):
        # Get end of this question
        if idx + 1 < len(question_starts):
            end_line = question_starts[idx + 1][0]
        else:
            end_line = len(lines)
        
        # Get all lines for this question
        q_lines = lines[start_line:end_line]
        q_text = '\n'.join(q_lines)
        
        # Remove question number from start
        q_text = re.sub(r'^\d{1,2}\s*', '', q_text)
        
        # Find options A B C D
        # Options can be inline or on separate lines
        # Pattern: A ... B ... C ... D ... (end or next number)
        
        opt_pattern = r'(?:^|\s+|[\n\r]+)A\s*[\.\)]?\s*(.+?)(?:\s+|[\n\r]+)B\s*[\.\)]?\s*(.+?)(?:\s+|[\n\r]+)C\s*[\.\)]?\s*(.+?)(?:\s+|[\n\r]+)D\s*[\.\)]?\s*(.+?)(?:\n\d{1,2}\s+\D|\n\d{1,2}$|$)'
        match = re.search(opt_pattern, q_text, re.DOTALL)
        
        if match:
            # Extract question text (everything before option A)
            opt_a_pos = q_text.find('A')
            question_text = q_text[:opt_a_pos].strip()
            
            options = [
                match.group(1).strip(),
                match.group(2).strip(),
                match.group(3).strip(),
                match.group(4).strip()
            ]
        else:
            # Try simpler split approach
            parts = re.split(r'\n(?=\s*[A-D]\s*[\.\)])', q_text)
            if len(parts) >= 2:
                question_text = parts[0].strip()
                options = ['', '', '', '']
                for i, p in enumerate(parts[1:5]):
                    m = re.match(r'\s*([A-D])\s*[\.\)]\s*(.+)', p, re.DOTALL)
                    if m:
                        options[i] = m.group(2).strip()
            else:
                continue
        
        # Clean up
        question_text = re.sub(r'\s+', ' ', question_text).strip()
        question_text = re.sub(r'^\d+\s+', '', question_text)  # Remove any leading number
        
        # Clean options - stop at copyright or next question indicator
        for i, opt in enumerate(options):
            opt = re.sub(r'\s+', ' ', opt).strip()
            opt = re.sub(r'^\d+\s+', '', opt)  # Remove leading numbers
            # Truncate if too long (option bleeding into next question)
            if len(opt) > 300:
                opt = opt[:300]
            options[i] = opt
        
        # Validate
        if not question_text or len(question_text) < 15:
            continue
        if all(o == '' for o in options):
            continue
        
        question = {
            'id': f"0610-y{paper_info['year']}-p{paper_info['paper']}-q{q_num}",
            'subject': 'igcse_biology',
            'yearGroup': 'year10',
            'difficulty': 'medium',
            'topic': paper_info.get('topic', 'general'),
            'marks': 1,
            'question': question_text[:400],
            'options': [o[:250] for o in options],
            'correctAnswer': 0,
            'explanation': '',
            'examStyle': True,
            'timeLimit': 60,
            'verified': False,
            'source': {
                'pdf': paper_info['filename'],
                'year': paper_info['year'],
                'session': paper_info.get('session', 'May/June'),
                'paper': paper_info['paper'],
                'question_number': str(q_num)
            }
        }
        questions.append(question)
    
    return questions

def parse_paper_info(filename):
    """Extract paper information from filename."""
    info = {
        'filename': filename,
        'year': 2024,
        'paper': '11',
        'session': 'May/June',
        'topic': 'general'
    }
    
    # Cambridge filename format: 0610_m25_qp_12.pdf
    # m25 = March 2025, s25 = June 2025, w25 = Nov 2025
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
    else:
        # Try other patterns like 520441-june-2024-question-paper-11.pdf
        year_match = re.search(r'(\d{4})', filename)
        if year_match:
            year = int(year_match.group(1))
            if 2020 <= year <= 2030:
                info['year'] = year
    
    # Parse paper number
    paper_match = re.search(r'(?:qp|paper)[_-]?(\d{1,2})', filename, re.IGNORECASE)
    if paper_match:
        info['paper'] = paper_match.group(1).zfill(2)
    
    return info

def process_all_pdfs(database_dir):
    """Process all PDFs in the database directory."""
    all_questions = []
    pdf_files = []
    
    biology_dir = Path(database_dir) / 'Cambridge_IGCSE' / 'Biology'
    
    if not biology_dir.exists():
        print(f"Directory not found: {biology_dir}")
        return []
    
    # Find all QP (question paper) PDFs
    for pdf_file in biology_dir.glob('*.pdf'):
        filename = pdf_file.name.lower()
        # Only process question papers (qp), not mark schemes (ms) or confidential (ci)
        if 'qp' in filename or 'question' in filename or 'paper' in filename:
            if 'ms' not in filename and 'mark' not in filename and 'ci' not in filename and 'confidential' not in filename:
                pdf_files.append(pdf_file)
    
    print(f"Found {len(pdf_files)} question papers to process")
    
    for pdf_file in sorted(pdf_files):
        print(f"\nProcessing: {pdf_file.name}")
        
        paper_info = parse_paper_info(pdf_file.name)
        print(f"  Year: {paper_info['year']}, Paper: {paper_info['paper']}, Session: {paper_info['session']}")
        
        text = extract_text_from_pdf(pdf_file)
        
        if text:
            questions = parse_questions(text, paper_info)
            print(f"  Extracted {len(questions)} questions")
            all_questions.extend(questions)
        else:
            print(f"  No text extracted")
    
    return all_questions

def save_questions(questions, output_path):
    """Save questions to JSON file."""
    output = {
        'metadata': {
            'subject': 'IGCSE Biology (0610)',
            'total_questions': len(questions),
            'description': f'{len(questions)} IGCSE Biology MCQs from past papers',
            'years': sorted(list(set(q['source']['year'] for q in questions))),
            'verified': False,
            'verified_count': 0,
            'accuracy': 'Auto-extracted from PDFs - verification needed'
        },
        'questions': questions
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved {len(questions)} questions to {output_path}")

if __name__ == '__main__':
    database_dir = Path(__file__).parent.parent / 'database'
    output_path = Path(__file__).parent.parent / 'public' / 'igcse_biology_0610_questions_new.json'
    
    print("Starting PDF processing...")
    questions = process_all_pdfs(database_dir)
    
    if questions:
        save_questions(questions, output_path)
        print(f"\n✓ Processing complete! {len(questions)} questions extracted.")
        print(f"  Output: {output_path}")
        print(f"\nNext steps:")
        print(f"  1. Review the extracted questions for accuracy")
        print(f"  2. Update correct answers using mark scheme files (ms_*.pdf)")
        print(f"  3. Replace igcse_biology_0610_questions.json with the new file")
    else:
        print("\n✗ No questions extracted. Check PDF files.")

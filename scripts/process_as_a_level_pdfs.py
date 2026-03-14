#!/usr/bin/env python3
"""Process Cambridge AS-A-Level PDFs and extract questions."""
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

def parse_paper_info(filename, subject):
    """Extract paper information from AS-A-Level filename."""
    info = {
        'filename': filename,
        'year': 2024,
        'paper': '01',
        'session': 'May/June',
        'topic': 'general',
        'subject': subject,
        'level': 'AS-A-Level'
    }
    
    # WBI11 format: wbi11-01-que-20210421.pdf or October 2025 - Unit 1 QP.pdf
    # Extract year from date patterns
    year_match = re.search(r'20(\d{2})(\d{2})(\d{2})', filename)
    if year_match:
        year = 2000 + int(year_match.group(1))
        month = int(year_match.group(2))
        info['year'] = year
        # Determine session from month
        if month in [1, 2, 3]:
            info['session'] = 'Jan/March'
        elif month in [4, 5, 6]:
            info['session'] = 'May/June'
        elif month in [10, 11, 12]:
            info['session'] = 'Oct/Nov'
    elif 'October 2025' in filename or 'October 2024' in filename:
        info['session'] = 'Oct/Nov'
    
    # Extract unit/paper number
    unit_match = re.search(r'Unit\s+(\d+)', filename, re.IGNORECASE)
    if unit_match:
        info['paper'] = unit_match.group(1).zfill(2)
    else:
        paper_match = re.search(r'-0?(\d+)-', filename)
        if paper_match:
            info['paper'] = paper_match.group(1).zfill(2)
    
    return info

def parse_questions(text, paper_info):
    """Parse MCQ questions from AS-A-Level text."""
    questions = []
    
    # Clean up text
    text = re.sub(r'©\s*Pearson[^\n]*', '', text)
    text = re.sub(r'©\s*Edexcel[^\n]*', '', text)
    text = re.sub(r'\[Turn over\]', '', text)
    text = re.sub(r'\*\d+\*', '', text)
    
    lines = text.split('\n')
    
    # Find question starts - AS-A-Level typically has 1-40 questions
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
        if idx + 1 < len(question_starts):
            end_line = question_starts[idx + 1][0]
        else:
            end_line = len(lines)
        
        q_lines = lines[start_line:end_line]
        q_text = '\n'.join(q_lines)
        q_text = re.sub(r'^\d{1,2}\s*', '', q_text)
        
        # Find options A B C D
        opt_patterns = [
            r'A\s*[\.\)]?\s*(.+?)\s+B\s*[\.\)]?\s*(.+?)\s+C\s*[\.\)]?\s*(.+?)\s+D\s*[\.\)]?\s*(.+?)(?:\n\d|$)',
            r'A\s+(.+?)\s+B\s+(.+?)\s+C\s+(.+?)\s+D\s+(.+?)(?:\n\d|$)',
        ]
        
        match = None
        for pattern in opt_patterns:
            match = re.search(pattern, q_text, re.DOTALL)
            if match:
                break
        
        if match:
            opt_a_pos = q_text.find('A')
            question_text = q_text[:opt_a_pos].strip()
            options = [match.group(1).strip(), match.group(2).strip(), 
                      match.group(3).strip(), match.group(4).strip()]
        else:
            parts = re.split(r'\n(?=\s*[A-D]\s*[\.\)]?)', q_text)
            if len(parts) >= 2:
                question_text = parts[0].strip()
                options = ['', '', '', '']
                for i, p in enumerate(parts[1:5]):
                    m = re.match(r'\s*([A-D])\s*[\.\)]?\s*(.+)', p, re.DOTALL)
                    if m:
                        options[i] = m.group(2).strip()
            else:
                continue
        
        # Clean up
        question_text = re.sub(r'\s+', ' ', question_text).strip()
        question_text = re.sub(r'^\d+\s+', '', question_text)
        
        for i, opt in enumerate(options):
            opt = re.sub(r'\s+', ' ', opt).strip()
            opt = re.sub(r'^\d+\s+', '', opt)
            if len(opt) > 300:
                opt = opt[:300]
            options[i] = opt
        
        if not question_text or len(question_text) < 15:
            continue
        if all(o == '' for o in options):
            continue
        
        # Generate ID based on subject code
        subject_code = 'wbi11' if 'Biology' in paper_info['subject'] else paper_info['subject'].lower()[:4]
        question = {
            'id': f"{subject_code}-y{paper_info['year']}-p{paper_info['paper']}-q{q_num}",
            'subject': f"as_a_level_{paper_info['subject'].lower().replace(' ', '_')}",
            'yearGroup': 'year12',
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
                'question_number': str(q_num),
                'level': 'AS-A-Level'
            }
        }
        questions.append(question)
    
    return questions

def process_as_a_level_pdfs(base_dir):
    """Process all AS-A-Level PDFs."""
    all_questions = []
    subjects = ['Biology WBI11', 'Chemistry', 'Economics', 'Mathematics', 'Physics']
    
    for subject in subjects:
        subject_dir = Path(base_dir) / subject
        if not subject_dir.exists():
            continue
        
        print(f"\n=== Processing {subject} ===")
        pdf_files = []
        
        for pdf_file in subject_dir.glob('*.pdf'):
            filename = pdf_file.name.lower()
            # Only process question papers
            if 'qp' in filename or 'que' in filename or 'question' in filename:
                if 'ms' not in filename and 'rms' not in filename and 'mark' not in filename:
                    pdf_files.append(pdf_file)
        
        print(f"Found {len(pdf_files)} question papers")
        
        for pdf_file in sorted(pdf_files):
            print(f"\nProcessing: {pdf_file.name}")
            paper_info = parse_paper_info(pdf_file.name, subject)
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
            'subject': 'Cambridge AS-A-Level',
            'total_questions': len(questions),
            'description': f'{len(questions)} AS-A-Level MCQs from past papers',
            'years': sorted(list(set(q['source']['year'] for q in questions))) if questions else [],
            'subjects': sorted(list(set(q['source'].get('level', '') + ' ' + q['subject'] for q in questions))) if questions else [],
            'verified': False,
            'verified_count': 0,
            'accuracy': 'Auto-extracted from PDFs - verification needed'
        },
        'questions': questions
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"Saved {len(questions)} questions to {output_path}")

if __name__ == '__main__':
    database_dir = Path(__file__).parent.parent / 'database' / 'Cambridge_AS-A-Level'
    output_path = Path(__file__).parent.parent / 'public' / 'as_a_level_questions_new.json'
    
    print("Starting AS-A-Level PDF processing...")
    print(f"Database directory: {database_dir}")
    
    questions = process_as_a_level_pdfs(database_dir)
    
    if questions:
        save_questions(questions, output_path)
        print(f"\nProcessing complete! {len(questions)} questions extracted.")
        print(f"Next steps:")
        print(f"  1. Review the extracted questions for accuracy")
        print(f"  2. Extract answers from mark scheme files")
    else:
        print("\nNo questions extracted. Check PDF files.")

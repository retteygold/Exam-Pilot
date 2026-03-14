#!/usr/bin/env python3
"""Extract answers from AS-A-Level mark scheme PDFs."""
import pdfplumber
import re
import json
from pathlib import Path


def parse_paper_info_from_filename(filename):
    """Parse year/unit/session from typical Edexcel-style filenames."""
    lower = filename.lower()

    year = None
    m = re.search(r'(\d{4})', filename)
    if m:
        y = int(m.group(1))
        if 2000 <= y <= 2100:
            year = y

    unit = None
    m = re.search(r'unit\s*(\d)', filename, re.IGNORECASE)
    if m:
        unit = m.group(1)
    else:
        m = re.search(r'unit(\d)', lower)
        if m:
            unit = m.group(1)
        else:
            # WBI11-01, WCH12-01 etc
            m = re.search(r'\b(?:wbi|wch)\d{2}-(\d{2})\b', lower)
            if m:
                unit = m.group(1).lstrip('0') or None

    session = None
    # e.g. 2020-01 / 2020-06 / 2020-10
    m = re.search(r'-(01|06|10)-', lower)
    if m:
        session = {'01': 'Jan', '06': 'Jun', '10': 'Oct'}.get(m.group(1))
    if not session:
        if 'october' in lower or '-10-' in lower:
            session = 'Oct'
        elif 'june' in lower or '-06-' in lower:
            session = 'Jun'
        elif 'january' in lower or '-01-' in lower:
            session = 'Jan'
    if not session:
        session = 'Unknown'

    return {'year': year, 'unit': unit, 'session': session}

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
    """Parse answers from AS/A-Level mark scheme text.

    Returns dict keyed by question part label like "3(a)" if present,
    otherwise "3".
    """
    answers = {}
    
    # Clean text
    text = re.sub(r'©\s*Pearson[^\n]*', '', text)
    text = re.sub(r'©\s*Edexcel[^\n]*', '', text)
    
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue

        # Pattern: "3(a) The only correct answer is A"
        match = re.match(
            r'^(\d+)\s*\(\s*([a-z])\s*\)\s+The\s+(?:only\s+correct\s+)?answer\s+is\s+([A-D])\b',
            line,
            re.IGNORECASE,
        )
        if match:
            q_num = int(match.group(1))
            part = match.group(2).lower()
            answer = match.group(3).upper()
            answers[f"{q_num}({part})"] = ord(answer) - ord('A')
            continue

        # Pattern: "3 The only correct answer is A" (no part)
        match = re.match(
            r'^(\d+)\s+The\s+(?:only\s+correct\s+)?answer\s+is\s+([A-D])\b',
            line,
            re.IGNORECASE,
        )
        if match:
            q_num = int(match.group(1))
            answer = match.group(2).upper()
            answers[str(q_num)] = ord(answer) - ord('A')
            continue
        
        # Pattern: "Question Answer" header followed by "3(a) The only correct answer is A"
        # Look at next line after finding question number
        match = re.match(r'^(\d+)\s*(?:\(\s*([a-z])\s*\))?\s+(.+)', line)
        if match:
            q_num = int(match.group(1))
            part = match.group(2).lower() if match.group(2) else None
            remainder = match.group(3)
            # Check if remainder contains "answer is X"
            ans_match = re.search(r'The\s+(?:only\s+correct\s+)?answer\s+is\s+([A-D])\b', remainder, re.IGNORECASE)
            if ans_match:
                answer = ans_match.group(1).upper()
                key = f"{q_num}({part})" if part else str(q_num)
                answers[key] = ord(answer) - ord('A')

    return answers


def _index_answers_by_paper(mark_schemes):
    """Build mapping: (year, session, unit) -> answers dict."""
    by_paper = {}
    for ms_pdf in mark_schemes:
        info = parse_paper_info_from_filename(ms_pdf.name)
        if not info.get('year') or not info.get('unit'):
            continue
        key = (int(info['year']), str(info['session']), str(info['unit']))

        text = extract_text_from_pdf(ms_pdf)
        if not text:
            continue

        answers = parse_mark_scheme(text, info)
        if not answers:
            continue

        # Merge (later files can fill missing)
        if key not in by_paper:
            by_paper[key] = {}
        by_paper[key].update(answers)
    return by_paper


def apply_answers_to_questions(questions_path, mark_schemes_dir):
    """Apply MS answers to question bank json.

    Matching is by (year, session, unit) derived from each question's source.pdf.
    Then by question_number (e.g. "3(a)") or fallback to main question number.
    """
    questions_path = Path(questions_path)
    if not questions_path.exists():
        raise FileNotFoundError(str(questions_path))

    raw = json.loads(questions_path.read_text(encoding='utf-8'))
    questions = raw.get('questions', [])
    if not isinstance(questions, list) or not questions:
        return {'total': 0, 'updated': 0, 'matched': 0, 'unmatched': 0}

    ms_files = []
    for pdf_file in Path(mark_schemes_dir).glob('*.pdf'):
        name = pdf_file.name.lower()
        if 'ms' in name or 'rms' in name or 'mark' in name:
            ms_files.append(pdf_file)

    answers_by_paper = _index_answers_by_paper(ms_files)

    updated = 0
    matched = 0
    unmatched = 0

    for q in questions:
        src = q.get('source') or {}
        pdf_name = src.get('pdf') or ''
        pinfo = parse_paper_info_from_filename(pdf_name)
        if not pinfo.get('year') or not pinfo.get('unit'):
            unmatched += 1
            continue

        key = (int(pinfo['year']), str(pinfo['session']), str(pinfo['unit']))
        paper_answers = answers_by_paper.get(key)
        if not paper_answers:
            unmatched += 1
            continue

        qn = str(src.get('question_number') or '').strip()
        # Prefer part keys like 3(a)
        ans = None
        if qn in paper_answers:
            ans = paper_answers[qn]
        else:
            m = re.match(r'^(\d+)', qn)
            if m and m.group(1) in paper_answers:
                ans = paper_answers[m.group(1)]
        if ans is None:
            unmatched += 1
            continue

        matched += 1
        # Only update if different or not verified
        if q.get('correctAnswer') != ans or not q.get('verified'):
            q['correctAnswer'] = ans
            q['verified'] = True
            updated += 1

    # Update metadata if present
    meta = raw.get('metadata')
    if isinstance(meta, dict):
        meta['verified_count'] = sum(1 for q in questions if q.get('verified'))

    questions_path.write_text(json.dumps(raw, indent=2, ensure_ascii=False), encoding='utf-8')

    return {
        'total': len(questions),
        'updated': updated,
        'matched': matched,
        'unmatched': unmatched,
        'papers_with_answers': len(answers_by_paper),
    }

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

    # Apply to the generated AS Biology + AS Chemistry banks
    public_dir = Path(__file__).parent.parent / 'public'
    biology_bank = public_dir / 'as_biology_wbi11_questions_new.json'
    chemistry_bank = public_dir / 'as_chemistry_wch_questions_new.json'

    if biology_bank.exists():
        print("\nApplying answers to AS Biology bank...")
        stats = apply_answers_to_questions(biology_bank, database_dir / 'Biology WBI11')
        print(f"AS Biology: total={stats['total']} matched={stats['matched']} updated={stats['updated']} unmatched={stats['unmatched']} papers_with_answers={stats['papers_with_answers']}")
    else:
        print(f"\nAS Biology bank not found: {biology_bank}")

    if chemistry_bank.exists():
        print("\nApplying answers to AS Chemistry bank...")
        stats = apply_answers_to_questions(chemistry_bank, database_dir / 'Chemistry')
        print(f"AS Chemistry: total={stats['total']} matched={stats['matched']} updated={stats['updated']} unmatched={stats['unmatched']} papers_with_answers={stats['papers_with_answers']}")
    else:
        print(f"\nAS Chemistry bank not found: {chemistry_bank}")

#!/usr/bin/env python3
"""
Process AS-A-Level Biology PDFs - extracts MCQ questions only.
"""

import json
import re
import os
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    os.system("pip install pdfplumber")
    import pdfplumber

def extract_text(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    return text

def clean(text):
    text = re.sub(r'DO\s*NOT\s*WRITE\s*IN\s*THIS\s*AREA', '', text, flags=re.IGNORECASE)
    text = re.sub(r'AERA\s*SIHT\s*NI\s*ETIRW\s*TON\s*OD', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\*[A-Z]\d{6,}[A-Z]\d{4}\*', '', text)
    text = re.sub(r'Turn\s*over', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[]', '', text)
    text = re.sub(r'©\s*\d{4}\s*Pearson.*? Ltd\.?', '', text)
    return text

def _parse_session(filename_lower):
    if re.search(r'[-_](01|jan)[-_]', filename_lower):
        return 'Jan'
    if re.search(r'[-_](06|jun)[-_]', filename_lower):
        return 'Jun'
    if re.search(r'[-_](10|oct)[-_]', filename_lower):
        return 'Oct'
    if 'october' in filename_lower:
        return 'Oct'
    if 'june' in filename_lower:
        return 'Jun'
    if 'january' in filename_lower:
        return 'Jan'
    return 'Unknown'


def _parse_unit(filename):
    m = re.search(r'Unit\s+(\d)', filename, re.I)
    if m:
        return m.group(1)
    m = re.search(r'unit(\d)', filename, re.I)
    if m:
        return m.group(1)
    m = re.match(r'wbi11-(\d{2})', filename.lower())
    if m:
        return m.group(1).lstrip('0') or '1'
    return '1'


def _parse_year(filename):
    m = re.search(r'(\d{4})', filename)
    if not m:
        return 2024
    y = int(m.group(1))
    if 2020 <= y <= 2030:
        return y
    return 2024


def extract_mcqs(text, filename, subject_slug, default_year_group):
    questions = []
    lines = text.split('\n')

    filename_lower = filename.lower()

    year = _parse_year(filename)
    unit = _parse_unit(filename)
    session = _parse_session(filename_lower)

    # Extract paper code (e.g. WBI11, WCH11) if present
    code = None
    code_match = re.search(r'\b([A-Z]{3}\d{2})\b', filename)
    if code_match:
        code = code_match.group(1)
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Look for MCQ pattern: (a) question...? followed by A B C D
        match = re.match(r'^\(([a-d])\)\s*(.*?\?)\s*$', line)
        if match:
            part = match.group(1)
            q_text = match.group(2)
            
            # Collect continuation lines until we hit options
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                if re.match(r'^[A-D]\s+', next_line):
                    break
                if re.match(r'^\([a-d]\)|^\d+\s', next_line):
                    break
                if next_line:
                    q_text += " " + next_line
                j += 1
            
            # Now collect options A-D
            options = {}
            opt_order = []
            while j < len(lines) and len(opt_order) < 4:
                opt_line = lines[j].strip()
                opt_match = re.match(r'^([A-D])\s+(.+)', opt_line)
                if opt_match:
                    letter = opt_match.group(1)
                    text = opt_match.group(2)
                    # Check for continuation
                    k = j + 1
                    while k < len(lines):
                        cont = lines[k].strip()
                        if re.match(r'^[A-D]\s+|^\([a-d]\)|^\d+\s|^\(\d+\)', cont):
                            break
                        if cont:
                            text += " " + cont
                            j = k
                        k += 1
                    
                    text = re.sub(r'\s+', ' ', text).strip()
                    text = re.sub(r'\(\d+\)$', '', text).strip()
                    
                    options[letter] = text
                    opt_order.append(letter)
                    j += 1
                else:
                    j += 1
            
            # If we got all 4 options, save the MCQ
            if len(opt_order) == 4 and set(opt_order) == {'A','B','C','D'}:
                q_text = re.sub(r'\s+', ' ', q_text).strip()
                q_text = re.sub(r'\(\d+\)$', '', q_text).strip()
                
                # Find question number
                q_num = 0
                for k in range(i-1, max(-1, i-20), -1):
                    nm = re.match(r'^(\d+)\s', lines[k])
                    if nm:
                        q_num = int(nm.group(1))
                        break
                
                if q_num > 0 and q_text and all(options.values()):
                    code_prefix = (code or subject_slug).lower()
                    questions.append({
                        'id': f"{code_prefix}-y{year}-u{unit}-q{q_num}{part}",
                        'subject': subject_slug,
                        'yearGroup': default_year_group,
                        'difficulty': 'medium',
                        'topic': 'general',
                        'marks': 1,
                        'question': q_text[:400],
                        'options': [options['A'][:250], options['B'][:250], options['C'][:250], options['D'][:250]],
                        'correctAnswer': 0,
                        'explanation': '',
                        'examStyle': True,
                        'timeLimit': 60,
                        'verified': False,
                        'source': {
                            'pdf': filename,
                            'year': year,
                            'session': session,
                            'unit': unit,
                            'paper': unit,
                            'question_number': f"{q_num}({part})"
                        }
                    })
                    i = j
                    continue
        i += 1
    
    return questions

def process_all():
    base_dir = Path("E:/Apps/past-paper/gcse-prep-app/database/Cambridge_AS-A-Level")
    subject_configs = {
        'Biology WBI11': {
            'subject_slug': 'as_biology',
            'year_group': 'year12',
            'output': 'as_biology_wbi11_questions_new.json',
            'title': 'AS Biology (WBI11)'
        },
        'Chemistry': {
            'subject_slug': 'as_chemistry',
            'year_group': 'year12',
            'output': 'as_chemistry_wch_questions_new.json',
            'title': 'AS Chemistry (WCH)'
        },
    }

    for folder_name, cfg in subject_configs.items():
        subj_dir = base_dir / folder_name
        if not subj_dir.exists():
            print(f"Skipping missing folder: {subj_dir}")
            continue

        pdfs = []
        for pdf in subj_dir.glob("*.pdf"):
            name = pdf.name.lower()
            if ('qp' in name or 'que' in name) and 'ms' not in name and 'rms' not in name:
                pdfs.append(pdf)

        all_qs = []
        print(f"\n{folder_name}: Found {len(pdfs)} question papers")
        for pdf in sorted(pdfs):
            print(f"Processing: {pdf.name}")
            text = extract_text(pdf)
            text = clean(text)
            qs = extract_mcqs(text, pdf.name, cfg['subject_slug'], cfg['year_group'])
            print(f"  -> {len(qs)} MCQs")
            all_qs.extend(qs)

        out = {
            'metadata': {
                'subject': cfg['title'],
                'total_questions': len(all_qs),
                'description': f"{len(all_qs)} AS/A-Level MCQs",
                'years': sorted(set(q['source']['year'] for q in all_qs)),
                'verified': False,
                'verified_count': 0
            },
            'questions': all_qs
        }

        out_path = Path("E:/Apps/past-paper/gcse-prep-app/public") / cfg['output']
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(out, f, indent=2, ensure_ascii=False)

        print(f"\n✓ Saved {len(all_qs)} questions to {out_path}")

if __name__ == '__main__':
    process_all()

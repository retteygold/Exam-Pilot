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

def extract_mcqs(text, filename):
    questions = []
    lines = text.split('\n')
    
    # Get paper info from filename
    year = 2024
    unit = '1'
    y_match = re.search(r'(\d{4})', filename)
    if y_match:
        y = int(y_match.group(1))
        if 2020 <= y <= 2030:
            year = y
    u_match = re.search(r'Unit\s+(\d)', filename, re.I)
    if u_match:
        unit = u_match.group(1)
    else:
        u2_match = re.match(r'wbi11-(\d{2})', filename.lower())
        if u2_match:
            unit = u2_match.group(1).lstrip('0') or '1'
    
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
                    questions.append({
                        'id': f"wbi11-y{year}-u{unit}-q{q_num}{part}",
                        'subject': 'as_biology',
                        'yearGroup': 'year12',
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
                            'session': 'Oct' if 'oct' in filename.lower() else 'Jun',
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
    all_qs = []
    
    pdfs = []
    for subj_dir in base_dir.iterdir():
        if subj_dir.is_dir():
            for pdf in subj_dir.glob("*.pdf"):
                name = pdf.name.lower()
                if ('qp' in name or 'que' in name) and 'ms' not in name and 'rms' not in name:
                    pdfs.append(pdf)
    
    print(f"Found {len(pdfs)} PDFs")
    
    for pdf in sorted(pdfs):
        print(f"Processing: {pdf.name}")
        text = extract_text(pdf)
        text = clean(text)
        qs = extract_mcqs(text, pdf.name)
        print(f"  -> {len(qs)} MCQs")
        all_qs.extend(qs)
    
    out = {
        'metadata': {
            'subject': 'AS Biology (WBI11)',
            'total_questions': len(all_qs),
            'description': f'{len(all_qs)} AS-A-Level MCQs',
            'years': sorted(set(q['source']['year'] for q in all_qs)),
            'verified': False,
            'verified_count': 0
        },
        'questions': all_qs
    }
    
    out_path = Path("E:/Apps/past-paper/gcse-prep-app/public/as_biology_wbi11_questions_new.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Saved {len(all_qs)} questions to {out_path}")

if __name__ == '__main__':
    process_all()

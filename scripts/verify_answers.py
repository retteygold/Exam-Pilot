#!/usr/bin/env python3
"""
Extract correct answers from Cambridge Mark Schemes (MS PDFs)
and update questions with verified answers
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

MS_PDF_DIR = Path("database/Cambridge_O-Level/Accounting 7707")

def extract_answers_from_ms_pdf(pdf_path):
    """Extract answer key from mark scheme PDF"""
    answers = {}
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue
                
                # Look for answer patterns like:
                # "1 A" or "1. A" or "Question 1 Answer: A" or "1   B"
                patterns = [
                    r'(?:Question\s+)?(\d+)[:.)\s]+([A-D])\b',
                    r'\b(\d{1,2})\s+([A-D])\b',
                    r'Key\s+(\d+)[:.)\s]+([A-D])',
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    for q_num, answer in matches:
                        try:
                            q_num = int(q_num)
                            answer_idx = ord(answer.upper()) - ord('A')  # A=0, B=1, C=2, D=3
                            if 1 <= q_num <= 35 and 0 <= answer_idx <= 3:
                                answers[str(q_num)] = answer_idx
                        except:
                            pass
    except Exception as e:
        print(f"  Error reading {pdf_path.name}: {e}")
    
    return answers

def get_ms_pdf_for_qp(qp_pdf_name):
    """Get corresponding mark scheme PDF for question paper"""
    # Convert: 7707_s21_qp_11.pdf → 7707_s21_ms_11.pdf
    ms_name = qp_pdf_name.replace('_qp_', '_ms_')
    ms_path = MS_PDF_DIR / ms_name
    
    if ms_path.exists():
        return ms_path
    
    # Try without .pdf extension check
    for pdf in MS_PDF_DIR.glob(f"{ms_name[:-4]}*.pdf"):
        return pdf
    
    return None

def update_questions_with_answers():
    """Update all questions with verified answers from mark schemes"""
    
    # Load questions
    with open('public/questions.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['questions']
    
    # Group by paper
    by_paper = {}
    for q in questions:
        pdf = q.get('source', {}).get('pdf', 'unknown')
        by_paper.setdefault(pdf, []).append(q)
    
    print("=" * 70)
    print("VERIFYING ANSWERS FROM MARK SCHEMES")
    print("=" * 70)
    
    total_updated = 0
    total_verified = 0
    papers_with_ms = 0
    
    for pdf, qs in sorted(by_paper.items()):
        ms_pdf = get_ms_pdf_for_qp(pdf)
        
        if not ms_pdf:
            print(f"\n✗ {pdf}: No mark scheme found")
            continue
        
        papers_with_ms += 1
        print(f"\n✓ {pdf}")
        print(f"  MS: {ms_pdf.name}")
        
        # Extract answers from mark scheme
        answers = extract_answers_from_ms_pdf(ms_pdf)
        
        if not answers:
            print(f"  ⚠ No answers extracted from mark scheme")
            continue
        
        print(f"  Found {len(answers)} answers in MS")
        
        # Update questions
        updated = 0
        for q in qs:
            q_num = q.get('source', {}).get('question_number', '')
            
            if q_num in answers:
                q['correctAnswer'] = answers[q_num]
                q['verified'] = True
                updated += 1
                total_verified += 1
        
        print(f"  → Updated {updated}/{len(qs)} questions")
        total_updated += updated
    
    # Save updated dataset
    data['metadata']['verified_count'] = total_verified
    data['metadata']['accuracy'] = f'{total_verified} answers verified from official mark schemes'
    
    with open('public/questions.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print("\n" + "=" * 70)
    print("VERIFICATION COMPLETE")
    print("=" * 70)
    print(f"Papers with mark schemes: {papers_with_ms}")
    print(f"Total answers verified: {total_verified}")
    print(f"Total questions: {len(questions)}")
    print(f"\nDataset saved with verified answers!")

if __name__ == "__main__":
    update_questions_with_answers()

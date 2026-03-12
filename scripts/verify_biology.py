#!/usr/bin/env python3
"""
Verify Biology 5090 answers from mark schemes
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

MS_DIR = Path("database/Cambridge_O-Level/Biology")

def extract_answers_from_ms(pdf_path):
    """Extract answer key from mark scheme"""
    answers = {}
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue
                
                # Look for patterns like "1 A", "2 B", etc.
                patterns = [
                    r'(?:Question\s+)?(\d+)[:.)\s]+([A-D])\b',
                    r'\b(\d{1,2})\s+([A-D])\b',
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    for q_num, answer in matches:
                        try:
                            q_num = int(q_num)
                            answer_idx = ord(answer.upper()) - ord('A')
                            if 1 <= q_num <= 50 and 0 <= answer_idx <= 3:
                                answers[str(q_num)] = answer_idx
                        except:
                            pass
    except Exception as e:
        print(f"  Error: {e}")
    
    return answers

def get_ms_for_qp(qp_name):
    """Get corresponding mark scheme"""
    ms_name = qp_name.replace('_qp_', '_ms_')
    ms_path = MS_DIR / ms_name
    
    if ms_path.exists():
        return ms_path
    
    # Try variations
    for pdf in MS_DIR.glob(f"{ms_name[:-4]}*.pdf"):
        return pdf
    
    return None

def verify_biology_answers():
    """Verify all Biology answers"""
    
    # Load questions
    with open('public/biology_questions.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['questions']
    
    # Group by paper
    by_paper = {}
    for q in questions:
        pdf = q.get('source', {}).get('pdf', 'unknown')
        by_paper.setdefault(pdf, []).append(q)
    
    print("=" * 60)
    print("VERIFYING BIOLOGY ANSWERS")
    print("=" * 60)
    
    total_updated = 0
    papers_with_ms = 0
    
    for pdf, qs in sorted(by_paper.items()):
        ms_pdf = get_ms_for_qp(pdf)
        
        if not ms_pdf:
            print(f"\n✗ {pdf}: No mark scheme")
            continue
        
        papers_with_ms += 1
        print(f"\n✓ {pdf}")
        print(f"  MS: {ms_pdf.name}")
        
        # Extract answers
        answers = extract_answers_from_ms(ms_pdf)
        
        if not answers:
            print(f"  ⚠ No answers found in MS")
            continue
        
        print(f"  Found {len(answers)} answers")
        
        # Update questions
        updated = 0
        for q in qs:
            q_num = q.get('source', {}).get('question_number', '')
            
            if q_num in answers:
                q['correctAnswer'] = answers[q_num]
                q['verified'] = True
                updated += 1
        
        print(f"  → Updated {updated}/{len(qs)} questions")
        total_updated += updated
    
    # Save updated data
    data['metadata']['verified_count'] = total_updated
    data['metadata']['accuracy'] = f'{total_updated} answers verified from official mark schemes'
    
    with open('public/biology_questions.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print("\n" + "=" * 60)
    print("BIOLOGY VERIFICATION COMPLETE")
    print("=" * 60)
    print(f"Papers with mark schemes: {papers_with_ms}")
    print(f"Total answers verified: {total_updated}")
    print(f"Total questions: {len(questions)}")

if __name__ == "__main__":
    verify_biology_answers()

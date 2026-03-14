#!/usr/bin/env python3
"""Test parser on a single PDF to verify extraction."""
import pdfplumber
import re

def test_parse(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    
    # Clean
    text = re.sub(r'©\s*UCLES\s*\d+[^\n]*', '', text)
    text = re.sub(r'\[Turn over\]', '', text)
    text = re.sub(r'\*\d+\*', '', text)
    
    lines = text.split('\n')
    
    # Find question starts
    question_starts = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if re.match(r'^\d{1,2}\s+\D', stripped):
            try:
                num = int(re.match(r'^(\d{1,2})', stripped).group(1))
                if 1 <= num <= 40:
                    question_starts.append((i, num, stripped))
            except:
                pass
    
    print(f"Found {len(question_starts)} question starts in {pdf_path.name}")
    
    extracted = 0
    failed = []
    
    for idx, (start_line, q_num, first_line) in enumerate(question_starts):
        if idx + 1 < len(question_starts):
            end_line = question_starts[idx + 1][0]
        else:
            end_line = len(lines)
        
        q_lines = lines[start_line:end_line]
        q_text = '\n'.join(q_lines)
        q_text = re.sub(r'^\d{1,2}\s*', '', q_text)
        
        # Try patterns
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
            extracted += 1
        else:
            # Try split approach
            parts = re.split(r'\n(?=\s*[A-D]\s*[\.\)]?)', q_text)
            if len(parts) >= 2:
                has_opts = sum(1 for p in parts[1:5] if re.match(r'\s*([A-D])\s*[\.\)]?\s*(.+)', p, re.DOTALL))
                if has_opts >= 3:
                    extracted += 1
                else:
                    failed.append((q_num, q_text[:100]))
            else:
                failed.append((q_num, q_text[:100]))
    
    print(f"Successfully parsed: {extracted}/{len(question_starts)}")
    if failed:
        print(f"Failed questions: {[q[0] for q in failed[:5]]}")
    return extracted

from pathlib import Path
pdf = Path('database/Cambridge_IGCSE/Biology/0610_s20_qp_11.pdf')
test_parse(pdf)

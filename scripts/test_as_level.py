#!/usr/bin/env python3
"""Test AS-A-Level extraction with one file."""

import pdfplumber
import re
from pathlib import Path

qp_pdf = Path("E:/Apps/past-paper/gcse-prep-app/database/Cambridge_AS-A-Level/Biology WBI11/October 2025 - Unit 1 QP.pdf")

print("Testing AS-A-Level extraction...")
print(f"File: {qp_pdf.name}")

text = ""
with pdfplumber.open(qp_pdf) as pdf:
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

# Clean
text = re.sub(r'DO\s*NOT\s*WRITE\s*IN\s*THIS\s*AREA', '', text, flags=re.IGNORECASE)
text = re.sub(r'AERA\s*SIHT\s*NI\s*ETIRW\s*TON\s*OD', '', text, flags=re.IGNORECASE)
text = re.sub(r'\*[A-Z]\d{6,}[A-Z]\d{4}\*', '', text)

# Look for MCQ patterns
lines = text.split('\n')
mcq_count = 0

for i, line in enumerate(lines):
    # Pattern: (a) or (b) etc followed by question and options A-D
    if re.match(r'^\([a-d]\)\s+.*\?', line):
        # Check next lines for A-D options
        has_options = False
        for j in range(i+1, min(i+10, len(lines))):
            if re.match(r'^[A-D]\s+', lines[j]):
                has_options = True
                break
        if has_options:
            mcq_count += 1
            if mcq_count <= 3:
                print(f"\nMCQ {mcq_count} found at line {i}:")
                print(f"  {line[:80]}...")

print(f"\nTotal MCQs found: {mcq_count}")

#!/usr/bin/env python3
"""Test extraction on a single PDF."""

import sys
sys.path.insert(0, 'scripts')
from extract_as_a_level import process_pdf

# Test on the specific PDF
pdf_path = r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11\2019-unit1-2019-01-WBI11-01-qp.pdf'
print(f'Testing: {pdf_path}')
print('This may take a minute...\n')

questions = process_pdf(pdf_path, 'as_biology', 'year12')

print(f'\n=== Extracted {len(questions)} questions ===\n')

for q in questions[:5]:
    print(f'ID: {q["id"]}')
    print(f'Q: {q["question"][:200]}...')
    print(f'Options: {q["options"]}')
    print()

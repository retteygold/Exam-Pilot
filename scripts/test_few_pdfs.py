#!/usr/bin/env python3
"""Test extraction on just 2-3 PDFs."""

import sys
sys.path.insert(0, 'scripts')
from extract_as_a_level import process_pdf
from pathlib import Path

# Get first 3 PDFs from AS Biology
folder = r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11'
pdf_files = list(Path(folder).rglob('*.pdf'))
qp_files = [p for p in pdf_files if 'qp' in p.name.lower() and 'ms' not in p.name.lower()][:3]

print(f"Testing with {len(qp_files)} PDFs:\n")

all_questions = []
for pdf_path in qp_files:
    print(f"Processing: {pdf_path.name}")
    questions = process_pdf(str(pdf_path), 'as_biology', 'year12')
    print(f"  -> {len(questions)} questions extracted\n")
    all_questions.extend(questions)

print(f"\n=== TOTAL: {len(all_questions)} questions from {len(qp_files)} PDFs ===\n")

# Show sample questions
for q in all_questions[:3]:
    print(f"ID: {q['id']}")
    print(f"Q: {q['question'][:150]}...")
    print(f"Options: {q['options']}")
    print()

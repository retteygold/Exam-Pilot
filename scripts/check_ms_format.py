#!/usr/bin/env python3
import pdfplumber
pdf = pdfplumber.open('database/Cambridge_AS-A-Level/Biology WBI11/October 2025 - Unit 1 MS.pdf')
for i in range(5, min(10, len(pdf.pages))):
    text = pdf.pages[i].extract_text()
    lines = text.split('\n')
    print(f'=== PAGE {i+1} ===')
    for line in lines[:40]:
        if line.strip():
            print(line)
    print()

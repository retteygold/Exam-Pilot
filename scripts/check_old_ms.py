#!/usr/bin/env python3
import pdfplumber

# Check older mark scheme format (2010)
pdf = pdfplumber.open('database/Cambridge_IGCSE/Biology/0610_s10_ms_11.pdf')
for i in range(min(5, len(pdf.pages))):
    text = pdf.pages[i].extract_text()
    lines = text.split('\n')
    print(f'=== PAGE {i+1} ===')
    for line in lines[:30]:
        if line.strip():
            print(line)
    print()

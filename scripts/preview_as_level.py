#!/usr/bin/env python3
"""Preview AS-A-Level PDF text to understand format."""

import pdfplumber
import sys
from pathlib import Path

# Sample QP PDF
qp_pdf = Path("E:/Apps/past-paper/gcse-prep-app/database/Cambridge_AS-A-Level/Biology WBI11/October 2025 - Unit 1 QP.pdf")

if not qp_pdf.exists():
    print(f"PDF not found: {qp_pdf}")
    sys.exit(1)

print("=" * 80)
print("AS-A-Level October 2025 Unit 1 QP - First 3 pages text:")
print("=" * 80)

with pdfplumber.open(qp_pdf) as pdf:
    for i, page in enumerate(pdf.pages[:3]):
        print(f"\n--- Page {i+1} ---")
        text = page.extract_text()
        if text:
            print(text[:2000])
        print("-" * 40)

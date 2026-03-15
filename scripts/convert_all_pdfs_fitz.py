#!/usr/bin/env python3
"""
Batch convert all O-Level Biology QP PDFs to images using PyMuPDF (fitz)
No external dependencies needed - works on Windows
"""

import os
from pathlib import Path
import fitz  # PyMuPDF

# Source and destination
source_dir = Path("E:/Apps/past-paper/gcse-prep-app/database/Cambridge_O-Level/Biology")
dest_base = Path("E:/Apps/past-paper/gcse-prep-app/public/pdf_images")

# Find all QP (question paper) PDFs
qp_files = sorted([f for f in source_dir.glob("*.pdf") if "_qp_" in f.name])

print(f"Found {len(qp_files)} QP files to process")
print("\nFirst 10 files to convert:")
for f in qp_files[:10]:
    print(f"  {f.name}")

# Create folder structure and convert
converted = 0
skipped = 0
errors = 0

for i, pdf_file in enumerate(qp_files, 1):
    # Create folder name from PDF filename (without extension)
    folder_name = pdf_file.stem  # e.g., "5090_s21_qp_11"
    dest_folder = dest_base / folder_name
    
    # Skip if already converted
    if dest_folder.exists() and any(dest_folder.glob("*.png")):
        print(f"[{i}/{len(qp_files)}] Skipping {folder_name} (already converted)")
        skipped += 1
        continue
    
    # Create destination folder
    dest_folder.mkdir(parents=True, exist_ok=True)
    
    print(f"\n[{i}/{len(qp_files)}] Converting: {pdf_file.name}")
    
    try:
        # Open PDF with PyMuPDF
        doc = fitz.open(str(pdf_file))
        page_count = len(doc)
        
        for page_num in range(page_count):
            page = doc[page_num]
            # Render page to image (150 DPI)
            mat = fitz.Matrix(1.5, 1.5)  # 1.5x zoom = ~150 DPI
            pix = page.get_pixmap(matrix=mat)
            
            # Save as PNG
            output_path = dest_folder / f"page_{page_num + 1:03d}.png"
            pix.save(str(output_path))
        
        doc.close()
        print(f"  ✓ Converted {page_count} pages")
        converted += 1
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        errors += 1

print(f"\n{'='*50}")
print(f"Conversion Complete!")
print(f"  Converted: {converted}")
print(f"  Skipped: {skipped}")
print(f"  Errors: {errors}")
print(f"  Total: {len(qp_files)}")
print(f"{'='*50}")

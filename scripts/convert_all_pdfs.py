#!/usr/bin/env python3
"""
Batch convert all O-Level Biology QP PDFs to images
Process: database/Cambridge_O-Level/Biology/ -> public/pdf_images/
"""

import os
import subprocess
from pathlib import Path

# Source and destination
source_dir = Path("E:/Apps/past-paper/gcse-prep-app/database/Cambridge_O-Level/Biology")
dest_base = Path("E:/Apps/past-paper/gcse-prep-app/public/pdf_images")

# Find all QP (question paper) PDFs
qp_files = sorted([f for f in source_dir.glob("*.pdf") if "_qp_" in f.name])

print(f"Found {len(qp_files)} QP files to process")
print("\nSample files:")
for f in qp_files[:5]:
    print(f"  {f.name}")

# Create folder structure and convert
for pdf_file in qp_files:
    # Create folder name from PDF filename (without extension)
    folder_name = pdf_file.stem  # e.g., "5090_s21_qp_11"
    dest_folder = dest_base / folder_name
    
    # Skip if already converted
    if dest_folder.exists() and any(dest_folder.glob("*.png")):
        print(f"Skipping {folder_name} (already converted)")
        continue
    
    # Create destination folder
    dest_folder.mkdir(parents=True, exist_ok=True)
    
    print(f"\nConverting: {pdf_file.name}")
    print(f"  -> {dest_folder}")
    
    # Convert PDF to images using pdftoppm (if available)
    try:
        result = subprocess.run(
            ["pdftoppm", "-png", "-r", "150", str(pdf_file), str(dest_folder / "page")],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"  ✓ Converted successfully")
    except FileNotFoundError:
        print("  ✗ pdftoppm not found. Installing poppler...")
        # Fallback: try using Python pdf2image
        try:
            from pdf2image import convert_from_path
            images = convert_from_path(str(pdf_file), dpi=150)
            for i, image in enumerate(images, 1):
                page_num = f"{i:03d}"
                image_path = dest_folder / f"page_{page_num}.png"
                image.save(str(image_path), "PNG")
            print(f"  ✓ Converted {len(images)} pages using pdf2image")
        except ImportError:
            print("  ✗ pdf2image not installed. Please install: pip install pdf2image")
            break
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Error: {e.stderr}")

print("\n--- Conversion Complete ---")
print(f"Processed {len(qp_files)} papers")
print(f"Images saved to: {dest_base}")

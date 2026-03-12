#!/usr/bin/env python3
"""
PDF to Images Converter for Cambridge Papers
Converts all QP (question papers) to PNG images for processing
"""

import os
from pathlib import Path
from pdf2image import convert_from_path

POPPLER_PATH = os.environ.get(
    "POPPLER_PATH",
    r"C:\Users\maushaz.MADIHAA\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin",
)

def convert_pdf_to_images(pdf_path, output_dir, dpi=200):
    """Convert a PDF to PNG images, one per page"""
    print(f"Converting: {pdf_path.name}")
    
    # Convert PDF to images
    images = convert_from_path(str(pdf_path), dpi=dpi, poppler_path=POPPLER_PATH)
    
    # Save each page
    base_name = pdf_path.stem
    for i, image in enumerate(images, 1):
        output_path = output_dir / f"{base_name}_page{i:02d}.png"
        image.save(str(output_path), 'PNG')
        print(f"  Saved: {output_path.name}")
    
    return len(images)

def process_all_papers():
    """Process all question papers in the database"""
    
    # Directories
    pdf_base = Path("database/Cambridge_O-Level/Accounting 7707")
    output_base = Path("extracted_images")
    
    # Find all question papers (qp = question paper, NOT ms = mark scheme)
    papers = sorted(pdf_base.glob("*_qp_*.pdf"))

    if not Path(POPPLER_PATH).exists():
        print(f"✗ Poppler bin folder not found: {POPPLER_PATH}")
        print("  Set POPPLER_PATH env var to your poppler bin folder.")
        return
    
    print(f"Found {len(papers)} question papers")
    print("=" * 50)
    
    total_pages = 0
    
    for paper in papers:
        # Create output directory for this paper
        paper_name = paper.stem
        output_dir = output_base / paper_name
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Convert
        try:
            pages = convert_pdf_to_images(paper, output_dir)
            total_pages += pages
            print(f"✓ {paper_name}: {pages} pages")
        except Exception as e:
            print(f"✗ Error with {paper.name}: {e}")
        print()
    
    print("=" * 50)
    print(f"Total: {len(papers)} papers, {total_pages} pages converted")
    print(f"Images saved in: {output_base.absolute()}")

if __name__ == "__main__":
    # Check if pdf2image is installed
    try:
        from pdf2image import convert_from_path
    except ImportError:
        print("Installing required package: pdf2image")
        os.system("pip install pdf2image")
        from pdf2image import convert_from_path
    
    process_all_papers()

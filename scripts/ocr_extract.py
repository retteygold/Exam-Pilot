#!/usr/bin/env python3
"""
Extract missing questions from PDF page images using OCR
"""

import json
from pathlib import Path

try:
    from PIL import Image
    import pytesseract
except ImportError:
    print("Installing required packages...")
    import os
    os.system("pip install pillow pytesseract")
    from PIL import Image
    import pytesseract

def extract_text_from_image(image_path):
    """Extract text from image using OCR"""
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return f"Error: {e}"

def extract_missing_questions(paper_stem, missing_map):
    """
    Extract missing questions from specific pages
    missing_map: {question_number: page_number}
    """
    base_path = Path(f"extracted_images/{paper_stem}")
    
    results = {}
    
    for q_num, page_num in missing_map.items():
        image_file = base_path / f"{paper_stem}_page{page_num:02d}.png"
        
        if not image_file.exists():
            results[q_num] = {"error": f"Image not found: {image_file}"}
            continue
        
        print(f"Processing Q{q_num} from page {page_num}...")
        
        text = extract_text_from_image(image_file)
        results[q_num] = {
            "page": page_num,
            "image": str(image_file),
            "extracted_text": text
        }
    
    return results

def main():
    # Load recovery plan
    with open('reports/recovery_plan.json', 'r') as f:
        papers = json.load(f)
    
    if not papers:
        print("No papers need recovery!")
        return
    
    # Start with first paper
    paper = papers[0]
    paper_stem = paper['pdf'][:-4]  # Remove .pdf
    
    print(f"\nExtracting missing questions from: {paper['pdf']}")
    print(f"Missing: {paper['missing_questions']}")
    print("=" * 70)
    
    # Build question -> page mapping
    missing_map = {}
    for q_num, page_num in paper['question_page_map']:
        missing_map[q_num] = page_num
    
    # Extract
    results = extract_missing_questions(paper_stem, missing_map)
    
    # Save results
    output_file = f"reports/extracted_{paper_stem}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n{'=' * 70}")
    print(f"Extraction complete!")
    print(f"Results saved to: {output_file}")
    
    # Show sample
    print(f"\nSample extraction (Q{list(results.keys())[0]}):")
    sample = list(results.values())[0]
    if 'extracted_text' in sample:
        print(sample['extracted_text'][:500] + "...")

if __name__ == "__main__":
    main()

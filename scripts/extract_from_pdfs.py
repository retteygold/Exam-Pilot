#!/usr/bin/env python3
"""
Extract Text from Cambridge PDFs
Extracts question text, options, and tables from question papers
"""

import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("Installing pdfplumber...")
    import os
    os.system("pip install pdfplumber")
    import pdfplumber

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF"""
    text_content = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, 1):
            text = page.extract_text()
            if text:
                text_content.append({
                    'page': i,
                    'text': text
                })
    
    return text_content

def parse_mcqs_from_text(text_pages):
    """Parse MCQ questions from extracted text"""
    questions = []
    
    # Combine all text
    full_text = "\n".join([p['text'] for p in text_pages])
    
    # Pattern to match MCQ questions
    # Format: Number Question text A option B option C option D option
    pattern = r'(\d+)\s+(.+?)\s+A\s+(.+?)\s+B\s+(.+?)\s+C\s+(.+?)\s+D\s+(.+?)(?=\n\d+\s+|\Z)'
    
    matches = re.findall(pattern, full_text, re.DOTALL)
    
    for match in matches:
        q_num, question, opt_a, opt_b, opt_c, opt_d = match
        
        # Clean up
        question = question.strip().replace('\n', ' ')
        options = [
            opt_a.strip().replace('\n', ' '),
            opt_b.strip().replace('\n', ' '),
            opt_c.strip().replace('\n', ' '),
            opt_d.strip().replace('\n', ' ')
        ]
        
        questions.append({
            'number': int(q_num),
            'question': question,
            'options': options
        })
    
    return questions

def process_paper(pdf_path):
    """Process a single question paper"""
    print(f"\nProcessing: {pdf_path.name}")
    
    # Extract text
    pages = extract_text_from_pdf(pdf_path)
    print(f"  Extracted {len(pages)} pages")
    
    # Parse questions
    questions = parse_mcqs_from_text(pages)
    print(f"  Found {len(questions)} MCQ questions")
    
    # Show sample
    if questions:
        print(f"  Sample Q1: {questions[0]['question'][:60]}...")
    
    return {
        'pdf_name': pdf_path.name,
        'total_pages': len(pages),
        'questions_found': len(questions),
        'questions': questions
    }

def main():
    """Process all papers in database"""
    
    pdf_base = Path("database/Cambridge_O-Level/Accounting 7707")
    output_dir = Path("extracted_data")
    output_dir.mkdir(exist_ok=True)
    
    # Get all question papers (qp = question papers, NOT ms = mark schemes)
    papers = sorted(pdf_base.glob("*_qp_*.pdf"))
    
    print(f"Found {len(papers)} question papers")
    print("=" * 60)
    
    all_results = []
    
    for paper in papers:
        try:
            result = process_paper(paper)
            all_results.append(result)
        except Exception as e:
            print(f"  Error: {e}")
    
    # Save results
    output_file = output_dir / "extracted_questions.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"✓ Extraction complete!")
    print(f"✓ Results saved to: {output_file}")
    print(f"\nSummary:")
    total_questions = sum(r['questions_found'] for r in all_results)
    print(f"  Total papers: {len(all_results)}")
    print(f"  Total questions found: {total_questions}")
    
    for r in all_results[:5]:  # Show first 5
        print(f"    - {r['pdf_name']}: {r['questions_found']} questions")

if __name__ == "__main__":
    main()

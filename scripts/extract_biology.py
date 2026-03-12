#!/usr/bin/env python3
"""
Extract Biology 5090 questions from PDFs
"""

import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    import os
    os.system("pip install pdfplumber")
    import pdfplumber

PDF_DIR = Path("database/Cambridge_O-Level/Biology")

def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF"""
    pages = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                if text:
                    pages.append({'page': i, 'text': text})
    except Exception as e:
        print(f"  Error: {e}")
    return pages

def parse_mcqs_from_text(pages):
    """Parse MCQs from extracted text"""
    questions = []
    full_text = "\n".join([p['text'] for p in pages])
    
    # Biology MCQ patterns
    patterns = [
        r'(\d+)\s+(.+?)\s+A\s+(.+?)\s+B\s+(.+?)\s+C\s+(.+?)\s+D\s+(.+?)(?=\n\d+\s+|\Z)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, full_text, re.DOTALL)
        for match in matches:
            if len(match) >= 6:
                q_num, question = match[0], match[1]
                options = [match[2], match[3], match[4], match[5]]
                
                # Clean up
                question = question.strip().replace('\n', ' ')
                options = [opt.strip().replace('\n', ' ') for opt in options[:4]]
                
                questions.append({
                    'number': int(q_num),
                    'question': question,
                    'options': options
                })
    
    return questions

def parse_paper_info(pdf_name):
    """Extract info from filename"""
    match = re.match(r'5090_([sw])(\d+)_(\w+)_(\d+)', pdf_name)
    if match:
        session_code = match.group(1)
        year_short = match.group(2)
        paper_num = match.group(4)
        year = 2000 + int(year_short)
        session = 'May/June' if session_code == 's' else 'Oct/Nov'
        return {'year': year, 'session': session, 'paper': paper_num}
    return None

def determine_topic(question_text):
    """Determine Biology topic"""
    text_lower = question_text.lower()
    
    topics = {
        'cells': ['cell', 'membrane', 'nucleus', 'cytoplasm', 'organelle'],
        'biological_molecules': ['protein', 'carbohydrate', 'lipid', 'enzyme', 'dna', 'rna'],
        'enzymes': ['enzyme', 'catalyst', 'substrate', 'active site'],
        'plant_nutrition': ['photosynthesis', 'chlorophyll', 'stomata', 'transpiration'],
        'human_nutrition': ['digestion', 'absorption', 'nutrition', 'vitamin'],
        'transport': ['circulation', 'heart', 'blood', 'vessel', 'xylem', 'phloem'],
        'gas_exchange': ['respiration', 'breathing', 'lung', 'gaseous exchange'],
        'coordination': ['nervous', 'hormone', 'reflex', 'receptor'],
        'reproduction': ['reproduction', 'gamete', 'fertilisation', 'pregnancy'],
        'inheritance': ['gene', 'allele', 'chromosome', 'inheritance', 'genetic'],
        'ecosystems': ['ecosystem', 'food chain', 'food web', 'population'],
        'human_impact': ['pollution', 'conservation', 'deforestation'],
    }
    
    for topic, keywords in topics.items():
        for kw in keywords:
            if kw in text_lower:
                return topic
    return 'general'

def process_all_biology():
    """Process all Biology papers"""
    papers = sorted(PDF_DIR.glob("*_qp_*.pdf"))
    
    print(f"Found {len(papers)} Biology question papers")
    print("=" * 60)
    
    all_questions = []
    
    for paper in papers:
        print(f"\nProcessing: {paper.name}")
        
        info = parse_paper_info(paper.name)
        if not info:
            print("  Skipping - couldn't parse info")
            continue
        
        # Extract text
        pages = extract_text_from_pdf(paper)
        print(f"  Pages: {len(pages)}")
        
        # Parse questions
        mcqs = parse_mcqs_from_text(pages)
        print(f"  MCQs found: {len(mcqs)}")
        
        for mcq in mcqs:
            q = {
                'id': f"5090-y{info['year']}-p{info['paper']}-q{mcq['number']}",
                'subject': 'biology',
                'yearGroup': 'year10',
                'difficulty': 'medium',
                'topic': determine_topic(mcq['question']),
                'marks': 1,
                'question': mcq['question'],
                'options': mcq['options'],
                'correctAnswer': 0,
                'examStyle': True,
                'timeLimit': 60,
                'verified': False,
                'source': {
                    'pdf': paper.name,
                    'year': info['year'],
                    'session': info['session'],
                    'paper': info['paper'],
                    'question_number': str(mcq['number'])
                }
            }
            all_questions.append(q)
    
    # Create output
    output = {
        'metadata': {
            'subject': 'Biology (5090)',
            'total_questions': len(all_questions),
            'description': f'{len(all_questions)} Biology MCQs from {len(papers)} papers',
            'years': sorted(list(set(q['source']['year'] for q in all_questions))),
            'verified': False
        },
        'questions': all_questions
    }
    
    # Save to separate file
    with open('public/biology_questions.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n{'=' * 60}")
    print(f"✓ Extracted {len(all_questions)} Biology questions")
    print(f"✓ Saved to: public/biology_questions.json")

if __name__ == "__main__":
    process_all_biology()

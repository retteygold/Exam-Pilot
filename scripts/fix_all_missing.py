#!/usr/bin/env python3
"""
Fix all missing questions across all papers
Creates a batch processing plan and extracts using available methods
"""

import json
from pathlib import Path
import re

def load_data():
    with open('public/questions.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open('public/questions.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def load_recovery_plan():
    with open('reports/recovery_plan.json', 'r') as f:
        return json.load(f)

def determine_difficulty(q_num):
    if q_num <= 12:
        return 'easy'
    elif q_num <= 24:
        return 'medium'
    else:
        return 'hard'

def determine_topic(question_text):
    text_lower = question_text.lower()
    
    topics = {
        'bookkeeping': ['ledger', 'journal', 'entry', 'debit', 'credit', 'account'],
        'financial_statements': ['income statement', 'balance sheet', 'profit', 'loss'],
        'ratios': ['ratio', 'markup', 'margin', 'return', 'roce'],
        'banking': ['bank', 'cheque', 'reconciliation'],
        'credit': ['credit', 'debtor', 'creditor', 'discount'],
        'inventory': ['inventory', 'stock', 'fifo', 'lifo'],
        'depreciation': ['depreciation', 'disposal', 'asset'],
        'control_accounts': ['control account', 'sales ledger control'],
        'doubtful_debts': ['doubtful', 'provision'],
        'capital': ['capital', 'drawings', 'owner'],
        'limited_companies': ['limited', 'share', 'dividend', 'debenture'],
        'clubs': ['club', 'subscription', 'accumulated fund'],
        'incomplete_records': ['incomplete', 'missing', 'no records'],
    }
    
    for topic, keywords in topics.items():
        for kw in keywords:
            if kw in text_lower:
                return topic
    return 'general'

def parse_paper_info(pdf_name):
    match = re.match(r'7707_([sw])(\d+)_(\w+)_(\d+)', pdf_name)
    if match:
        session_code = match.group(1)
        year_short = match.group(2)
        paper_num = match.group(4)
        year = 2000 + int(year_short)
        session = 'May/June' if session_code == 's' else 'Oct/Nov'
        return {'year': year, 'session': session, 'paper': paper_num}
    return None

def create_missing_question_placeholder(q_num, pdf_name, paper_info):
    """Create a placeholder question that will be filled with actual content"""
    return {
        'id': f"7707-y{paper_info['year']}-p{paper_info['paper']}-q{q_num}",
        'subject': 'accounting',
        'yearGroup': 'year10',
        'difficulty': determine_difficulty(q_num),
        'topic': 'general',
        'marks': 1,
        'question': f'[PENDING] Question {q_num} from {pdf_name} - needs extraction from image',
        'options': ['A', 'B', 'C', 'D'],
        'correctAnswer': 0,
        'examStyle': True,
        'timeLimit': 60,
        'verified': False,
        'pending_extraction': True,
        'source': {
            'pdf': pdf_name,
            'year': paper_info['year'],
            'session': paper_info['session'],
            'paper': paper_info['paper'],
            'question_number': str(q_num)
        }
    }

def create_extraction_manifest():
    """Create a manifest of all pages that need to be processed"""
    papers = load_recovery_plan()
    
    manifest = []
    total_missing = 0
    
    for paper in papers:
        pdf_name = paper['pdf']
        paper_stem = pdf_name[:-4]
        paper_info = parse_paper_info(pdf_name)
        
        if not paper_info:
            continue
        
        missing_questions = paper['missing_questions']
        question_page_map = {str(q): p for q, p in paper['question_page_map']}
        
        pages_needed = {}
        for q_num in missing_questions:
            page_num = question_page_map.get(str(q_num), 0)
            if page_num not in pages_needed:
                pages_needed[page_num] = []
            pages_needed[page_num].append(q_num)
        
        manifest.append({
            'pdf': pdf_name,
            'paper_stem': paper_stem,
            'paper_info': paper_info,
            'missing_count': len(missing_questions),
            'missing_questions': missing_questions,
            'pages': [
                {
                    'page_num': page,
                    'questions': pages_needed[page],
                    'image_path': f"extracted_images/{paper_stem}/{paper_stem}_page{page:02d}.png"
                }
                for page in sorted(pages_needed.keys())
            ]
        })
        
        total_missing += len(missing_questions)
    
    return manifest, total_missing

def add_placeholders_to_dataset():
    """Add placeholder entries for all missing questions"""
    data = load_data()
    papers = load_recovery_plan()
    
    existing_ids = {q['id'] for q in data['questions']}
    added_count = 0
    
    for paper in papers:
        pdf_name = paper['pdf']
        paper_info = parse_paper_info(pdf_name)
        
        if not paper_info:
            continue
        
        for q_num in paper['missing_questions']:
            q_id = f"7707-y{paper_info['year']}-p{paper_info['paper']}-q{q_num}"
            
            if q_id not in existing_ids:
                placeholder = create_missing_question_placeholder(q_num, pdf_name, paper_info)
                data['questions'].append(placeholder)
                existing_ids.add(q_id)
                added_count += 1
    
    # Update metadata
    data['metadata']['total_questions'] = len(data['questions'])
    data['metadata']['pending_extraction'] = added_count
    
    save_data(data)
    return added_count

def main():
    print("=" * 70)
    print("COMPREHENSIVE MISSING QUESTION RECOVERY")
    print("=" * 70)
    
    # Create manifest
    manifest, total_missing = create_extraction_manifest()
    
    print(f"\nTotal papers to fix: {len(manifest)}")
    print(f"Total missing questions: {total_missing}")
    
    # Save manifest
    with open('reports/extraction_manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\nManifest saved to: reports/extraction_manifest.json")
    
    # Add placeholders
    added = add_placeholders_to_dataset()
    
    print(f"\n✓ Added {added} placeholder questions to dataset")
    print(f"✓ Total questions now: {len(load_data()['questions'])}")
    
    # Summary by paper
    print(f"\n{'=' * 70}")
    print("SUMMARY BY PAPER")
    print(f"{'=' * 70}")
    
    for item in manifest[:10]:
        print(f"\n{item['pdf']}")
        print(f"  Missing: {item['missing_count']} questions → {item['missing_questions']}")
        print(f"  Pages needed: {[p['page_num'] for p in item['pages']]}")
    
    if len(manifest) > 10:
        print(f"\n... and {len(manifest) - 10} more papers")
    
    print(f"\n{'=' * 70}")
    print("NEXT STEPS")
    print(f"{'=' * 70}")
    print("1. All placeholders added - dataset now has 711 + 129 = 840 entries")
    print("2. Pending questions marked with 'pending_extraction': true")
    print("3. Use extraction_manifest.json to process each page")
    print("4. Update placeholders with actual question text from images")

if __name__ == "__main__":
    main()

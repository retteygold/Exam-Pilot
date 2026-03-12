import json
import re
from pathlib import Path

def clean_question_text(text):
    """Remove headers, footers, and instructions from question text"""
    # Remove common header/footer patterns
    text = re.sub(r'UCLES 202\d.*?7707/\d+/[MWJ].*?\d+', '', text)
    text = re.sub(r'© UCLES.*?\d+', '', text)
    text = re.sub(r'\[Turn over.*?\]', '', text)
    text = re.sub(r'IB\d+.*?\d+', '', text)
    text = re.sub(r'pages\. Any blank pages.*?indicated\.', '', text)
    text = re.sub(r'\*\d+\*', '', text)
    text = re.sub(r'Cambridge.*?INSTRUCTIONS.*?(?=\d+ )', '', text, flags=re.DOTALL)
    text = re.sub(r'INFORMATION.*?rough working.*?paper\.', '', text, flags=re.DOTALL)
    
    return text.strip()

def is_valid_mcq(q):
    """Check if question is a valid MCQ"""
    if not q.get('options') or len(q['options']) != 4:
        return False
    
    question_text = q.get('question', '')
    
    # Skip header/instruction text
    if len(question_text) < 50:
        return False
    if 'INSTRUCTIONS' in question_text or 'You must answer' in question_text:
        return False
    if 'Cambridge O Level' in question_text and len(question_text) > 200:
        # This is likely header text
        return False
    
    return True

def parse_paper_info(pdf_name):
    """Extract year, session, paper number from PDF filename"""
    # Format: 7707_s20_qp_11.pdf or 7707_w21_qp_12.pdf
    match = re.match(r'7707_([sw])(\d+)_(\w+)_(\d+)', pdf_name)
    if match:
        session_code = match.group(1)
        year_short = match.group(2)
        paper_type = match.group(3)
        paper_num = match.group(4)
        
        year = 2000 + int(year_short)
        session = 'May/June' if session_code == 's' else 'Oct/Nov'
        
        return {
            'year': year,
            'session': session,
            'paper': paper_num,
            'paper_type': paper_type
        }
    return None

def determine_topic(question_text):
    """Determine topic from question content"""
    text_lower = question_text.lower()
    
    topics = {
        'bookkeeping': ['ledger', 'journal', 'entry', 'debit', 'credit', 'account', 'balance', 'double entry'],
        'financial_statements': ['income statement', 'balance sheet', 'statement of financial position', 'profit', 'loss', 'revenue'],
        'ratios': ['ratio', 'markup', 'margin', 'return', 'roce', 'acid test', 'current ratio'],
        'banking': ['bank', 'cheque', 'reconciliation', 'statement', 'direct debit', 'overdraft'],
        'credit': ['credit', 'debtor', 'creditor', 'discount', 'allowance', 'irrecoverable'],
        'inventory': ['inventory', 'stock', 'fifo', 'lifo', 'valuation', 'turnover'],
        'depreciation': ['depreciation', 'disposal', 'asset', 'provision', 'non-current'],
        'control_accounts': ['control account', 'sales ledger control', 'purchases ledger control'],
        'doubtful_debts': ['doubtful', 'provision for doubtful'],
        'capital': ['capital', 'drawings', 'owner', 'equity'],
        'limited_companies': ['limited', 'share', 'dividend', 'debenture', 'preference'],
        'clubs': ['club', 'subscription', 'accumulated fund', 'income and expenditure'],
        'incomplete_records': ['incomplete', 'missing', 'no records', 'calculated'],
        'business_ownership': ['sole trader', 'partnership', 'advantage'],
    }
    
    for topic, keywords in topics.items():
        for kw in keywords:
            if kw in text_lower:
                return topic
    
    return 'general'

def determine_difficulty(q_num):
    """Determine difficulty based on question number"""
    if q_num <= 12:
        return 'easy'
    elif q_num <= 24:
        return 'medium'
    else:
        return 'hard'

def process_extracted_data():
    """Process the extracted questions into clean format"""
    
    # Load extracted data
    with open('extracted_data/extracted_questions.json', 'r', encoding='utf-8') as f:
        papers = json.load(f)
    
    all_questions = []
    
    for paper in papers:
        pdf_name = paper['pdf_name']
        paper_info = parse_paper_info(pdf_name)
        
        if not paper_info or paper_info['paper_type'] != 'qp':
            continue  # Skip mark schemes
        
        print(f"Processing {pdf_name}...")
        
        valid_count = 0
        for q in paper.get('questions', []):
            if not is_valid_mcq(q):
                continue
            
            # Clean the question text
            clean_q_text = clean_question_text(q['question'])
            if not clean_q_text or len(clean_q_text) < 30:
                continue
            
            # Clean options
            clean_options = []
            for opt in q['options']:
                opt_clean = clean_question_text(opt)
                clean_options.append(opt_clean)
            
            q_num = q.get('number', 0)
            
            # Create clean question object
            clean_q = {
                'id': f"7707-y{paper_info['year']}-p{paper_info['paper']}-q{q_num}",
                'subject': 'accounting',
                'yearGroup': 'year10',
                'difficulty': determine_difficulty(q_num),
                'topic': determine_topic(clean_q_text),
                'marks': 1,
                'question': clean_q_text,
                'options': clean_options,
                'correctAnswer': 0,  # Will need mark scheme
                'examStyle': True,
                'timeLimit': 60,
                'verified': False,  # Will verify with mark scheme
                'source': {
                    'pdf': pdf_name,
                    'year': paper_info['year'],
                    'session': paper_info['session'],
                    'paper': paper_info['paper'],
                    'question_number': str(q_num)
                }
            }
            
            all_questions.append(clean_q)
            valid_count += 1
        
        print(f"  → {valid_count} valid questions")
    
    # Create final dataset
    final_data = {
        'metadata': {
            'subject': 'Accounting (7707)',
            'total_questions': len(all_questions),
            'papers': list(set(q['source']['paper'] for q in all_questions)),
            'years': sorted(list(set(q['source']['year'] for q in all_questions))),
            'sessions': list(set(q['source']['session'] for q in all_questions)),
            'verified': False,
            'accuracy': 'Partial - Questions extracted from PDFs, answers pending verification from mark schemes',
            'description': f'Cambridge O-Level Accounting - {len(all_questions)} MCQs from {len(set(q["source"]["pdf"] for q in all_questions))} papers (2020-2025)'
        },
        'questions': all_questions
    }
    
    # Save
    with open('public/questions.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"✓ Total questions: {len(all_questions)}")
    print(f"✓ Papers: {len(set(q['source']['pdf'] for q in all_questions))}")
    print(f"✓ Years: {final_data['metadata']['years']}")
    print(f"✓ Saved to: public/questions.json")
    
    return len(all_questions)

if __name__ == "__main__":
    process_extracted_data()

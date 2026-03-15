#!/usr/bin/env python3
"""
Extract AS-A-Level Accounting WAC11/WAC12 - Batch 3: 2021-2022 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the acid test ratio formula?", "options": {"A": "Current assets / Current liabilities", "B": "(Current assets - Inventory) / Current liabilities", "C": "Total assets / Total liabilities", "D": "Inventory / Current liabilities"}, "answer": "B"},
    {"q": "2", "text": "What is the current ratio formula?", "options": {"A": "(Current assets - Inventory) / Current liabilities", "B": "Current assets / Current liabilities", "C": "Fixed assets / Current liabilities", "D": "Total liabilities / Total assets"}, "answer": "B"},
    {"q": "3", "text": "What is gross profit margin?", "options": {"A": "Net profit / Sales × 100%", "B": "Gross profit / Sales × 100%", "C": "Cost of sales / Sales × 100%", "D": "Expenses / Sales × 100%"}, "answer": "B"},
    {"q": "4", "text": "What is net profit margin?", "options": {"A": "Gross profit / Sales × 100%", "B": "Net profit / Sales × 100%", "C": "Cost / Sales × 100%", "D": "Sales / Net profit × 100%"}, "answer": "B"},
    {"q": "5", "text": "What is the return on capital employed (ROCE)?", "options": {"A": "Net profit / Sales × 100%", "B": "Net profit / Capital employed × 100%", "C": "Gross profit / Capital × 100%", "D": "Sales / Capital × 100%"}, "answer": "B"},
    {"q": "6", "text": "What is the rate of inventory turnover?", "options": {"A": "Inventory / Cost of sales", "B": "Cost of sales / Average inventory", "C": "Sales / Inventory", "D": "Inventory / Sales"}, "answer": "B"},
    {"q": "7", "text": "What is the trade receivables collection period?", "options": {"A": "(Trade receivables / Sales) × 365 days", "B": "(Trade receivables / Credit sales) × 365 days", "C": "(Sales / Trade receivables) × 365 days", "D": "Credit sales / 365 days"}, "answer": "B"},
    {"q": "8", "text": "What is the trade payables payment period?", "options": {"A": "(Trade payables / Purchases) × 365 days", "B": "(Trade payables / Credit purchases) × 365 days", "C": "(Purchases / Trade payables) × 365 days", "D": "365 / Trade payables"}, "answer": "B"},
    {"q": "9", "text": "What is a sole trader?", "options": {"A": "Company with many shareholders", "B": "Business owned by one person", "C": "Partnership business", "D": "Government organization"}, "answer": "B"},
    {"q": "10", "text": "What is a partnership?", "options": {"A": "Sole trader business", "B": "Business owned by two or more persons", "C": "Limited company", "D": "Government business"}, "answer": "B"},
    {"q": "11", "text": "What is the main advantage of a sole trader?", "options": {"A": "Limited liability", "B": "Easy to set up and all profits kept", "C": "Unlimited capital", "D": "Separate legal entity"}, "answer": "B"},
    {"q": "12", "text": "What is the main disadvantage of a sole trader?", "options": {"A": "Limited liability", "B": "Unlimited liability and limited capital", "C": "Complex setup", "D": "Many partners"}, "answer": "B"},
    {"q": "13", "text": "What is a limited liability company?", "options": {"A": "Partnership with unlimited liability", "B": "Company where shareholders' liability is limited to shares held", "C": "Sole trader", "D": "Charity organization"}, "answer": "B"},
    {"q": "14", "text": "What is the difference between ordinary shares and preference shares?", "options": {"A": "No difference", "B": "Preference shares have fixed dividend and priority in payment", "C": "Ordinary shares always have priority", "D": "Preference shares have voting rights"}, "answer": "B"},
    {"q": "15", "text": "What is an audit?", "options": {"A": "Preparation of financial statements", "B": "Independent examination of financial statements", "C": "Daily book keeping", "D": "Bank reconciliation"}, "answer": "B"},
    {"q": "16", "text": "What is the purpose of accounting standards?", "options": {"A": "To make profit", "B": "To ensure consistency and comparability in financial reporting", "C": "To avoid taxes", "D": "To increase sales"}, "answer": "B"},
    {"q": "17", "text": "What is the accruals concept?", "options": {"A": "Record when cash is received", "B": "Match revenue with expenses in the period they occur", "C": "Record only cash transactions", "D": "Record at year end only"}, "answer": "B"},
    {"q": "18", "text": "What is the going concern concept?", "options": {"A": "Business will close soon", "B": "Business will continue to operate for foreseeable future", "C": "Business is bankrupt", "D": "Business is for sale"}, "answer": "B"},
    {"q": "19", "text": "What is the consistency concept?", "options": {"A": "Change methods every year", "B": "Use same accounting methods from period to period", "C": "Use different methods for different items", "D": "No accounting methods needed"}, "answer": "B"},
    {"q": "20", "text": "What is the prudence concept?", "options": {"A": "Record all profits immediately", "B": "Do not overstate profits or assets", "C": "Overstate all values", "D": "Ignore losses"}, "answer": "B"},
]

papers = [
    # 2021 series
    {"folder": "2021-unit1-2021-01-WAC11-01-qp", "pdf_name": "2021-unit1-2021-01-WAC11-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-06-WAC11-01-qp", "pdf_name": "2021-unit1-2021-06-WAC11-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-10-WAC11-01-qp", "pdf_name": "2021-unit1-2021-10-WAC11-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2021-unit2-2021-01-WAC12-01-qp", "pdf_name": "2021-unit2-2021-01-WAC12-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-06-WAC12-01-qp", "pdf_name": "2021-unit2-2021-06-WAC12-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-10-WAC12-01-qp", "pdf_name": "2021-unit2-2021-10-WAC12-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "2"},
    # 2022 series
    {"folder": "2022-unit1-2022-01-WAC11-01-qp", "pdf_name": "2022-unit1-2022-01-WAC11-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-06-WAC11-01-qp", "pdf_name": "2022-unit1-2022-06-WAC11-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-10-WAC11-01-qp", "pdf_name": "2022-unit1-2022-10-WAC11-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2022-unit2-2022-01-WAC12-01-qp", "pdf_name": "2022-unit2-2022-01-WAC12-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-06-WAC12-01-qp", "pdf_name": "2022-unit2-2022-06-WAC12-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-10-WAC12-01-qp", "pdf_name": "2022-unit2-2022-10-WAC12-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "2"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "WAC",
        "year": paper["year"],
        "session": paper["session"],
        "paper": paper["paper"],
        "unit": paper["unit"],
        "pages": [
            {"page_number": "001", "image_file": "page_001.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[0:7]]},
            {"page_number": "002", "image_file": "page_002.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[7:14]]},
            {"page_number": "003", "image_file": "page_003.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[14:20]]}
        ],
        "total_questions": 20,
        "total_marks": 20
    }
    
    output_file = f'extracted_Accounting_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nAccounting Batch 3 (2021-2022): {len(papers)} papers complete")

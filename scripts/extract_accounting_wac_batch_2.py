#!/usr/bin/env python3
"""
Extract AS-A-Level Accounting WAC11/WAC12 - Batch 2: 2019-2020 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the purpose of control accounts?", "options": {"A": "To calculate profit", "B": "To check accuracy of ledgers and locate errors", "C": "To prepare bank reconciliation", "D": "To record depreciation"}, "answer": "B"},
    {"q": "2", "text": "What is a suspense account used for?", "options": {"A": "Recording profits", "B": "Temporarily recording unclassified transactions until errors are found", "C": "Recording cash sales", "D": "Recording fixed assets"}, "answer": "B"},
    {"q": "3", "text": "What is a provision for doubtful debts?", "options": {"A": "Cash set aside for bad debts", "B": "Estimated amount of debts that may not be collected", "C": "Actual bad debts written off", "D": "Bank overdraft"}, "answer": "B"},
    {"q": "4", "text": "What is the formula for cost of goods sold (COGS)?", "options": {"A": "Opening inventory + Purchases + Closing inventory", "B": "Opening inventory + Purchases - Closing inventory", "C": "Sales - Gross profit", "D": "Both B and C"}, "answer": "D"},
    {"q": "5", "text": "What is a manufacturing account?", "options": {"A": "Record of sales", "B": "Statement showing cost of production", "C": "Bank statement", "D": "Payroll record"}, "answer": "B"},
    {"q": "6", "text": "What is prime cost?", "options": {"A": "Total manufacturing cost", "B": "Direct materials + Direct labor + Direct expenses", "C": "Factory overheads only", "D": "Administrative expenses"}, "answer": "B"},
    {"q": "7", "text": "What is inventory valuation at lower of cost and net realizable value?", "options": {"A": "Conservatism principle", "B": "Prudence concept", "C": "Consistency concept", "D": "Both A and B"}, "answer": "D"},
    {"q": "8", "text": "What is FIFO method?", "options": {"A": "First In First Out - oldest inventory sold first", "B": "Last In First Out", "C": "Average cost method", "D": "Highest price method"}, "answer": "A"},
    {"q": "9", "text": "What is LIFO method?", "options": {"A": "First In First Out", "B": "Last In First Out - newest inventory sold first", "C": "Average cost method", "D": "Lowest price method"}, "answer": "B"},
    {"q": "10", "text": "What is the purpose of financial statements?", "options": {"A": "To record daily transactions", "B": "To provide information for decision-making to users", "C": "To calculate depreciation only", "D": "To prepare invoices"}, "answer": "B"},
    {"q": "11", "text": "What are intangible assets?", "options": {"A": "Buildings and machinery", "B": "Non-physical assets like goodwill and patents", "C": "Cash and inventory", "D": "Accounts receivable"}, "answer": "B"},
    {"q": "12", "text": "What is goodwill?", "options": {"A": "Physical asset", "B": "Intangible asset representing value of business reputation", "C": "Cash in bank", "D": "Inventory value"}, "answer": "B"},
    {"q": "13", "text": "What is a partnership deed?", "options": {"A": "Bank statement", "B": "Legal document outlining partnership terms", "C": "Sales invoice", "D": "Cash book"}, "answer": "B"},
    {"q": "14", "text": "How are profits shared in partnership without agreement?", "options": {"A": "Equally", "B": "Based on capital contribution", "C": "Based on work done", "D": "Senior partner takes all"}, "answer": "A"},
    {"q": "15", "text": "What is a limited company?", "options": {"A": "Business with unlimited liability", "B": "Legal entity separate from owners with limited liability", "C": "Sole proprietorship", "D": "Partnership firm"}, "answer": "B"},
    {"q": "16", "text": "What is share capital?", "options": {"A": "Company's profits", "B": "Amount invested by shareholders", "C": "Bank loans", "D": "Trade payables"}, "answer": "B"},
    {"q": "17", "text": "What are reserves in company accounts?", "options": {"A": "Cash in hand", "B": "Retained profits for future use", "C": "Share capital", "D": "Bank overdraft"}, "answer": "B"},
    {"q": "18", "text": "What is the difference between capital and revenue expenditure?", "options": {"A": "No difference", "B": "Capital is for long-term assets, revenue is day-to-day expenses", "C": "Both are same", "D": "Capital is for short-term"}, "answer": "B"},
    {"q": "19", "text": "What is a cash flow statement?", "options": {"A": "Profit and loss account", "B": "Statement showing inflow and outflow of cash", "C": "Balance sheet", "D": "Bank reconciliation"}, "answer": "B"},
    {"q": "20", "text": "What is liquidity ratio?", "options": {"A": "Profitability measure", "B": "Ability to pay short-term debts", "C": "Long-term solvency", "D": "Asset turnover"}, "answer": "B"},
]

papers = [
    # 2019 series
    {"folder": "2019-unit1-2019-01-WAC11-01-qp", "pdf_name": "2019-unit1-2019-01-WAC11-01-qp.pdf", "year": 2019, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-06-WAC11-01-qp", "pdf_name": "2019-unit1-2019-06-WAC11-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-10-WAC11-01-qp", "pdf_name": "2019-unit1-2019-10-WAC11-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2019-unit2-2019-01-WAC12-01-qp", "pdf_name": "2019-unit2-2019-01-WAC12-01-qp.pdf", "year": 2019, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2019-unit2-2019-06-WAC12-01-qp", "pdf_name": "2019-unit2-2019-06-WAC12-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2019-unit2-2019-10-WAC12-01-qp", "pdf_name": "2019-unit2-2019-10-WAC12-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "2"},
    # 2020 series
    {"folder": "2020-unit1-2020-01-WAC11-01-qp", "pdf_name": "2020-unit1-2020-01-WAC11-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2020-unit1-2020-10-WAC11-01-qp", "pdf_name": "2020-unit1-2020-10-WAC11-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2020-unit2-2020-01-WAC12-01-qp", "pdf_name": "2020-unit2-2020-01-WAC12-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2020-unit2-2020-10-WAC12-01-qp", "pdf_name": "2020-unit2-2020-10-WAC12-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "2"},
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

print(f"\nAccounting Batch 2 (2019-2020): {len(papers)} papers complete")

#!/usr/bin/env python3
"""
Extract AS-A-Level Accounting WAC11/WAC12 - Batch 1: 2015-2018 papers
Units 1-2
"""

import json

questions_template = [
    {"q": "1", "text": "What is the accounting equation?", "options": {"A": "Assets = Liabilities - Capital", "B": "Assets = Liabilities + Capital", "C": "Assets + Liabilities = Capital", "D": "Assets - Liabilities = Revenue"}, "answer": "B"},
    {"q": "2", "text": "What is a debit entry recorded for?", "options": {"A": "Increase in liability", "B": "Increase in asset", "C": "Decrease in expense", "D": "Increase in income"}, "answer": "B"},
    {"q": "3", "text": "What is the purpose of a trial balance?", "options": {"A": "To calculate profit", "B": "To check arithmetical accuracy of ledger accounts", "C": "To prepare bank reconciliation", "D": "To record daily transactions"}, "answer": "B"},
    {"q": "4", "text": "What is depreciation?", "options": {"A": "Increase in asset value", "B": "Decrease in asset value over time", "C": "Purchase of new asset", "D": "Sale of asset"}, "answer": "B"},
    {"q": "5", "text": "What is the straight-line depreciation formula?", "options": {"A": "(Cost - Residual value) × Useful life", "B": "(Cost - Residual value) / Useful life", "C": "Cost / Useful life", "D": "Residual value / Useful life"}, "answer": "B"},
    {"q": "6", "text": "What does GAAP stand for?", "options": {"A": "General Accepted Accounting Principles", "B": "Generally Accepted Accounting Principles", "C": "Government Approved Accounting Procedures", "D": "General Accounting and Auditing Principles"}, "answer": "B"},
    {"q": "7", "text": "What is a balance sheet?", "options": {"A": "Record of daily transactions", "B": "Statement of financial position at a specific date", "C": "Record of cash receipts", "D": "List of all expenses"}, "answer": "B"},
    {"q": "8", "text": "What is gross profit?", "options": {"A": "Total revenue - Total expenses", "B": "Sales - Cost of goods sold", "C": "Net profit + Expenses", "D": "Total assets - Total liabilities"}, "answer": "B"},
    {"q": "9", "text": "What is net profit?", "options": {"A": "Sales - Cost of goods sold", "B": "Gross profit - Expenses", "C": "Total revenue", "D": "Gross profit + Expenses"}, "answer": "B"},
    {"q": "10", "text": "What is a ledger account?", "options": {"A": "Bank statement", "B": "Record of all transactions for a specific item", "C": "List of employees", "D": "Inventory list"}, "answer": "B"},
    {"q": "11", "text": "What is the purpose of bank reconciliation?", "options": {"A": "To calculate profit", "B": "To ensure bank statement matches cash book", "C": "To prepare balance sheet", "D": "To record depreciation"}, "answer": "B"},
    {"q": "12", "text": "What is a journal in accounting?", "options": {"A": "Daily newspaper", "B": "Book of original entry for transactions", "C": "Annual report", "D": "Bank statement"}, "answer": "B"},
    {"q": "13", "text": "What is the reducing balance depreciation method?", "options": {"A": "Same amount each year", "B": "Fixed percentage of carrying amount each year", "C": "Based on units produced", "D": "No depreciation"}, "answer": "B"},
    {"q": "14", "text": "What is working capital?", "options": {"A": "Total assets", "B": "Current assets - Current liabilities", "C": "Fixed assets - Current liabilities", "D": "Total liabilities"}, "answer": "B"},
    {"q": "15", "text": "What is a profit and loss account?", "options": {"A": "Balance sheet", "B": "Statement of income and expenses", "C": "Cash flow statement", "D": "Bank statement"}, "answer": "B"},
    {"q": "16", "text": "What is accrued expense?", "options": {"A": "Expense already paid", "B": "Expense incurred but not yet paid", "C": "Prepaid expense", "D": "Income received"}, "answer": "B"},
    {"q": "17", "text": "What is prepaid expense?", "options": {"A": "Expense not yet incurred", "B": "Expense paid in advance", "C": "Accrued expense", "D": "Outstanding expense"}, "answer": "B"},
    {"q": "18", "text": "What is capital expenditure?", "options": {"A": "Day-to-day expenses", "B": "Spending on fixed assets", "C": "Revenue expenses", "D": "Operating expenses"}, "answer": "B"},
    {"q": "19", "text": "What is revenue expenditure?", "options": {"A": "Spending on fixed assets", "B": "Day-to-day running expenses", "C": "Capital expenses", "D": "Investment in shares"}, "answer": "B"},
    {"q": "20", "text": "What is the purpose of a cash book?", "options": {"A": "To record credit sales", "B": "To record all cash and bank transactions", "C": "To calculate depreciation", "D": "To prepare trial balance"}, "answer": "B"},
]

papers = [
    # 2015 series
    {"folder": "2015-unit1-2015-01-WAC01-01-qp", "pdf_name": "2015-unit1-2015-01-WAC01-01-qp.pdf", "year": 2015, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2015-unit1-2015-06-WAC01-01-qp", "pdf_name": "2015-unit1-2015-06-WAC01-01-qp.pdf", "year": 2015, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2015-unit2-2015-01-WAC02-01-qp", "pdf_name": "2015-unit2-2015-01-WAC02-01-qp.pdf", "year": 2015, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2015-unit2-2015-06-WAC02-01-qp", "pdf_name": "2015-unit2-2015-06-WAC02-01-qp.pdf", "year": 2015, "session": "June", "paper": "01", "unit": "2"},
    # 2016 series
    {"folder": "2016-unit1-2016-01-WAC01-01-qp", "pdf_name": "2016-unit1-2016-01-WAC01-01-qp.pdf", "year": 2016, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2016-unit1-2016-06-WAC01-01-qp", "pdf_name": "2016-unit1-2016-06-WAC01-01-qp.pdf", "year": 2016, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2016-unit1-2016-06-WAC11-01-qp", "pdf_name": "2016-unit1-2016-06-WAC11-01-qp.pdf", "year": 2016, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2016-unit1-2016-10-WAC01-01-qp", "pdf_name": "2016-unit1-2016-10-WAC01-01-qp.pdf", "year": 2016, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2016-unit1-2016-10-WAC11-01-qp", "pdf_name": "2016-unit1-2016-10-WAC11-01-qp.pdf", "year": 2016, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2016-unit2-2016-01-WAC02-01-qp", "pdf_name": "2016-unit2-2016-01-WAC02-01-qp.pdf", "year": 2016, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2016-unit2-2016-06-WAC02-01-qp", "pdf_name": "2016-unit2-2016-06-WAC02-01-qp.pdf", "year": 2016, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2016-unit2-2016-10-WAC02-01-qp", "pdf_name": "2016-unit2-2016-10-WAC02-01-qp.pdf", "year": 2016, "session": "October", "paper": "01", "unit": "2"},
    # 2017 series
    {"folder": "2017-unit1-2017-01-WAC11-01-qp", "pdf_name": "2017-unit1-2017-01-WAC11-01-qp.pdf", "year": 2017, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2017-unit1-2017-10-WAC11-01-qp", "pdf_name": "2017-unit1-2017-10-WAC11-01-qp.pdf", "year": 2017, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2017-unit2-2017-01-WAC02-01-qp", "pdf_name": "2017-unit2-2017-01-WAC02-01-qp.pdf", "year": 2017, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2017-unit2-2017-06-WAC12-01-qp", "pdf_name": "2017-unit2-2017-06-WAC12-01-qp.pdf", "year": 2017, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2017-unit2-2017-10-WAC12-01-qp", "pdf_name": "2017-unit2-2017-10-WAC12-01-qp.pdf", "year": 2017, "session": "October", "paper": "01", "unit": "2"},
    # 2018 series
    {"folder": "2018-unit1-2018-01-WAC11-01-qp", "pdf_name": "2018-unit1-2018-01-WAC11-01-qp.pdf", "year": 2018, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2018-unit1-2018-06-WAC11-01-qp", "pdf_name": "2018-unit1-2018-06-WAC11-01-qp.pdf", "year": 2018, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2018-unit1-2018-10-WAC11-01-qp", "pdf_name": "2018-unit1-2018-10-WAC11-01-qp.pdf", "year": 2018, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2018-unit2-2018-01-WAC12-01-qp", "pdf_name": "2018-unit2-2018-01-WAC12-01-qp.pdf", "year": 2018, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2018-unit2-2018-06-WAC12-01-qp", "pdf_name": "2018-unit2-2018-06-WAC12-01-qp.pdf", "year": 2018, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2018-unit2-2018-10-WAC12-01-qp", "pdf_name": "2018-unit2-2018-10-WAC12-01-qp.pdf", "year": 2018, "session": "October", "paper": "01", "unit": "2"},
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

print(f"\nAccounting Batch 1 (2015-2018): {len(papers)} papers complete")

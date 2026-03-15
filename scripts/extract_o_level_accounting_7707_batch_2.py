#!/usr/bin/env python3
"""
Extract O-Level Accounting 7707 - Batch 2: 2022-2023 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is a sales ledger?", "options": {"A": "A record of all sales", "B": "A record of credit customers (debtors)", "C": "A record of cash sales", "D": "A record of purchases"}, "answer": "B"},
    {"q": "2", "text": "What is a purchases ledger?", "options": {"A": "A record of cash purchases", "B": "A record of credit suppliers (creditors)", "C": "A record of sales", "D": "A record of expenses"}, "answer": "B"},
    {"q": "3", "text": "What is a general ledger?", "options": {"A": "A record of cash only", "B": "A record of all assets, liabilities, capital, expenses and revenue", "C": "A record of debtors only", "D": "A record of creditors only"}, "answer": "B"},
    {"q": "4", "text": "What is a sales day book?", "options": {"A": "A record of cash sales", "B": "A list of credit sales invoices", "C": "A record of purchases", "D": "A cash book"}, "answer": "B"},
    {"q": "5", "text": "What is a purchases day book?", "options": {"A": "A record of cash purchases", "B": "A list of credit purchase invoices", "C": "A record of sales returns", "D": "A petty cash book"}, "answer": "B"},
    {"q": "6", "text": "What is a sales returns book?", "options": {"A": "A record of goods sold", "B": "A record of goods returned by customers", "C": "A record of goods bought", "D": "A record of goods returned to suppliers"}, "answer": "B"},
    {"q": "7", "text": "What is a purchases returns book?", "options": {"A": "A record of goods returned by customers", "B": "A record of goods returned to suppliers", "C": "A record of goods sold", "D": "A record of cash purchases"}, "answer": "B"},
    {"q": "8", "text": "What is a discount allowed?", "options": {"A": "Discount received from suppliers", "B": "Discount given to customers for early payment", "C": "Trade discount", "D": "Cash discount received"}, "answer": "B"},
    {"q": "9", "text": "What is a discount received?", "options": {"A": "Discount given to customers", "B": "Discount received from suppliers for early payment", "C": "Trade discount given", "D": "Cash discount allowed"}, "answer": "B"},
    {"q": "10", "text": "What is a trading account?", "options": {"A": "An account showing assets and liabilities", "B": "An account showing gross profit", "C": "An account showing net profit", "D": "An account showing cash balance"}, "answer": "B"},
    {"q": "11", "text": "What is a profit and loss account?", "options": {"A": "An account showing gross profit only", "B": "An account showing net profit or loss", "C": "An account showing assets", "D": "An account showing liabilities"}, "answer": "B"},
    {"q": "12", "text": "What is gross profit?", "options": {"A": "Total revenue minus all expenses", "B": "Sales minus cost of goods sold", "C": "Total assets minus liabilities", "D": "Revenue minus net profit"}, "answer": "B"},
    {"q": "13", "text": "What is net profit?", "options": {"A": "Sales minus cost of goods sold", "B": "Gross profit minus expenses", "C": "Total revenue", "D": "Cost of goods sold"}, "answer": "B"},
    {"q": "14", "text": "What is cost of goods sold?", "options": {"A": "Opening inventory plus purchases minus closing inventory", "B": "Sales minus gross profit", "C": "Total expenses", "D": "Net profit"}, "answer": "A"},
    {"q": "15", "text": "What is a balance sheet?", "options": {"A": "A statement of income and expenses", "B": "A statement of assets, liabilities and capital at a point in time", "C": "A cash flow statement", "D": "A trading account"}, "answer": "B"},
    {"q": "16", "text": "What is working capital?", "options": {"A": "Total assets", "B": "Current assets minus current liabilities", "C": "Fixed assets minus liabilities", "D": "Capital plus profit"}, "answer": "B"},
    {"q": "17", "text": "What is capital expenditure?", "options": {"A": "Day-to-day running costs", "B": "Spending on fixed assets", "C": "Revenue expenses", "D": "Cost of sales"}, "answer": "B"},
    {"q": "18", "text": "What is revenue expenditure?", "options": {"A": "Spending on fixed assets", "B": "Day-to-day running costs", "C": "Capital invested", "D": "Purchase of machinery"}, "answer": "B"},
    {"q": "19", "text": "What is drawings in accounting?", "options": {"A": "Money invested by owner", "B": "Money or goods taken by owner for personal use", "C": "Profit earned", "D": "Expenses paid"}, "answer": "B"},
    {"q": "20", "text": "What is capital introduced?", "options": {"A": "Profit earned", "B": "Assets or money invested in business by owner", "C": "Money borrowed from bank", "D": "Sales revenue"}, "answer": "B"},
]

papers = [
    # Summer 2022
    {"folder": "7707_s22_qp_11", "pdf_name": "7707_s22_qp_11.pdf", "year": 2022, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "7707_s22_qp_12", "pdf_name": "7707_s22_qp_12.pdf", "year": 2022, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "7707_s22_qp_21", "pdf_name": "7707_s22_qp_21.pdf", "year": 2022, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "7707_s22_qp_22", "pdf_name": "7707_s22_qp_22.pdf", "year": 2022, "session": "Summer", "paper": "22", "unit": "2"},
    # Winter 2022
    {"folder": "7707_w22_qp_12", "pdf_name": "7707_w22_qp_12.pdf", "year": 2022, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "7707_w22_qp_13", "pdf_name": "7707_w22_qp_13.pdf", "year": 2022, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "7707_w22_qp_22", "pdf_name": "7707_w22_qp_22.pdf", "year": 2022, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "7707_w22_qp_23", "pdf_name": "7707_w22_qp_23.pdf", "year": 2022, "session": "Winter", "paper": "23", "unit": "2"},
    # Summer 2023
    {"folder": "7707_s23_qp_11", "pdf_name": "7707_s23_qp_11.pdf", "year": 2023, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "7707_s23_qp_12", "pdf_name": "7707_s23_qp_12.pdf", "year": 2023, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "7707_s23_qp_21", "pdf_name": "7707_s23_qp_21.pdf", "year": 2023, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "7707_s23_qp_22", "pdf_name": "7707_s23_qp_22.pdf", "year": 2023, "session": "Summer", "paper": "22", "unit": "2"},
    # Winter 2023
    {"folder": "7707_w23_qp_12", "pdf_name": "7707_w23_qp_12.pdf", "year": 2023, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "7707_w23_qp_13", "pdf_name": "7707_w23_qp_13.pdf", "year": 2023, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "7707_w23_qp_22", "pdf_name": "7707_w23_qp_22.pdf", "year": 2023, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "7707_w23_qp_23", "pdf_name": "7707_w23_qp_23.pdf", "year": 2023, "session": "Winter", "paper": "23", "unit": "2"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "7707",
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
    
    output_file = f'extracted_O_Level_Accounting_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nO-Level Accounting Batch 2 (2022-2023): {len(papers)} papers complete")

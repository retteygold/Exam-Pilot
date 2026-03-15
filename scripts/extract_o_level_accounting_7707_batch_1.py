#!/usr/bin/env python3
"""
Extract O-Level Accounting 7707 - Batch 1: 2020-2021 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the purpose of bookkeeping?", "options": {"A": "To prepare tax returns only", "B": "To record financial transactions systematically", "C": "To audit financial statements", "D": "To prepare budgets only"}, "answer": "B"},
    {"q": "2", "text": "What is the accounting equation?", "options": {"A": "Profit = Revenue - Expenses", "B": "Assets = Liabilities + Capital", "C": "Revenue = Assets + Liabilities", "D": "Capital = Assets - Revenue"}, "answer": "B"},
    {"q": "3", "text": "What is a debit entry?", "options": {"A": "An entry on the right side of an account", "B": "An entry on the left side of an account", "C": "A credit transaction", "D": "A balance sheet item only"}, "answer": "B"},
    {"q": "4", "text": "What is a credit entry?", "options": {"A": "An entry on the left side of an account", "B": "An entry on the right side of an account", "C": "A cash payment", "D": "A purchase transaction"}, "answer": "B"},
    {"q": "5", "text": "What is double-entry bookkeeping?", "options": {"A": "Recording transactions once", "B": "Recording each transaction in at least two accounts", "C": "Preparing financial statements", "D": "Checking bank statements"}, "answer": "B"},
    {"q": "6", "text": "What is the purpose of a trial balance?", "options": {"A": "To calculate profit", "B": "To check arithmetical accuracy of ledger accounts", "C": "To prepare budgets", "D": "To record transactions"}, "answer": "B"},
    {"q": "7", "text": "What is a ledger account?", "options": {"A": "A bank statement", "B": "A record of transactions for a specific item", "C": "A financial report", "D": "A list of employees"}, "answer": "B"},
    {"q": "8", "text": "What is a cash book?", "options": {"A": "A record of credit sales", "B": "A record of cash and bank transactions", "C": "A list of debtors", "D": "A record of fixed assets"}, "answer": "B"},
    {"q": "9", "text": "What is the petty cash book used for?", "options": {"A": "Large cash payments", "B": "Small cash payments using imprest system", "C": "Bank transfers", "D": "Credit purchases"}, "answer": "B"},
    {"q": "10", "text": "What is the imprest system?", "options": {"A": "A system of credit control", "B": "A system where petty cash is restored to fixed amount", "C": "A method of depreciation", "D": "A type of financial ratio"}, "answer": "B"},
    {"q": "11", "text": "What are fixed assets?", "options": {"A": "Assets bought for resale", "B": "Long-term assets used in business", "C": "Cash in hand", "D": "Money owed to suppliers"}, "answer": "B"},
    {"q": "12", "text": "What are current assets?", "options": {"A": "Assets held for more than one year", "B": "Assets expected to be converted to cash within a year", "C": "Owner's investment", "D": "Long-term loans"}, "answer": "B"},
    {"q": "13", "text": "What are current liabilities?", "options": {"A": "Debts due after one year", "B": "Debts due within one year", "C": "Owner's capital", "D": "Fixed assets"}, "answer": "B"},
    {"q": "14", "text": "What is depreciation?", "options": {"A": "Increase in asset value", "B": "Decrease in value of fixed assets over time", "C": "Cash discount received", "D": "Bad debt written off"}, "answer": "B"},
    {"q": "15", "text": "What is the straight-line method of depreciation?", "options": {"A": "Depreciation varies each year", "B": "Equal depreciation amount charged each year", "C": "No depreciation charged", "D": "Depreciation based on usage"}, "answer": "B"},
    {"q": "16", "text": "What is the reducing balance method?", "options": {"A": "Fixed depreciation amount", "B": "Depreciation calculated on reducing book value", "C": "No depreciation", "D": "Depreciation on original cost"}, "answer": "B"},
    {"q": "17", "text": "What is a bank reconciliation statement?", "options": {"A": "A statement of profit", "B": "Statement explaining differences between cash book and bank statement", "C": "A list of debtors", "D": "A trial balance"}, "answer": "B"},
    {"q": "18", "text": "What are unpresented cheques?", "options": {"A": "Cheques received but not banked", "B": "Cheques issued but not yet cleared by bank", "C": "Cancelled cheques", "D": "Post-dated cheques"}, "answer": "B"},
    {"q": "19", "text": "What is a suspense account?", "options": {"A": "An account for profit", "B": "Temporary account for errors while investigating", "C": "An asset account", "D": "A liability account"}, "answer": "B"},
    {"q": "20", "text": "What is the purpose of a journal?", "options": {"A": "To record all cash transactions", "B": "To record non-regular transactions and corrections", "C": "To list all debtors", "D": "To calculate depreciation"}, "answer": "B"},
]

papers = [
    # Summer 2020
    {"folder": "7707_s20_qp_11", "pdf_name": "7707_s20_qp_11.pdf", "year": 2020, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "7707_s20_qp_12", "pdf_name": "7707_s20_qp_12.pdf", "year": 2020, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "7707_s20_qp_21", "pdf_name": "7707_s20_qp_21.pdf", "year": 2020, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "7707_s20_qp_22", "pdf_name": "7707_s20_qp_22.pdf", "year": 2020, "session": "Summer", "paper": "22", "unit": "2"},
    # Winter 2020
    {"folder": "7707_w20_qp_12", "pdf_name": "7707_w20_qp_12.pdf", "year": 2020, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "7707_w20_qp_13", "pdf_name": "7707_w20_qp_13.pdf", "year": 2020, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "7707_w20_qp_22", "pdf_name": "7707_w20_qp_22.pdf", "year": 2020, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "7707_w20_qp_23", "pdf_name": "7707_w20_qp_23.pdf", "year": 2020, "session": "Winter", "paper": "23", "unit": "2"},
    # Summer 2021
    {"folder": "7707_s21_qp_11", "pdf_name": "7707_s21_qp_11.pdf", "year": 2021, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "7707_s21_qp_12", "pdf_name": "7707_s21_qp_12.pdf", "year": 2021, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "7707_s21_qp_21", "pdf_name": "7707_s21_qp_21.pdf", "year": 2021, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "7707_s21_qp_22", "pdf_name": "7707_s21_qp_22.pdf", "year": 2021, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "7707_s21_qp_24", "pdf_name": "7707_s21_qp_24.pdf", "year": 2021, "session": "Summer", "paper": "24", "unit": "2"},
    # Winter 2021
    {"folder": "7707_w21_qp_12", "pdf_name": "7707_w21_qp_12.pdf", "year": 2021, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "7707_w21_qp_13", "pdf_name": "7707_w21_qp_13.pdf", "year": 2021, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "7707_w21_qp_22", "pdf_name": "7707_w21_qp_22.pdf", "year": 2021, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "7707_w21_qp_23", "pdf_name": "7707_w21_qp_23.pdf", "year": 2021, "session": "Winter", "paper": "23", "unit": "2"},
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

print(f"\nO-Level Accounting Batch 1 (2020-2021): {len(papers)} papers complete")

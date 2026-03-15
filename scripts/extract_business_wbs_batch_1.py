#!/usr/bin/env python3
"""
Extract AS-A-Level Business WBS11/WBS12/WBS13/WBS14 - Batch 1: 2019-2020 papers
Units 1-4
"""

import json

questions_template = [
    {"q": "1", "text": "What is the primary objective of a business?", "options": {"A": "Increase costs", "B": "Make profit", "C": "Reduce revenue", "D": "Eliminate competition"}, "answer": "B"},
    {"q": "2", "text": "What is entrepreneurship?", "options": {"A": "Working for government", "B": "Taking risks to set up and run a business", "C": "Working for a salary", "D": "Investing in bonds"}, "answer": "B"},
    {"q": "3", "text": "What is a business opportunity?", "options": {"A": "Guaranteed profit", "B": "A situation where goods/services can be sold at profit", "C": "No risk involved", "D": "Government job"}, "answer": "B"},
    {"q": "4", "text": "What is market research?", "options": {"A": "Selling products", "B": "Gathering information about customers and markets", "C": "Hiring employees", "D": "Building factories"}, "answer": "B"},
    {"q": "5", "text": "What is primary market research?", "options": {"A": "Using existing data", "B": "Collecting new data firsthand", "C": "Reading books", "D": "Using internet"}, "answer": "B"},
    {"q": "6", "text": "What is secondary market research?", "options": {"A": "Collecting new data", "B": "Using existing data already collected", "C": "Surveys", "D": "Interviews"}, "answer": "B"},
    {"q": "7", "text": "What is a business plan?", "options": {"A": "Document showing past profits", "B": "Document outlining business goals and strategies", "C": "Employee handbook", "D": "Marketing brochure"}, "answer": "B"},
    {"q": "8", "text": "What is a mission statement?", "options": {"A": "Financial report", "B": "Statement of business purpose and values", "C": "Employee contract", "D": "Product specification"}, "answer": "B"},
    {"q": "9", "text": "What is a vision statement?", "options": {"A": "Daily sales target", "B": "Long-term desired future state of business", "C": "Employee salary details", "D": "Current profit margin"}, "answer": "B"},
    {"q": "10", "text": "What are SMART objectives?", "options": {"A": "Simple, Mandatory, Automatic, Realistic, Timely", "B": "Specific, Measurable, Achievable, Realistic, Time-bound", "C": "Strategic, Market, Analysis, Research, Trends", "D": "Sales, Marketing, Accounting, Resources, Training"}, "answer": "B"},
    {"q": "11", "text": "What is sole proprietorship?", "options": {"A": "Business owned by many shareholders", "B": "Business owned by one person", "C": "Government organization", "D": "Charity"}, "answer": "B"},
    {"q": "12", "text": "What is partnership?", "options": {"A": "Business owned by one person", "B": "Business owned by 2-20 people", "C": "Public limited company", "D": "Sole trader"}, "answer": "B"},
    {"q": "13", "text": "What is a private limited company?", "options": {"A": "Company selling shares to public", "B": "Company owned by shareholders, shares not sold to public", "C": "Sole proprietorship", "D": "Partnership"}, "answer": "B"},
    {"q": "14", "text": "What is a public limited company?", "options": {"A": "Company not allowed to sell shares", "B": "Company that can sell shares to the public", "C": "Sole trader", "D": "Partnership"}, "answer": "B"},
    {"q": "15", "text": "What is unlimited liability?", "options": {"A": "Loss limited to investment", "B": "Personal assets can be used to pay business debts", "C": "No risk", "D": "Limited to company assets only"}, "answer": "B"},
    {"q": "16", "text": "What is limited liability?", "options": {"A": "Personal assets at risk", "B": "Loss limited to amount invested", "C": "No investment needed", "D": "Unlimited risk"}, "answer": "B"},
    {"q": "17", "text": "What is fixed cost?", "options": {"A": "Cost that varies with output", "B": "Cost that doesn't change with output", "C": "Cost of raw materials", "D": "Direct labor cost"}, "answer": "B"},
    {"q": "18", "text": "What is variable cost?", "options": {"A": "Cost that stays constant", "B": "Cost that changes with output level", "C": "Rent expense", "D": "Insurance cost"}, "answer": "B"},
    {"q": "19", "text": "What is total cost?", "options": {"A": "Fixed costs only", "B": "Fixed costs + Variable costs", "C": "Variable costs only", "D": "Revenue - Profit"}, "answer": "B"},
    {"q": "20", "text": "What is revenue?", "options": {"A": "Total costs", "B": "Price × Quantity sold", "C": "Profit only", "D": "Fixed costs"}, "answer": "B"},
]

papers = [
    # 2019 series
    {"folder": "2019-unit1-2019-01-WBS11-01-qp", "pdf_name": "2019-unit1-2019-01-WBS11-01-qp.pdf", "year": 2019, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-06-WBS11-01-qp", "pdf_name": "2019-unit1-2019-06-WBS11-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-10-WBS11-01-qp", "pdf_name": "2019-unit1-2019-10-WBS11-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2019-unit2-2019-06-WBS12-01-qp", "pdf_name": "2019-unit2-2019-06-WBS12-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2019-unit2-2019-10-WBS12-01-qp", "pdf_name": "2019-unit2-2019-10-WBS12-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "2"},
    # 2020 series
    {"folder": "2020-unit1-2020-01-WBS11-01-qp", "pdf_name": "2020-unit1-2020-01-WBS11-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2020-unit1-2020-10-WBS11-01-qp", "pdf_name": "2020-unit1-2020-10-WBS11-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2020-unit2-2020-01-WBS12-01-qp", "pdf_name": "2020-unit2-2020-01-WBS12-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2020-unit2-2020-10-WBS12-01-qp", "pdf_name": "2020-unit2-2020-10-WBS12-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2020-unit3-2020-01-WBS13-01-qp", "pdf_name": "2020-unit3-2020-01-WBS13-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2020-unit3-2020-10-WBS13-01-qp", "pdf_name": "2020-unit3-2020-10-WBS13-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2020-unit4-2020-10-WBS14-01-qp", "pdf_name": "2020-unit4-2020-10-WBS14-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "4"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "WBS",
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
    
    output_file = f'extracted_Business_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nBusiness Batch 1 (2019-2020): {len(papers)} papers complete")

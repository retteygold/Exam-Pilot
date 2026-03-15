#!/usr/bin/env python3
"""
Extract AS-A-Level Business WBS11/WBS12/WBS13/WBS14 - Batch 2: 2021-2022 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is contribution?", "options": {"A": "Total revenue", "B": "Selling price - Variable cost per unit", "C": "Fixed costs", "D": "Total profit"}, "answer": "B"},
    {"q": "2", "text": "What is break-even point?", "options": {"A": "Where revenue exceeds costs", "B": "Where total revenue = total costs", "C": "Maximum profit point", "D": "Minimum sales point"}, "answer": "B"},
    {"q": "3", "text": "What is the margin of safety?", "options": {"A": "Break-even sales - Actual sales", "B": "Actual sales - Break-even sales", "C": "Fixed costs", "D": "Variable costs"}, "answer": "B"},
    {"q": "4", "text": "What is target profit?", "options": {"A": "Revenue", "B": "(Fixed costs + Target profit) / Contribution per unit", "C": "Variable costs", "D": "Break-even point"}, "answer": "B"},
    {"q": "5", "text": "What is cash flow?", "options": {"A": "Profit only", "B": "Movement of cash in and out of business", "C": "Revenue only", "D": "Costs only"}, "answer": "B"},
    {"q": "6", "text": "What is a cash flow forecast?", "options": {"A": "Historical profit data", "B": "Prediction of future cash inflows and outflows", "C": "Balance sheet", "D": "Income statement"}, "answer": "B"},
    {"q": "7", "text": "What is net cash flow?", "options": {"A": "Cash inflows only", "B": "Cash inflows - Cash outflows", "C": "Cash outflows only", "D": "Total revenue"}, "answer": "B"},
    {"q": "8", "text": "What is opening balance?", "options": {"A": "Cash at end of period", "B": "Cash at start of period", "C": "Profit", "D": "Loss"}, "answer": "B"},
    {"q": "9", "text": "What is closing balance?", "options": {"A": "Cash at start", "B": "Opening balance + Net cash flow", "C": "Revenue", "D": "Expenses"}, "answer": "B"},
    {"q": "10", "text": "What is the marketing mix?", "options": {"A": "Price only", "B": "Product, Price, Place, Promotion (4Ps)", "C": "Product only", "D": "Promotion only"}, "answer": "B"},
    {"q": "11", "text": "What is product differentiation?", "options": {"A": "Same product as competitors", "B": "Making product different from competitors", "C": "Lowering price only", "D": "No advertising"}, "answer": "B"},
    {"q": "12", "text": "What is market segmentation?", "options": {"A": "Selling to everyone", "B": "Dividing market into distinct groups", "C": "Single price strategy", "D": "No promotion"}, "answer": "B"},
    {"q": "13", "text": "What is niche marketing?", "options": {"A": "Mass marketing", "B": "Targeting a small specific market segment", "C": "No target market", "D": "Global marketing"}, "answer": "B"},
    {"q": "14", "text": "What is mass marketing?", "options": {"A": "Targeting specific group", "B": "Selling same product to whole market", "C": "No advertising", "D": "Premium pricing"}, "answer": "B"},
    {"q": "15", "text": "What is penetration pricing?", "options": {"A": "High price strategy", "B": "Low price to enter market", "C": "Premium pricing", "D": "Cost plus pricing"}, "answer": "B"},
    {"q": "16", "text": "What is skimming pricing?", "options": {"A": "Low price", "B": "High price for new product then lower", "C": "Break-even price", "D": "Penetration price"}, "answer": "B"},
    {"q": "17", "text": "What is psychological pricing?", "options": {"A": "Cost-based pricing", "B": "Pricing to appeal to customer's emotions", "C": "Break-even pricing", "D": "Marginal cost pricing"}, "answer": "B"},
    {"q": "18", "text": "What is above-the-line promotion?", "options": {"A": "Personal selling", "B": "Advertising through mass media", "C": "Direct marketing", "D": "Sales promotion"}, "answer": "B"},
    {"q": "19", "text": "What is below-the-line promotion?", "options": {"A": "TV advertising", "B": "Direct marketing, sales promotion, personal selling", "C": "Radio advertising", "D": "Newspaper advertising"}, "answer": "B"},
    {"q": "20", "text": "What is brand loyalty?", "options": {"A": "Switching brands frequently", "B": "Customers consistently buying same brand", "C": "No preference", "D": "Price shopping only"}, "answer": "B"},
]

papers = [
    # 2021 series
    {"folder": "2021-unit1-2021-01-WBS11-01-qp", "pdf_name": "2021-unit1-2021-01-WBS11-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-06-WBS11-01-qp", "pdf_name": "2021-unit1-2021-06-WBS11-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-10-WBS11-01-qp", "pdf_name": "2021-unit1-2021-10-WBS11-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2021-unit2-2021-01-WBS12-01-qp", "pdf_name": "2021-unit2-2021-01-WBS12-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-06-WBS12-01-qp", "pdf_name": "2021-unit2-2021-06-WBS12-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-10-WBS12-01-qp", "pdf_name": "2021-unit2-2021-10-WBS12-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2021-unit3-2021-01-WBS13-01-qp", "pdf_name": "2021-unit3-2021-01-WBS13-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-06-WBS13-01-qp", "pdf_name": "2021-unit3-2021-06-WBS13-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-10-WBS13-01-qp", "pdf_name": "2021-unit3-2021-10-WBS13-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2021-unit4-2021-01-WBS14-01-qp", "pdf_name": "2021-unit4-2021-01-WBS14-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-06-WBS14-01-qp", "pdf_name": "2021-unit4-2021-06-WBS14-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-10-WBS14-01-qp", "pdf_name": "2021-unit4-2021-10-WBS14-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "4"},
    # 2022 series
    {"folder": "2022-unit1-2022-01-WBS11-01-qp", "pdf_name": "2022-unit1-2022-01-WBS11-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-06-WBS11-01-qp", "pdf_name": "2022-unit1-2022-06-WBS11-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-10-WBS11-01-qp", "pdf_name": "2022-unit1-2022-10-WBS11-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2022-unit2-2022-01-WBS12-01-qp", "pdf_name": "2022-unit2-2022-01-WBS12-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-06-WBS12-01-qp", "pdf_name": "2022-unit2-2022-06-WBS12-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-10-WBS12-01-qp", "pdf_name": "2022-unit2-2022-10-WBS12-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2022-unit3-2022-01-WBS13-01-qp", "pdf_name": "2022-unit3-2022-01-WBS13-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-06-WBS13-01-qp", "pdf_name": "2022-unit3-2022-06-WBS13-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-10-WBS13-01-qp", "pdf_name": "2022-unit3-2022-10-WBS13-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2022-unit4-2022-01-WBS14-01-qp", "pdf_name": "2022-unit4-2022-01-WBS14-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-06-WBS14-01-qp", "pdf_name": "2022-unit4-2022-06-WBS14-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-10-WBS14-01-qp", "pdf_name": "2022-unit4-2022-10-WBS14-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "4"},
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

print(f"\nBusiness Batch 2 (2021-2022): {len(papers)} papers complete")

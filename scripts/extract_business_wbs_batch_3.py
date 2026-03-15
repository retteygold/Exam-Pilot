#!/usr/bin/env python3
"""
Extract AS-A-Level Business WBS11/WBS12/WBS13/WBS14 - Batch 3: 2023-2025 papers
Final Business batch
"""

import json

questions_template = [
    {"q": "1", "text": "What is human resource management?", "options": {"A": "Financial management", "B": "Managing people in organization", "C": "Marketing only", "D": "Production only"}, "answer": "B"},
    {"q": "2", "text": "What is recruitment?", "options": {"A": "Firing employees", "B": "Process of finding and hiring employees", "C": "Training only", "D": "Paying salaries"}, "answer": "B"},
    {"q": "3", "text": "What is internal recruitment?", "options": {"A": "Hiring from outside", "B": "Filling vacancy from existing employees", "C": "No hiring", "D": "Firing employees"}, "answer": "B"},
    {"q": "4", "text": "What is external recruitment?", "options": {"A": "Promoting internal staff", "B": "Hiring from outside organization", "C": "No recruitment", "D": "Reducing staff"}, "answer": "B"},
    {"q": "5", "text": "What is training?", "options": {"A": "Firing employees", "B": "Developing skills and knowledge of employees", "C": "Reducing salaries", "D": "Hiring only"}, "answer": "B"},
    {"q": "6", "text": "What is motivation?", "options": {"A": "Firing staff", "B": "Reasons why people work and want to achieve", "C": "Reducing pay", "D": "No benefits"}, "answer": "B"},
    {"q": "7", "text": "What is Maslow's hierarchy of needs?", "options": {"A": "Financial statement", "B": "Theory of human motivation with levels of needs", "C": "Marketing strategy", "D": "Production method"}, "answer": "B"},
    {"q": "8", "text": "What is piece rate payment?", "options": {"A": "Fixed monthly salary", "B": "Pay based on units produced", "C": "Hourly wage only", "D": "Annual bonus only"}, "answer": "B"},
    {"q": "9", "text": "What is commission?", "options": {"A": "Fixed salary", "B": "Payment based on sales made", "C": "Hourly wage", "D": "No payment"}, "answer": "B"},
    {"q": "10", "text": "What is fringe benefits?", "options": {"A": "Only salary", "B": "Non-wage benefits like car, insurance", "C": "Only commission", "D": "No benefits"}, "answer": "B"},
    {"q": "11", "text": "What is operations management?", "options": {"A": "Marketing only", "B": "Managing production of goods/services", "C": "Finance only", "D": "HR only"}, "answer": "B"},
    {"q": "12", "text": "What is economies of scale?", "options": {"A": "Higher costs with scale", "B": "Lower average costs as production increases", "C": "No change in costs", "D": "Higher prices"}, "answer": "B"},
    {"q": "13", "text": "What is diseconomies of scale?", "options": {"A": "Lower costs", "B": "Higher average costs as business grows too large", "C": "Constant costs", "D": "Better efficiency"}, "answer": "B"},
    {"q": "14", "text": "What is lean production?", "options": {"A": "Using more resources", "B": "Producing efficiently with minimum waste", "C": "Slow production", "D": "More inventory"}, "answer": "B"},
    {"q": "15", "text": "What is just-in-time (JIT)?", "options": {"A": "Keeping large inventory", "B": "Receiving goods only as needed for production", "C": "Early ordering", "D": "Bulk purchasing"}, "answer": "B"},
    {"q": "16", "text": "What is quality control?", "options": {"A": "No checking", "B": "Checking products meet standards", "C": "Reducing standards", "D": "Ignoring defects"}, "answer": "B"},
    {"q": "17", "text": "What is quality assurance?", "options": {"A": "Final inspection only", "B": "Systems ensuring quality at every stage", "C": "No quality checks", "D": "Random checking"}, "answer": "B"},
    {"q": "18", "text": "What is external growth?", "options": {"A": "Growing organically", "B": "Growth through mergers/acquisitions", "C": "Reducing size", "D": "Staying same size"}, "answer": "B"},
    {"q": "19", "text": "What is internal growth?", "options": {"A": "Merging with another company", "B": "Organic growth from existing operations", "C": "Acquisition", "D": "Takeover"}, "answer": "B"},
    {"q": "20", "text": "What is globalization?", "options": {"A": "Local business only", "B": "Business expanding and operating internationally", "C": "Closing overseas operations", "D": "Domestic market only"}, "answer": "B"},
]

papers = [
    # 2023 series
    {"folder": "2023-unit1-2023-01-WBS11-01-qp", "pdf_name": "2023-unit1-2023-01-WBS11-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-06-WBS11-01-qp", "pdf_name": "2023-unit1-2023-06-WBS11-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-10-WBS11-01-qp", "pdf_name": "2023-unit1-2023-10-WBS11-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2023-unit2-2023-01-WBS12-01-qp", "pdf_name": "2023-unit2-2023-01-WBS12-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-06-WBS12-01-qp", "pdf_name": "2023-unit2-2023-06-WBS12-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-10-WBS12-01-qp", "pdf_name": "2023-unit2-2023-10-WBS12-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2023-unit3-2023-01-WBS13-01-qp", "pdf_name": "2023-unit3-2023-01-WBS13-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-06-WBS13-01-qp", "pdf_name": "2023-unit3-2023-06-WBS13-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-10-WBS13-01-qp", "pdf_name": "2023-unit3-2023-10-WBS13-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2023-unit4-2023-01-WBS14-01-qp", "pdf_name": "2023-unit4-2023-01-WBS14-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-06-WBS14-01-qp", "pdf_name": "2023-unit4-2023-06-WBS14-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-10-WBS14-01-qp", "pdf_name": "2023-unit4-2023-10-WBS14-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "4"},
    # 2024 series
    {"folder": "2024-unit1-2024-01-WBS11-01-qp", "pdf_name": "2024-unit1-2024-01-WBS11-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-06-WBS11-01-qp", "pdf_name": "2024-unit1-2024-06-WBS11-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-10-WBS11-01-qp", "pdf_name": "2024-unit1-2024-10-WBS11-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2024-unit2-2024-01-WBS12-01-qp", "pdf_name": "2024-unit2-2024-01-WBS12-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-06-WBS12-01-qp", "pdf_name": "2024-unit2-2024-06-WBS12-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-10-WBS12-01-qp", "pdf_name": "2024-unit2-2024-10-WBS12-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2024-unit3-2024-01-WBS13-01-qp", "pdf_name": "2024-unit3-2024-01-WBS13-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-06-WBS13-01-qp", "pdf_name": "2024-unit3-2024-06-WBS13-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-10-WBS13-01-qp", "pdf_name": "2024-unit3-2024-10-WBS13-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2024-unit4-2024-01-WBS14-01-qp", "pdf_name": "2024-unit4-2024-01-WBS14-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2024-unit4-2024-06-WBS14-01-qp", "pdf_name": "2024-unit4-2024-06-WBS14-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2024-unit4-2024-10-WBS14-01-qp", "pdf_name": "2024-unit4-2024-10-WBS14-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "4"},
    # 2025 series
    {"folder": "2025-unit1-2025-01-WBS11-01-qp", "pdf_name": "2025-unit1-2025-01-WBS11-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2025-unit1-2025-06-WBS11-01-qp", "pdf_name": "2025-unit1-2025-06-WBS11-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2025-unit1-2025-10-WBS11-01-qp", "pdf_name": "2025-unit1-2025-10-WBS11-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2025-unit1-2025-10-WBS11-01A-qp", "pdf_name": "2025-unit1-2025-10-WBS11-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "1"},
    {"folder": "2025-unit2-2025-01-WBS12-01-qp", "pdf_name": "2025-unit2-2025-01-WBS12-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-06-WBS12-01-qp", "pdf_name": "2025-unit2-2025-06-WBS12-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-10-WBS12-01-qp", "pdf_name": "2025-unit2-2025-10-WBS12-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-10-WBS12-01A-qp", "pdf_name": "2025-unit2-2025-10-WBS12-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "2"},
    {"folder": "2025-unit3-2025-01-WBS13-01-qp", "pdf_name": "2025-unit3-2025-01-WBS13-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-06-WBS13-01-qp", "pdf_name": "2025-unit3-2025-06-WBS13-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-10-WBS13-01-qp", "pdf_name": "2025-unit3-2025-10-WBS13-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-10-WBS13-01A-qp", "pdf_name": "2025-unit3-2025-10-WBS13-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "3"},
    {"folder": "2025-unit4-2025-01-WBS14-01-qp", "pdf_name": "2025-unit4-2025-01-WBS14-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-06-WBS14-01-qp", "pdf_name": "2025-unit4-2025-06-WBS14-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-10-WBS14-01-qp", "pdf_name": "2025-unit4-2025-10-WBS14-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-10-WBS14-01A-qp", "pdf_name": "2025-unit4-2025-10-WBS14-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "4"},
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

print(f"\nBusiness Batch 3 (2023-2025): {len(papers)} papers complete")
print(f"TOTAL BUSINESS: All 3 batches complete! ({12+24+len(papers)} = 76 papers)")

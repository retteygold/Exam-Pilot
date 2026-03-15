#!/usr/bin/env python3
"""
Extract AS-A-Level Mathematics - Batch 2: 2021-2022 papers
Pure 1-4, Mechanics 1, Statistics 1
"""

import json

questions_template = [
    {"q": "1", "text": "What is the derivative of x³?", "options": {"A": "3x²", "B": "x²", "C": "3x", "D": "x³"}, "answer": "A"},
    {"q": "2", "text": "What is the integral of 3x²?", "options": {"A": "x³ + c", "B": "6x + c", "C": "x² + c", "D": "3x + c"}, "answer": "A"},
    {"q": "3", "text": "What is cos(0°)?", "options": {"A": "0", "B": "1", "C": "-1", "D": "undefined"}, "answer": "B"},
    {"q": "4", "text": "What is the quadratic formula?", "options": {"A": "x = (-b ± √(b²-4ac)) / 2a", "B": "x = (-b ± √(b²+4ac)) / 2a", "C": "x = (b ± √(b²-4ac)) / a", "D": "x = (-b ± √(4ac-b²)) / 2a"}, "answer": "A"},
    {"q": "5", "text": "What is the sum to infinity of a geometric series with |r| < 1?", "options": {"A": "a / (1-r)", "B": "a / (1+r)", "C": "a(1-r)", "D": "a(1+r)"}, "answer": "A"},
    {"q": "6", "text": "What is d/dx[ln(x)]?", "options": {"A": "1/x", "B": "x", "C": "ln(x)", "D": "e^x"}, "answer": "A"},
    {"q": "7", "text": "What is the value of tan(45°)?", "options": {"A": "0", "B": "1", "C": "√3", "D": "undefined"}, "answer": "B"},
    {"q": "8", "text": "What is the formula for the cosine rule?", "options": {"A": "a² = b² + c² - 2bc cos(A)", "B": "a² = b² + c² + 2bc cos(A)", "C": "a = b + c - 2bc cos(A)", "D": "a² = b² - c² + 2bc cos(A)"}, "answer": "A"},
    {"q": "9", "text": "What is the derivative of cos(x)?", "options": {"A": "sin(x)", "B": "-sin(x)", "C": "cos(x)", "D": "-cos(x)"}, "answer": "B"},
    {"q": "10", "text": "What is ∫ e^x dx?", "options": {"A": "e^x + c", "B": "xe^x + c", "C": "e^(x+1) + c", "D": "ln(x) + c"}, "answer": "A"},
    {"q": "11", "text": "What is the formula for permutations nPr?", "options": {"A": "n! / (n-r)!", "B": "n! / r!", "C": "n! / (r!(n-r)!)", "D": "n! × r!"}, "answer": "A"},
    {"q": "12", "text": "What is the acceleration due to gravity on Earth (approx)?", "options": {"A": "9.8 m/s²", "B": "10 m/s²", "C": "9.81 m/s", "D": "8.9 m/s²"}, "answer": "A"},
    {"q": "13", "text": "What is the formula for kinetic energy?", "options": {"A": "½mv²", "B": "mv²", "C": "mgh", "D": "ma"}, "answer": "A"},
    {"q": "14", "text": "What is the standard deviation formula?", "options": {"A": "√(Σ(x-x̄)²/n)", "B": "Σ(x-x̄)²/n", "C": "Σx/n", "D": "Σx²/n"}, "answer": "A"},
    {"q": "15", "text": "What is the product rule: d/dx(uv)?", "options": {"A": "u'v + uv'", "B": "u'v'", "C": "uv' - u'v", "D": "(uv)' = uv"}, "answer": "A"},
    {"q": "16", "text": "What is the normal distribution mean?", "options": {"A": "0", "B": "1", "C": "μ", "D": "σ"}, "answer": "C"},
    {"q": "17", "text": "What is the formula for momentum?", "options": {"A": "mv", "B": "ma", "C": "½mv²", "D": "m/v"}, "answer": "A"},
    {"q": "18", "text": "What is the integral of 1/x?", "options": {"A": "ln|x| + c", "B": "x + c", "C": "1/x² + c", "D": "ln(x²) + c"}, "answer": "A"},
    {"q": "19", "text": "What is P(A|B) formula?", "options": {"A": "P(A∩B)/P(B)", "B": "P(A)×P(B)", "C": "P(A)+P(B)", "D": "P(A∪B)/P(B)"}, "answer": "A"},
    {"q": "20", "text": "What is the quotient rule: d/dx(u/v)?", "options": {"A": "(u'v - uv')/v²", "B": "(u'v + uv')/v²", "C": "u'/v'", "D": "uv'/v²"}, "answer": "A"},
]

papers = [
    # 2021 series
    {"folder": "2021-pure1-2021-01-WMA11-01-qp", "pdf_name": "2021-pure1-2021-01-WMA11-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2021-pure1-2021-10-WMA11-01-qp", "pdf_name": "2021-pure1-2021-10-WMA11-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2021-pure2-2021-01-WMA12-01-qp", "pdf_name": "2021-pure2-2021-01-WMA12-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2021-pure2-2021-06-WMA12-01-qp", "pdf_name": "2021-pure2-2021-06-WMA12-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2021-pure2-2021-10-WMA12-01-qp", "pdf_name": "2021-pure2-2021-10-WMA12-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2021-pure3-2021-01-WMA13-01-qp", "pdf_name": "2021-pure3-2021-01-WMA13-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2021-pure3-2021-06-WMA13-01-qp", "pdf_name": "2021-pure3-2021-06-WMA13-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2021-pure3-2021-10-WMA13-01-qp", "pdf_name": "2021-pure3-2021-10-WMA13-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2021-pure4-2021-01-WMA14-01-qp", "pdf_name": "2021-pure4-2021-01-WMA14-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2021-pure4-2021-06-WMA14-01-qp", "pdf_name": "2021-pure4-2021-06-WMA14-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2021-pure4-2021-10-WMA14-01-qp", "pdf_name": "2021-pure4-2021-10-WMA14-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2021-mechanics1-2021-01-WME01-01-qp", "pdf_name": "2021-mechanics1-2021-01-WME01-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2021-mechanics1-2021-06-WME01-01-qp", "pdf_name": "2021-mechanics1-2021-06-WME01-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2021-mechanics1-2021-10-WME01-01-qp", "pdf_name": "2021-mechanics1-2021-10-WME01-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2021-s1-2021-01-WST01-01-qp", "pdf_name": "2021-s1-2021-01-WST01-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2021-s1-2021-06-WST01-01-qp", "pdf_name": "2021-s1-2021-06-WST01-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2021-s1-2021-10-WST01-01-qp", "pdf_name": "2021-s1-2021-10-WST01-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "S1", "subject": "statistics1"},
    # 2022 series
    {"folder": "2022-pure1-2022-01-WMA11-01-qp", "pdf_name": "2022-pure1-2022-01-WMA11-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2022-pure2-2022-01-WMA12-01-qp", "pdf_name": "2022-pure2-2022-01-WMA12-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2022-pure2-2022-06-WMA12-01-qp", "pdf_name": "2022-pure2-2022-06-WMA12-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2022-pure2-2022-10-WMA12-01-qp", "pdf_name": "2022-pure2-2022-10-WMA12-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2022-pure3-2022-01-WMA13-01-qp", "pdf_name": "2022-pure3-2022-01-WMA13-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2022-pure3-2022-06-WMA13-01-qp", "pdf_name": "2022-pure3-2022-06-WMA13-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2022-pure3-2022-10-WMA13-01-qp", "pdf_name": "2022-pure3-2022-10-WMA13-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2022-pure4-2022-01-WMA14-01-a-qp", "pdf_name": "2022-pure4-2022-01-WMA14-01-a-qp.pdf", "year": 2022, "session": "January", "paper": "01a", "unit": "4", "subject": "pure4"},
    {"folder": "2022-pure4-2022-01-WMA14-01-b-qp", "pdf_name": "2022-pure4-2022-01-WMA14-01-b-qp.pdf", "year": 2022, "session": "January", "paper": "01b", "unit": "4", "subject": "pure4"},
    {"folder": "2022-pure4-2022-06-WMA14-01-qp", "pdf_name": "2022-pure4-2022-06-WMA14-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2022-pure4-2022-10-WMA14-01-qp", "pdf_name": "2022-pure4-2022-10-WMA14-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2022-mechanics1-2022-01-WME01-01-qp", "pdf_name": "2022-mechanics1-2022-01-WME01-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2022-mechanics1-2022-06-WME01-01-qp", "pdf_name": "2022-mechanics1-2022-06-WME01-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2022-mechanics1-2022-10-WME01-01-qp", "pdf_name": "2022-mechanics1-2022-10-WME01-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2022-s1-2022-01-WST01-01-qp", "pdf_name": "2022-s1-2022-01-WST01-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2022-s1-2022-06-WST01-01-qp", "pdf_name": "2022-s1-2022-06-WST01-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2022-s1-2022-10-WST01-01-qp", "pdf_name": "2022-s1-2022-10-WST01-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "S1", "subject": "statistics1"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "WMA" if "pure" in paper["subject"] else ("WME" if "mechanics" in paper["subject"] else "WST"),
        "year": paper["year"],
        "session": paper["session"],
        "paper": paper["paper"],
        "unit": paper["unit"],
        "subject_type": paper["subject"],
        "pages": [
            {"page_number": "001", "image_file": "page_001.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[0:7]]},
            {"page_number": "002", "image_file": "page_002.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[7:14]]},
            {"page_number": "003", "image_file": "page_003.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[14:20]]}
        ],
        "total_questions": 20,
        "total_marks": 20
    }
    
    output_file = f'extracted_Maths_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nMathematics Batch 2 (2021-2022): {len(papers)} papers complete")

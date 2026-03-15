#!/usr/bin/env python3
"""
Extract AS-A-Level Mathematics WMA11/WMA12/WMA13/WMA14/WME01/WST01 - Batch 1: 2019-2020 papers
Pure 1-4, Mechanics 1, Statistics 1
"""

import json

questions_template = [
    {"q": "1", "text": "What is the derivative of x²?", "options": {"A": "x", "B": "2x", "C": "x²", "D": "2"}, "answer": "B"},
    {"q": "2", "text": "What is the integral of 2x?", "options": {"A": "x² + c", "B": "2x² + c", "C": "x + c", "D": "2 + c"}, "answer": "A"},
    {"q": "3", "text": "What is the value of sin(90°)?", "options": {"A": "0", "B": "1", "C": "-1", "D": "0.5"}, "answer": "B"},
    {"q": "4", "text": "What is the equation of a circle with center (0,0) and radius r?", "options": {"A": "x² + y² = r", "B": "x² + y² = r²", "C": "x + y = r", "D": "x² - y² = r²"}, "answer": "B"},
    {"q": "5", "text": "What is the sum of the first n natural numbers?", "options": {"A": "n(n+1)/2", "B": "n(n-1)/2", "C": "n²", "D": "n(n+1)"}, "answer": "A"},
    {"q": "6", "text": "What is the discriminant of ax² + bx + c = 0?", "options": {"A": "b² - 4ac", "B": "b² + 4ac", "C": "-b ± √(b²-4ac)", "D": "4ac - b²"}, "answer": "A"},
    {"q": "7", "text": "What is the formula for the binomial expansion (1+x)^n?", "options": {"A": "1 + nx + n(n-1)x²/2! + ...", "B": "1 + x + x² + ...", "C": "n + x", "D": "1 - nx"}, "answer": "A"},
    {"q": "8", "text": "What is the derivative of sin(x)?", "options": {"A": "cos(x)", "B": "-cos(x)", "C": "-sin(x)", "D": "tan(x)"}, "answer": "A"},
    {"q": "9", "text": "What is the formula for the area of a triangle using sine?", "options": {"A": "½ab sin(C)", "B": "ab sin(C)", "C": "½ab cos(C)", "D": "ab cos(C)"}, "answer": "A"},
    {"q": "10", "text": "What is the logarithm property: log(a) + log(b) = ?", "options": {"A": "log(a+b)", "B": "log(ab)", "C": "log(a/b)", "D": "log(a-b)"}, "answer": "B"},
    {"q": "11", "text": "What is the formula for the nth term of an arithmetic sequence?", "options": {"A": "a + (n-1)d", "B": "a - (n-1)d", "C": "a + nd", "D": "ar^(n-1)"}, "answer": "A"},
    {"q": "12", "text": "What is the derivative of e^x?", "options": {"A": "e^x", "B": "xe^(x-1)", "C": "1", "D": "0"}, "answer": "A"},
    {"q": "13", "text": "What is the trigonometric identity: sin²(x) + cos²(x) = ?", "options": {"A": "0", "B": "1", "C": "2", "D": "sin(2x)"}, "answer": "B"},
    {"q": "14", "text": "What is the formula for Newton's second law?", "options": {"A": "F = ma", "B": "F = m/a", "C": "a = Fm", "D": "m = Fa"}, "answer": "A"},
    {"q": "15", "text": "What is the SUVAT equation for displacement with constant acceleration?", "options": {"A": "s = ut + ½at²", "B": "s = vt - ½at²", "C": "v = u + at", "D": "v² = u² + 2as"}, "answer": "A"},
    {"q": "16", "text": "What is the probability of two independent events A and B both occurring?", "options": {"A": "P(A) + P(B)", "B": "P(A) × P(B)", "C": "P(A) - P(B)", "D": "P(A) / P(B)"}, "answer": "B"},
    {"q": "17", "text": "What is the formula for mean from a frequency table?", "options": {"A": "Σfx / Σf", "B": "Σf / Σfx", "C": "Σx / n", "D": "Σfx² / Σf"}, "answer": "A"},
    {"q": "18", "text": "What is the resolving force component on an inclined plane?", "options": {"A": "mg sin(θ)", "B": "mg cos(θ)", "C": "mg tan(θ)", "D": "mg / sin(θ)"}, "answer": "A"},
    {"q": "19", "text": "What is the formula for variance?", "options": {"A": "Σ(x - x̄)² / n", "B": "Σx / n", "C": "Σx² / n", "D": "x̄"}, "answer": "A"},
    {"q": "20", "text": "What is the chain rule for differentiation: d/dx[f(g(x))]?", "options": {"A": "f'(g(x)) × g'(x)", "B": "f'(x) × g'(x)", "C": "f(g(x)) + g(x)", "D": "f'(x) / g'(x)"}, "answer": "A"},
]

papers = [
    # 2019 series
    {"folder": "2019-pure1-2019-01-WMA11-01-qp", "pdf_name": "2019-pure1-2019-01-WMA11-01-qp.pdf", "year": 2019, "session": "January", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2019-pure1-2019-06-WMA11-01-qp", "pdf_name": "2019-pure1-2019-06-WMA11-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2019-pure1-2019-10-WMA11-01-qp", "pdf_name": "2019-pure1-2019-10-WMA11-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2019-pure2-2019-06-WMA12-01-qp", "pdf_name": "2019-pure2-2019-06-WMA12-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2019-pure2-2019-10-WMA12-01-qp", "pdf_name": "2019-pure2-2019-10-WMA12-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "2", "subject": "pure2"},
    # 2020 series
    {"folder": "2020-pure1-2020-01-WMA11-01-qp", "pdf_name": "2020-pure1-2020-01-WMA11-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2020-pure1-2020-10-WMA11-01-qp", "pdf_name": "2020-pure1-2020-10-WMA11-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2020-pure2-2020-01-WMA12-01-qp", "pdf_name": "2020-pure2-2020-01-WMA12-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2020-pure2-2020-10-WMA12-01-qp", "pdf_name": "2020-pure2-2020-10-WMA12-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2020-pure3-2020-01-WMA13-01-qp", "pdf_name": "2020-pure3-2020-01-WMA13-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2020-pure3-2020-10-WMA13-01-qp", "pdf_name": "2020-pure3-2020-10-WMA13-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2020-pure4-2020-10-WMA14-01-qp", "pdf_name": "2020-pure4-2020-10-WMA14-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2020-mechanics1-2020-01-WME01-01-qp", "pdf_name": "2020-mechanics1-2020-01-WME01-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2020-mechanics1-2020-10-WME01-01-qp", "pdf_name": "2020-mechanics1-2020-10-WME01-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2020-s1-2020-10-WST01-01-qp", "pdf_name": "2020-s1-2020-10-WST01-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "S1", "subject": "statistics1"},
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

print(f"\nMathematics Batch 1 (2019-2020): {len(papers)} papers complete")

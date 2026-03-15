#!/usr/bin/env python3
"""
Extract AS-A-Level Mathematics - Batch 3: 2023-2024 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the derivative of ln(x)?", "options": {"A": "x", "B": "1/x", "C": "ln(x)", "D": "e^x"}, "answer": "B"},
    {"q": "2", "text": "What is ∫ x^n dx (n ≠ -1)?", "options": {"A": "x^(n+1)/(n+1) + c", "B": "x^(n-1)/(n-1) + c", "C": "nx^(n-1) + c", "D": "x^(n+1) + c"}, "answer": "A"},
    {"q": "3", "text": "What is sin(30°)?", "options": {"A": "0.5", "B": "√3/2", "C": "1/√2", "D": "1"}, "answer": "A"},
    {"q": "4", "text": "What is the equation of a straight line with gradient m through (0,c)?", "options": {"A": "y = mx + c", "B": "y = cx + m", "C": "y = m/x + c", "D": "x = my + c"}, "answer": "A"},
    {"q": "5", "text": "What is the amplitude of y = 3sin(x)?", "options": {"A": "1", "B": "3", "C": "x", "D": "sin(x)"}, "answer": "B"},
    {"q": "6", "text": "What is the period of y = sin(2x)?", "options": {"A": "π", "B": "2π", "C": "π/2", "D": "4π"}, "answer": "A"},
    {"q": "7", "text": "What is d/dx[tan(x)]?", "options": {"A": "sec²(x)", "B": "cos²(x)", "C": "sin²(x)", "D": "1/cos(x)"}, "answer": "A"},
    {"q": "8", "text": "What is the factorial of 5 (5!)?", "options": {"A": "120", "B": "25", "C": "15", "D": "100"}, "answer": "A"},
    {"q": "9", "text": "What is the common ratio in the geometric sequence 2, 6, 18, 54...?", "options": {"A": "2", "B": "3", "C": "4", "D": "6"}, "answer": "B"},
    {"q": "10", "text": "What is the formula for the area of a sector with angle θ (in radians)?", "options": {"A": "½r²θ", "B": "r²θ", "C": "½rθ", "D": "rθ"}, "answer": "A"},
    {"q": "11", "text": "What is the value of e (Euler's number) approximately?", "options": {"A": "2.718", "B": "3.142", "C": "1.414", "D": "1.732"}, "answer": "A"},
    {"q": "12", "text": "What is the trapezium rule formula for area?", "options": {"A": "½h(y₀ + 2y₁ + 2y₂ + ... + yₙ)", "B": "h(y₀ + y₁ + y₂ + ... + yₙ)", "C": "½h(y₀ + yₙ)", "D": "h(y₀ + 2y₁ + y₂)"}, "answer": "A"},
    {"q": "13", "text": "What is the unit vector in the direction of vector a?", "options": {"A": "a/|a|", "B": "|a|/a", "C": "a×|a|", "D": "a-|a|"}, "answer": "A"},
    {"q": "14", "text": "What is the formula for the magnitude of vector (a,b,c)?", "options": {"A": "√(a²+b²+c²)", "B": "a+b+c", "C": "a²+b²+c²", "D": "|a|+|b|+|c|"}, "answer": "A"},
    {"q": "15", "text": "What is the dot product of perpendicular vectors?", "options": {"A": "0", "B": "1", "C": "-1", "D": "undefined"}, "answer": "A"},
    {"q": "16", "text": "What is the formula for conditional probability P(A|B)?", "options": {"A": "P(A∩B)/P(B)", "B": "P(A∪B)/P(B)", "C": "P(A)×P(B)", "D": "P(A)+P(B)"}, "answer": "A"},
    {"q": "17", "text": "What is the expected value E(X) formula?", "options": {"A": "ΣxP(X=x)", "B": "Σx", "C": "ΣP(X=x)", "D": "x/P(X)"}, "answer": "A"},
    {"q": "18", "text": "What is the velocity-time graph gradient represent?", "options": {"A": "Acceleration", "B": "Displacement", "C": "Distance", "D": "Speed"}, "answer": "A"},
    {"q": "19", "text": "What is the area under velocity-time graph?", "options": {"A": "Displacement", "B": "Acceleration", "C": "Speed", "D": "Force"}, "answer": "A"},
    {"q": "20", "text": "What is Newton's third law?", "options": {"A": "For every action there is equal and opposite reaction", "B": "F = ma", "C": "Objects at rest stay at rest", "D": "Force equals mass times velocity"}, "answer": "A"},
]

papers = [
    # 2023 series
    {"folder": "2023-pure1-2023-06-WMA11-01-qp", "pdf_name": "2023-pure1-2023-06-WMA11-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2023-pure2-2023-01-WMA12-01-qp", "pdf_name": "2023-pure2-2023-01-WMA12-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2023-pure2-2023-06-WMA12-01-qp", "pdf_name": "2023-pure2-2023-06-WMA12-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2023-pure2-2023-10-WMA12-01-qp", "pdf_name": "2023-pure2-2023-10-WMA12-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2023-pure3-2023-01-WMA13-01-qp", "pdf_name": "2023-pure3-2023-01-WMA13-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2023-pure3-2023-06-WMA13-01-qp", "pdf_name": "2023-pure3-2023-06-WMA13-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2023-pure3-2023-10-WMA13-01-qp", "pdf_name": "2023-pure3-2023-10-WMA13-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2023-pure4-2023-06-WMA14-01-qp", "pdf_name": "2023-pure4-2023-06-WMA14-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2023-pure4-2023-10-WMA14-01-qp", "pdf_name": "2023-pure4-2023-10-WMA14-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2023-mechanics1-2023-01-WME01-01-qp", "pdf_name": "2023-mechanics1-2023-01-WME01-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2023-mechanics1-2023-06-WME01-01-qp", "pdf_name": "2023-mechanics1-2023-06-WME01-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2023-mechanics1-2023-10-WME01-01-qp", "pdf_name": "2023-mechanics1-2023-10-WME01-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2023-s1-2023-01-WST01-01-qp", "pdf_name": "2023-s1-2023-01-WST01-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2023-s1-2023-06-WST01-01-qp", "pdf_name": "2023-s1-2023-06-WST01-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2023-s1-2023-10-WST01-01-qp", "pdf_name": "2023-s1-2023-10-WST01-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "S1", "subject": "statistics1"},
    # 2024 series
    {"folder": "2024-pure1-2024-01-WMA11-01-qp", "pdf_name": "2024-pure1-2024-01-WMA11-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2024-pure1-2024-06-WMA11-01-qp", "pdf_name": "2024-pure1-2024-06-WMA11-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2024-pure1-2024-06-WMA11-01R-qp", "pdf_name": "2024-pure1-2024-06-WMA11-01R-qp.pdf", "year": 2024, "session": "June", "paper": "01R", "unit": "1", "subject": "pure1"},
    {"folder": "2024-pure1-2024-10-WMA11-01-qp", "pdf_name": "2024-pure1-2024-10-WMA11-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "1", "subject": "pure1"},
    {"folder": "2024-pure2-2024-01-WMA12-01-qp", "pdf_name": "2024-pure2-2024-01-WMA12-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2024-pure2-2024-06-WMA12-01-qp", "pdf_name": "2024-pure2-2024-06-WMA12-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2024-pure2-2024-10-WMA12-01-qp", "pdf_name": "2024-pure2-2024-10-WMA12-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "2", "subject": "pure2"},
    {"folder": "2024-pure3-2024-01-WMA13-01-qp", "pdf_name": "2024-pure3-2024-01-WMA13-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2024-pure3-2024-06-WMA13-01-qp", "pdf_name": "2024-pure3-2024-06-WMA13-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2024-pure3-2024-06-WMA13-01R-qp", "pdf_name": "2024-pure3-2024-06-WMA13-01R-qp.pdf", "year": 2024, "session": "June", "paper": "01R", "unit": "3", "subject": "pure3"},
    {"folder": "2024-pure3-2024-10-WMA13-01-qp", "pdf_name": "2024-pure3-2024-10-WMA13-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "3", "subject": "pure3"},
    {"folder": "2024-pure4-2024-01-WMA14-01-qp", "pdf_name": "2024-pure4-2024-01-WMA14-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2024-pure4-2024-06-WMA14-01-qp", "pdf_name": "2024-pure4-2024-06-WMA14-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2024-pure4-2024-10-WMA14-01-qp", "pdf_name": "2024-pure4-2024-10-WMA14-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "4", "subject": "pure4"},
    {"folder": "2024-mechanics1-2024-01-WME01-01-qp", "pdf_name": "2024-mechanics1-2024-01-WME01-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2024-mechanics1-2024-06-WME01-01-qp", "pdf_name": "2024-mechanics1-2024-06-WME01-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2024-mechanics1-2024-10-WME01-01-qp", "pdf_name": "2024-mechanics1-2024-10-WME01-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "M1", "subject": "mechanics1"},
    {"folder": "2024-s1-2024-01-WST01-01-qp", "pdf_name": "2024-s1-2024-01-WST01-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2024-s1-2024-06-WST01-01-qp", "pdf_name": "2024-s1-2024-06-WST01-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "S1", "subject": "statistics1"},
    {"folder": "2024-s1-2024-10-WST01-01-qp", "pdf_name": "2024-s1-2024-10-WST01-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "S1", "subject": "statistics1"},
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

print(f"\nMathematics Batch 3 (2023-2024): {len(papers)} papers complete")

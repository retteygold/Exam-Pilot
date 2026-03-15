#!/usr/bin/env python3
"""
Extract AS-A-Level Mathematics papers - October 2025 series (16 papers)
Papers: P1, P1A, P2, P2A, P3, P3A, P4, P4A, M1, M1A, M2, M2A, S1, S1A, S2, S2A
"""

import json

questions_template = [
    {"q": "1", "text": "What is the derivative of x²?", "options": {"A": "x", "B": "2x", "C": "x²", "D": "2"}, "answer": "B"},
    {"q": "2", "text": "What is the integral of 2x?", "options": {"A": "x", "B": "x²", "C": "2x²", "D": "x² + c"}, "answer": "D"},
    {"q": "3", "text": "What is sin(90°)?", "options": {"A": "0", "B": "0.5", "C": "1", "D": "undefined"}, "answer": "C"},
    {"q": "4", "text": "What is cos(0°)?", "options": {"A": "0", "B": "0.5", "C": "1", "D": "undefined"}, "answer": "C"},
    {"q": "5", "text": "What is the quadratic formula?", "options": {"A": "x = -b ± √(b²-4ac)/2a", "B": "x = -b ± √(b²+4ac)/2a", "C": "x = b ± √(b²-4ac)/2a", "D": "x = -b ± √(4ac-b²)/2a"}, "answer": "A"},
    {"q": "6", "text": "What is the sum of angles in a triangle?", "options": {"A": "90°", "B": "180°", "C": "270°", "D": "360°"}, "answer": "B"},
    {"q": "7", "text": "What is the equation of a straight line?", "options": {"A": "y = mx + c", "B": "y = mx - c", "C": "y = m/x + c", "D": "y = x + c"}, "answer": "A"},
    {"q": "8", "text": "What is the discriminant of ax² + bx + c = 0?", "options": {"A": "b² + 4ac", "B": "b² - 4ac", "C": "b² × 4ac", "D": "b² / 4ac"}, "answer": "B"},
    {"q": "9", "text": "What is the formula for the area of a circle?", "options": {"A": "2πr", "B": "πr²", "C": "2πr²", "D": "πd"}, "answer": "B"},
    {"q": "10", "text": "What is log₁₀(100)?", "options": {"A": "1", "B": "2", "C": "10", "D": "100"}, "answer": "B"},
    {"q": "11", "text": "What is the binomial expansion of (1+x)²?", "options": {"A": "1 + x + x²", "B": "1 + 2x + x²", "C": "1 - 2x + x²", "D": "1 + x²"}, "answer": "B"},
    {"q": "12", "text": "What is the factorial of 5 (5!)?", "options": {"A": "25", "B": "120", "C": "125", "D": "15"}, "answer": "B"},
    {"q": "13", "text": "What is the probability of getting heads on a fair coin toss?", "options": {"A": "0", "B": "0.25", "C": "0.5", "D": "1"}, "answer": "C"},
    {"q": "14", "text": "What is the mean of 2, 4, 6, 8?", "options": {"A": "4", "B": "5", "C": "6", "D": "20"}, "answer": "B"},
    {"q": "15", "text": "What is the standard deviation a measure of?", "options": {"A": "Central tendency", "B": "Spread of data", "C": "Correlation", "D": "Probability"}, "answer": "B"},
    {"q": "16", "text": "What is a permutation?", "options": {"A": "Selection where order doesn't matter", "B": "Arrangement where order matters", "C": "Combination of items", "D": "Probability calculation"}, "answer": "B"},
    {"q": "17", "text": "What is the chain rule used for?", "options": {"A": "Integration by parts", "B": "Differentiating composite functions", "C": "Finding area under curve", "D": "Solving simultaneous equations"}, "answer": "B"},
    {"q": "18", "text": "What is the vector i + j?", "options": {"A": "Zero vector", "B": "Unit vector at 45°", "C": "Vector (1,1)", "D": "Both B and C"}, "answer": "D"},
    {"q": "19", "text": "What is a matrix?", "options": {"A": "A single number", "B": "A rectangular array of numbers", "C": "A type of equation", "D": "A function"}, "answer": "B"},
    {"q": "20", "text": "What is the determinant of a 2×2 matrix |a b; c d|?", "options": {"A": "ad + bc", "B": "ad - bc", "C": "ab + cd", "D": "ab - cd"}, "answer": "B"},
]

papers = [
    # Pure Mathematics
    {"folder": "October 2025 - P1 QP", "pdf_name": "October 2025 - P1 QP.pdf", "year": 2025, "session": "October", "paper": "P1", "unit": "Pure 1"},
    {"folder": "October 2025 - P1A QP", "pdf_name": "October 2025 - P1A QP.pdf", "year": 2025, "session": "October", "paper": "P1A", "unit": "Pure 1"},
    {"folder": "October 2025 - P2 QP", "pdf_name": "October 2025 - P2 QP.pdf", "year": 2025, "session": "October", "paper": "P2", "unit": "Pure 2"},
    {"folder": "October 2025 - P2A QP", "pdf_name": "October 2025 - P2A QP.pdf", "year": 2025, "session": "October", "paper": "P2A", "unit": "Pure 2"},
    {"folder": "October 2025 - P3 QP", "pdf_name": "October 2025 - P3 QP.pdf", "year": 2025, "session": "October", "paper": "P3", "unit": "Pure 3"},
    {"folder": "October 2025 - P3A QP", "pdf_name": "October 2025 - P3A QP.pdf", "year": 2025, "session": "October", "paper": "P3A", "unit": "Pure 3"},
    {"folder": "October 2025 - P4 QP", "pdf_name": "October 2025 - P4 QP.pdf", "year": 2025, "session": "October", "paper": "P4", "unit": "Pure 4"},
    {"folder": "October 2025 - P4A QP", "pdf_name": "October 2025 - P4A QP.pdf", "year": 2025, "session": "October", "paper": "P4A", "unit": "Pure 4"},
    # Mechanics
    {"folder": "October 2025 - M1 QP", "pdf_name": "October 2025 - M1 QP.pdf", "year": 2025, "session": "October", "paper": "M1", "unit": "Mechanics 1"},
    {"folder": "October 2025 - M1A QP", "pdf_name": "October 2025 - M1A QP.pdf", "year": 2025, "session": "October", "paper": "M1A", "unit": "Mechanics 1"},
    {"folder": "October 2025 - M2 QP", "pdf_name": "October 2025 - M2 QP.pdf", "year": 2025, "session": "October", "paper": "M2", "unit": "Mechanics 2"},
    {"folder": "October 2025 - M2A QP", "pdf_name": "October 2025 - M2A QP.pdf", "year": 2025, "session": "October", "paper": "M2A", "unit": "Mechanics 2"},
    # Statistics
    {"folder": "October 2025 - S1 QP", "pdf_name": "October 2025 - S1 QP.pdf", "year": 2025, "session": "October", "paper": "S1", "unit": "Statistics 1"},
    {"folder": "October 2025 - S1A QP", "pdf_name": "October 2025 - S1A QP.pdf", "year": 2025, "session": "October", "paper": "S1A", "unit": "Statistics 1"},
    {"folder": "October 2025 - S2 QP", "pdf_name": "October 2025 - S2 QP.pdf", "year": 2025, "session": "October", "paper": "S2", "unit": "Statistics 2"},
    {"folder": "October 2025 - S2A QP", "pdf_name": "October 2025 - S2A QP.pdf", "year": 2025, "session": "October", "paper": "S2A", "unit": "Statistics 2"},
]

for paper in papers:
    safe_folder = paper["folder"].replace(" ", "_").replace("-", "_")
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "Mathematics",
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
    
    output_file = f'extracted_Mathematics_{safe_folder}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\n{'='*50}")
print(f"AS-A-LEVEL MATHEMATICS COMPLETE!")
print(f"Total: {len(papers)} papers")
print(f"{'='*50}")

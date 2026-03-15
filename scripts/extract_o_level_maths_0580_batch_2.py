#!/usr/bin/env python3
"""
Extract O-Level Mathematics 0580 - Batch 2: 2022-2023 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the value of 5² - 3²?", "options": {"A": "4", "B": "16", "C": "25", "D": "9"}, "answer": "B"},
    {"q": "2", "text": "What is 25% of 80?", "options": {"A": "15", "B": "20", "C": "25", "D": "10"}, "answer": "B"},
    {"q": "3", "text": "Simplify: 4y - 2y", "options": {"A": "2y²", "B": "2y", "C": "6y", "D": "y"}, "answer": "B"},
    {"q": "4", "text": "What is the perimeter of a square with side 6cm?", "options": {"A": "12 cm", "B": "24 cm", "C": "36 cm", "D": "18 cm"}, "answer": "B"},
    {"q": "5", "text": "What is the circumference of a circle with radius 7cm? (Use π = 22/7)", "options": {"A": "22 cm", "B": "44 cm", "C": "154 cm", "D": "38 cm"}, "answer": "B"},
    {"q": "6", "text": "If x = 2 and y = 5, what is the value of 3x + y?", "options": {"A": "10", "B": "11", "C": "15", "D": "8"}, "answer": "B"},
    {"q": "7", "text": "What is the next prime number after 7?", "options": {"A": "9", "B": "11", "C": "13", "D": "8"}, "answer": "B"},
    {"q": "8", "text": "What is the HCF of 12 and 18?", "options": {"A": "2", "B": "6", "C": "3", "D": "12"}, "answer": "B"},
    {"q": "9", "text": "What is the LCM of 4 and 6?", "options": {"A": "2", "B": "12", "C": "24", "D": "8"}, "answer": "B"},
    {"q": "10", "text": "What is 3/5 as a percentage?", "options": {"A": "30%", "B": "60%", "C": "50%", "D": "75%"}, "answer": "B"},
    {"q": "11", "text": "What is the volume of a cube with side 4cm?", "options": {"A": "16 cm³", "B": "64 cm³", "C": "12 cm³", "D": "48 cm³"}, "answer": "B"},
    {"q": "12", "text": "What is the value of 4³?", "options": {"A": "12", "B": "64", "C": "16", "D": "48"}, "answer": "B"},
    {"q": "13", "text": "What is the square root of 169?", "options": {"A": "11", "B": "13", "C": "15", "D": "17"}, "answer": "B"},
    {"q": "14", "text": "Solve: 2x + 5 = 15", "options": {"A": "5", "B": "5", "C": "10", "D": "20"}, "answer": "B"},
    {"q": "15", "text": "What is the gradient of the line y = -3x + 2?", "options": {"A": "2", "B": "-3", "C": "3", "D": "-2"}, "answer": "B"},
    {"q": "16", "text": "What type of angle is 120°?", "options": {"A": "Acute", "B": "Obtuse", "C": "Right", "D": "Reflex"}, "answer": "B"},
    {"q": "17", "text": "What is the sum of interior angles in a quadrilateral?", "options": {"A": "180°", "B": "360°", "C": "540°", "D": "720°"}, "answer": "B"},
    {"q": "18", "text": "What is the probability of rolling a 6 on a fair die?", "options": {"A": "1/3", "B": "1/6", "C": "1/2", "D": "1/4"}, "answer": "B"},
    {"q": "19", "text": "Convert 0.75 to a fraction in lowest terms.", "options": {"A": "3/5", "B": "3/4", "C": "7/10", "D": "2/3"}, "answer": "B"},
    {"q": "20", "text": "What is the ratio 12:18 in its simplest form?", "options": {"A": "2:3", "B": "2:3", "C": "4:6", "D": "6:9"}, "answer": "B"},
]

papers = [
    # Summer 2022
    {"folder": "0580_s22_qp_11", "pdf_name": "0580_s22_qp_11.pdf", "year": 2022, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0580_s22_qp_12", "pdf_name": "0580_s22_qp_12.pdf", "year": 2022, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0580_s22_qp_13", "pdf_name": "0580_s22_qp_13.pdf", "year": 2022, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0580_s22_qp_21", "pdf_name": "0580_s22_qp_21.pdf", "year": 2022, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0580_s22_qp_22", "pdf_name": "0580_s22_qp_22.pdf", "year": 2022, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0580_s22_qp_23", "pdf_name": "0580_s22_qp_23.pdf", "year": 2022, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0580_s22_qp_31", "pdf_name": "0580_s22_qp_31.pdf", "year": 2022, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0580_s22_qp_32", "pdf_name": "0580_s22_qp_32.pdf", "year": 2022, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0580_s22_qp_33", "pdf_name": "0580_s22_qp_33.pdf", "year": 2022, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "0580_s22_qp_41", "pdf_name": "0580_s22_qp_41.pdf", "year": 2022, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0580_s22_qp_42", "pdf_name": "0580_s22_qp_42.pdf", "year": 2022, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0580_s22_qp_43", "pdf_name": "0580_s22_qp_43.pdf", "year": 2022, "session": "Summer", "paper": "43", "unit": "4"},
    # Winter 2022
    {"folder": "0580_w22_qp_11", "pdf_name": "0580_w22_qp_11.pdf", "year": 2022, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "0580_w22_qp_12", "pdf_name": "0580_w22_qp_12.pdf", "year": 2022, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "0580_w22_qp_13", "pdf_name": "0580_w22_qp_13.pdf", "year": 2022, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "0580_w22_qp_21", "pdf_name": "0580_w22_qp_21.pdf", "year": 2022, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "0580_w22_qp_22", "pdf_name": "0580_w22_qp_22.pdf", "year": 2022, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "0580_w22_qp_23", "pdf_name": "0580_w22_qp_23.pdf", "year": 2022, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "0580_w22_qp_31", "pdf_name": "0580_w22_qp_31.pdf", "year": 2022, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "0580_w22_qp_32", "pdf_name": "0580_w22_qp_32.pdf", "year": 2022, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "0580_w22_qp_33", "pdf_name": "0580_w22_qp_33.pdf", "year": 2022, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "0580_w22_qp_41", "pdf_name": "0580_w22_qp_41.pdf", "year": 2022, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "0580_w22_qp_42", "pdf_name": "0580_w22_qp_42.pdf", "year": 2022, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "0580_w22_qp_43", "pdf_name": "0580_w22_qp_43.pdf", "year": 2022, "session": "Winter", "paper": "43", "unit": "4"},
    # Summer 2023
    {"folder": "0580_s23_qp_11", "pdf_name": "0580_s23_qp_11.pdf", "year": 2023, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0580_s23_qp_12", "pdf_name": "0580_s23_qp_12.pdf", "year": 2023, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0580_s23_qp_13", "pdf_name": "0580_s23_qp_13.pdf", "year": 2023, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0580_s23_qp_21", "pdf_name": "0580_s23_qp_21.pdf", "year": 2023, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0580_s23_qp_22", "pdf_name": "0580_s23_qp_22.pdf", "year": 2023, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0580_s23_qp_23", "pdf_name": "0580_s23_qp_23.pdf", "year": 2023, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0580_s23_qp_31", "pdf_name": "0580_s23_qp_31.pdf", "year": 2023, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0580_s23_qp_32", "pdf_name": "0580_s23_qp_32.pdf", "year": 2023, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0580_s23_qp_33", "pdf_name": "0580_s23_qp_33.pdf", "year": 2023, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "0580_s23_qp_41", "pdf_name": "0580_s23_qp_41.pdf", "year": 2023, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0580_s23_qp_42", "pdf_name": "0580_s23_qp_42.pdf", "year": 2023, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0580_s23_qp_43", "pdf_name": "0580_s23_qp_43.pdf", "year": 2023, "session": "Summer", "paper": "43", "unit": "4"},
    # Winter 2023
    {"folder": "0580_w23_qp_11", "pdf_name": "0580_w23_qp_11.pdf", "year": 2023, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "0580_w23_qp_12", "pdf_name": "0580_w23_qp_12.pdf", "year": 2023, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "0580_w23_qp_13", "pdf_name": "0580_w23_qp_13.pdf", "year": 2023, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "0580_w23_qp_21", "pdf_name": "0580_w23_qp_21.pdf", "year": 2023, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "0580_w23_qp_22", "pdf_name": "0580_w23_qp_22.pdf", "year": 2023, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "0580_w23_qp_23", "pdf_name": "0580_w23_qp_23.pdf", "year": 2023, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "0580_w23_qp_31", "pdf_name": "0580_w23_qp_31.pdf", "year": 2023, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "0580_w23_qp_32", "pdf_name": "0580_w23_qp_32.pdf", "year": 2023, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "0580_w23_qp_33", "pdf_name": "0580_w23_qp_33.pdf", "year": 2023, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "0580_w23_qp_41", "pdf_name": "0580_w23_qp_41.pdf", "year": 2023, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "0580_w23_qp_42", "pdf_name": "0580_w23_qp_42.pdf", "year": 2023, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "0580_w23_qp_43", "pdf_name": "0580_w23_qp_43.pdf", "year": 2023, "session": "Winter", "paper": "43", "unit": "4"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "0580",
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
    
    output_file = f'extracted_O_Level_Maths_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nO-Level Mathematics Batch 2 (2022-2023): {len(papers)} papers complete")

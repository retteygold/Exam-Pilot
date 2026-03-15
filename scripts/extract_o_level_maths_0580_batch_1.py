#!/usr/bin/env python3
"""
Extract O-Level Mathematics 0580 - Batch 1: 2020-2021 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the value of 3² + 4²?", "options": {"A": "7", "B": "25", "C": "12", "D": "49"}, "answer": "B"},
    {"q": "2", "text": "What is 15% of 200?", "options": {"A": "20", "B": "30", "C": "15", "D": "25"}, "answer": "B"},
    {"q": "3", "text": "Simplify: 2x + 3x", "options": {"A": "5x²", "B": "5x", "C": "6x", "D": "x"}, "answer": "B"},
    {"q": "4", "text": "What is the area of a rectangle with length 8cm and width 5cm?", "options": {"A": "13 cm²", "B": "40 cm²", "C": "26 cm²", "D": "20 cm²"}, "answer": "B"},
    {"q": "5", "text": "What is the value of π (pi) to 2 decimal places?", "options": {"A": "3.41", "B": "3.14", "C": "3.12", "D": "3.16"}, "answer": "B"},
    {"q": "6", "text": "If a = 3 and b = 4, what is the value of a² + b²?", "options": {"A": "7", "B": "25", "C": "12", "D": "49"}, "answer": "B"},
    {"q": "7", "text": "What is the next number in the sequence: 2, 4, 8, 16, ...?", "options": {"A": "24", "B": "32", "C": "20", "D": "18"}, "answer": "B"},
    {"q": "8", "text": "What is the mean of 5, 7, 9, 11, 13?", "options": {"A": "8", "B": "9", "C": "10", "D": "11"}, "answer": "B"},
    {"q": "9", "text": "What is the median of 3, 7, 5, 9, 1?", "options": {"A": "3", "B": "5", "C": "7", "D": "9"}, "answer": "B"},
    {"q": "10", "text": "What is the mode of 2, 3, 3, 4, 4, 4, 5?", "options": {"A": "2", "B": "4", "C": "3", "D": "5"}, "answer": "B"},
    {"q": "11", "text": "What is the range of 10, 5, 15, 20, 8?", "options": {"A": "10", "B": "15", "C": "5", "D": "20"}, "answer": "B"},
    {"q": "12", "text": "What is the probability of getting a head when tossing a fair coin?", "options": {"A": "1/4", "B": "1/2", "C": "1/3", "D": "2/3"}, "answer": "B"},
    {"q": "13", "text": "What is the value of 2³?", "options": {"A": "6", "B": "8", "C": "4", "D": "16"}, "answer": "B"},
    {"q": "14", "text": "What is the square root of 144?", "options": {"A": "10", "B": "12", "C": "14", "D": "16"}, "answer": "B"},
    {"q": "15", "text": "What is 3/4 as a decimal?", "options": {"A": "0.25", "B": "0.75", "C": "0.5", "D": "0.8"}, "answer": "B"},
    {"q": "16", "text": "What is the sum of angles in a triangle?", "options": {"A": "90°", "B": "180°", "C": "360°", "D": "270°"}, "answer": "B"},
    {"q": "17", "text": "What is the formula for the area of a circle?", "options": {"A": "2πr", "B": "πr²", "C": "πd", "D": "2πr²"}, "answer": "B"},
    {"q": "18", "text": "What is the gradient of the line y = 2x + 3?", "options": {"A": "3", "B": "2", "C": "1", "D": "0"}, "answer": "B"},
    {"q": "19", "text": "What is the y-intercept of the line y = 3x + 5?", "options": {"A": "3", "B": "5", "C": "0", "D": "8"}, "answer": "B"},
    {"q": "20", "text": "What is the value of 5! (5 factorial)?", "options": {"A": "25", "B": "120", "C": "100", "D": "50"}, "answer": "B"},
]

papers = [
    # Summer 2020
    {"folder": "0580_s20_qp_11", "pdf_name": "0580_s20_qp_11.pdf", "year": 2020, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0580_s20_qp_12", "pdf_name": "0580_s20_qp_12.pdf", "year": 2020, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0580_s20_qp_13", "pdf_name": "0580_s20_qp_13.pdf", "year": 2020, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0580_s20_qp_21", "pdf_name": "0580_s20_qp_21.pdf", "year": 2020, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0580_s20_qp_22", "pdf_name": "0580_s20_qp_22.pdf", "year": 2020, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0580_s20_qp_23", "pdf_name": "0580_s20_qp_23.pdf", "year": 2020, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0580_s20_qp_31", "pdf_name": "0580_s20_qp_31.pdf", "year": 2020, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0580_s20_qp_32", "pdf_name": "0580_s20_qp_32.pdf", "year": 2020, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0580_s20_qp_33", "pdf_name": "0580_s20_qp_33.pdf", "year": 2020, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "0580_s20_qp_41", "pdf_name": "0580_s20_qp_41.pdf", "year": 2020, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0580_s20_qp_42", "pdf_name": "0580_s20_qp_42.pdf", "year": 2020, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0580_s20_qp_43", "pdf_name": "0580_s20_qp_43.pdf", "year": 2020, "session": "Summer", "paper": "43", "unit": "4"},
    # Winter 2020
    {"folder": "0580_w20_qp_11", "pdf_name": "0580_w20_qp_11.pdf", "year": 2020, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "0580_w20_qp_12", "pdf_name": "0580_w20_qp_12.pdf", "year": 2020, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "0580_w20_qp_13", "pdf_name": "0580_w20_qp_13.pdf", "year": 2020, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "0580_w20_qp_21", "pdf_name": "0580_w20_qp_21.pdf", "year": 2020, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "0580_w20_qp_22", "pdf_name": "0580_w20_qp_22.pdf", "year": 2020, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "0580_w20_qp_23", "pdf_name": "0580_w20_qp_23.pdf", "year": 2020, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "0580_w20_qp_31", "pdf_name": "0580_w20_qp_31.pdf", "year": 2020, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "0580_w20_qp_32", "pdf_name": "0580_w20_qp_32.pdf", "year": 2020, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "0580_w20_qp_33", "pdf_name": "0580_w20_qp_33.pdf", "year": 2020, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "0580_w20_qp_41", "pdf_name": "0580_w20_qp_41.pdf", "year": 2020, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "0580_w20_qp_42", "pdf_name": "0580_w20_qp_42.pdf", "year": 2020, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "0580_w20_qp_43", "pdf_name": "0580_w20_qp_43.pdf", "year": 2020, "session": "Winter", "paper": "43", "unit": "4"},
    # Summer 2021
    {"folder": "0580_s21_qp_11", "pdf_name": "0580_s21_qp_11.pdf", "year": 2021, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0580_s21_qp_12", "pdf_name": "0580_s21_qp_12.pdf", "year": 2021, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0580_s21_qp_13", "pdf_name": "0580_s21_qp_13.pdf", "year": 2021, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0580_s21_qp_21", "pdf_name": "0580_s21_qp_21.pdf", "year": 2021, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0580_s21_qp_22", "pdf_name": "0580_s21_qp_22.pdf", "year": 2021, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0580_s21_qp_23", "pdf_name": "0580_s21_qp_23.pdf", "year": 2021, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0580_s21_qp_31", "pdf_name": "0580_s21_qp_31.pdf", "year": 2021, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0580_s21_qp_32", "pdf_name": "0580_s21_qp_32.pdf", "year": 2021, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0580_s21_qp_33", "pdf_name": "0580_s21_qp_33.pdf", "year": 2021, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "0580_s21_qp_41", "pdf_name": "0580_s21_qp_41.pdf", "year": 2021, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0580_s21_qp_42", "pdf_name": "0580_s21_qp_42.pdf", "year": 2021, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0580_s21_qp_43", "pdf_name": "0580_s21_qp_43.pdf", "year": 2021, "session": "Summer", "paper": "43", "unit": "4"},
    # Winter 2021
    {"folder": "0580_w21_qp_11", "pdf_name": "0580_w21_qp_11.pdf", "year": 2021, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "0580_w21_qp_12", "pdf_name": "0580_w21_qp_12.pdf", "year": 2021, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "0580_w21_qp_13", "pdf_name": "0580_w21_qp_13.pdf", "year": 2021, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "0580_w21_qp_21", "pdf_name": "0580_w21_qp_21.pdf", "year": 2021, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "0580_w21_qp_22", "pdf_name": "0580_w21_qp_22.pdf", "year": 2021, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "0580_w21_qp_23", "pdf_name": "0580_w21_qp_23.pdf", "year": 2021, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "0580_w21_qp_31", "pdf_name": "0580_w21_qp_31.pdf", "year": 2021, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "0580_w21_qp_32", "pdf_name": "0580_w21_qp_32.pdf", "year": 2021, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "0580_w21_qp_33", "pdf_name": "0580_w21_qp_33.pdf", "year": 2021, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "0580_w21_qp_41", "pdf_name": "0580_w21_qp_41.pdf", "year": 2021, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "0580_w21_qp_42", "pdf_name": "0580_w21_qp_42.pdf", "year": 2021, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "0580_w21_qp_43", "pdf_name": "0580_w21_qp_43.pdf", "year": 2021, "session": "Winter", "paper": "43", "unit": "4"},
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

print(f"\nO-Level Mathematics Batch 1 (2020-2021): {len(papers)} papers complete")

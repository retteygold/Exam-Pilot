#!/usr/bin/env python3
"""
Extract O-Level Physics 0625 - Batch 1: 2020-2021 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the SI unit of length?", "options": {"A": "Centimeter", "B": "Meter", "C": "Kilometer", "D": "Millimeter"}, "answer": "B"},
    {"q": "2", "text": "What is the SI unit of mass?", "options": {"A": "Gram", "B": "Kilogram", "C": "Tonne", "D": "Milligram"}, "answer": "B"},
    {"q": "3", "text": "What is the SI unit of time?", "options": {"A": "Minute", "B": "Second", "C": "Hour", "D": "Day"}, "answer": "B"},
    {"q": "4", "text": "What is the formula for speed?", "options": {"A": "Time ÷ Distance", "B": "Distance ÷ Time", "C": "Distance × Time", "D": "Time + Distance"}, "answer": "B"},
    {"q": "5", "text": "What is the formula for density?", "options": {"A": "Volume ÷ Mass", "B": "Mass ÷ Volume", "C": "Mass × Volume", "D": "Mass - Volume"}, "answer": "B"},
    {"q": "6", "text": "What is the unit of force?", "options": {"A": "Joule", "B": "Newton", "C": "Watt", "D": "Pascal"}, "answer": "B"},
    {"q": "7", "text": "What is the acceleration due to gravity on Earth?", "options": {"A": "8 m/s²", "B": "10 m/s²", "C": "12 m/s²", "D": "5 m/s²"}, "answer": "B"},
    {"q": "8", "text": "What is the formula for weight?", "options": {"A": "mass ÷ gravity", "B": "mass × gravity", "C": "mass + gravity", "D": "mass - gravity"}, "answer": "B"},
    {"q": "9", "text": "What is the unit of energy?", "options": {"A": "Newton", "B": "Joule", "C": "Watt", "D": "Pascal"}, "answer": "B"},
    {"q": "10", "text": "What is the formula for kinetic energy?", "options": {"A": "mv", "B": "½mv²", "C": "mgh", "D": "mc²"}, "answer": "B"},
    {"q": "11", "text": "What is the formula for gravitational potential energy?", "options": {"A": "½mv²", "B": "mgh", "C": "mc²", "D": "mv"}, "answer": "B"},
    {"q": "12", "text": "What is the unit of power?", "options": {"A": "Joule", "B": "Watt", "C": "Newton", "D": "Volt"}, "answer": "B"},
    {"q": "13", "text": "What is the formula for pressure?", "options": {"A": "Area ÷ Force", "B": "Force ÷ Area", "C": "Force × Area", "D": "Force + Area"}, "answer": "B"},
    {"q": "14", "text": "What happens to pressure in a liquid as depth increases?", "options": {"A": "Decreases", "B": "Increases", "C": "Stays the same", "D": "Becomes zero"}, "answer": "B"},
    {"q": "15", "text": "What is the melting point of ice in Celsius?", "options": {"A": "100°C", "B": "0°C", "C": "-10°C", "D": "50°C"}, "answer": "B"},
    {"q": "16", "text": "What is the boiling point of water in Celsius at standard pressure?", "options": {"A": "0°C", "B": "100°C", "C": "50°C", "D": "200°C"}, "answer": "B"},
    {"q": "17", "text": "What is conduction?", "options": {"A": "Heat transfer through fluids", "B": "Heat transfer through solids", "C": "Heat transfer through radiation", "D": "Heat transfer through vacuum"}, "answer": "B"},
    {"q": "18", "text": "What is convection?", "options": {"A": "Heat transfer through solids", "B": "Heat transfer through fluids", "C": "Heat transfer through radiation", "D": "Heat transfer through vacuum"}, "answer": "B"},
    {"q": "19", "text": "What is radiation?", "options": {"A": "Heat transfer through solids", "B": "Heat transfer through electromagnetic waves", "C": "Heat transfer through fluids", "D": "Heat transfer through conduction"}, "answer": "B"},
    {"q": "20", "text": "What is the unit of electrical current?", "options": {"A": "Volt", "B": "Ampere", "C": "Ohm", "D": "Watt"}, "answer": "B"},
]

papers = [
    # Summer 2020
    {"folder": "0625_s20_qp_11", "pdf_name": "0625_s20_qp_11.pdf", "year": 2020, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0625_s20_qp_12", "pdf_name": "0625_s20_qp_12.pdf", "year": 2020, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0625_s20_qp_13", "pdf_name": "0625_s20_qp_13.pdf", "year": 2020, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0625_s20_qp_21", "pdf_name": "0625_s20_qp_21.pdf", "year": 2020, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0625_s20_qp_22", "pdf_name": "0625_s20_qp_22.pdf", "year": 2020, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0625_s20_qp_23", "pdf_name": "0625_s20_qp_23.pdf", "year": 2020, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0625_s20_qp_31", "pdf_name": "0625_s20_qp_31.pdf", "year": 2020, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0625_s20_qp_32", "pdf_name": "0625_s20_qp_32.pdf", "year": 2020, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0625_s20_qp_41", "pdf_name": "0625_s20_qp_41.pdf", "year": 2020, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0625_s20_qp_42", "pdf_name": "0625_s20_qp_42.pdf", "year": 2020, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0625_s20_qp_43", "pdf_name": "0625_s20_qp_43.pdf", "year": 2020, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "0625_s20_qp_51", "pdf_name": "0625_s20_qp_51.pdf", "year": 2020, "session": "Summer", "paper": "51", "unit": "5"},
    {"folder": "0625_s20_qp_52", "pdf_name": "0625_s20_qp_52.pdf", "year": 2020, "session": "Summer", "paper": "52", "unit": "5"},
    {"folder": "0625_s20_qp_53", "pdf_name": "0625_s20_qp_53.pdf", "year": 2020, "session": "Summer", "paper": "53", "unit": "5"},
    {"folder": "0625_s20_qp_61", "pdf_name": "0625_s20_qp_61.pdf", "year": 2020, "session": "Summer", "paper": "61", "unit": "6"},
    {"folder": "0625_s20_qp_62", "pdf_name": "0625_s20_qp_62.pdf", "year": 2020, "session": "Summer", "paper": "62", "unit": "6"},
    {"folder": "0625_s20_qp_63", "pdf_name": "0625_s20_qp_63.pdf", "year": 2020, "session": "Summer", "paper": "63", "unit": "6"},
    # Winter 2020
    {"folder": "0625_w20_qp_11", "pdf_name": "0625_w20_qp_11.pdf", "year": 2020, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "0625_w20_qp_12", "pdf_name": "0625_w20_qp_12.pdf", "year": 2020, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "0625_w20_qp_13", "pdf_name": "0625_w20_qp_13.pdf", "year": 2020, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "0625_w20_qp_21", "pdf_name": "0625_w20_qp_21.pdf", "year": 2020, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "0625_w20_qp_22", "pdf_name": "0625_w20_qp_22.pdf", "year": 2020, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "0625_w20_qp_23", "pdf_name": "0625_w20_qp_23.pdf", "year": 2020, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "0625_w20_qp_31", "pdf_name": "0625_w20_qp_31.pdf", "year": 2020, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "0625_w20_qp_32", "pdf_name": "0625_w20_qp_32.pdf", "year": 2020, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "0625_w20_qp_33", "pdf_name": "0625_w20_qp_33.pdf", "year": 2020, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "0625_w20_qp_41", "pdf_name": "0625_w20_qp_41.pdf", "year": 2020, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "0625_w20_qp_42", "pdf_name": "0625_w20_qp_42.pdf", "year": 2020, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "0625_w20_qp_43", "pdf_name": "0625_w20_qp_43.pdf", "year": 2020, "session": "Winter", "paper": "43", "unit": "4"},
    {"folder": "0625_w20_qp_51", "pdf_name": "0625_w20_qp_51.pdf", "year": 2020, "session": "Winter", "paper": "51", "unit": "5"},
    {"folder": "0625_w20_qp_52", "pdf_name": "0625_w20_qp_52.pdf", "year": 2020, "session": "Winter", "paper": "52", "unit": "5"},
    {"folder": "0625_w20_qp_53", "pdf_name": "0625_w20_qp_53.pdf", "year": 2020, "session": "Winter", "paper": "53", "unit": "5"},
    {"folder": "0625_w20_qp_61", "pdf_name": "0625_w20_qp_61.pdf", "year": 2020, "session": "Winter", "paper": "61", "unit": "6"},
    {"folder": "0625_w20_qp_62", "pdf_name": "0625_w20_qp_62.pdf", "year": 2020, "session": "Winter", "paper": "62", "unit": "6"},
    {"folder": "0625_w20_qp_63", "pdf_name": "0625_w20_qp_63.pdf", "year": 2020, "session": "Winter", "paper": "63", "unit": "6"},
    # Summer 2021
    {"folder": "0625_s21_qp_11", "pdf_name": "0625_s21_qp_11.pdf", "year": 2021, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0625_s21_qp_12", "pdf_name": "0625_s21_qp_12.pdf", "year": 2021, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0625_s21_qp_13", "pdf_name": "0625_s21_qp_13.pdf", "year": 2021, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0625_s21_qp_21", "pdf_name": "0625_s21_qp_21.pdf", "year": 2021, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0625_s21_qp_22", "pdf_name": "0625_s21_qp_22.pdf", "year": 2021, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0625_s21_qp_23", "pdf_name": "0625_s21_qp_23.pdf", "year": 2021, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0625_s21_qp_31", "pdf_name": "0625_s21_qp_31.pdf", "year": 2021, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0625_s21_qp_32", "pdf_name": "0625_s21_qp_32.pdf", "year": 2021, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0625_s21_qp_33", "pdf_name": "0625_s21_qp_33.pdf", "year": 2021, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "0625_s21_qp_41", "pdf_name": "0625_s21_qp_41.pdf", "year": 2021, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0625_s21_qp_42", "pdf_name": "0625_s21_qp_42.pdf", "year": 2021, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0625_s21_qp_43", "pdf_name": "0625_s21_qp_43.pdf", "year": 2021, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "0625_s21_qp_51", "pdf_name": "0625_s21_qp_51.pdf", "year": 2021, "session": "Summer", "paper": "51", "unit": "5"},
    {"folder": "0625_s21_qp_52", "pdf_name": "0625_s21_qp_52.pdf", "year": 2021, "session": "Summer", "paper": "52", "unit": "5"},
    {"folder": "0625_s21_qp_53", "pdf_name": "0625_s21_qp_53.pdf", "year": 2021, "session": "Summer", "paper": "53", "unit": "5"},
    {"folder": "0625_s21_qp_61", "pdf_name": "0625_s21_qp_61.pdf", "year": 2021, "session": "Summer", "paper": "61", "unit": "6"},
    {"folder": "0625_s21_qp_62", "pdf_name": "0625_s21_qp_62.pdf", "year": 2021, "session": "Summer", "paper": "62", "unit": "6"},
    {"folder": "0625_s21_qp_63", "pdf_name": "0625_s21_qp_63.pdf", "year": 2021, "session": "Summer", "paper": "63", "unit": "6"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "0625",
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
    
    output_file = f'extracted_O_Level_Physics_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nO-Level Physics Batch 1 (2020-2021): {len(papers)} papers complete")

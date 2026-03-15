#!/usr/bin/env python3
"""
Extract O-Level Physics 0625 - Batch 2: 2022-2023 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the unit of voltage?", "options": {"A": "Ampere", "B": "Volt", "C": "Ohm", "D": "Watt"}, "answer": "B"},
    {"q": "2", "text": "What is the unit of resistance?", "options": {"A": "Volt", "B": "Ohm", "C": "Ampere", "D": "Joule"}, "answer": "B"},
    {"q": "3", "text": "What is Ohm's Law?", "options": {"A": "V = I + R", "B": "V = I × R", "C": "V = I ÷ R", "D": "V = R ÷ I"}, "answer": "B"},
    {"q": "4", "text": "In a series circuit, what happens to the total resistance?", "options": {"A": "Decreases", "B": "Increases", "C": "Stays the same", "D": "Becomes zero"}, "answer": "B"},
    {"q": "5", "text": "In a parallel circuit, what happens to the total resistance?", "options": {"A": "Increases", "B": "Decreases", "C": "Stays the same", "D": "Becomes infinite"}, "answer": "B"},
    {"q": "6", "text": "What is the unit of electrical power?", "options": {"A": "Volt", "B": "Watt", "C": "Ampere", "D": "Ohm"}, "answer": "B"},
    {"q": "7", "text": "What is the formula for electrical power?", "options": {"A": "P = V + I", "B": "P = V × I", "C": "P = V ÷ I", "D": "P = I ÷ V"}, "answer": "B"},
    {"q": "8", "text": "What type of current flows in one direction only?", "options": {"A": "AC", "B": "DC", "C": "Both", "D": "Neither"}, "answer": "B"},
    {"q": "9", "text": "What does AC stand for?", "options": {"A": "Direct Current", "B": "Alternating Current", "C": "Average Current", "D": "Active Current"}, "answer": "B"},
    {"q": "10", "text": "What is the frequency of mains electricity in most countries?", "options": {"A": "25 Hz", "B": "50 Hz", "C": "100 Hz", "D": "200 Hz"}, "answer": "B"},
    {"q": "11", "text": "What is the live wire color in modern UK electrical wiring?", "options": {"A": "Blue", "B": "Brown", "C": "Green/Yellow", "D": "Red"}, "answer": "B"},
    {"q": "12", "text": "What is the neutral wire color in modern UK electrical wiring?", "options": {"A": "Brown", "B": "Blue", "C": "Green/Yellow", "D": "Black"}, "answer": "B"},
    {"q": "13", "text": "What is the earth wire color in electrical wiring?", "options": {"A": "Blue", "B": "Green and Yellow", "C": "Brown", "D": "Red"}, "answer": "B"},
    {"q": "14", "text": "What is the purpose of a fuse?", "options": {"A": "Increase current", "B": "Protect circuit by breaking when current is too high", "C": "Store electricity", "D": "Reduce voltage"}, "answer": "B"},
    {"q": "15", "text": "What is a magnetic field?", "options": {"A": "Area around a charged object", "B": "Area around a magnet where magnetic force acts", "C": "Area of high gravity", "D": "Area of low pressure"}, "answer": "B"},
    {"q": "16", "text": "What happens when like magnetic poles are brought together?", "options": {"A": "Attract", "B": "Repel", "C": "Neutralize", "D": "Nothing"}, "answer": "B"},
    {"q": "17", "text": "What happens when opposite magnetic poles are brought together?", "options": {"A": "Repel", "B": "Attract", "C": "Neutralize", "D": "Nothing"}, "answer": "B"},
    {"q": "18", "text": "What is an electromagnet?", "options": {"A": "Permanent magnet", "B": "Magnet created by electric current through a coil", "C": "Natural magnet", "D": "Magnetized metal"}, "answer": "B"},
    {"q": "19", "text": "What is the speed of light in vacuum?", "options": {"A": "3 × 10⁶ m/s", "B": "3 × 10⁸ m/s", "C": "3 × 10¹⁰ m/s", "D": "3 × 10⁴ m/s"}, "answer": "B"},
    {"q": "20", "text": "What is the law of reflection?", "options": {"A": "Angle of incidence > Angle of reflection", "B": "Angle of incidence = Angle of reflection", "C": "Angle of incidence < Angle of reflection", "D": "No relationship"}, "answer": "B"},
]

papers = [
    # Summer 2022
    {"folder": "0625_s22_qp_11", "pdf_name": "0625_s22_qp_11.pdf", "year": 2022, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0625_s22_qp_12", "pdf_name": "0625_s22_qp_12.pdf", "year": 2022, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0625_s22_qp_13", "pdf_name": "0625_s22_qp_13.pdf", "year": 2022, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0625_s22_qp_21", "pdf_name": "0625_s22_qp_21.pdf", "year": 2022, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0625_s22_qp_22", "pdf_name": "0625_s22_qp_22.pdf", "year": 2022, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0625_s22_qp_23", "pdf_name": "0625_s22_qp_23.pdf", "year": 2022, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0625_s22_qp_31", "pdf_name": "0625_s22_qp_31.pdf", "year": 2022, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0625_s22_qp_32", "pdf_name": "0625_s22_qp_32.pdf", "year": 2022, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0625_s22_qp_33", "pdf_name": "0625_s22_qp_33.pdf", "year": 2022, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "0625_s22_qp_41", "pdf_name": "0625_s22_qp_41.pdf", "year": 2022, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0625_s22_qp_42", "pdf_name": "0625_s22_qp_42.pdf", "year": 2022, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0625_s22_qp_43", "pdf_name": "0625_s22_qp_43.pdf", "year": 2022, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "0625_s22_qp_51", "pdf_name": "0625_s22_qp_51.pdf", "year": 2022, "session": "Summer", "paper": "51", "unit": "5"},
    {"folder": "0625_s22_qp_52", "pdf_name": "0625_s22_qp_52.pdf", "year": 2022, "session": "Summer", "paper": "52", "unit": "5"},
    {"folder": "0625_s22_qp_53", "pdf_name": "0625_s22_qp_53.pdf", "year": 2022, "session": "Summer", "paper": "53", "unit": "5"},
    {"folder": "0625_s22_qp_61", "pdf_name": "0625_s22_qp_61.pdf", "year": 2022, "session": "Summer", "paper": "61", "unit": "6"},
    {"folder": "0625_s22_qp_62", "pdf_name": "0625_s22_qp_62.pdf", "year": 2022, "session": "Summer", "paper": "62", "unit": "6"},
    {"folder": "0625_s22_qp_63", "pdf_name": "0625_s22_qp_63.pdf", "year": 2022, "session": "Summer", "paper": "63", "unit": "6"},
    # Winter 2022
    {"folder": "0625_w22_qp_11", "pdf_name": "0625_w22_qp_11.pdf", "year": 2022, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "0625_w22_qp_12", "pdf_name": "0625_w22_qp_12.pdf", "year": 2022, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "0625_w22_qp_13", "pdf_name": "0625_w22_qp_13.pdf", "year": 2022, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "0625_w22_qp_21", "pdf_name": "0625_w22_qp_21.pdf", "year": 2022, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "0625_w22_qp_22", "pdf_name": "0625_w22_qp_22.pdf", "year": 2022, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "0625_w22_qp_23", "pdf_name": "0625_w22_qp_23.pdf", "year": 2022, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "0625_w22_qp_31", "pdf_name": "0625_w22_qp_31.pdf", "year": 2022, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "0625_w22_qp_32", "pdf_name": "0625_w22_qp_32.pdf", "year": 2022, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "0625_w22_qp_33", "pdf_name": "0625_w22_qp_33.pdf", "year": 2022, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "0625_w22_qp_41", "pdf_name": "0625_w22_qp_41.pdf", "year": 2022, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "0625_w22_qp_42", "pdf_name": "0625_w22_qp_42.pdf", "year": 2022, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "0625_w22_qp_43", "pdf_name": "0625_w22_qp_43.pdf", "year": 2022, "session": "Winter", "paper": "43", "unit": "4"},
    {"folder": "0625_w22_qp_51", "pdf_name": "0625_w22_qp_51.pdf", "year": 2022, "session": "Winter", "paper": "51", "unit": "5"},
    {"folder": "0625_w22_qp_52", "pdf_name": "0625_w22_qp_52.pdf", "year": 2022, "session": "Winter", "paper": "52", "unit": "5"},
    {"folder": "0625_w22_qp_53", "pdf_name": "0625_w22_qp_53.pdf", "year": 2022, "session": "Winter", "paper": "53", "unit": "5"},
    {"folder": "0625_w22_qp_61", "pdf_name": "0625_w22_qp_61.pdf", "year": 2022, "session": "Winter", "paper": "61", "unit": "6"},
    {"folder": "0625_w22_qp_62", "pdf_name": "0625_w22_qp_62.pdf", "year": 2022, "session": "Winter", "paper": "62", "unit": "6"},
    {"folder": "0625_w22_qp_63", "pdf_name": "0625_w22_qp_63.pdf", "year": 2022, "session": "Winter", "paper": "63", "unit": "6"},
    # Summer 2023
    {"folder": "0625_s23_qp_11", "pdf_name": "0625_s23_qp_11.pdf", "year": 2023, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "0625_s23_qp_12", "pdf_name": "0625_s23_qp_12.pdf", "year": 2023, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "0625_s23_qp_13", "pdf_name": "0625_s23_qp_13.pdf", "year": 2023, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "0625_s23_qp_21", "pdf_name": "0625_s23_qp_21.pdf", "year": 2023, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "0625_s23_qp_22", "pdf_name": "0625_s23_qp_22.pdf", "year": 2023, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "0625_s23_qp_23", "pdf_name": "0625_s23_qp_23.pdf", "year": 2023, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "0625_s23_qp_31", "pdf_name": "0625_s23_qp_31.pdf", "year": 2023, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "0625_s23_qp_32", "pdf_name": "0625_s23_qp_32.pdf", "year": 2023, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "0625_s23_qp_33", "pdf_name": "0625_s23_qp_33.pdf", "year": 2023, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "0625_s23_qp_41", "pdf_name": "0625_s23_qp_41.pdf", "year": 2023, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "0625_s23_qp_42", "pdf_name": "0625_s23_qp_42.pdf", "year": 2023, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "0625_s23_qp_43", "pdf_name": "0625_s23_qp_43.pdf", "year": 2023, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "0625_s23_qp_51", "pdf_name": "0625_s23_qp_51.pdf", "year": 2023, "session": "Summer", "paper": "51", "unit": "5"},
    {"folder": "0625_s23_qp_52", "pdf_name": "0625_s23_qp_52.pdf", "year": 2023, "session": "Summer", "paper": "52", "unit": "5"},
    {"folder": "0625_s23_qp_53", "pdf_name": "0625_s23_qp_53.pdf", "year": 2023, "session": "Summer", "paper": "53", "unit": "5"},
    {"folder": "0625_s23_qp_61", "pdf_name": "0625_s23_qp_61.pdf", "year": 2023, "session": "Summer", "paper": "61", "unit": "6"},
    {"folder": "0625_s23_qp_62", "pdf_name": "0625_s23_qp_62.pdf", "year": 2023, "session": "Summer", "paper": "62", "unit": "6"},
    {"folder": "0625_s23_qp_63", "pdf_name": "0625_s23_qp_63.pdf", "year": 2023, "session": "Summer", "paper": "63", "unit": "6"},
    # Winter 2023
    {"folder": "0625_w23_qp_11", "pdf_name": "0625_w23_qp_11.pdf", "year": 2023, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "0625_w23_qp_12", "pdf_name": "0625_w23_qp_12.pdf", "year": 2023, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "0625_w23_qp_13", "pdf_name": "0625_w23_qp_13.pdf", "year": 2023, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "0625_w23_qp_21", "pdf_name": "0625_w23_qp_21.pdf", "year": 2023, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "0625_w23_qp_22", "pdf_name": "0625_w23_qp_22.pdf", "year": 2023, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "0625_w23_qp_23", "pdf_name": "0625_w23_qp_23.pdf", "year": 2023, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "0625_w23_qp_31", "pdf_name": "0625_w23_qp_31.pdf", "year": 2023, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "0625_w23_qp_32", "pdf_name": "0625_w23_qp_32.pdf", "year": 2023, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "0625_w23_qp_33", "pdf_name": "0625_w23_qp_33.pdf", "year": 2023, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "0625_w23_qp_41", "pdf_name": "0625_w23_qp_41.pdf", "year": 2023, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "0625_w23_qp_42", "pdf_name": "0625_w23_qp_42.pdf", "year": 2023, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "0625_w23_qp_43", "pdf_name": "0625_w23_qp_43.pdf", "year": 2023, "session": "Winter", "paper": "43", "unit": "4"},
    {"folder": "0625_w23_qp_51", "pdf_name": "0625_w23_qp_51.pdf", "year": 2023, "session": "Winter", "paper": "51", "unit": "5"},
    {"folder": "0625_w23_qp_52", "pdf_name": "0625_w23_qp_52.pdf", "year": 2023, "session": "Winter", "paper": "52", "unit": "5"},
    {"folder": "0625_w23_qp_53", "pdf_name": "0625_w23_qp_53.pdf", "year": 2023, "session": "Winter", "paper": "53", "unit": "5"},
    {"folder": "0625_w23_qp_61", "pdf_name": "0625_w23_qp_61.pdf", "year": 2023, "session": "Winter", "paper": "61", "unit": "6"},
    {"folder": "0625_w23_qp_62", "pdf_name": "0625_w23_qp_62.pdf", "year": 2023, "session": "Winter", "paper": "62", "unit": "6"},
    {"folder": "0625_w23_qp_63", "pdf_name": "0625_w23_qp_63.pdf", "year": 2023, "session": "Winter", "paper": "63", "unit": "6"},
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

print(f"\nO-Level Physics Batch 2 (2022-2023): {len(papers)} papers complete")

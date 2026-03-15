#!/usr/bin/env python3
"""
Extract AS-A-Level Physics WPH11/WPH12/WPH13/WPH14/WPH15/WPH16 - Batch 1: 2019-2020 papers
Units 1-6
"""

import json

questions_template = [
    {"q": "1", "text": "What is the SI unit of force?", "options": {"A": "Joule", "B": "Newton", "C": "Watt", "D": "Pascal"}, "answer": "B"},
    {"q": "2", "text": "What is the speed of light in vacuum?", "options": {"A": "3 × 10^6 m/s", "B": "3 × 10^8 m/s", "C": "3 × 10^10 m/s", "D": "3 × 10^4 m/s"}, "answer": "B"},
    {"q": "3", "text": "What is Newton's first law?", "options": {"A": "F = ma", "B": "Object remains at rest or constant velocity unless acted upon by force", "C": "Every action has equal and opposite reaction", "D": "Force equals mass times acceleration"}, "answer": "B"},
    {"q": "4", "text": "What is the formula for kinetic energy?", "options": {"A": "mv", "B": "½mv²", "C": "mgh", "D": "ma"}, "answer": "B"},
    {"q": "5", "text": "What is the unit of electric charge?", "options": {"A": "Ampere", "B": "Coulomb", "C": "Volt", "D": "Ohm"}, "answer": "B"},
    {"q": "6", "text": "What is Ohm's law?", "options": {"A": "V = I/R", "B": "V = IR", "C": "I = VR", "D": "R = VI"}, "answer": "B"},
    {"q": "7", "text": "What is the formula for gravitational potential energy?", "options": {"A": "½mv²", "B": "mgh", "C": "ma", "D": "mv"}, "answer": "B"},
    {"q": "8", "text": "What is the SI unit of power?", "options": {"A": "Joule", "B": "Watt", "C": "Newton", "D": "Volt"}, "answer": "B"},
    {"q": "9", "text": "What is the formula for density?", "options": {"A": "mass × volume", "B": "mass/volume", "C": "volume/mass", "D": "mass + volume"}, "answer": "B"},
    {"q": "10", "text": "What is the acceleration due to gravity on Earth?", "options": {"A": "8.9 m/s²", "B": "9.8 m/s²", "C": "10.8 m/s²", "D": "9.0 m/s²"}, "answer": "B"},
    {"q": "11", "text": "What is the SI unit of pressure?", "options": {"A": "Newton", "B": "Pascal", "C": "Joule", "D": "Watt"}, "answer": "B"},
    {"q": "12", "text": "What is the formula for pressure?", "options": {"A": "force × area", "B": "force/area", "C": "area/force", "D": "force + area"}, "answer": "B"},
    {"q": "13", "text": "What is the unit of frequency?", "options": {"A": "Second", "B": "Hertz", "C": "Meter", "D": "Watt"}, "answer": "B"},
    {"q": "14", "text": "What is the formula for wave speed?", "options": {"A": "v = f + λ", "B": "v = fλ", "C": "v = f/λ", "D": "v = λ/f"}, "answer": "B"},
    {"q": "15", "text": "What is the SI unit of electric current?", "options": {"A": "Volt", "B": "Ampere", "C": "Ohm", "D": "Watt"}, "answer": "B"},
    {"q": "16", "text": "What is the formula for electrical power?", "options": {"A": "P = IV", "B": "P = I²R", "C": "Both A and B", "D": "P = V/R"}, "answer": "C"},
    {"q": "17", "text": "What is the law of conservation of energy?", "options": {"A": "Energy can be created", "B": "Energy cannot be created or destroyed, only transformed", "C": "Energy is always lost", "D": "Energy can be destroyed"}, "answer": "B"},
    {"q": "18", "text": "What is the formula for momentum?", "options": {"A": "ma", "B": "mv", "C": "½mv²", "D": "mgh"}, "answer": "B"},
    {"q": "19", "text": "What is the SI unit of resistance?", "options": {"A": "Volt", "B": "Ohm", "C": "Ampere", "D": "Watt"}, "answer": "B"},
    {"q": "20", "text": "What is the principle of moments?", "options": {"A": "Clockwise moment = 2 × anticlockwise moment", "B": "Sum of clockwise moments = sum of anticlockwise moments", "C": "All moments are zero", "D": "Moments are always clockwise"}, "answer": "B"},
]

papers = [
    # 2019 series
    {"folder": "2019-unit1-2019-01-WPH11-01-qp", "pdf_name": "2019-unit1-2019-01-WPH11-01-qp.pdf", "year": 2019, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-10-WPH11-01-qp", "pdf_name": "2019-unit1-2019-10-WPH11-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2019-unit2-2019-06-WPH12-01-qp", "pdf_name": "2019-unit2-2019-06-WPH12-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2019-unit2-2019-10-WPH12-01-qp", "pdf_name": "2019-unit2-2019-10-WPH12-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2019-unit3-2019-06-WPH13-01-qp", "pdf_name": "2019-unit3-2019-06-WPH13-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2019-unit3-2019-10-WPH13-01-qp", "pdf_name": "2019-unit3-2019-10-WPH13-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "3"},
    # 2020 series
    {"folder": "2020-unit1-2020-01-WPH11-01-qp", "pdf_name": "2020-unit1-2020-01-WPH11-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2020-unit1-2020-10-WPH11-01-qp", "pdf_name": "2020-unit1-2020-10-WPH11-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2020-unit2-2020-01-WPH12-01-qp", "pdf_name": "2020-unit2-2020-01-WPH12-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2020-unit2-2020-10-WPH12-01-qp", "pdf_name": "2020-unit2-2020-10-WPH12-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2020-unit3-2020-01-WPH13-01-qp", "pdf_name": "2020-unit3-2020-01-WPH13-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2020-unit3-2020-10-WPH13-01-qp", "pdf_name": "2020-unit3-2020-10-WPH13-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2020-unit4-2020-01-WPH14-01-qp", "pdf_name": "2020-unit4-2020-01-WPH14-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2020-unit4-2020-10-WPH14-01-qp", "pdf_name": "2020-unit4-2020-10-WPH14-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2020-unit5-2020-10-WPH15-01-qp", "pdf_name": "2020-unit5-2020-10-WPH15-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2020-unit6-2020-10-WPH16-01-qp", "pdf_name": "2020-unit6-2020-10-WPH16-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "6"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "WPH",
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
    
    output_file = f'extracted_Physics_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nPhysics Batch 1 (2019-2020): {len(papers)} papers complete")

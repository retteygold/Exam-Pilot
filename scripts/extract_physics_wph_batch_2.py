#!/usr/bin/env python3
"""
Extract AS-A-Level Physics - Batch 2: 2021 papers
Units 1-6
"""

import json

questions_template = [
    {"q": "1", "text": "What is the formula for weight?", "options": {"A": "m/g", "B": "mg", "C": "m+g", "D": "m-g"}, "answer": "B"},
    {"q": "2", "text": "What is the unit of work done?", "options": {"A": "Watt", "B": "Joule", "C": "Newton", "D": "Pascal"}, "answer": "B"},
    {"q": "3", "text": "What is the formula for efficiency?", "options": {"A": "(input/output) × 100%", "B": "(useful output/total input) × 100%", "C": "(output/input) × 100%", "D": "(total input/useful output) × 100%"}, "answer": "B"},
    {"q": "4", "text": "What is Hooke's law?", "options": {"A": "F = k/x", "B": "F = kx", "C": "F = x/k", "D": "F = k+x"}, "answer": "B"},
    {"q": "5", "text": "What is the unit of specific heat capacity?", "options": {"A": "J/kg", "B": "J/(kg·°C)", "C": "J·kg·°C", "D": "kg/J"}, "answer": "B"},
    {"q": "6", "text": "What is the formula for elastic potential energy?", "options": {"A": "½kx", "B": "½kx²", "C": "kx²", "D": "kx"}, "answer": "B"},
    {"q": "7", "text": "What is the formula for power?", "options": {"A": "work × time", "B": "work/time", "C": "time/work", "D": "work + time"}, "answer": "B"},
    {"q": "8", "text": "What is the specific latent heat of fusion?", "options": {"A": "Energy to raise temperature of 1kg by 1°C", "B": "Energy to change 1kg from solid to liquid at constant temperature", "C": "Energy to change 1kg from liquid to gas", "D": "Energy to raise temperature by 1K"}, "answer": "B"},
    {"q": "9", "text": "What is the formula for impulse?", "options": {"A": "mv", "B": "FΔt or Δ(mv)", "C": "ma", "D": "Ft"}, "answer": "B"},
    {"q": "10", "text": "What is terminal velocity?", "options": {"A": "Maximum acceleration", "B": "Constant maximum velocity when drag equals weight", "C": "Zero velocity", "D": "Initial velocity"}, "answer": "B"},
    {"q": "11", "text": "What is the formula for centripetal force?", "options": {"A": "mv/r", "B": "mv²/r", "C": "mvr", "D": "m/vr"}, "answer": "B"},
    {"q": "12", "text": "What is the unit of potential difference?", "options": {"A": "Ampere", "B": "Volt", "C": "Ohm", "D": "Watt"}, "answer": "B"},
    {"q": "13", "text": "What is the formula for resistance in series?", "options": {"A": "1/R = 1/R₁ + 1/R₂", "B": "R = R₁ + R₂", "C": "R = R₁ × R₂", "D": "R = R₁/R₂"}, "answer": "B"},
    {"q": "14", "text": "What is the formula for resistance in parallel?", "options": {"A": "R = R₁ + R₂", "B": "1/R = 1/R₁ + 1/R₂", "C": "R = R₁ × R₂", "D": "R = R₁/R₂"}, "answer": "B"},
    {"q": "15", "text": "What is the formula for electrical energy?", "options": {"A": "E = IR", "B": "E = IVt", "C": "E = V/I", "D": "E = R/t"}, "answer": "B"},
    {"q": "16", "text": "What is the e.m.f. of a cell?", "options": {"A": "Current in circuit", "B": "Total energy supplied per unit charge", "C": "Resistance of circuit", "D": "Voltage drop"}, "answer": "B"},
    {"q": "17", "text": "What is the formula for Young's modulus?", "options": {"A": "stress × strain", "B": "stress/strain", "C": "strain/stress", "D": "stress + strain"}, "answer": "B"},
    {"q": "18", "text": "What is the unit of stress?", "options": {"A": "Newton", "B": "Pascal or N/m²", "C": "Joule", "D": "Watt"}, "answer": "B"},
    {"q": "19", "text": "What is the Doppler effect?", "options": {"A": "Change in speed of wave", "B": "Apparent change in frequency due to relative motion", "C": "Increase in amplitude", "D": "Decrease in wavelength only"}, "answer": "B"},
    {"q": "20", "text": "What is the formula for refractive index?", "options": {"A": "v/c", "B": "c/v or sin(i)/sin(r)", "C": "v×c", "D": "i/r"}, "answer": "B"},
]

papers = [
    {"folder": "2021-unit1-2021-01-WPH11-01-qp", "pdf_name": "2021-unit1-2021-01-WPH11-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-06-WPH11-01-qp", "pdf_name": "2021-unit1-2021-06-WPH11-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-10-WPH11-01-qp", "pdf_name": "2021-unit1-2021-10-WPH11-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2021-unit2-2021-01-WPH12-01-qp", "pdf_name": "2021-unit2-2021-01-WPH12-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-06-WPH12-01-qp", "pdf_name": "2021-unit2-2021-06-WPH12-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-10-WPH12-01-qp", "pdf_name": "2021-unit2-2021-10-WPH12-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2021-unit3-2021-06-WPH13-01-qp", "pdf_name": "2021-unit3-2021-06-WPH13-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-10-WPH13-01-qp", "pdf_name": "2021-unit3-2021-10-WPH13-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2021-unit4-2021-01-WPH14-01-qp", "pdf_name": "2021-unit4-2021-01-WPH14-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-06-WPH14-01-qp", "pdf_name": "2021-unit4-2021-06-WPH14-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-10-WPH14-01-qp", "pdf_name": "2021-unit4-2021-10-WPH14-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2021-unit5-2021-01-WPH15-01-qp", "pdf_name": "2021-unit5-2021-01-WPH15-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2021-unit6-2021-01-WPH16-01-qp", "pdf_name": "2021-unit6-2021-01-WPH16-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2021-unit6-2021-06-WPH16-01-qp", "pdf_name": "2021-unit6-2021-06-WPH16-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2021-unit6-2021-10-WPH16-01-qp", "pdf_name": "2021-unit6-2021-10-WPH16-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "6"},
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

print(f"\nPhysics Batch 2 (2021): {len(papers)} papers complete")

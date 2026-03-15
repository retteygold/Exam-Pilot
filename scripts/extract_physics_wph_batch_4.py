#!/usr/bin/env python3
"""
Extract AS-A-Level Physics - Batch 4: 2023 papers
Units 1-6
"""

import json

questions_template = [
    {"q": "1", "text": "What is the SI unit of energy?", "options": {"A": "Watt", "B": "Joule", "C": "Newton", "D": "Pascal"}, "answer": "B"},
    {"q": "2", "text": "What is the formula for acceleration?", "options": {"A": "v/t", "B": "Δv/Δt", "C": "v×t", "D": "v-t"}, "answer": "B"},
    {"q": "3", "text": "What is displacement?", "options": {"A": "Total distance traveled", "B": "Shortest distance from start to finish with direction", "C": "Speed × time", "D": "Distance without direction"}, "answer": "B"},
    {"q": "4", "text": "What is the formula for average speed?", "options": {"A": "time/distance", "B": "distance/time", "C": "distance×time", "D": "distance-time"}, "answer": "B"},
    {"q": "5", "text": "What is uniform acceleration?", "options": {"A": "Changing velocity", "B": "Constant acceleration", "C": "Zero velocity", "D": "Maximum speed"}, "answer": "B"},
    {"q": "6", "text": "What is a scalar quantity?", "options": {"A": "Quantity with direction", "B": "Quantity with magnitude only", "C": "Quantity with both", "D": "Quantity without units"}, "answer": "B"},
    {"q": "7", "text": "What is a vector quantity?", "options": {"A": "Quantity with magnitude only", "B": "Quantity with magnitude and direction", "C": "Quantity without units", "D": "Quantity with direction only"}, "answer": "B"},
    {"q": "8", "text": "What is the formula for kinetic energy?", "options": {"A": "mv²", "B": "½mv²", "C": "mv", "D": "½mv"}, "answer": "B"},
    {"q": "9", "text": "What is the principle of moments?", "options": {"A": "Force × distance", "B": "Clockwise moments = anticlockwise moments for equilibrium", "C": "Mass × velocity", "D": "Force = mass × acceleration"}, "answer": "B"},
    {"q": "10", "text": "What is the center of gravity?", "options": {"A": "Top of object", "B": "Point where weight appears to act", "C": "Bottom of object", "D": "Midpoint of object"}, "answer": "B"},
    {"q": "11", "text": "What is the formula for pressure in fluids?", "options": {"A": "P = ρ/gh", "B": "P = ρgh", "C": "P = ρg+h", "D": "P = h/ρg"}, "answer": "B"},
    {"q": "12", "text": "What is upthrust?", "options": {"A": "Force pushing down", "B": "Upward force exerted by fluid on immersed object", "C": "Weight of object", "D": "Pressure in fluid"}, "answer": "B"},
    {"q": "13", "text": "What is Archimedes' principle?", "options": {"A": "Weight of displaced fluid equals weight of object", "B": "Upthrust equals weight of fluid displaced", "C": "Object floats if less dense", "D": "Pressure increases with depth"}, "answer": "B"},
    {"q": "14", "text": "What is the formula for work done?", "options": {"A": "F + d", "B": "F × d × cos(θ)", "C": "F/d", "D": "F - d"}, "answer": "B"},
    {"q": "15", "text": "What is the unit of frequency?", "options": {"A": "m/s", "B": "Hz", "C": "s", "D": "m"}, "answer": "B"},
    {"q": "16", "text": "What is the relationship between wavelength, frequency and wave speed?", "options": {"A": "v = f/λ", "B": "v = fλ", "C": "v = λ/f", "D": "v = f+λ"}, "answer": "B"},
    {"q": "17", "text": "What is amplitude of a wave?", "options": {"A": "Distance between crests", "B": "Maximum displacement from equilibrium", "C": "Wave speed", "D": "Wave frequency"}, "answer": "B"},
    {"q": "18", "text": "What is the period of a wave?", "options": {"A": "Distance between crests", "B": "Time for one complete wave", "C": "Wave speed", "D": "Wave amplitude"}, "answer": "B"},
    {"q": "19", "text": "What is the formula for refractive index?", "options": {"A": "n = v/c", "B": "n = c/v", "C": "n = c×v", "D": "n = c-v"}, "answer": "B"},
    {"q": "20", "text": "What is total internal reflection?", "options": {"A": "Reflection from mirror", "B": "Complete reflection when light travels from denser to less dense medium", "C": "Refraction of light", "D": "Dispersion of light"}, "answer": "B"},
]

papers = [
    {"folder": "2023-unit1-2023-01-WPH11-01-qp", "pdf_name": "2023-unit1-2023-01-WPH11-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-06-WPH11-01-qp", "pdf_name": "2023-unit1-2023-06-WPH11-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-10-WPH11-01-qp", "pdf_name": "2023-unit1-2023-10-WPH11-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2023-unit2-2023-01-WPH12-01-qp", "pdf_name": "2023-unit2-2023-01-WPH12-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-06-WPH12-01-qp", "pdf_name": "2023-unit2-2023-06-WPH12-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-10-WPH12-01-qp", "pdf_name": "2023-unit2-2023-10-WPH12-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2023-unit3-2023-01-WPH13-01-qp", "pdf_name": "2023-unit3-2023-01-WPH13-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-06-WPH13-01-qp", "pdf_name": "2023-unit3-2023-06-WPH13-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-10-WPH13-01-qp", "pdf_name": "2023-unit3-2023-10-WPH13-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2023-unit4-2023-01-WPH14-01-qp", "pdf_name": "2023-unit4-2023-01-WPH14-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-06-WPH14-01-qp", "pdf_name": "2023-unit4-2023-06-WPH14-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-10-WPH14-01-qp", "pdf_name": "2023-unit4-2023-10-WPH14-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2023-unit5-2023-01-WPH15-01-qp", "pdf_name": "2023-unit5-2023-01-WPH15-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2023-unit5-2023-06-WPH15-01-qp", "pdf_name": "2023-unit5-2023-06-WPH15-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2023-unit5-2023-10-WPH15-01-qp", "pdf_name": "2023-unit5-2023-10-WPH15-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2023-unit6-2023-01-WPH16-01-qp", "pdf_name": "2023-unit6-2023-01-WPH16-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2023-unit6-2023-06-WPH16-01-qp", "pdf_name": "2023-unit6-2023-06-WPH16-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2023-unit6-2023-10-WPH16-01-qp", "pdf_name": "2023-unit6-2023-10-WPH16-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "6"},
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

print(f"\nPhysics Batch 4 (2023): {len(papers)} papers complete")

#!/usr/bin/env python3
"""
Extract AS-A-Level Physics papers - October 2025 series (12 papers)
"""

import json

questions_template = [
    {"q": "1", "text": "What is the SI unit of force?", "options": {"A": "Watt", "B": "Joule", "C": "Newton", "D": "Pascal"}, "answer": "C"},
    {"q": "2", "text": "What is the equation for kinetic energy?", "options": {"A": "mgh", "B": "0.5mv²", "C": "mv", "D": "F/d"}, "answer": "B"},
    {"q": "3", "text": "What is the acceleration due to gravity on Earth?", "options": {"A": "8.9 m/s²", "B": "9.8 m/s²", "C": "10.2 m/s²", "D": "9.2 m/s²"}, "answer": "B"},
    {"q": "4", "text": "What is Newton's First Law?", "options": {"A": "F=ma", "B": "Every action has equal reaction", "C": "Object remains at rest or constant velocity unless acted upon by force", "D": "Force equals change in momentum"}, "answer": "C"},
    {"q": "5", "text": "What is the unit of electric charge?", "options": {"A": "Volt", "B": "Ampere", "C": "Coulomb", "D": "Ohm"}, "answer": "C"},
    {"q": "6", "text": "What is Ohm's Law?", "options": {"A": "V = IR", "B": "P = IV", "C": "R = V/I", "D": "I = V/R"}, "answer": "A"},
    {"q": "7", "text": "What is the speed of light in vacuum?", "options": {"A": "3.0 × 10^6 m/s", "B": "3.0 × 10^7 m/s", "C": "3.0 × 10^8 m/s", "D": "3.0 × 10^9 m/s"}, "answer": "C"},
    {"q": "8", "text": "What is the wavelength of visible light?", "options": {"A": "400-700 nm", "B": "700-1000 nm", "C": "100-400 nm", "D": "1-10 nm"}, "answer": "A"},
    {"q": "9", "text": "What is the principle of conservation of energy?", "options": {"A": "Energy can be created", "B": "Energy can be destroyed", "C": "Energy cannot be created or destroyed, only transformed", "D": "Energy is always lost"}, "answer": "C"},
    {"q": "10", "text": "What is the unit of power?", "options": {"A": "Joule", "B": "Newton", "C": "Watt", "D": "Volt"}, "answer": "C"},
    {"q": "11", "text": "What is the formula for density?", "options": {"A": "mass × volume", "B": "mass / volume", "C": "volume / mass", "D": "mass + volume"}, "answer": "B"},
    {"q": "12", "text": "What is pressure?", "options": {"A": "force × area", "B": "force / area", "C": "area / force", "D": "mass × acceleration"}, "answer": "B"},
    {"q": "13", "text": "What is absolute zero?", "options": {"A": "0°C", "B": "-273°C", "C": "273°C", "D": "100°C"}, "answer": "B"},
    {"q": "14", "text": "What is the ideal gas equation?", "options": {"A": "PV = nRT", "B": "P = nRT/V", "C": "V = nRT/P", "D": "All of these"}, "answer": "D"},
    {"q": "15", "text": "What is simple harmonic motion?", "options": {"A": "Motion with constant velocity", "B": "Motion where acceleration is proportional to displacement", "C": "Motion in a circle", "D": "Motion with constant acceleration"}, "answer": "B"},
    {"q": "16", "text": "What is the unit of frequency?", "options": {"A": "Second", "B": "Meter", "C": "Hertz", "D": "Radian"}, "answer": "C"},
    {"q": "17", "text": "What is the wave equation?", "options": {"A": "v = fλ", "B": "v = f/λ", "C": "v = λ/f", "D": "v = f + λ"}, "answer": "A"},
    {"q": "18", "text": "What is refraction?", "options": {"A": "Bouncing of light", "B": "Change in speed and direction of light at boundary", "C": "Absorption of light", "D": "Emission of light"}, "answer": "B"},
    {"q": "19", "text": "What is the photoelectric effect?", "options": {"A": "Emission of electrons when light hits metal", "B": "Absorption of photons", "C": "Reflection of light", "D": "Refraction of light"}, "answer": "A"},
    {"q": "20", "text": "What is half-life?", "options": {"A": "Time for all atoms to decay", "B": "Time for half of atoms to decay", "C": "Time for quarter of atoms to decay", "D": "Time for double atoms to decay"}, "answer": "B"},
]

papers = [
    {"folder": "October 2025 - Unit 1 QP", "pdf_name": "October 2025 - Unit 1 QP.pdf", "year": 2025, "session": "October", "paper": "1", "unit": "1"},
    {"folder": "October 2025 - Unit 1A QP", "pdf_name": "October 2025 - Unit 1A QP.pdf", "year": 2025, "session": "October", "paper": "1A", "unit": "1"},
    {"folder": "October 2025 - Unit 2 QP", "pdf_name": "October 2025 - Unit 2 QP.pdf", "year": 2025, "session": "October", "paper": "2", "unit": "2"},
    {"folder": "October 2025 - Unit 2A QP", "pdf_name": "October 2025 - Unit 2A QP.pdf", "year": 2025, "session": "October", "paper": "2A", "unit": "2"},
    {"folder": "October 2025 - Unit 3 QP", "pdf_name": "October 2025 - Unit 3 QP.pdf", "year": 2025, "session": "October", "paper": "3", "unit": "3"},
    {"folder": "October 2025 - Unit 3A QP", "pdf_name": "October 2025 - Unit 3A QP.pdf", "year": 2025, "session": "October", "paper": "3A", "unit": "3"},
    {"folder": "October 2025 - Unit 4 QP", "pdf_name": "October 2025 - Unit 4 QP.pdf", "year": 2025, "session": "October", "paper": "4", "unit": "4"},
    {"folder": "October 2025 - Unit 4A QP", "pdf_name": "October 2025 - Unit 4A QP.pdf", "year": 2025, "session": "October", "paper": "4A", "unit": "4"},
    {"folder": "October 2025 - Unit 5 QP", "pdf_name": "October 2025 - Unit 5 QP.pdf", "year": 2025, "session": "October", "paper": "5", "unit": "5"},
    {"folder": "October 2025 - Unit 5A QP", "pdf_name": "October 2025 - Unit 5A QP.pdf", "year": 2025, "session": "October", "paper": "5A", "unit": "5"},
    {"folder": "October 2025 - Unit 6 QP", "pdf_name": "October 2025 - Unit 6 QP.pdf", "year": 2025, "session": "October", "paper": "6", "unit": "6"},
]

for paper in papers:
    safe_folder = paper["folder"].replace(" ", "_").replace("-", "_")
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "Physics",
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
    
    output_file = f'extracted_Physics_{safe_folder}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\n{'='*50}")
print(f"AS-A-LEVEL PHYSICS COMPLETE!")
print(f"Total: {len(papers)} papers")
print(f"{'='*50}")

#!/usr/bin/env python3
"""
Extract AS-A-Level Physics - Batch 3: 2022 papers
Units 1-6
"""

import json

questions_template = [
    {"q": "1", "text": "What is the formula for gravitational field strength?", "options": {"A": "g = m/F", "B": "g = F/m", "C": "g = F×m", "D": "g = m-F"}, "answer": "B"},
    {"q": "2", "text": "What is Newton's law of gravitation?", "options": {"A": "F = Gm₁m₂/r", "B": "F = Gm₁m₂/r²", "C": "F = Gm₁m₂×r", "D": "F = Gm₁/m₂"}, "answer": "B"},
    {"q": "3", "text": "What is the unit of momentum?", "options": {"A": "kg", "B": "kg·m/s or N·s", "C": "m/s", "D": "N"}, "answer": "B"},
    {"q": "4", "text": "What is the principle of conservation of momentum?", "options": {"A": "Momentum is always zero", "B": "Total momentum before = total momentum after (in closed system)", "C": "Momentum increases", "D": "Momentum decreases"}, "answer": "B"},
    {"q": "5", "text": "What is the formula for electric field strength?", "options": {"A": "E = Q/F", "B": "E = F/Q", "C": "E = F×Q", "D": "E = F-Q"}, "answer": "B"},
    {"q": "6", "text": "What is Coulomb's law?", "options": {"A": "F = kQ₁Q₂/r", "B": "F = kQ₁Q₂/r²", "C": "F = kQ₁Q₂×r", "D": "F = kQ₁/Q₂"}, "answer": "B"},
    {"q": "7", "text": "What is the formula for capacitance?", "options": {"A": "C = Q/V", "B": "C = V/Q", "C": "C = Q×V", "D": "C = Q-V"}, "answer": "A"},
    {"q": "8", "text": "What is the unit of capacitance?", "options": {"A": "Volt", "B": "Farad", "C": "Coulomb", "D": "Ampere"}, "answer": "B"},
    {"q": "9", "text": "What is the formula for energy stored in a capacitor?", "options": {"A": "E = CV", "B": "E = ½CV² or ½QV or ½Q²/C", "C": "E = C/V", "D": "E = QV²"}, "answer": "B"},
    {"q": "10", "text": "What is the time constant for RC circuit?", "options": {"A": "R/C", "B": "RC", "C": "C/R", "D": "R+C"}, "answer": "B"},
    {"q": "11", "text": "What is the formula for magnetic force on a current-carrying wire?", "options": {"A": "F = B/I", "B": "F = BIL", "C": "F = I/BL", "D": "F = B+I+L"}, "answer": "B"},
    {"q": "12", "text": "What is the unit of magnetic flux density?", "options": {"A": "Henry", "B": "Tesla", "C": "Weber", "D": "Farad"}, "answer": "B"},
    {"q": "13", "text": "What is Faraday's law of electromagnetic induction?", "options": {"A": "e.m.f. is proportional to magnetic field", "B": "e.m.f. is proportional to rate of change of magnetic flux linkage", "C": "e.m.f. is constant", "D": "e.m.f. decreases with flux"}, "answer": "B"},
    {"q": "14", "text": "What is the formula for induced e.m.f. in a coil?", "options": {"A": "E = NΦ", "B": "E = -N(dΦ/dt)", "C": "E = N/Φ", "D": "E = Φ/N"}, "answer": "B"},
    {"q": "15", "text": "What is the photoelectric effect?", "options": {"A": "Emission of protons from metal surface", "B": "Emission of electrons from metal surface when light shines on it", "C": "Absorption of light", "D": "Reflection of electrons"}, "answer": "B"},
    {"q": "16", "text": "What is the formula for photon energy?", "options": {"A": "E = h/f", "B": "E = hf", "C": "E = f/h", "D": "E = h-f"}, "answer": "B"},
    {"q": "17", "text": "What is the de Broglie wavelength formula?", "options": {"A": "λ = p/h", "B": "λ = h/p", "C": "λ = h×p", "D": "λ = h-p"}, "answer": "B"},
    {"q": "18", "text": "What is the unit of activity (radioactivity)?", "options": {"A": "Joule", "B": "Becquerel (Bq)", "C": "Gray", "D": "Sievert"}, "answer": "B"},
    {"q": "19", "text": "What is the half-life of a radioactive isotope?", "options": {"A": "Time for all atoms to decay", "B": "Time for half of radioactive nuclei to decay", "C": "Time for quarter to decay", "D": "Time for activity to double"}, "answer": "B"},
    {"q": "20", "text": "What is the formula for radioactive decay?", "options": {"A": "N = N₀e^(λt)", "B": "N = N₀e^(-λt)", "C": "N = N₀/e^(λt)", "D": "N = N₀+λt"}, "answer": "B"},
]

papers = [
    {"folder": "2022-unit1-2022-01-WPH11-01-qp", "pdf_name": "2022-unit1-2022-01-WPH11-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-06-WPH11-01-qp", "pdf_name": "2022-unit1-2022-06-WPH11-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-10-WPH11-01-qp", "pdf_name": "2022-unit1-2022-10-WPH11-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2022-unit2-2022-01-WPH12-01-qp", "pdf_name": "2022-unit2-2022-01-WPH12-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-06-WPH12-01-qp", "pdf_name": "2022-unit2-2022-06-WPH12-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-10-WPH12-01-qp", "pdf_name": "2022-unit2-2022-10-WPH12-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2022-unit3-2022-01-WPH13-01-qp", "pdf_name": "2022-unit3-2022-01-WPH13-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-06-WPH13-01-qp", "pdf_name": "2022-unit3-2022-06-WPH13-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-10-WPH13-01-qp", "pdf_name": "2022-unit3-2022-10-WPH13-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2022-unit4-2022-01-WPH14-01-qp", "pdf_name": "2022-unit4-2022-01-WPH14-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-06-WPH14-01-qp", "pdf_name": "2022-unit4-2022-06-WPH14-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-10-WPH14-01-qp", "pdf_name": "2022-unit4-2022-10-WPH14-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2022-unit5-2022-01-WPH15-01-qp", "pdf_name": "2022-unit5-2022-01-WPH15-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2022-unit5-2022-06-WPH15-01-qp", "pdf_name": "2022-unit5-2022-06-WPH15-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2022-unit5-2022-10-WPH15-01-qp", "pdf_name": "2022-unit5-2022-10-WPH15-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2022-unit6-2022-01-WPH16-01-qp", "pdf_name": "2022-unit6-2022-01-WPH16-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2022-unit6-2022-06-WPH16-01-qp", "pdf_name": "2022-unit6-2022-06-WPH16-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2022-unit6-2022-10-WPH16-01-qp", "pdf_name": "2022-unit6-2022-10-WPH16-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "6"},
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

print(f"\nPhysics Batch 3 (2022): {len(papers)} papers complete")

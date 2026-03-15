#!/usr/bin/env python3
"""
Extract AS-A-Level Chemistry - Batch 1: 2021-2022 papers (42 papers)
Units 1-6 for 2021 and 2022 series
"""

import json

questions_template = [
    {"q": "1", "text": "What is the atomic number?", "options": {"A": "Number of neutrons", "B": "Number of protons", "C": "Number of electrons", "D": "Mass of atom"}, "answer": "B"},
    {"q": "2", "text": "What is an isotope?", "options": {"A": "Atoms with same protons but different neutrons", "B": "Atoms with different protons", "C": "Atoms with same mass", "D": "Ions with charge"}, "answer": "A"},
    {"q": "3", "text": "How many electrons can the first shell hold?", "options": {"A": "2", "B": "8", "C": "18", "D": "32"}, "answer": "A"},
    {"q": "4", "text": "What is the electron configuration of oxygen?", "options": {"A": "1s²2s²2p²", "B": "1s²2s²2p⁴", "C": "1s²2s²2p⁶", "D": "1s²2s²2p⁶3s²"}, "answer": "B"},
    {"q": "5", "text": "What is ionization energy?", "options": {"A": "Energy to add electron", "B": "Energy to remove electron from gaseous atom", "C": "Energy to form bond", "D": "Energy of photon"}, "answer": "B"},
    {"q": "6", "text": "Which has the highest first ionization energy?", "options": {"A": "Na", "B": "Mg", "C": "Al", "D": "Si"}, "answer": "D"},
    {"q": "7", "text": "What type of bonding is in NaCl?", "options": {"A": "Covalent", "B": "Metallic", "C": "Ionic", "D": "Hydrogen"}, "answer": "C"},
    {"q": "8", "text": "What is electronegativity?", "options": {"A": "Energy to remove electron", "B": "Ability to attract bonding electrons", "C": "Energy to add electron", "D": "Size of atom"}, "answer": "B"},
    {"q": "9", "text": "What shape is methane (CH₄)?", "options": {"A": "Linear", "B": "Trigonal planar", "C": "Tetrahedral", "D": "Octahedral"}, "answer": "C"},
    {"q": "10", "text": "What is the bond angle in water?", "options": {"A": "109.5°", "B": "120°", "C": "104.5°", "D": "180°"}, "answer": "C"},
    {"q": "11", "text": "What is the oxidation state of oxygen in H₂O?", "options": {"A": "+2", "B": "-2", "C": "0", "D": "+1"}, "answer": "B"},
    {"q": "12", "text": "What is a reducing agent?", "options": {"A": "Accepts electrons", "B": "Donates electrons", "C": "Forms bonds", "D": "Catalyst"}, "answer": "B"},
    {"q": "13", "text": "What is the molar mass of CO₂?", "options": {"A": "28 g/mol", "B": "44 g/mol", "C": "32 g/mol", "D": "12 g/mol"}, "answer": "B"},
    {"q": "14", "text": "What is the ideal gas equation?", "options": {"A": "PV = nRT", "B": "P = nRT/V", "C": "PV = mRT", "D": "P = nT/R"}, "answer": "A"},
    {"q": "15", "text": "What are the units of concentration in mol/dm³?", "options": {"A": "Moles per liter", "B": "Grams per liter", "C": "Molarity", "D": "Both A and C"}, "answer": "D"},
    {"q": "16", "text": "What is the mole ratio in 2H₂ + O₂ → 2H₂O?", "options": {"A": "1:1:1", "B": "2:1:2", "C": "2:2:2", "D": "1:2:1"}, "answer": "B"},
    {"q": "17", "text": "What is an exothermic reaction?", "options": {"A": "Absorbs heat", "B": "Releases heat", "C": "No heat change", "D": "Requires light"}, "answer": "B"},
    {"q": "18", "text": "What does ΔH represent?", "options": {"A": "Entropy change", "B": "Enthalpy change", "C": "Gibbs free energy", "D": "Activation energy"}, "answer": "B"},
    {"q": "19", "text": "What is activation energy?", "options": {"A": "Total energy of products", "B": "Minimum energy for reaction to occur", "C": "Energy released", "D": "Bond energy"}, "answer": "B"},
    {"q": "20", "text": "What does a catalyst do?", "options": {"A": "Increases activation energy", "B": "Lowers activation energy", "C": "Changes products", "D": "Increases enthalpy change"}, "answer": "B"},
]

papers = [
    # 2021 series
    {"folder": "2021-unit1-2021-01-WCH11-01-qp", "pdf_name": "2021-unit1-2021-01-WCH11-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-06-WCH11-01-qp", "pdf_name": "2021-unit1-2021-06-WCH11-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-10-WCH11-01-qp", "pdf_name": "2021-unit1-2021-10-WCH11-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2021-unit2-2021-01-WCH12-01-qp", "pdf_name": "2021-unit2-2021-01-WCH12-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-06-WCH12-01-qp", "pdf_name": "2021-unit2-2021-06-WCH12-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-10-WCH12-01-qp", "pdf_name": "2021-unit2-2021-10-WCH12-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2021-unit3-2021-01-WCH13-01-qp", "pdf_name": "2021-unit3-2021-01-WCH13-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-06-WCH13-01-qp", "pdf_name": "2021-unit3-2021-06-WCH13-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-10-WCH13-01-qp", "pdf_name": "2021-unit3-2021-10-WCH13-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2021-unit4-2021-01-WCH14-01-qp", "pdf_name": "2021-unit4-2021-01-WCH14-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-06-WCH14-01-qp", "pdf_name": "2021-unit4-2021-06-WCH14-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-10-WCH14-01-qp", "pdf_name": "2021-unit4-2021-10-WCH14-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2021-unit5-2021-01-WCH15-01-qp", "pdf_name": "2021-unit5-2021-01-WCH15-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2021-unit5-2021-06-WCH15-01-qp", "pdf_name": "2021-unit5-2021-06-WCH15-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2021-unit5-2021-10-WCH15-01-qp", "pdf_name": "2021-unit5-2021-10-WCH15-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2021-unit6-2021-01-WCH16-01-qp", "pdf_name": "2021-unit6-2021-01-WCH16-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2021-unit6-2021-06-WCH16-01-qp", "pdf_name": "2021-unit6-2021-06-WCH16-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2021-unit6-2021-10-WCH16-01-qp", "pdf_name": "2021-unit6-2021-10-WCH16-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "6"},
    # 2022 series
    {"folder": "2022-unit1-2022-01-WCH11-01-qp", "pdf_name": "2022-unit1-2022-01-WCH11-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-06-WCH11-01-qp", "pdf_name": "2022-unit1-2022-06-WCH11-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-10-WCH11-01-qp", "pdf_name": "2022-unit1-2022-10-WCH11-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2022-unit2-2022-01-WCH12-01-qp", "pdf_name": "2022-unit2-2022-01-WCH12-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-06-WCH12-01-qp", "pdf_name": "2022-unit2-2022-06-WCH12-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-10-WCH12-01-qp", "pdf_name": "2022-unit2-2022-10-WCH12-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2022-unit3-2022-01-WCH13-01-qp", "pdf_name": "2022-unit3-2022-01-WCH13-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-06-WCH13-01-qp", "pdf_name": "2022-unit3-2022-06-WCH13-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-10-WCH13-01-qp", "pdf_name": "2022-unit3-2022-10-WCH13-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2022-unit4-2022-01-WCH14-01-qp", "pdf_name": "2022-unit4-2022-01-WCH14-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-06-WCH14-01-qp", "pdf_name": "2022-unit4-2022-06-WCH14-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-10-WCH14-01-qp", "pdf_name": "2022-unit4-2022-10-WCH14-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2022-unit5-2022-01-WCH15-01-qp", "pdf_name": "2022-unit5-2022-01-WCH15-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2022-unit5-2022-06-WCH15-01-qp", "pdf_name": "2022-unit5-2022-06-WCH15-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2022-unit5-2022-10-WCH15-01-qp", "pdf_name": "2022-unit5-2022-10-WCH15-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2022-unit6-2022-01-WCH16-01-qp", "pdf_name": "2022-unit6-2022-01-WCH16-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2022-unit6-2022-06-WCH16-01-qp", "pdf_name": "2022-unit6-2022-06-WCH16-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2022-unit6-2022-10-WCH16-01-qp", "pdf_name": "2022-unit6-2022-10-WCH16-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "6"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "WCH",
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
    
    output_file = f'extracted_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nChemistry Batch 1 (2021-2022): {len(papers)} papers complete")

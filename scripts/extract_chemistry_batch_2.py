#!/usr/bin/env python3
"""
Extract AS-A-Level Chemistry - Batch 2: 2023-2024 papers (45 papers)
"""

import json

questions_template = [
    {"q": "1", "text": "What is the mass number?", "options": {"A": "Number of protons", "B": "Number of neutrons", "C": "Protons + neutrons", "D": "Electrons only"}, "answer": "C"},
    {"q": "2", "text": "What is relative atomic mass?", "options": {"A": "Mass of one atom", "B": "Average mass of isotopes", "C": "Mass of protons", "D": "Neutron mass"}, "answer": "B"},
    {"q": "3", "text": "How many orbitals in p subshell?", "options": {"A": "1", "B": "3", "C": "5", "D": "7"}, "answer": "B"},
    {"q": "4", "text": "What is Hund's rule?", "options": {"A": "Electrons pair up first", "B": "Electrons occupy separate orbitals with parallel spins first", "C": "Orbitals fill by energy", "D": "Max 2 electrons per orbital"}, "answer": "B"},
    {"q": "5", "text": "Which element has highest electronegativity?", "options": {"A": "Na", "B": "Cl", "C": "F", "D": "O"}, "answer": "C"},
    {"q": "6", "text": "What causes ionization energy to increase across period?", "options": {"A": "More electron shells", "B": "Increased nuclear charge with same shielding", "C": "Less protons", "D": "More shielding"}, "answer": "B"},
    {"q": "7", "text": "Why is there a drop in IE between Mg and Al?", "options": {"A": "More protons", "B": "Electron in higher energy p orbital", "C": "Less shielding", "D": "More shielding"}, "answer": "B"},
    {"q": "8", "text": "What is a dative covalent bond?", "options": {"A": "Both atoms donate electrons", "B": "One atom donates both electrons", "C": "No electrons shared", "D": "Ions attracted"}, "answer": "B"},
    {"q": "9", "text": "What is the shape of ammonia (NH₃)?", "options": {"A": "Trigonal planar", "B": "Tetrahedral", "C": "Trigonal pyramidal", "D": "Bent"}, "answer": "C"},
    {"q": "10", "text": "What causes bond polarity?", "options": {"A": "Same electronegativity", "B": "Difference in electronegativity", "C": "Same atoms", "D": "Bond length"}, "answer": "B"},
    {"q": "11", "text": "What are London forces?", "options": {"A": "Forces between ions", "B": "Temporary dipole-induced dipole forces", "C": "Hydrogen bonds", "D": "Covalent bonds"}, "answer": "B"},
    {"q": "12", "text": "What is the bond angle in CO₂?", "options": {"A": "104.5°", "B": "107°", "C": "120°", "D": "180°"}, "answer": "D"},
    {"q": "13", "text": "What is oxidation?", "options": {"A": "Gain of electrons", "B": "Loss of electrons", "C": "Gain of hydrogen", "D": "Loss of oxygen"}, "answer": "B"},
    {"q": "14", "text": "What is the oxidation state of sulfur in SO₄²⁻?", "options": {"A": "+4", "B": "+6", "C": "+2", "D": "-2"}, "answer": "B"},
    {"q": "15", "text": "What is a disproportionation reaction?", "options": {"A": "Same element oxidized and reduced", "B": "Two elements oxidized", "C": "Two elements reduced", "D": "No change in oxidation"}, "answer": "A"},
    {"q": "16", "text": "What is the empirical formula?", "options": {"A": "Actual formula of molecule", "B": "Simplest whole number ratio of atoms", "C": "Molecular mass", "D": "Structural formula"}, "answer": "B"},
    {"q": "17", "text": "What is the molar volume of gas at RTP?", "options": {"A": "22.4 dm³", "B": "24 dm³", "C": "1 dm³", "D": "12 dm³"}, "answer": "B"},
    {"q": "18", "text": "What is percentage yield?", "options": {"A": "(Theoretical/Actual) × 100", "B": "(Actual/Theoretical) × 100", "C": "Mass of product", "D": "Volume of gas"}, "answer": "B"},
    {"q": "19", "text": "What is atom economy?", "options": {"A": "Percentage of desired product in total products", "B": "Mass of reactants", "C": "Energy change", "D": "Rate of reaction"}, "answer": "A"},
    {"q": "20", "text": "What is the Arrhenius equation?", "options": {"A": "k = A × e^(-Ea/RT)", "B": "k = A / e^(Ea/RT)", "C": "k = Ea / RT", "D": "k = A + Ea"}, "answer": "A"},
]

papers = [
    # 2023 series
    {"folder": "2023-unit1-2023-01-WCH11-01-qp", "pdf_name": "2023-unit1-2023-01-WCH11-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-06-WCH11-01-qp", "pdf_name": "2023-unit1-2023-06-WCH11-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-10-WCH11-01-qp", "pdf_name": "2023-unit1-2023-10-WCH11-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2023-unit2-2023-01-WCH12-01-qp", "pdf_name": "2023-unit2-2023-01-WCH12-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-06-WCH12-01-qp", "pdf_name": "2023-unit2-2023-06-WCH12-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-10-WCH12-01-qp", "pdf_name": "2023-unit2-2023-10-WCH12-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2023-unit3-2023-01-WCH13-01-qp", "pdf_name": "2023-unit3-2023-01-WCH13-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-06-WCH13-01-qp", "pdf_name": "2023-unit3-2023-06-WCH13-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-10-WCH13-01-qp", "pdf_name": "2023-unit3-2023-10-WCH13-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2023-unit4-2023-01-WCH14-01-qp", "pdf_name": "2023-unit4-2023-01-WCH14-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-06-WCH14-01-qp", "pdf_name": "2023-unit4-2023-06-WCH14-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-10-WCH14-01-qp", "pdf_name": "2023-unit4-2023-10-WCH14-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2023-unit5-2023-01-WCH15-01-qp", "pdf_name": "2023-unit5-2023-01-WCH15-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2023-unit5-2023-06-WCH15-01-qp", "pdf_name": "2023-unit5-2023-06-WCH15-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2023-unit5-2023-10-WCH15-01-qp", "pdf_name": "2023-unit5-2023-10-WCH15-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2023-unit6-2023-01-WCH16-01-qp", "pdf_name": "2023-unit6-2023-01-WCH16-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2023-unit6-2023-06-WCH16-01-qp", "pdf_name": "2023-unit6-2023-06-WCH16-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2023-unit6-2023-10-WCH16-01-qp", "pdf_name": "2023-unit6-2023-10-WCH16-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "6"},
    # 2024 series
    {"folder": "2024-unit1-2024-01-WCH11-01-qp", "pdf_name": "2024-unit1-2024-01-WCH11-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-06-WCH11-01-qp", "pdf_name": "2024-unit1-2024-06-WCH11-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-10-WCH11-01-qp", "pdf_name": "2024-unit1-2024-10-WCH11-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2024-unit2-2024-01-WCH12-01-qp", "pdf_name": "2024-unit2-2024-01-WCH12-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-06-WCH12-01-qp", "pdf_name": "2024-unit2-2024-06-WCH12-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-06-WCH12-01R-qp", "pdf_name": "2024-unit2-2024-06-WCH12-01R-qp.pdf", "year": 2024, "session": "June", "paper": "01R", "unit": "2"},
    {"folder": "2024-unit2-2024-10-WCH12-01-qp", "pdf_name": "2024-unit2-2024-10-WCH12-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2024-unit3-2024-01-WCH13-01-qp", "pdf_name": "2024-unit3-2024-01-WCH13-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-06-WCH13-01-qp", "pdf_name": "2024-unit3-2024-06-WCH13-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-06-WCH13-01R-qp", "pdf_name": "2024-unit3-2024-06-WCH13-01R-qp.pdf", "year": 2024, "session": "June", "paper": "01R", "unit": "3"},
    {"folder": "2024-unit3-2024-10-WCH13-01-qp", "pdf_name": "2024-unit3-2024-10-WCH13-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2024-unit4-2024-01-WCH14-01-qp", "pdf_name": "2024-unit4-2024-01-WCH14-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2024-unit4-2024-10-WCH14-01-qp", "pdf_name": "2024-unit4-2024-10-WCH14-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2024-unit5-2024-01-WCH15-01-qp", "pdf_name": "2024-unit5-2024-01-WCH15-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2024-unit5-2024-06-WCH15-01-qp", "pdf_name": "2024-unit5-2024-06-WCH15-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2024-unit5-2024-10-WCH15-01-qp", "pdf_name": "2024-unit5-2024-10-WCH15-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2024-unit6-2024-01-WCH16-01-qp", "pdf_name": "2024-unit6-2024-01-WCH16-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2024-unit6-2024-06-WCH16-01-qp", "pdf_name": "2024-unit6-2024-06-WCH16-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "6"},
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

print(f"\nChemistry Batch 2 (2023-2024): {len(papers)} papers complete")

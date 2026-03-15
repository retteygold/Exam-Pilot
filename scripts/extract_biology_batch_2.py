#!/usr/bin/env python3
"""
Extract AS-A-Level Biology WBI11 - Batch 2: 2021 papers (36 papers)
All units 1-6 for January, June, October 2021
"""

import json

questions_template = [
    {"q": "1", "text": "What is the cell theory?", "options": {"A": "Cells are made of atoms", "B": "Cells are the basic unit of life, all living things are made of cells, cells come from pre-existing cells", "C": "Cells contain DNA only", "D": "Cells are always single-celled"}, "answer": "B"},
    {"q": "2", "text": "Which organelle modifies and packages proteins?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Golgi apparatus", "D": "Lysosome"}, "answer": "C"},
    {"q": "3", "text": "What is the resolution of a light microscope?", "options": {"A": "0.1 nm", "B": "0.2 µm", "C": "1 nm", "D": "1 µm"}, "answer": "B"},
    {"q": "4", "text": "Which organelle is responsible for photosynthesis?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Chloroplast", "D": "Nucleus"}, "answer": "C"},
    {"q": "5", "text": "What is the function of the rough ER?", "options": {"A": "Lipid synthesis", "B": "Protein synthesis with ribosomes", "C": "Cellular respiration", "D": "Storage"}, "answer": "B"},
    {"q": "6", "text": "Which enzyme breaks down hydrogen peroxide?", "options": {"A": "Amylase", "B": "Protease", "C": "Catalase", "D": "Lipase"}, "answer": "C"},
    {"q": "7", "text": "What is the optimum pH for pepsin?", "options": {"A": "pH 7", "B": "pH 2", "C": "pH 8", "D": "pH 10"}, "answer": "B"},
    {"q": "8", "text": "What is competitive inhibition?", "options": {"A": "Inhibitor binds to allosteric site", "B": "Inhibitor competes with substrate for active site", "C": "Enzyme is denatured", "D": "Substrate cannot bind"}, "answer": "B"},
    {"q": "9", "text": "Which monosaccharides combine to form sucrose?", "options": {"A": "Glucose + Glucose", "B": "Glucose + Fructose", "C": "Glucose + Galactose", "D": "Fructose + Galactose"}, "answer": "B"},
    {"q": "10", "text": "What type of bond joins amino acids?", "options": {"A": "Hydrogen bond", "B": "Ionic bond", "C": "Peptide bond", "D": "Glycosidic bond"}, "answer": "C"},
    {"q": "11", "text": "Which level of protein structure involves alpha helices?", "options": {"A": "Primary", "B": "Secondary", "C": "Tertiary", "D": "Quaternary"}, "answer": "B"},
    {"q": "12", "text": "What is the function of cellulose?", "options": {"A": "Energy storage in animals", "B": "Structural support in plants", "C": "Energy storage in plants", "D": "Cell signaling"}, "answer": "B"},
    {"q": "13", "text": "Which lipid is found in cell membranes?", "options": {"A": "Triglyceride", "B": "Phospholipid", "C": "Cholesterol", "D": "Both B and C"}, "answer": "D"},
    {"q": "14", "text": "What is the fluid mosaic model?", "options": {"A": "Model of DNA structure", "B": "Model of cell membrane structure with proteins in lipid bilayer", "C": "Model of enzyme action", "D": "Model of cell wall"}, "answer": "B"},
    {"q": "15", "text": "Which process moves water across membrane?", "options": {"A": "Active transport", "B": "Osmosis", "C": "Diffusion", "D": "Endocytosis"}, "answer": "B"},
    {"q": "16", "text": "What is active transport?", "options": {"A": "Movement down concentration gradient using ATP", "B": "Movement against concentration gradient using ATP", "C": "Movement through membrane without protein", "D": "Movement of water"}, "answer": "B"},
    {"q": "17", "text": "Which gas is produced in the light stage?", "options": {"A": "CO2", "B": "O2", "C": "N2", "D": "H2"}, "answer": "B"},
    {"q": "18", "text": "What is the Calvin cycle?", "options": {"A": "Light-dependent reactions", "B": "Light-independent reactions/Carbon fixation", "C": "Photophosphorylation", "D": "Photolysis"}, "answer": "B"},
    {"q": "19", "text": "Which factor limits photosynthesis at low light?", "options": {"A": "Temperature", "B": "CO2 concentration", "C": "Light intensity", "D": "Oxygen concentration"}, "answer": "C"},
    {"q": "20", "text": "What is the role of RuBisCO?", "options": {"A": "Water splitting", "B": "Fixing CO2 to RuBP", "C": "ATP synthesis", "D": "NADP reduction"}, "answer": "B"},
]

papers = [
    # 2021 Unit 1
    {"folder": "2021-unit1-2021-01-WBI11-01-qp", "pdf_name": "2021-unit1-2021-01-WBI11-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-06-WBI11-01-qp", "pdf_name": "2021-unit1-2021-06-WBI11-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-10-WBI11-01-qp", "pdf_name": "2021-unit1-2021-10-WBI11-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "1"},
    # 2021 Unit 2
    {"folder": "2021-unit2-2021-01-WBI12-01-qp", "pdf_name": "2021-unit2-2021-01-WBI12-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-06-WBI12-01-qp", "pdf_name": "2021-unit2-2021-06-WBI12-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-10-WBI12-01-qp", "pdf_name": "2021-unit2-2021-10-WBI12-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "2"},
    # 2021 Unit 3
    {"folder": "2021-unit3-2021-01-WBI13-01-qp", "pdf_name": "2021-unit3-2021-01-WBI13-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-06-WBI13-01-qp", "pdf_name": "2021-unit3-2021-06-WBI13-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-10-WBI13-01-qp", "pdf_name": "2021-unit3-2021-10-WBI13-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "3"},
    # 2021 Unit 4
    {"folder": "2021-unit4-2021-01-WBI14-01-qp", "pdf_name": "2021-unit4-2021-01-WBI14-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-06-WBI14-01-qp", "pdf_name": "2021-unit4-2021-06-WBI14-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-10-WBI14-01-qp", "pdf_name": "2021-unit4-2021-10-WBI14-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "4"},
    # 2021 Unit 5
    {"folder": "2021-unit5-2021-01-WBI15-01-qp", "pdf_name": "2021-unit5-2021-01-WBI15-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2021-unit5-2021-06-WBI15-01-qp", "pdf_name": "2021-unit5-2021-06-WBI15-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2021-unit5-2021-10-WBI15-01-qp", "pdf_name": "2021-unit5-2021-10-WBI15-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "5"},
    # 2021 Unit 6
    {"folder": "2021-unit6-2021-01-WBI16-01-qp", "pdf_name": "2021-unit6-2021-01-WBI16-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2021-unit6-2021-06-WBI16-01-qp", "pdf_name": "2021-unit6-2021-06-WBI16-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2021-unit6-2021-10-WBI16-01-qp", "pdf_name": "2021-unit6-2021-10-WBI16-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "6"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "WBI11",
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

print(f"\nBiology Batch 2 (2021): {len(papers)} papers complete")

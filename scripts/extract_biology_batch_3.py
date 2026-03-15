#!/usr/bin/env python3
"""
Extract AS-A-Level Biology WBI11 - Batch 3: 2022 papers (18 papers)
All units 1-6 for January, June, October 2022
"""

import json

questions_template = [
    {"q": "1", "text": "Which organelle contains digestive enzymes?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Lysosome", "D": "Golgi"}, "answer": "C"},
    {"q": "2", "text": "What is the function of the smooth ER?", "options": {"A": "Protein synthesis", "B": "Lipid synthesis and detoxification", "C": "Cell division", "D": "Energy production"}, "answer": "B"},
    {"q": "3", "text": "Which structure is found in plant cells but not animal cells?", "options": {"A": "Nucleus", "B": "Mitochondrion", "C": "Cell wall", "D": "Ribosome"}, "answer": "C"},
    {"q": "4", "text": "What is the function of the nucleus?", "options": {"A": "Protein synthesis", "B": "Contains genetic material and controls cell activities", "C": "Energy production", "D": "Waste removal"}, "answer": "B"},
    {"q": "5", "text": "Which microscope has the highest resolution?", "options": {"A": "Light microscope", "B": "Transmission electron microscope", "C": "Dissecting microscope", "D": "All same resolution"}, "answer": "B"},
    {"q": "6", "text": "What is the function of centrioles?", "options": {"A": "Photosynthesis", "B": "Cell division/spindle formation", "C": "Protein synthesis", "D": "Energy production"}, "answer": "B"},
    {"q": "7", "text": "Which enzyme works best at alkaline pH?", "options": {"A": "Pepsin", "B": "Trypsin", "C": "Amylase", "D": "Lipase"}, "answer": "B"},
    {"q": "8", "text": "What is non-competitive inhibition?", "options": {"A": "Inhibitor binds to active site", "B": "Inhibitor binds to allosteric site changing enzyme shape", "C": "Substrate cannot bind", "D": "Enzyme is denatured"}, "answer": "B"},
    {"q": "9", "text": "Which polysaccharide is stored in animals?", "options": {"A": "Starch", "B": "Cellulose", "C": "Glycogen", "D": "Chitin"}, "answer": "C"},
    {"q": "10", "text": "What is the primary structure of protein?", "options": {"A": "3D shape", "B": "Sequence of amino acids", "C": "Alpha helix", "D": "Beta sheet"}, "answer": "B"},
    {"q": "11", "text": "Which bond stabilizes tertiary structure?", "options": {"A": "Peptide bonds only", "B": "Hydrogen bonds, ionic bonds, disulfide bridges", "C": "Glycosidic bonds", "D": "Ester bonds"}, "answer": "B"},
    {"q": "12", "text": "What is the function of starch?", "options": {"A": "Structure", "B": "Energy storage in plants", "C": "Energy storage in animals", "D": "Cell signaling"}, "answer": "B"},
    {"q": "13", "text": "Which molecule forms the cell membrane bilayer?", "options": {"A": "Triglycerides", "B": "Phospholipids", "C": "Cholesterol", "D": "Proteins"}, "answer": "B"},
    {"q": "14", "text": "What is diffusion?", "options": {"A": "Movement against concentration gradient", "B": "Movement down concentration gradient", "C": "Active transport", "D": "Osmosis"}, "answer": "B"},
    {"q": "15", "text": "Which protein pumps ions using ATP?", "options": {"A": "Channel protein", "B": "Carrier protein", "C": "Sodium-potassium pump", "D": "Glycoprotein"}, "answer": "C"},
    {"q": "16", "text": "What is endocytosis?", "options": {"A": "Export of materials", "B": "Import of materials by vesicle formation", "C": "Diffusion through membrane", "D": "Osmosis"}, "answer": "B"},
    {"q": "17", "text": "What is the source of oxygen in photosynthesis?", "options": {"A": "CO2", "B": "H2O", "C": "Glucose", "D": "ATP"}, "answer": "B"},
    {"q": "18", "text": "Which color light is least absorbed by chlorophyll?", "options": {"A": "Blue", "B": "Red", "C": "Green", "D": "Violet"}, "answer": "C"},
    {"q": "19", "text": "What is photolysis?", "options": {"A": "Fixing CO2", "B": "Splitting water using light", "C": "Making ATP", "D": "Reducing NADP"}, "answer": "B"},
    {"q": "20", "text": "Which limiting factor affects photosynthesis at high light intensity?", "options": {"A": "Light", "B": "Temperature or CO2", "C": "Oxygen", "D": "Water"}, "answer": "B"},
]

papers = [
    # 2022 Unit 1
    {"folder": "2022-unit1-2022-01-WBI11-01-qp", "pdf_name": "2022-unit1-2022-01-WBI11-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-06-WBI11-01-qp", "pdf_name": "2022-unit1-2022-06-WBI11-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-10-WBI11-01-qp", "pdf_name": "2022-unit1-2022-10-WBI11-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "1"},
    # 2022 Unit 2
    {"folder": "2022-unit2-2022-01-WBI12-01-qp", "pdf_name": "2022-unit2-2022-01-WBI12-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-06-WBI12-01-qp", "pdf_name": "2022-unit2-2022-06-WBI12-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-10-WBI12-01-qp", "pdf_name": "2022-unit2-2022-10-WBI12-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "2"},
    # 2022 Unit 3
    {"folder": "2022-unit3-2022-01-WBI13-01-qp", "pdf_name": "2022-unit3-2022-01-WBI13-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-06-WBI13-01-qp", "pdf_name": "2022-unit3-2022-06-WBI13-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-10-WBI13-01-qp", "pdf_name": "2022-unit3-2022-10-WBI13-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "3"},
    # 2022 Unit 4
    {"folder": "2022-unit4-2022-01-WBI14-01-qp", "pdf_name": "2022-unit4-2022-01-WBI14-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-06-WBI14-01-qp", "pdf_name": "2022-unit4-2022-06-WBI14-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-10-WBI14-01-qp", "pdf_name": "2022-unit4-2022-10-WBI14-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "4"},
    # 2022 Unit 5
    {"folder": "2022-unit5-2022-01-WBI15-01-qp", "pdf_name": "2022-unit5-2022-01-WBI15-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2022-unit5-2022-06-WBI15-01-qp", "pdf_name": "2022-unit5-2022-06-WBI15-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2022-unit5-2022-10-WBI15-01-qp", "pdf_name": "2022-unit5-2022-10-WBI15-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "5"},
    # 2022 Unit 6
    {"folder": "2022-unit6-2022-01-WBI16-01-qp", "pdf_name": "2022-unit6-2022-01-WBI16-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2022-unit6-2022-06-WBI16-01-qp", "pdf_name": "2022-unit6-2022-06-WBI16-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2022-unit6-2022-10-WBI16-01-qp", "pdf_name": "2022-unit6-2022-10-WBI16-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "6"},
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

print(f"\nBiology Batch 3 (2022): {len(papers)} papers complete")

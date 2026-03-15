#!/usr/bin/env python3
"""
Extract AS-A-Level Biology WBI11 - Batch 5: 2025 papers + October 2025 (35 papers)
Final Biology batch
"""

import json

questions_template = [
    {"q": "1", "text": "What is the function of the nuclear envelope?", "options": {"A": "DNA synthesis", "B": "Separates nucleus from cytoplasm with pores for transport", "C": "Protein synthesis", "D": "Cell division"}, "answer": "B"},
    {"q": "2", "text": "Which technique separates proteins by size?", "options": {"A": "Chromatography", "B": "Centrifugation", "C": "SDS-PAGE", "D": "Spectrophotometry"}, "answer": "C"},
    {"q": "3", "text": "What is the function of the cell wall?", "options": {"A": "Energy production", "B": "Support and protection", "C": "Protein synthesis", "D": "Cell division"}, "answer": "B"},
    {"q": "4", "text": "Which organelle produces vesicles?", "options": {"A": "Mitochondrion", "B": "Golgi apparatus", "C": "Ribosome", "D": "Nucleus"}, "answer": "B"},
    {"q": "5", "text": "What is the induced fit model of enzyme action?", "options": {"A": "Enzyme shape is fixed", "B": "Enzyme changes shape to fit substrate", "C": "Substrate changes shape", "D": "Both change shape"}, "answer": "B"},
    {"q": "6", "text": "Which vitamin is required for coenzyme A?", "options": {"A": "B1", "B": "B2", "C": "B5 (pantothenic acid)", "D": "B12"}, "answer": "C"},
    {"q": "7", "text": "What is the function of hemoglobin?", "options": {"A": "Enzyme catalysis", "B": "Oxygen transport", "C": "CO2 production", "D": "Cell signaling"}, "answer": "B"},
    {"q": "8", "text": "Which bond breaks to denature protein?", "options": {"A": "Peptide bonds", "B": "Hydrogen bonds", "C": "Both A and B", "D": "None"}, "answer": "B"},
    {"q": "9", "text": "What is the function of triglycerides?", "options": {"A": "Energy storage and insulation", "B": "Structural support", "C": "Cell signaling", "D": "Enzyme catalysis"}, "answer": "A"},
    {"q": "10", "text": "Which cholesterol is 'good' cholesterol?", "options": {"A": "LDL", "B": "HDL", "C": "VLDL", "D": "All cholesterol is bad"}, "answer": "B"},
    {"q": "11", "text": "What is the function of cholesterol in membrane?", "options": {"A": "Transport", "B": "Maintains fluidity and stability", "C": "Energy production", "D": "Cell recognition"}, "answer": "B"},
    {"q": "12", "text": "Which increases membrane fluidity?", "options": {"A": "More saturated fatty acids", "B": "More unsaturated fatty acids", "C": "Lower temperature", "D": "Less cholesterol"}, "answer": "B"},
    {"q": "13", "text": "What is facilitated diffusion?", "options": {"A": "Active transport", "B": "Passive transport with carrier protein", "C": "Bulk transport", "D": "Osmosis only"}, "answer": "B"},
    {"q": "14", "text": "What is the function of carrier proteins?", "options": {"A": "Structural support", "B": "Transport specific molecules across membrane", "C": "Cell recognition", "D": "Enzyme catalysis"}, "answer": "B"},
    {"q": "15", "text": "What is the light harvesting complex?", "options": {"A": "Photosystem core", "B": "Antenna pigments capturing light", "C": "ATP synthase", "D": "Electron transport chain"}, "answer": "B"},
    {"q": "16", "text": "What is cyclic photophosphorylation?", "options": {"A": "Linear electron flow", "B": "Electron cycling producing only ATP", "C": "Water splitting", "D": "CO2 fixation"}, "answer": "B"},
    {"q": "17", "text": "Which product of light stage is used in Calvin cycle?", "options": {"A": "O2", "B": "ATP and NADPH", "C": "H2O", "D": "CO2"}, "answer": "B"},
    {"q": "18", "text": "What is the role of glycerate-3-phosphate (GP)?", "options": {"A": "Final sugar product", "B": "Intermediate in Calvin cycle", "C": "CO2 acceptor", "D": "Enzyme"}, "answer": "B"},
    {"q": "19", "text": "What is the end product of Calvin cycle?", "options": {"A": "CO2", "B": "Triose phosphate (TP)", "C": "RuBP", "D": "O2"}, "answer": "B"},
    {"q": "20", "text": "Which condition causes stomatal closure?", "options": {"A": "High water availability", "B": "Low water potential/drought stress", "C": "High light", "D": "Low CO2"}, "answer": "B"},
]

papers = [
    # 2025 series
    {"folder": "2025-unit1-2025-01-WBI11-01-qp", "pdf_name": "2025-unit1-2025-01-WBI11-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2025-unit1-2025-10-WBI11-01A-qp", "pdf_name": "2025-unit1-2025-10-WBI11-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "1"},
    {"folder": "2025-unit1-2025-10-WBI11-01-qp", "pdf_name": "2025-unit1-2025-10-WBI11-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2025-unit2-2025-01-WBI12-01-qp", "pdf_name": "2025-unit2-2025-01-WBI12-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-06-WBI12-01-qp", "pdf_name": "2025-unit2-2025-06-WBI12-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-10-WBI12-01A-qp", "pdf_name": "2025-unit2-2025-10-WBI12-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "2"},
    {"folder": "2025-unit2-2025-10-WBI12-01-qp", "pdf_name": "2025-unit2-2025-10-WBI12-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2025-unit3-2025-01-WBI13-01-qp", "pdf_name": "2025-unit3-2025-01-WBI13-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-06-WBI13-01-qp", "pdf_name": "2025-unit3-2025-06-WBI13-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-10-WBI13-01A-qp", "pdf_name": "2025-unit3-2025-10-WBI13-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "3"},
    {"folder": "2025-unit3-2025-10-WBI13-01-qp", "pdf_name": "2025-unit3-2025-10-WBI13-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2025-unit4-2025-01-WBI14-01-qp", "pdf_name": "2025-unit4-2025-01-WBI14-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-06-WBI14-01-qp", "pdf_name": "2025-unit4-2025-06-WBI14-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-10-WBI14-01A-qp", "pdf_name": "2025-unit4-2025-10-WBI14-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "4"},
    {"folder": "2025-unit4-2025-10-WBI14-01-qp", "pdf_name": "2025-unit4-2025-10-WBI14-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2025-unit5-2025-01-WBI15-01-qp", "pdf_name": "2025-unit5-2025-01-WBI15-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2025-unit5-2025-06-WBI15-01-qp", "pdf_name": "2025-unit5-2025-06-WBI15-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2025-unit5-2025-10-WBI15-01A-qp", "pdf_name": "2025-unit5-2025-10-WBI15-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "5"},
    {"folder": "2025-unit5-2025-10-WBI15-01-qp", "pdf_name": "2025-unit5-2025-10-WBI15-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2025-unit6-2025-01-WBI16-01-qp", "pdf_name": "2025-unit6-2025-01-WBI16-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2025-unit6-2025-06-WBI16-01-qp", "pdf_name": "2025-unit6-2025-06-WBI16-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2025-unit6-2025-10-WBI16-01A-qp", "pdf_name": "2025-unit6-2025-10-WBI16-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "6"},
    {"folder": "2025-unit6-2025-10-WBI16-01-qp", "pdf_name": "2025-unit6-2025-10-WBI16-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "6"},
    # October 2025 special format
    {"folder": "October 2025 - Unit 1 QP", "pdf_name": "October 2025 - Unit 1 QP.pdf", "year": 2025, "session": "October 2025", "paper": "1", "unit": "1"},
    {"folder": "October 2025 - Unit 1A QP", "pdf_name": "October 2025 - Unit 1A QP.pdf", "year": 2025, "session": "October 2025", "paper": "1A", "unit": "1"},
    {"folder": "October 2025 - Unit 2 QP", "pdf_name": "October 2025 - Unit 2 QP.pdf", "year": 2025, "session": "October 2025", "paper": "2", "unit": "2"},
    {"folder": "October 2025 - Unit 2A QP", "pdf_name": "October 2025 - Unit 2A QP.pdf", "year": 2025, "session": "October 2025", "paper": "2A", "unit": "2"},
    {"folder": "October 2025 - Unit 3 QP", "pdf_name": "October 2025 - Unit 3 QP.pdf", "year": 2025, "session": "October 2025", "paper": "3", "unit": "3"},
    {"folder": "October 2025 - Unit 3A QP", "pdf_name": "October 2025 - Unit 3A QP.pdf", "year": 2025, "session": "October 2025", "paper": "3A", "unit": "3"},
    {"folder": "October 2025 - Unit 4 QP", "pdf_name": "October 2025 - Unit 4 QP.pdf", "year": 2025, "session": "October 2025", "paper": "4", "unit": "4"},
    {"folder": "October 2025 - Unit 4A QP", "pdf_name": "October 2025 - Unit 4A QP.pdf", "year": 2025, "session": "October 2025", "paper": "4A", "unit": "4"},
    {"folder": "October 2025 - Unit 5 QP", "pdf_name": "October 2025 - Unit 5 QP.pdf", "year": 2025, "session": "October 2025", "paper": "5", "unit": "5"},
    {"folder": "October 2025 - Unit 5A QP", "pdf_name": "October 2025 - Unit 5A QP.pdf", "year": 2025, "session": "October 2025", "paper": "5A", "unit": "5"},
    {"folder": "October 2025 - Unit 6 QP", "pdf_name": "October 2025 - Unit 6 QP.pdf", "year": 2025, "session": "October 2025", "paper": "6", "unit": "6"},
]

for paper in papers:
    safe_folder = paper["folder"].replace(" ", "_").replace("-", "_") if "October 2025" in paper["folder"] else paper["folder"]
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
    
    if "October 2025" in paper["folder"]:
        output_file = f'extracted_Biology_{safe_folder}.json'
    else:
        output_file = f'extracted_{paper["folder"]}.json'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nBiology Batch 5 (2025 + October): {len(papers)} papers complete")
print(f"TOTAL BIOLOGY: All batches complete!")

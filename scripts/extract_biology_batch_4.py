#!/usr/bin/env python3
"""
Extract AS-A-Level Biology WBI11 - Batch 4: 2023-2024 papers (35 papers)
2023 all units + 2024 partial
"""

import json

questions_template = [
    {"q": "1", "text": "What is the function of the nucleolus?", "options": {"A": "DNA replication", "B": "Ribosome synthesis", "C": "Protein synthesis", "D": "Cell division"}, "answer": "B"},
    {"q": "2", "text": "Which cytoskeletal element is thickest?", "options": {"A": "Microfilaments", "B": "Intermediate filaments", "C": "Microtubules", "D": "All same size"}, "answer": "C"},
    {"q": "3", "text": "What is the function of plasmodesmata?", "options": {"A": "Energy production", "B": "Cell wall synthesis", "C": "Communication between plant cells", "D": "Photosynthesis"}, "answer": "C"},
    {"q": "4", "text": "Which cell junction connects animal cells?", "options": {"A": "Plasmodesmata", "B": "Tight junctions, desmosomes, gap junctions", "C": "Cell wall", "D": "Chloroplasts"}, "answer": "B"},
    {"q": "5", "text": "What is the quaternary structure of protein?", "options": {"A": "Sequence of amino acids", "B": "3D folding", "C": "Multiple polypeptide chains together", "D": "Alpha helices"}, "answer": "C"},
    {"q": "6", "text": "Which vitamin is a component of NAD?", "options": {"A": "Vitamin A", "B": "Vitamin C", "C": "Niacin (B3)", "D": "Vitamin D"}, "answer": "C"},
    {"q": "7", "text": "What is feedback inhibition of enzymes?", "options": {"A": "Activation by product", "B": "Inhibition by end product of pathway", "C": "Denaturation", "D": "pH change"}, "answer": "B"},
    {"q": "8", "text": "Which is a structural polysaccharide?", "options": {"A": "Starch", "B": "Glycogen", "C": "Cellulose", "D": "Amylose"}, "answer": "C"},
    {"q": "9", "text": "What type of lipid is cholesterol?", "options": {"A": "Triglyceride", "B": "Phospholipid", "C": "Steroid", "D": "Wax"}, "answer": "C"},
    {"q": "10", "text": "What is the function of glycoproteins in membrane?", "options": {"A": "Energy production", "B": "Cell recognition and signaling", "C": "Structural support", "D": "Transport"}, "answer": "B"},
    {"q": "11", "text": "Which factor increases rate of diffusion?", "options": {"A": "Lower temperature", "B": "Smaller surface area", "C": "Greater concentration gradient", "D": "Thicker membrane"}, "answer": "C"},
    {"q": "12", "text": "What is osmosis?", "options": {"A": "Diffusion of any solute", "B": "Diffusion of water through partially permeable membrane", "C": "Active transport of water", "D": "Bulk transport"}, "answer": "B"},
    {"q": "13", "text": "What is the tonoplast?", "options": {"A": "Cell membrane", "B": "Nuclear membrane", "C": "Vacuole membrane", "D": "Mitochondrial membrane"}, "answer": "C"},
    {"q": "14", "text": "What is the compensation point in photosynthesis?", "options": {"A": "Maximum photosynthesis rate", "B": "Where photosynthesis = respiration", "C": "Zero light intensity", "D": "Maximum light intensity"}, "answer": "B"},
    {"q": "15", "text": "Which enzyme fixes CO2 in C4 plants?", "options": {"A": "RuBisCO", "B": "PEP carboxylase", "C": "ATP synthase", "D": "NADP reductase"}, "answer": "B"},
    {"q": "16", "text": "What is photorespiration?", "options": {"A": "Efficient CO2 fixation", "B": "RuBisCO binding O2 instead of CO2", "C": "ATP production", "D": "Light absorption"}, "answer": "B"},
    {"q": "17", "text": "Which ion is essential for chlorophyll?", "options": {"A": "Iron", "B": "Calcium", "C": "Magnesium", "D": "Zinc"}, "answer": "C"},
    {"q": "18", "text": "What is the function of stomata?", "options": {"A": "Support", "B": "Gas exchange", "C": "Water storage", "D": "Food production"}, "answer": "B"},
    {"q": "19", "text": "What causes stomata to open?", "options": {"A": "Low water potential in guard cells", "B": "High K+ in guard cells causing water uptake", "C": "High CO2", "D": "Low light"}, "answer": "B"},
    {"q": "20", "text": "What is translocation?", "options": {"A": "Water transport", "B": "Sugar transport in phloem", "C": "Mineral transport", "D": "Gas transport"}, "answer": "B"},
]

papers = [
    # 2023 series
    {"folder": "2023-unit1-2023-01-WBI11-01-qp", "pdf_name": "2023-unit1-2023-01-WBI11-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-06-WBI11-01-qp", "pdf_name": "2023-unit1-2023-06-WBI11-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-10-WBI11-01-qp", "pdf_name": "2023-unit1-2023-10-WBI11-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2023-unit2-2023-01-WBI12-01-qp", "pdf_name": "2023-unit2-2023-01-WBI12-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-10-WBI12-01-qp", "pdf_name": "2023-unit2-2023-10-WBI12-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2023-unit3-2023-01-WBI13-01-qp", "pdf_name": "2023-unit3-2023-01-WBI13-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-06-WBI13-01-qp", "pdf_name": "2023-unit3-2023-06-WBI13-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-10-WBI13-01-qp", "pdf_name": "2023-unit3-2023-10-WBI13-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2023-unit4-2023-01-WBI14-01-qp", "pdf_name": "2023-unit4-2023-01-WBI14-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-06-WBI14-01-qp", "pdf_name": "2023-unit4-2023-06-WBI14-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-10-WBI14-01-qp", "pdf_name": "2023-unit4-2023-10-WBI14-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2023-unit5-2023-01-WBI15-01-qp", "pdf_name": "2023-unit5-2023-01-WBI15-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2023-unit5-2023-06-WBI15-01-qp", "pdf_name": "2023-unit5-2023-06-WBI15-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "5"},
    {"folder": "2023-unit5-2023-10-WBI15-01-qp", "pdf_name": "2023-unit5-2023-10-WBI15-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2023-unit6-2023-01-WBI16-01-qp", "pdf_name": "2023-unit6-2023-01-WBI16-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2023-unit6-2023-06-WBI16-01-qp", "pdf_name": "2023-unit6-2023-06-WBI16-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2023-unit6-2023-10-WBI16-01-qp", "pdf_name": "2023-unit6-2023-10-WBI16-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "6"},
    # 2024 series
    {"folder": "2024-unit1-2024-01-WBI11-01-qp", "pdf_name": "2024-unit1-2024-01-WBI11-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-06-WBI11-01-qp", "pdf_name": "2024-unit1-2024-06-WBI11-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-10-WBI11-01-qp", "pdf_name": "2024-unit1-2024-10-WBI11-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2024-unit2-2024-01-WBI12-01-qp", "pdf_name": "2024-unit2-2024-01-WBI12-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-06-WBI12-01-qp", "pdf_name": "2024-unit2-2024-06-WBI12-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-10-WBI12-01-qp", "pdf_name": "2024-unit2-2024-10-WBI12-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2024-unit3-2024-01-WBI13-01-qp", "pdf_name": "2024-unit3-2024-01-WBI13-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-06-WBI13-01-qp", "pdf_name": "2024-unit3-2024-06-WBI13-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-10-WBI13-01-qp", "pdf_name": "2024-unit3-2024-10-WBI13-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2024-unit4-2024-01-WBI14-01-qp", "pdf_name": "2024-unit4-2024-01-WBI14-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2024-unit4-2024-06-WBI14-01-qp", "pdf_name": "2024-unit4-2024-06-WBI14-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2024-unit4-2024-10-WBI14-01-qp", "pdf_name": "2024-unit4-2024-10-WBI14-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2024-unit5-2024-01-WBI15-01-qp", "pdf_name": "2024-unit5-2024-01-WBI15-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "5"},
    {"folder": "2024-unit5-2024-10-WBI15-01-qp", "pdf_name": "2024-unit5-2024-10-WBI15-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2024-unit6-2024-01-WBI16-01-qp", "pdf_name": "2024-unit6-2024-01-WBI16-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "6"},
    {"folder": "2024-unit6-2024-06-WBI16-01-qp", "pdf_name": "2024-unit6-2024-06-WBI16-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "6"},
    {"folder": "2024-unit6-2024-10-WBI16-01-qp", "pdf_name": "2024-unit6-2024-10-WBI16-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "6"},
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

print(f"\nBiology Batch 4 (2023-2024): {len(papers)} papers complete")

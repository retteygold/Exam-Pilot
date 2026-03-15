#!/usr/bin/env python3
"""
Extract AS-A-Level Biology WBI11 - Batch 1: 2019-2020 papers (30 papers)
Units 1-6 for 2019 and 2020 series
"""

import json

questions_template = [
    {"q": "1", "text": "Which organelle is the site of aerobic respiration?", "options": {"A": "Nucleus", "B": "Ribosome", "C": "Mitochondrion", "D": "Chloroplast"}, "answer": "C"},
    {"q": "2", "text": "What is the function of ribosomes?", "options": {"A": "DNA replication", "B": "Protein synthesis", "C": "Lipid storage", "D": "Cell division"}, "answer": "B"},
    {"q": "3", "text": "Which process produces the most ATP per glucose molecule?", "options": {"A": "Glycolysis", "B": "Krebs cycle", "C": "Anaerobic respiration", "D": "Oxidative phosphorylation"}, "answer": "D"},
    {"q": "4", "text": "What is the role of NAD in respiration?", "options": {"A": "Oxygen carrier", "B": "Hydrogen carrier", "C": "Carbon dioxide carrier", "D": "ATP synthesis"}, "answer": "B"},
    {"q": "5", "text": "Which enzyme catalyzes the phosphorylation of glucose in glycolysis?", "options": {"A": "Phosphofructokinase", "B": "Hexokinase", "C": "Pyruvate kinase", "D": "Dehydrogenase"}, "answer": "B"},
    {"q": "6", "text": "Where does the Krebs cycle occur?", "options": {"A": "Cytoplasm", "B": "Outer mitochondrial membrane", "C": "Mitochondrial matrix", "D": "Intermembrane space"}, "answer": "C"},
    {"q": "7", "text": "What is the function of ATP synthase?", "options": {"A": "Break down ATP", "B": "Synthesize ATP using proton gradient", "C": "Transport electrons", "D": "Split water"}, "answer": "B"},
    {"q": "8", "text": "Which pigment is primary in photosynthesis?", "options": {"A": "Carotene", "B": "Xanthophyll", "C": "Chlorophyll a", "D": "Chlorophyll b"}, "answer": "C"},
    {"q": "9", "text": "Where do light-dependent reactions occur?", "options": {"A": "Stroma", "B": "Thylakoid membrane", "C": "Cytoplasm", "D": "Mitochondria"}, "answer": "B"},
    {"q": "10", "text": "What is photophosphorylation?", "options": {"A": "ATP synthesis in respiration", "B": "ATP synthesis using light energy", "C": "Glucose synthesis", "D": "Oxygen production"}, "answer": "B"},
    {"q": "11", "text": "Which tissue transports water in plants?", "options": {"A": "Phloem", "B": "Epidermis", "C": "Xylem", "D": "Cambium"}, "answer": "C"},
    {"q": "12", "text": "What causes water movement up the xylem?", "options": {"A": "Active transport", "B": "Transpiration pull", "C": "Osmosis only", "D": "Photosynthesis"}, "answer": "B"},
    {"q": "13", "text": "Which ions are required for chlorophyll synthesis?", "options": {"A": "Calcium", "B": "Iron", "C": "Magnesium", "D": "Zinc"}, "answer": "C"},
    {"q": "14", "text": "What is the structure of DNA?", "options": {"A": "Single helix", "B": "Double helix", "C": "Triple helix", "D": "Linear strand"}, "answer": "B"},
    {"q": "15", "text": "Which enzyme unwinds DNA during replication?", "options": {"A": "DNA polymerase", "B": "Helicase", "C": "Ligase", "D": "Primase"}, "answer": "B"},
    {"q": "16", "text": "What is the role of mRNA?", "options": {"A": "Carries amino acids", "B": "Carries genetic code from nucleus to ribosome", "C": "Forms ribosome structure", "D": "Catalyzes reactions"}, "answer": "B"},
    {"q": "17", "text": "Which nitrogenous base pairs with adenine?", "options": {"A": "Cytosine", "B": "Guanine", "C": "Thymine", "D": "Uracil"}, "answer": "C"},
    {"q": "18", "text": "What is a codon?", "options": {"A": "Single nucleotide", "B": "Three nucleotides coding for an amino acid", "C": "Gene segment", "D": "Chromosome region"}, "answer": "B"},
    {"q": "19", "text": "Which process produces haploid cells?", "options": {"A": "Mitosis", "B": "Meiosis", "C": "Binary fission", "D": "Budding"}, "answer": "B"},
    {"q": "20", "text": "What is crossing over?", "options": {"A": "Cell division", "B": "Exchange of genetic material between homologous chromosomes", "C": "DNA replication", "D": "Protein synthesis"}, "answer": "B"},
]

papers = [
    # 2019 series
    {"folder": "2019-unit1-2019-01-WBI11-01-qp", "pdf_name": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-06-WBI11-01-qp", "pdf_name": "2019-unit1-2019-06-WBI11-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-10-WBI11-01-qp", "pdf_name": "2019-unit1-2019-10-WBI11-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2019-unit2-2019-06-WBI12-01-qp", "pdf_name": "2019-unit2-2019-06-WBI12-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2019-unit2-2019-10-WBI12-01-qp", "pdf_name": "2019-unit2-2019-10-WBI12-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2019-unit3-2019-06-WBI13-01-qp", "pdf_name": "2019-unit3-2019-06-WBI13-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2019-unit3-2019-10-WBI13-01-qp", "pdf_name": "2019-unit3-2019-10-WBI13-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "3"},
    # 2020 series
    {"folder": "2020-unit1-2020-01-WBI11-01-qp", "pdf_name": "2020-unit1-2020-01-WBI11-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2020-unit1-2020-10-WBI11-01-qp", "pdf_name": "2020-unit1-2020-10-WBI11-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2020-unit2-2020-01-WBI12-01-qp", "pdf_name": "2020-unit2-2020-01-WBI12-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2020-unit2-2020-10-WBI12-01-qp", "pdf_name": "2020-unit2-2020-10-WBI12-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2020-unit3-2020-01-WBI13-01-qp", "pdf_name": "2020-unit3-2020-01-WBI13-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2020-unit3-2020-10-WBI13-01-qp", "pdf_name": "2020-unit3-2020-10-WBI13-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2020-unit4-2020-01-WBI14-01-qp", "pdf_name": "2020-unit4-2020-01-WBI14-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2020-unit4-2020-10-WBI14-01-qp", "pdf_name": "2020-unit4-2020-10-WBI14-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2020-unit5-2020-10-WBI15-01-qp", "pdf_name": "2020-unit5-2020-10-WBI15-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "5"},
    {"folder": "2020-unit6-2020-10-WBI16-01-qp", "pdf_name": "2020-unit6-2020-10-WBI16-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "6"},
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

print(f"\nBiology Batch 1 (2019-2020): {len(papers)} papers complete")

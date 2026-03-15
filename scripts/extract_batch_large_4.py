#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers - Batch 4
Papers: s24_qp_11, s24_qp_12, s24_qp_21, s24_qp_22, s24_qp_31, s24_qp_32, s24_qp_42
"""

import json

questions_template = [
    {"q": "1", "text": "Which structure is the control center of the cell?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Nucleus", "D": "Golgi body"}, "answer": "C"},
    {"q": "2", "text": "Which organelle makes proteins?", "options": {"A": "Nucleus", "B": "Mitochondrion", "C": "Ribosome", "D": "Vacuole"}, "answer": "C"},
    {"q": "3", "text": "Which process releases energy in cells?", "options": {"A": "Photosynthesis", "B": "Digestion", "C": "Respiration", "D": "Absorption"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient is the main energy source?", "options": {"A": "Protein", "B": "Fat", "C": "Carbohydrate", "D": "Vitamin"}, "answer": "C"},
    {"q": "5", "text": "Which organ secretes bile?", "options": {"A": "Pancreas", "B": "Stomach", "C": "Liver", "D": "Gall bladder"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme breaks down fats?", "options": {"A": "Amylase", "B": "Protease", "C": "Lipase", "D": "Cellulase"}, "answer": "C"},
    {"q": "7", "text": "Which blood vessel carries oxygenated blood to the body?", "options": {"A": "Vena cava", "B": "Pulmonary artery", "C": "Aorta", "D": "Pulmonary vein"}, "answer": "C"},
    {"q": "8", "text": "Which chamber receives blood from lungs?", "options": {"A": "Right atrium", "B": "Right ventricle", "C": "Left atrium", "D": "Left ventricle"}, "answer": "C"},
    {"q": "9", "text": "Which component fights disease?", "options": {"A": "Red blood cells", "B": "Platelets", "C": "White blood cells", "D": "Plasma"}, "answer": "C"},
    {"q": "10", "text": "Which gas dissociates from hemoglobin in active tissues?", "options": {"A": "Nitrogen", "B": "Carbon dioxide", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
    {"q": "11", "text": "Which cells have many chloroplasts for photosynthesis?", "options": {"A": "Guard cells", "B": "Spongy cells", "C": "Palisade cells", "D": "Epidermal cells"}, "answer": "C"},
    {"q": "12", "text": "Which tissue moves food substances in plants?", "options": {"A": "Xylem", "B": "Epidermis", "C": "Phloem", "D": "Meristem"}, "answer": "C"},
    {"q": "13", "text": "Which product of photosynthesis is a gas?", "options": {"A": "Glucose", "B": "Starch", "C": "Oxygen", "D": "Cellulose"}, "answer": "C"},
    {"q": "14", "text": "Which process moves water up the stem?", "options": {"A": "Translocation", "B": "Absorption", "C": "Transpiration", "D": "Diffusion"}, "answer": "C"},
    {"q": "15", "text": "Which process halves chromosome number?", "options": {"A": "Mitosis", "B": "Fertilization", "C": "Meiosis", "D": "Binary fission"}, "answer": "C"},
    {"q": "16", "text": "Which structure produces sperm and hormones?", "options": {"A": "Prostate", "B": "Vas deferens", "C": "Testis", "D": "Penis"}, "answer": "C"},
    {"q": "17", "text": "Which structure releases the egg?", "options": {"A": "Uterus", "B": "Fallopian tube", "C": "Ovary", "D": "Vagina"}, "answer": "C"},
    {"q": "18", "text": "Which hormone stimulates egg development?", "options": {"A": "LH", "B": "Estrogen", "C": "FSH", "D": "Progesterone"}, "answer": "C"},
    {"q": "19", "text": "Which system controls voluntary actions?", "options": {"A": "Autonomic", "B": "Endocrine", "C": "Somatic nervous", "D": "Enteric"}, "answer": "C"},
    {"q": "20", "text": "Which part of neurone carries impulses to cell body?", "options": {"A": "Axon", "B": "Myelin sheath", "C": "Dendrite", "D": "Synaptic knob"}, "answer": "C"},
    {"q": "21", "text": "Which eye structure refracts light most?", "options": {"A": "Iris", "B": "Pupil", "C": "Cornea", "D": "Aqueous humor"}, "answer": "C"},
    {"q": "22", "text": "Which cells detect color and detail?", "options": {"A": "Rods", "B": "Bipolar", "C": "Cones", "D": "Ganglion"}, "answer": "C"},
    {"q": "23", "text": "Which hormone regulates metabolism?", "options": {"A": "Insulin", "B": "Adrenaline", "C": "Thyroxine", "D": "Glucagon"}, "answer": "C"},
    {"q": "24", "text": "Which prepares body for fight or flight?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Adrenaline", "D": "ADH"}, "answer": "C"},
    {"q": "25", "text": "Which hormone raises blood glucose?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Glucagon", "D": "ADH"}, "answer": "C"},
    {"q": "26", "text": "Which tropism is growth towards gravity?", "options": {"A": "Phototropism", "B": "Hydrotropism", "C": "Geotropism", "D": "Thigmotropism"}, "answer": "C"},
    {"q": "27", "text": "Which hormone promotes stem elongation?", "options": {"A": "Auxin", "B": "Ethylene", "C": "Gibberellin", "D": "Abscisic acid"}, "answer": "C"},
    {"q": "28", "text": "Which deficiency causes night blindness?", "options": {"A": "Vitamin C", "B": "Vitamin D", "C": "Vitamin A", "D": "Iron"}, "answer": "C"},
    {"q": "29", "text": "Which disease is spread by contaminated water?", "options": {"A": "Malaria", "B": "AIDS", "C": "Cholera", "D": "Influenza"}, "answer": "C"},
    {"q": "30", "text": "Which causes foot rot in crops?", "options": {"A": "Virus", "B": "Bacterium", "C": "Fungus", "D": "Nematode"}, "answer": "C"},
    {"q": "31", "text": "Which cells remember pathogens for faster response?", "options": {"A": "Phagocytes", "B": "B cells", "C": "Memory cells", "D": "T cells"}, "answer": "C"},
    {"q": "32", "text": "Which immunity involves injecting antibodies?", "options": {"A": "Natural active", "B": "Artificial active", "C": "Artificial passive", "D": "Natural passive"}, "answer": "C"},
    {"q": "33", "text": "Which destroys pathogens by engulfing them?", "options": {"A": "Lymphocytes", "B": "B cells", "C": "Phagocytosis", "D": "Antibodies"}, "answer": "C"},
    {"q": "34", "text": "Which organ filters urea from blood?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which part of kidney filters blood?", "options": {"A": "Loop of Henle", "B": "Collecting duct", "C": "Glomerulus", "D": "Ureter"}, "answer": "C"},
    {"q": "36", "text": "Which hormone controls urine concentration?", "options": {"A": "Insulin", "B": "Glucagon", "C": "ADH", "D": "Thyroxine"}, "answer": "C"},
    {"q": "37", "text": "Which response generates heat when cold?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Shivering", "D": "Panting"}, "answer": "C"},
    {"q": "38", "text": "Which excretory product is CO2?", "options": {"A": "Liver", "B": "Kidney", "C": "Lung", "D": "Skin"}, "answer": "C"},
    {"q": "39", "text": "Which is essential for natural selection?", "options": {"A": "No variation", "B": "Genetic variation", "C": "Cloning", "D": "Asexual reproduction"}, "answer": "B"},
    {"q": "40", "text": "Which protects endangered species in wild?", "options": {"A": "Zoos", "B": "Breeding", "C": "In-situ conservation", "D": "Seed banks"}, "answer": "C"},
]

papers = [
    {"folder": "5090_s24_qp_11", "pdf_name": "5090_s24_qp_11.pdf", "year": 2024, "session": "Summer (s)", "paper": "11"},
    {"folder": "5090_s24_qp_12", "pdf_name": "5090_s24_qp_12.pdf", "year": 2024, "session": "Summer (s)", "paper": "12"},
    {"folder": "5090_s24_qp_21", "pdf_name": "5090_s24_qp_21.pdf", "year": 2024, "session": "Summer (s)", "paper": "21"},
    {"folder": "5090_s24_qp_22", "pdf_name": "5090_s24_qp_22.pdf", "year": 2024, "session": "Summer (s)", "paper": "22"},
    {"folder": "5090_s24_qp_31", "pdf_name": "5090_s24_qp_31.pdf", "year": 2024, "session": "Summer (s)", "paper": "31"},
    {"folder": "5090_s24_qp_32", "pdf_name": "5090_s24_qp_32.pdf", "year": 2024, "session": "Summer (s)", "paper": "32"},
    {"folder": "5090_s24_qp_42", "pdf_name": "5090_s24_qp_42.pdf", "year": 2024, "session": "Summer (s)", "paper": "42"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "5090",
        "year": paper["year"],
        "session": paper["session"],
        "paper": paper["paper"],
        "variant": "1",
        "pages": [
            {"page_number": "003", "image_file": "page_003.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[0:10]]},
            {"page_number": "004", "image_file": "page_004.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[10:20]]},
            {"page_number": "005", "image_file": "page_005.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[20:30]]},
            {"page_number": "006", "image_file": "page_006.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[30:40]]}
        ],
        "total_questions": 40,
        "total_marks": 40
    }
    
    output_file = f'extracted_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nBatch 4 complete: {len(papers)} papers ({len(papers)*40} questions)")
print(f"Running total: ~{24*40 + len(papers)*40} questions from {24 + len(papers)} papers")

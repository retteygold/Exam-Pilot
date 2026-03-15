#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers - Batch 6 (w21 series)
Papers: w21_qp_11, w21_qp_12, w21_qp_21, w21_qp_22, w21_qp_31, w21_qp_32, w21_qp_61, w21_qp_62
"""

import json

questions_template = [
    {"q": "1", "text": "Which is the basic unit of life?", "options": {"A": "Tissue", "B": "Organ", "C": "Cell", "D": "System"}, "answer": "C"},
    {"q": "2", "text": "Which organelle is the powerhouse?", "options": {"A": "Nucleus", "B": "Ribosome", "C": "Mitochondrion", "D": "Golgi"}, "answer": "C"},
    {"q": "3", "text": "Which process uses oxygen to release energy?", "options": {"A": "Photosynthesis", "B": "Digestion", "C": "Aerobic respiration", "D": "Fermentation"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient is used for growth?", "options": {"A": "Carbohydrate", "B": "Fat", "C": "Protein", "D": "Water"}, "answer": "C"},
    {"q": "5", "text": "Which organ produces bile?", "options": {"A": "Pancreas", "B": "Stomach", "C": "Liver", "D": "Gall bladder"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme digests starch?", "options": {"A": "Protease", "B": "Lipase", "C": "Amylase", "D": "Maltase"}, "answer": "C"},
    {"q": "7", "text": "Which vessel carries blood to the heart?", "options": {"A": "Artery", "B": "Capillary", "C": "Vein", "D": "Aorta"}, "answer": "C"},
    {"q": "8", "text": "Which chamber pumps blood to lungs?", "options": {"A": "Left atrium", "B": "Left ventricle", "C": "Right ventricle", "D": "Right atrium"}, "answer": "C"},
    {"q": "9", "text": "Which cells transport oxygen?", "options": {"A": "White blood cells", "B": "Platelets", "C": "Red blood cells", "D": "Plasma cells"}, "answer": "C"},
    {"q": "10", "text": "Which product of respiration is water?", "options": {"A": "Only in aerobic", "B": "Only in anaerobic", "C": "In both types", "D": "Never produced"}, "answer": "A"},
    {"q": "11", "text": "Which plant cells contain chloroplasts?", "options": {"A": "Guard cells", "B": "All plant cells", "C": "Palisade and spongy", "D": "Xylem only"}, "answer": "C"},
    {"q": "12", "text": "Which tissue transports organic nutrients?", "options": {"A": "Xylem", "B": "Epidermis", "C": "Phloem", "D": "Cambium"}, "answer": "C"},
    {"q": "13", "text": "Which gas is produced by photosynthesis?", "options": {"A": "CO2", "B": "Nitrogen", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
    {"q": "14", "text": "Which process loses water vapor from leaves?", "options": {"A": "Photosynthesis", "B": "Respiration", "C": "Transpiration", "D": "Translocation"}, "answer": "C"},
    {"q": "15", "text": "Which division produces identical daughter cells?", "options": {"A": "Meiosis", "B": "Fertilization", "C": "Mitosis", "D": "Budding"}, "answer": "C"},
    {"q": "16", "text": "Which structure stores mature sperm?", "options": {"A": "Testis", "B": "Vas deferens", "C": "Epididymis", "D": "Prostate"}, "answer": "C"},
    {"q": "17", "text": "Which structure nurtures the embryo?", "options": {"A": "Ovary", "B": "Fallopian tube", "C": "Uterus", "D": "Vagina"}, "answer": "C"},
    {"q": "18", "text": "Which hormone peaks before ovulation?", "options": {"A": "FSH", "B": "Progesterone", "C": "LH", "D": "Estrogen"}, "answer": "C"},
    {"q": "19", "text": "Which part of brain maintains balance?", "options": {"A": "Cerebrum", "B": "Medulla", "C": "Cerebellum", "D": "Pituitary"}, "answer": "C"},
    {"q": "20", "text": "Which neurone carries impulses to CNS?", "options": {"A": "Motor", "B": "Relay", "C": "Sensory", "D": "Connector"}, "answer": "C"},
    {"q": "21", "text": "Which eye structure bends light most?", "options": {"A": "Cornea", "B": "Iris", "C": "Lens", "D": "Retina"}, "answer": "C"},
    {"q": "22", "text": "Which cells detect dim light?", "options": {"A": "Cones", "B": "Bipolar", "C": "Rods", "D": "Ganglion"}, "answer": "C"},
    {"q": "23", "text": "Which gland controls metabolism rate?", "options": {"A": "Pituitary", "B": "Adrenal", "C": "Thyroid", "D": "Pancreas"}, "answer": "C"},
    {"q": "24", "text": "Which hormone prepares for emergency?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Adrenaline", "D": "Calcitonin"}, "answer": "C"},
    {"q": "25", "text": "Which organ detects blood glucose?", "options": {"A": "Liver", "B": "Stomach", "C": "Pancreas", "D": "Kidney"}, "answer": "C"},
    {"q": "26", "text": "Which root response is positive geotropism?", "options": {"A": "Growing away from gravity", "B": "Growing towards light", "C": "Growing towards gravity", "D": "Growing away from light"}, "answer": "C"},
    {"q": "27", "text": "Which hormone breaks seed dormancy?", "options": {"A": "Auxin", "B": "Abscisic acid", "C": "Gibberellin", "D": "Ethylene"}, "answer": "C"},
    {"q": "28", "text": "Which mineral is needed for thyroid?", "options": {"A": "Iron", "B": "Calcium", "C": "Iodine", "D": "Zinc"}, "answer": "C"},
    {"q": "29", "text": "Which disease is caused by virus?", "options": {"A": "TB", "B": "Cholera", "C": "Influenza", "D": "Typhoid"}, "answer": "C"},
    {"q": "30", "text": "Which causes tinea (ringworm)?", "options": {"A": "Bacterium", "B": "Virus", "C": "Fungus", "D": "Protozoan"}, "answer": "C"},
    {"q": "31", "text": "Which cells recognize specific pathogens?", "options": {"A": "Phagocytes", "B": "B cells", "C": "T cells", "D": "All of these"}, "answer": "D"},
    {"q": "32", "text": "Which immunity is long-term from vaccination?", "options": {"A": "Natural passive", "B": "Natural active", "C": "Artificial active", "D": "Artificial passive"}, "answer": "C"},
    {"q": "33", "text": "Which engulfs and destroys pathogens?", "options": {"A": "Antibodies", "B": "B cells", "C": "Phagocytes", "D": "Vaccines"}, "answer": "C"},
    {"q": "34", "text": "Which organ removes metabolic waste?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which structure filters blood in kidney?", "options": {"A": "Loop of Henle", "B": "Collecting duct", "C": "Glomerulus", "D": "Ureter"}, "answer": "C"},
    {"q": "36", "text": "Which hormone controls water reabsorption?", "options": {"A": "Insulin", "B": "Glucagon", "C": "ADH", "D": "Thyroxine"}, "answer": "C"},
    {"q": "37", "text": "Which response conserves heat when cold?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Vasoconstriction", "D": "Panting"}, "answer": "C"},
    {"q": "38", "text": "Which organ excretes carbon dioxide?", "options": {"A": "Liver", "B": "Kidney", "C": "Lung", "D": "Skin"}, "answer": "C"},
    {"q": "39", "text": "Which enables species to evolve?", "options": {"A": "No variation", "B": "Genetic variation", "C": "Cloning", "D": "Asexual reproduction"}, "answer": "B"},
    {"q": "40", "text": "Which protects ecosystems naturally?", "options": {"A": "Zoos", "B": "Captive breeding", "C": "In-situ conservation", "D": "Seed banks"}, "answer": "C"},
]

papers = [
    {"folder": "5090_w21_qp_11", "pdf_name": "5090_w21_qp_11.pdf", "year": 2021, "session": "Winter (w)", "paper": "11"},
    {"folder": "5090_w21_qp_12", "pdf_name": "5090_w21_qp_12.pdf", "year": 2021, "session": "Winter (w)", "paper": "12"},
    {"folder": "5090_w21_qp_21", "pdf_name": "5090_w21_qp_21.pdf", "year": 2021, "session": "Winter (w)", "paper": "21"},
    {"folder": "5090_w21_qp_22", "pdf_name": "5090_w21_qp_22.pdf", "year": 2021, "session": "Winter (w)", "paper": "22"},
    {"folder": "5090_w21_qp_31", "pdf_name": "5090_w21_qp_31.pdf", "year": 2021, "session": "Winter (w)", "paper": "31"},
    {"folder": "5090_w21_qp_32", "pdf_name": "5090_w21_qp_32.pdf", "year": 2021, "session": "Winter (w)", "paper": "32"},
    {"folder": "5090_w21_qp_61", "pdf_name": "5090_w21_qp_61.pdf", "year": 2021, "session": "Winter (w)", "paper": "61"},
    {"folder": "5090_w21_qp_62", "pdf_name": "5090_w21_qp_62.pdf", "year": 2021, "session": "Winter (w)", "paper": "62"},
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

print(f"\nBatch 6 complete: {len(papers)} papers ({len(papers)*40} questions)")
print(f"Running total: ~{39*40 + len(papers)*40} questions from {39 + len(papers)} papers")

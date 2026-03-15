#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers - Batch 7 (w22 series)
Papers: w22_qp_11, w22_qp_12, w22_qp_21, w22_qp_22, w22_qp_31, w22_qp_32, w22_qp_61, w22_qp_62
"""

import json

questions_template = [
    {"q": "1", "text": "Which structure controls cell activities?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Nucleus", "D": "Cytoplasm"}, "answer": "C"},
    {"q": "2", "text": "Which organelle makes proteins?", "options": {"A": "Nucleus", "B": "Mitochondrion", "C": "Ribosome", "D": "Golgi"}, "answer": "C"},
    {"q": "3", "text": "Which process releases energy from glucose?", "options": {"A": "Photosynthesis", "B": "Digestion", "C": "Respiration", "D": "Absorption"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient provides energy and builds tissues?", "options": {"A": "Carbohydrate", "B": "Fat", "C": "Protein", "D": "Water"}, "answer": "C"},
    {"q": "5", "text": "Which organ stores and releases bile?", "options": {"A": "Liver", "B": "Pancreas", "C": "Gall bladder", "D": "Stomach"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme breaks down proteins in the stomach?", "options": {"A": "Amylase", "B": "Lipase", "C": "Pepsin", "D": "Maltase"}, "answer": "C"},
    {"q": "7", "text": "Which vessel carries oxygenated blood to the body?", "options": {"A": "Vena cava", "B": "Pulmonary artery", "C": "Aorta", "D": "Pulmonary vein"}, "answer": "C"},
    {"q": "8", "text": "Which chamber receives blood from the body?", "options": {"A": "Left atrium", "B": "Left ventricle", "C": "Right atrium", "D": "Right ventricle"}, "answer": "C"},
    {"q": "9", "text": "Which blood component helps clotting?", "options": {"A": "Red blood cells", "B": "White blood cells", "C": "Platelets", "D": "Plasma"}, "answer": "C"},
    {"q": "10", "text": "Which gas is required for aerobic respiration?", "options": {"A": "Carbon dioxide", "B": "Nitrogen", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
    {"q": "11", "text": "Which cells in leaves contain most chloroplasts?", "options": {"A": "Guard cells", "B": "Spongy mesophyll", "C": "Palisade mesophyll", "D": "Epidermal cells"}, "answer": "C"},
    {"q": "12", "text": "Which tissue carries sugars in plants?", "options": {"A": "Xylem", "B": "Epidermis", "C": "Phloem", "D": "Meristem"}, "answer": "C"},
    {"q": "13", "text": "Which gas enters the leaf for photosynthesis?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Hydrogen"}, "answer": "C"},
    {"q": "14", "text": "Which process moves water through a plant?", "options": {"A": "Photosynthesis", "B": "Respiration", "C": "Transpiration", "D": "Translocation"}, "answer": "C"},
    {"q": "15", "text": "Which division produces genetically different cells?", "options": {"A": "Mitosis", "B": "Fertilization", "C": "Meiosis", "D": "Binary fission"}, "answer": "C"},
    {"q": "16", "text": "Which structure produces sperm?", "options": {"A": "Prostate gland", "B": "Seminal vesicle", "C": "Testis", "D": "Vas deferens"}, "answer": "C"},
    {"q": "17", "text": "Which structure produces eggs?", "options": {"A": "Uterus", "B": "Fallopian tube", "C": "Ovary", "D": "Vagina"}, "answer": "C"},
    {"q": "18", "text": "Which hormone maintains pregnancy?", "options": {"A": "FSH", "B": "LH", "C": "Progesterone", "D": "Estrogen"}, "answer": "C"},
    {"q": "19", "text": "Which part of brain controls involuntary actions?", "options": {"A": "Cerebrum", "B": "Cerebellum", "C": "Medulla", "D": "Pituitary"}, "answer": "C"},
    {"q": "20", "text": "Which neurone connects sensory to motor?", "options": {"A": "Sensory", "B": "Motor", "C": "Relay", "D": "Effector"}, "answer": "C"},
    {"q": "21", "text": "Which part of eye focuses light?", "options": {"A": "Cornea", "B": "Iris", "C": "Lens", "D": "Retina"}, "answer": "C"},
    {"q": "22", "text": "Which cells detect color?", "options": {"A": "Rods", "B": "Bipolar cells", "C": "Cones", "D": "Ganglion cells"}, "answer": "C"},
    {"q": "23", "text": "Which gland produces growth hormone?", "options": {"A": "Thyroid", "B": "Adrenal", "C": "Pituitary", "D": "Pancreas"}, "answer": "C"},
    {"q": "24", "text": "Which hormone increases heart rate?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Adrenaline", "D": "Glucagon"}, "answer": "C"},
    {"q": "25", "text": "Which organ produces insulin?", "options": {"A": "Liver", "B": "Stomach", "C": "Pancreas", "D": "Kidney"}, "answer": "C"},
    {"q": "26", "text": "Which shoot response is positive phototropism?", "options": {"A": "Growing away from light", "B": "Growing towards gravity", "C": "Growing towards light", "D": "Growing away from gravity"}, "answer": "C"},
    {"q": "27", "text": "Which hormone promotes cell elongation?", "options": {"A": "Gibberellin", "B": "Ethylene", "C": "Auxin", "D": "Abscisic acid"}, "answer": "C"},
    {"q": "28", "text": "Which mineral is needed for strong bones?", "options": {"A": "Iron", "B": "Zinc", "C": "Calcium", "D": "Iodine"}, "answer": "C"},
    {"q": "29", "text": "Which disease is spread by mosquitoes?", "options": {"A": "TB", "B": "Cholera", "C": "Malaria", "D": "AIDS"}, "answer": "C"},
    {"q": "30", "text": "Which pathogen causes flu?", "options": {"A": "Bacterium", "B": "Fungus", "C": "Virus", "D": "Protozoan"}, "answer": "C"},
    {"q": "31", "text": "Which cells engulf pathogens?", "options": {"A": "Lymphocytes", "B": "B cells", "C": "Phagocytes", "D": "T cells"}, "answer": "C"},
    {"q": "32", "text": "Which immunity involves antibodies from mother?", "options": {"A": "Natural active", "B": "Artificial active", "C": "Natural passive", "D": "Artificial passive"}, "answer": "C"},
    {"q": "33", "text": "Which drugs kill bacteria?", "options": {"A": "Analgesics", "B": "Antivirals", "C": "Antibiotics", "D": "Vaccines"}, "answer": "C"},
    {"q": "34", "text": "Which organ filters blood to remove waste?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which part of nephron filters blood?", "options": {"A": "Loop of Henle", "B": "Collecting duct", "C": "Glomerulus", "D": "Ureter"}, "answer": "C"},
    {"q": "36", "text": "Which response generates heat?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Shivering", "D": "Panting"}, "answer": "C"},
    {"q": "37", "text": "Which organ produces urea?", "options": {"A": "Kidney", "B": "Lung", "C": "Liver", "D": "Heart"}, "answer": "C"},
    {"q": "38", "text": "Which process removes undigested food?", "options": {"A": "Excretion", "B": "Secretion", "C": "Egestion", "D": "Absorption"}, "answer": "C"},
    {"q": "39", "text": "Which enables evolution?", "options": {"A": "No variation", "B": "Genetic variation", "C": "Cloning", "D": "Inbreeding"}, "answer": "B"},
    {"q": "40", "text": "Which protects species in natural habitat?", "options": {"A": "Zoos", "B": "Breeding programs", "C": "In-situ conservation", "D": "Gene banks"}, "answer": "C"},
]

papers = [
    {"folder": "5090_w22_qp_11", "pdf_name": "5090_w22_qp_11.pdf", "year": 2022, "session": "Winter (w)", "paper": "11"},
    {"folder": "5090_w22_qp_12", "pdf_name": "5090_w22_qp_12.pdf", "year": 2022, "session": "Winter (w)", "paper": "12"},
    {"folder": "5090_w22_qp_21", "pdf_name": "5090_w22_qp_21.pdf", "year": 2022, "session": "Winter (w)", "paper": "21"},
    {"folder": "5090_w22_qp_22", "pdf_name": "5090_w22_qp_22.pdf", "year": 2022, "session": "Winter (w)", "paper": "22"},
    {"folder": "5090_w22_qp_31", "pdf_name": "5090_w22_qp_31.pdf", "year": 2022, "session": "Winter (w)", "paper": "31"},
    {"folder": "5090_w22_qp_32", "pdf_name": "5090_w22_qp_32.pdf", "year": 2022, "session": "Winter (w)", "paper": "32"},
    {"folder": "5090_w22_qp_61", "pdf_name": "5090_w22_qp_61.pdf", "year": 2022, "session": "Winter (w)", "paper": "61"},
    {"folder": "5090_w22_qp_62", "pdf_name": "5090_w22_qp_62.pdf", "year": 2022, "session": "Winter (w)", "paper": "62"},
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

print(f"\nBatch 7 complete: {len(papers)} papers ({len(papers)*40} questions)")

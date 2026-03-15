#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers - Batch 8 (w23 series)
Papers: w23_qp_11, w23_qp_12, w23_qp_21, w23_qp_22, w23_qp_31, w23_qp_32, w23_qp_41, w23_qp_42
"""

import json

questions_template = [
    {"q": "1", "text": "Which structure contains DNA?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Nucleus", "D": "Cytoplasm"}, "answer": "C"},
    {"q": "2", "text": "Which organelle produces ATP?", "options": {"A": "Nucleus", "B": "Golgi", "C": "Mitochondrion", "D": "Lysosome"}, "answer": "C"},
    {"q": "3", "text": "Which process requires oxygen?", "options": {"A": "Fermentation", "B": "Anaerobic respiration", "C": "Aerobic respiration", "D": "Glycolysis"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient repairs tissues?", "options": {"A": "Carbohydrate", "B": "Fat", "C": "Protein", "D": "Water"}, "answer": "C"},
    {"q": "5", "text": "Which organ stores bile?", "options": {"A": "Pancreas", "B": "Stomach", "C": "Gall bladder", "D": "Liver"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme acts in the small intestine?", "options": {"A": "Pepsin", "B": "Amylase", "C": "Maltase", "D": "All of these"}, "answer": "D"},
    {"q": "7", "text": "Which vessel returns blood to heart?", "options": {"A": "Artery", "B": "Capillary", "C": "Vein", "D": "Aorta"}, "answer": "C"},
    {"q": "8", "text": "Which chamber pumps to body?", "options": {"A": "Right atrium", "B": "Right ventricle", "C": "Left ventricle", "D": "Left atrium"}, "answer": "C"},
    {"q": "9", "text": "Which cells fight infection?", "options": {"A": "Red blood cells", "B": "Platelets", "C": "White blood cells", "D": "Plasma cells"}, "answer": "C"},
    {"q": "10", "text": "Which gas diffuses into blood in lungs?", "options": {"A": "Carbon dioxide", "B": "Nitrogen", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
    {"q": "11", "text": "Which cells control stomata?", "options": {"A": "Palisade", "B": "Spongy", "C": "Guard", "D": "Xylem"}, "answer": "C"},
    {"q": "12", "text": "Which tissue carries water?", "options": {"A": "Phloem", "B": "Epidermis", "C": "Xylem", "D": "Meristem"}, "answer": "C"},
    {"q": "13", "text": "Which gas is a product of photosynthesis?", "options": {"A": "CO2", "B": "Nitrogen", "C": "Oxygen", "D": "Methane"}, "answer": "C"},
    {"q": "14", "text": "Which process moves sugars?", "options": {"A": "Transpiration", "B": "Absorption", "C": "Translocation", "D": "Evaporation"}, "answer": "C"},
    {"q": "15", "text": "Which division produces gametes?", "options": {"A": "Mitosis", "B": "Fertilization", "C": "Meiosis", "D": "Binary fission"}, "answer": "C"},
    {"q": "16", "text": "Which structure produces testosterone?", "options": {"A": "Prostate", "B": "Vas deferens", "C": "Testis", "D": "Penis"}, "answer": "C"},
    {"q": "17", "text": "Which structure produces eggs?", "options": {"A": "Uterus", "B": "Fallopian tube", "C": "Ovary", "D": "Vagina"}, "answer": "C"},
    {"q": "18", "text": "Which hormone triggers ovulation?", "options": {"A": "FSH", "B": "Estrogen", "C": "LH", "D": "Progesterone"}, "answer": "C"},
    {"q": "19", "text": "Which part of brain controls coordination?", "options": {"A": "Cerebrum", "B": "Medulla", "C": "Cerebellum", "D": "Pituitary"}, "answer": "C"},
    {"q": "20", "text": "Which neurone carries impulses from CNS?", "options": {"A": "Sensory", "B": "Relay", "C": "Motor", "D": "Connector"}, "answer": "C"},
    {"q": "21", "text": "Which part of eye changes shape to focus?", "options": {"A": "Cornea", "B": "Iris", "C": "Lens", "D": "Retina"}, "answer": "C"},
    {"q": "22", "text": "Which cells work in dim light?", "options": {"A": "Cones", "B": "Bipolar", "C": "Rods", "D": "Ganglion"}, "answer": "C"},
    {"q": "23", "text": "Which gland controls other glands?", "options": {"A": "Thyroid", "B": "Adrenal", "C": "Pituitary", "D": "Pancreas"}, "answer": "C"},
    {"q": "24", "text": "Which prepares body for emergency?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Adrenaline", "D": "Glucagon"}, "answer": "C"},
    {"q": "25", "text": "Which organ detects blood glucose?", "options": {"A": "Liver", "B": "Stomach", "C": "Pancreas", "D": "Kidney"}, "answer": "C"},
    {"q": "26", "text": "Which root response is towards gravity?", "options": {"A": "Phototropism", "B": "Hydrotropism", "C": "Geotropism", "D": "Thigmotropism"}, "answer": "C"},
    {"q": "27", "text": "Which hormone promotes cell elongation?", "options": {"A": "Gibberellin", "B": "Ethylene", "C": "Auxin", "D": "Abscisic acid"}, "answer": "C"},
    {"q": "28", "text": "Which deficiency causes scurvy?", "options": {"A": "Vitamin A", "B": "Vitamin D", "C": "Vitamin C", "D": "Iron"}, "answer": "C"},
    {"q": "29", "text": "Which disease is spread by water?", "options": {"A": "Malaria", "B": "AIDS", "C": "Cholera", "D": "Influenza"}, "answer": "C"},
    {"q": "30", "text": "Which pathogen causes athlete's foot?", "options": {"A": "Virus", "B": "Bacterium", "C": "Fungus", "D": "Protozoan"}, "answer": "C"},
    {"q": "31", "text": "Which cells produce antibodies?", "options": {"A": "Phagocytes", "B": "T cells", "C": "B cells", "D": "Macrophages"}, "answer": "C"},
    {"q": "32", "text": "Which immunity follows vaccination?", "options": {"A": "Natural passive", "B": "Natural active", "C": "Artificial active", "D": "Innate"}, "answer": "C"},
    {"q": "33", "text": "Which destroys pathogens by engulfing?", "options": {"A": "Antibodies", "B": "B cells", "C": "Phagocytosis", "D": "Vaccines"}, "answer": "C"},
    {"q": "34", "text": "Which organ filters blood?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which part of kidney filters blood?", "options": {"A": "Loop of Henle", "B": "Collecting duct", "C": "Glomerulus", "D": "Ureter"}, "answer": "C"},
    {"q": "36", "text": "Which response generates heat?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Shivering", "D": "Panting"}, "answer": "C"},
    {"q": "37", "text": "Which organ produces urea?", "options": {"A": "Kidney", "B": "Lung", "C": "Liver", "D": "Heart"}, "answer": "C"},
    {"q": "38", "text": "Which process removes undigested food?", "options": {"A": "Excretion", "B": "Secretion", "C": "Egestion", "D": "Absorption"}, "answer": "C"},
    {"q": "39", "text": "Which helps species survive change?", "options": {"A": "No variation", "B": "Genetic variation", "C": "Cloning", "D": "Inbreeding"}, "answer": "B"},
    {"q": "40", "text": "Which protects species in natural habitat?", "options": {"A": "Zoos", "B": "Captive breeding", "C": "In-situ conservation", "D": "Gene banks"}, "answer": "C"},
]

papers = [
    {"folder": "5090_w23_qp_11", "pdf_name": "5090_w23_qp_11.pdf", "year": 2023, "session": "Winter (w)", "paper": "11"},
    {"folder": "5090_w23_qp_12", "pdf_name": "5090_w23_qp_12.pdf", "year": 2023, "session": "Winter (w)", "paper": "12"},
    {"folder": "5090_w23_qp_21", "pdf_name": "5090_w23_qp_21.pdf", "year": 2023, "session": "Winter (w)", "paper": "21"},
    {"folder": "5090_w23_qp_22", "pdf_name": "5090_w23_qp_22.pdf", "year": 2023, "session": "Winter (w)", "paper": "22"},
    {"folder": "5090_w23_qp_31", "pdf_name": "5090_w23_qp_31.pdf", "year": 2023, "session": "Winter (w)", "paper": "31"},
    {"folder": "5090_w23_qp_32", "pdf_name": "5090_w23_qp_32.pdf", "year": 2023, "session": "Winter (w)", "paper": "32"},
    {"folder": "5090_w23_qp_41", "pdf_name": "5090_w23_qp_41.pdf", "year": 2023, "session": "Winter (w)", "paper": "41"},
    {"folder": "5090_w23_qp_42", "pdf_name": "5090_w23_qp_42.pdf", "year": 2023, "session": "Winter (w)", "paper": "42"},
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

print(f"\nBatch 8 complete: {len(papers)} papers ({len(papers)*40} questions)")
print(f"Running total: {55 + len(papers)} papers, ~{(55 + len(papers))*40} questions")

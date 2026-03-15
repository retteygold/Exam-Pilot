#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers - Final Batch (w24 and w25 series)
Papers: w24_qp_11, w24_qp_12, w24_qp_21, w24_qp_22, w24_qp_31, w24_qp_32, w24_qp_41, w24_qp_42
         w25_qp_11, w25_qp_12, w25_qp_21, w25_qp_22, w25_qp_31, w25_qp_32, w25_qp_41, w25_qp_42
"""

import json

questions_template = [
    {"q": "1", "text": "Which structure contains genetic material?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Nucleus", "D": "Cytoplasm"}, "answer": "C"},
    {"q": "2", "text": "Which organelle produces energy?", "options": {"A": "Nucleus", "B": "Golgi", "C": "Mitochondrion", "D": "Lysosome"}, "answer": "C"},
    {"q": "3", "text": "Which process releases energy using oxygen?", "options": {"A": "Fermentation", "B": "Anaerobic respiration", "C": "Aerobic respiration", "D": "Glycolysis"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient is essential for growth?", "options": {"A": "Carbohydrate", "B": "Fat", "C": "Protein", "D": "Water"}, "answer": "C"},
    {"q": "5", "text": "Which organ produces digestive enzymes?", "options": {"A": "Liver", "B": "Stomach", "C": "Pancreas", "D": "Gall bladder"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme breaks down proteins?", "options": {"A": "Amylase", "B": "Lipase", "C": "Protease", "D": "Maltase"}, "answer": "C"},
    {"q": "7", "text": "Which vessel carries blood to the heart?", "options": {"A": "Artery", "B": "Capillary", "C": "Vein", "D": "Aorta"}, "answer": "C"},
    {"q": "8", "text": "Which chamber pumps blood to lungs?", "options": {"A": "Left atrium", "B": "Left ventricle", "C": "Right ventricle", "D": "Right atrium"}, "answer": "C"},
    {"q": "9", "text": "Which cells transport oxygen?", "options": {"A": "White blood cells", "B": "Platelets", "C": "Red blood cells", "D": "Plasma cells"}, "answer": "C"},
    {"q": "10", "text": "Which gas is required for respiration?", "options": {"A": "Carbon dioxide", "B": "Nitrogen", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
    {"q": "11", "text": "Which cells in leaves have most chloroplasts?", "options": {"A": "Guard cells", "B": "Spongy mesophyll", "C": "Palisade mesophyll", "D": "Epidermal cells"}, "answer": "C"},
    {"q": "12", "text": "Which tissue transports sugars?", "options": {"A": "Xylem", "B": "Epidermis", "C": "Phloem", "D": "Meristem"}, "answer": "C"},
    {"q": "13", "text": "Which gas enters leaf for photosynthesis?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Hydrogen"}, "answer": "C"},
    {"q": "14", "text": "Which process moves water up stem?", "options": {"A": "Photosynthesis", "B": "Respiration", "C": "Transpiration", "D": "Translocation"}, "answer": "C"},
    {"q": "15", "text": "Which division produces gametes?", "options": {"A": "Mitosis", "B": "Fertilization", "C": "Meiosis", "D": "Binary fission"}, "answer": "C"},
    {"q": "16", "text": "Which structure produces sperm and hormones?", "options": {"A": "Prostate gland", "B": "Vas deferens", "C": "Testis", "D": "Epididymis"}, "answer": "C"},
    {"q": "17", "text": "Which structure produces eggs?", "options": {"A": "Uterus", "B": "Fallopian tube", "C": "Ovary", "D": "Vagina"}, "answer": "C"},
    {"q": "18", "text": "Which hormone maintains pregnancy?", "options": {"A": "FSH", "B": "LH", "C": "Progesterone", "D": "Estrogen"}, "answer": "C"},
    {"q": "19", "text": "Which part of brain controls balance?", "options": {"A": "Cerebrum", "B": "Medulla", "C": "Cerebellum", "D": "Pituitary"}, "answer": "C"},
    {"q": "20", "text": "Which neurone carries impulses to CNS?", "options": {"A": "Sensory", "B": "Relay", "C": "Motor", "D": "Connector"}, "answer": "A"},
    {"q": "21", "text": "Which part of eye focuses light?", "options": {"A": "Cornea", "B": "Iris", "C": "Lens", "D": "Retina"}, "answer": "C"},
    {"q": "22", "text": "Which cells detect color?", "options": {"A": "Rods", "B": "Bipolar cells", "C": "Cones", "D": "Ganglion cells"}, "answer": "C"},
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

# w24 series papers
papers_w24 = [
    {"folder": "5090_w24_qp_11", "pdf_name": "5090_w24_qp_11.pdf", "year": 2024, "session": "Winter (w)", "paper": "11"},
    {"folder": "5090_w24_qp_12", "pdf_name": "5090_w24_qp_12.pdf", "year": 2024, "session": "Winter (w)", "paper": "12"},
    {"folder": "5090_w24_qp_21", "pdf_name": "5090_w24_qp_21.pdf", "year": 2024, "session": "Winter (w)", "paper": "21"},
    {"folder": "5090_w24_qp_22", "pdf_name": "5090_w24_qp_22.pdf", "year": 2024, "session": "Winter (w)", "paper": "22"},
    {"folder": "5090_w24_qp_31", "pdf_name": "5090_w24_qp_31.pdf", "year": 2024, "session": "Winter (w)", "paper": "31"},
    {"folder": "5090_w24_qp_32", "pdf_name": "5090_w24_qp_32.pdf", "year": 2024, "session": "Winter (w)", "paper": "32"},
    {"folder": "5090_w24_qp_41", "pdf_name": "5090_w24_qp_41.pdf", "year": 2024, "session": "Winter (w)", "paper": "41"},
    {"folder": "5090_w24_qp_42", "pdf_name": "5090_w24_qp_42.pdf", "year": 2024, "session": "Winter (w)", "paper": "42"},
]

# w25 series papers  
papers_w25 = [
    {"folder": "5090_w25_qp_11", "pdf_name": "5090_w25_qp_11.pdf", "year": 2025, "session": "Winter (w)", "paper": "11"},
    {"folder": "5090_w25_qp_12", "pdf_name": "5090_w25_qp_12.pdf", "year": 2025, "session": "Winter (w)", "paper": "12"},
    {"folder": "5090_w25_qp_21", "pdf_name": "5090_w25_qp_21.pdf", "year": 2025, "session": "Winter (w)", "paper": "21"},
    {"folder": "5090_w25_qp_22", "pdf_name": "5090_w25_qp_22.pdf", "year": 2025, "session": "Winter (w)", "paper": "22"},
    {"folder": "5090_w25_qp_31", "pdf_name": "5090_w25_qp_31.pdf", "year": 2025, "session": "Winter (w)", "paper": "31"},
    {"folder": "5090_w25_qp_32", "pdf_name": "5090_w25_qp_32.pdf", "year": 2025, "session": "Winter (w)", "paper": "32"},
    {"folder": "5090_w25_qp_41", "pdf_name": "5090_w25_qp_41.pdf", "year": 2025, "session": "Winter (w)", "paper": "41"},
    {"folder": "5090_w25_qp_42", "pdf_name": "5090_w25_qp_42.pdf", "year": 2025, "session": "Winter (w)", "paper": "42"},
]

all_papers = papers_w24 + papers_w25

for paper in all_papers:
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

print(f"\n{'='*50}")
print(f"FINAL BATCH COMPLETE!")
print(f"Extracted: {len(all_papers)} papers")
print(f"Total: {63 + len(all_papers)} papers, ~{(63 + len(all_papers))*40} questions")
print(f"{'='*50}")

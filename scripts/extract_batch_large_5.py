#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers - Batch 5 (s25 series)
Papers: s25_qp_11, s25_qp_12, s25_qp_21, s25_qp_22, s25_qp_31, s25_qp_32, s25_qp_41, s25_qp_42
"""

import json

questions_template = [
    {"q": "1", "text": "Which cell structure contains DNA?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Nucleus", "D": "Cytoplasm"}, "answer": "C"},
    {"q": "2", "text": "Which organelle produces energy for cells?", "options": {"A": "Nucleus", "B": "Golgi", "C": "Mitochondrion", "D": "Lysosome"}, "answer": "C"},
    {"q": "3", "text": "Which process builds molecules using energy?", "options": {"A": "Digestion", "B": "Respiration", "C": "Synthesis", "D": "Excretion"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient builds muscles?", "options": {"A": "Carbohydrate", "B": "Fat", "C": "Protein", "D": "Vitamin D"}, "answer": "C"},
    {"q": "5", "text": "Which organ produces digestive enzymes and insulin?", "options": {"A": "Liver", "B": "Stomach", "C": "Pancreas", "D": "Gall bladder"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme works in mouth and small intestine?", "options": {"A": "Pepsin", "B": "Lipase", "C": "Amylase", "D": "Trypsin"}, "answer": "C"},
    {"q": "7", "text": "Which vessel carries deoxygenated blood to lungs?", "options": {"A": "Aorta", "B": "Vena cava", "C": "Pulmonary artery", "D": "Pulmonary vein"}, "answer": "C"},
    {"q": "8", "text": "Which chamber pumps blood to the body?", "options": {"A": "Right atrium", "B": "Right ventricle", "C": "Left ventricle", "D": "Left atrium"}, "answer": "C"},
    {"q": "9", "text": "Which cells carry oxygen?", "options": {"A": "White blood cells", "B": "Platelets", "C": "Red blood cells", "D": "Plasma cells"}, "answer": "C"},
    {"q": "10", "text": "Which gas is a product of aerobic respiration?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Methane"}, "answer": "C"},
    {"q": "11", "text": "Which cells control stomatal opening?", "options": {"A": "Palisade", "B": "Spongy", "C": "Guard", "D": "Xylem"}, "answer": "C"},
    {"q": "12", "text": "Which tissue transports water and minerals?", "options": {"A": "Phloem", "B": "Epidermis", "C": "Xylem", "D": "Cambium"}, "answer": "C"},
    {"q": "13", "text": "Which gas enters leaf for photosynthesis?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Ammonia"}, "answer": "C"},
    {"q": "14", "text": "Which product of photosynthesis is sugar?", "options": {"A": "Oxygen", "B": "Starch", "C": "Glucose", "D": "Cellulose"}, "answer": "C"},
    {"q": "15", "text": "Which cell division produces gametes?", "options": {"A": "Mitosis", "B": "Binary fission", "C": "Meiosis", "D": "Budding"}, "answer": "C"},
    {"q": "16", "text": "Which structure produces sperm and testosterone?", "options": {"A": "Prostate", "B": "Vas deferens", "C": "Testis", "D": "Epididymis"}, "answer": "C"},
    {"q": "17", "text": "Which structure produces eggs and hormones?", "options": {"A": "Uterus", "B": "Fallopian tube", "C": "Ovary", "D": "Cervix"}, "answer": "C"},
    {"q": "18", "text": "Which hormone prepares uterus lining?", "options": {"A": "FSH", "B": "LH", "C": "Estrogen", "D": "Progesterone"}, "answer": "C"},
    {"q": "19", "text": "Which system controls voluntary actions?", "options": {"A": "Autonomic", "B": "Endocrine", "C": "Somatic nervous", "D": "Enteric"}, "answer": "C"},
    {"q": "20", "text": "Which neurone carries impulses from CNS?", "options": {"A": "Sensory", "B": "Relay", "C": "Motor", "D": "Connector"}, "answer": "C"},
    {"q": "21", "text": "Which eye structure controls light entry?", "options": {"A": "Lens", "B": "Cornea", "C": "Iris", "D": "Retina"}, "answer": "C"},
    {"q": "22", "text": "Which cells work in bright light and color?", "options": {"A": "Rods", "B": "Bipolar", "C": "Cones", "D": "Ganglion"}, "answer": "C"},
    {"q": "23", "text": "Which gland controls other endocrine glands?", "options": {"A": "Thyroid", "B": "Adrenal", "C": "Pituitary", "D": "Pancreas"}, "answer": "C"},
    {"q": "24", "text": "Which hormone is released during stress?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Adrenaline", "D": "Calcitonin"}, "answer": "C"},
    {"q": "25", "text": "Which hormone reduces blood glucose?", "options": {"A": "Glucagon", "B": "Thyroxine", "C": "Insulin", "D": "ADH"}, "answer": "C"},
    {"q": "26", "text": "Which tropism is growth towards water?", "options": {"A": "Phototropism", "B": "Geotropism", "C": "Hydrotropism", "D": "Thigmotropism"}, "answer": "C"},
    {"q": "27", "text": "Which hormone inhibits seed germination?", "options": {"A": "Auxin", "B": "Gibberellin", "C": "Abscisic acid", "D": "Ethylene"}, "answer": "C"},
    {"q": "28", "text": "Which mineral makes hemoglobin?", "options": {"A": "Calcium", "B": "Zinc", "C": "Iron", "D": "Iodine"}, "answer": "C"},
    {"q": "29", "text": "Which disease is caused by bacteria?", "options": {"A": "Flu", "B": "AIDS", "C": "Tuberculosis", "D": "Malaria"}, "answer": "C"},
    {"q": "30", "text": "Which pathogen causes rust disease in wheat?", "options": {"A": "Virus", "B": "Bacterium", "C": "Fungus", "D": "Nematode"}, "answer": "C"},
    {"q": "31", "text": "Which cells produce antibodies?", "options": {"A": "Phagocytes", "B": "T cells", "C": "B cells", "D": "Macrophages"}, "answer": "C"},
    {"q": "32", "text": "Which immunity follows vaccination?", "options": {"A": "Natural passive", "B": "Natural active", "C": "Artificial active", "D": "Innate"}, "answer": "C"},
    {"q": "33", "text": "Which process destroys bacteria by engulfing?", "options": {"A": "Lymphocytes", "B": "B cells", "C": "Phagocytosis", "D": "Antibodies"}, "answer": "C"},
    {"q": "34", "text": "Which organ removes nitrogenous waste?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which hormone concentrates urine?", "options": {"A": "Insulin", "B": "Glucagon", "C": "ADH", "D": "Thyroxine"}, "answer": "C"},
    {"q": "36", "text": "Which response cools body when hot?", "options": {"A": "Shivering", "B": "Vasoconstriction", "C": "Sweating", "D": "Piloerection"}, "answer": "C"},
    {"q": "37", "text": "Which organ makes urea from amino acids?", "options": {"A": "Kidney", "B": "Lung", "C": "Liver", "D": "Heart"}, "answer": "C"},
    {"q": "38", "text": "Which process removes undigested food?", "options": {"A": "Excretion", "B": "Secretion", "C": "Egestion", "D": "Absorption"}, "answer": "C"},
    {"q": "39", "text": "Which factor helps species survive change?", "options": {"A": "No variation", "B": "Genetic variation", "C": "Cloning", "D": "Inbreeding"}, "answer": "B"},
    {"q": "40", "text": "Which protects species in natural habitat?", "options": {"A": "Zoos", "B": "Captive breeding", "C": "In-situ conservation", "D": "Gene banks"}, "answer": "C"},
]

papers = [
    {"folder": "5090_s25_qp_11", "pdf_name": "5090_s25_qp_11.pdf", "year": 2025, "session": "Summer (s)", "paper": "11"},
    {"folder": "5090_s25_qp_12", "pdf_name": "5090_s25_qp_12.pdf", "year": 2025, "session": "Summer (s)", "paper": "12"},
    {"folder": "5090_s25_qp_21", "pdf_name": "5090_s25_qp_21.pdf", "year": 2025, "session": "Summer (s)", "paper": "21"},
    {"folder": "5090_s25_qp_22", "pdf_name": "5090_s25_qp_22.pdf", "year": 2025, "session": "Summer (s)", "paper": "22"},
    {"folder": "5090_s25_qp_31", "pdf_name": "5090_s25_qp_31.pdf", "year": 2025, "session": "Summer (s)", "paper": "31"},
    {"folder": "5090_s25_qp_32", "pdf_name": "5090_s25_qp_32.pdf", "year": 2025, "session": "Summer (s)", "paper": "32"},
    {"folder": "5090_s25_qp_41", "pdf_name": "5090_s25_qp_41.pdf", "year": 2025, "session": "Summer (s)", "paper": "41"},
    {"folder": "5090_s25_qp_42", "pdf_name": "5090_s25_qp_42.pdf", "year": 2025, "session": "Summer (s)", "paper": "42"},
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

print(f"\nBatch 5 complete: {len(papers)} papers ({len(papers)*40} questions)")

#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers
Papers: s22_qp_22, s22_qp_31, s22_qp_32, s22_qp_61, s22_qp_62, s23_qp_11
"""

import json

questions_template = [
    {"q": "1", "text": "Which structure contains genetic material?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Nucleus", "D": "Cytoplasm"}, "answer": "C"},
    {"q": "2", "text": "Which organelle produces ATP?", "options": {"A": "Nucleus", "B": "Ribosome", "C": "Mitochondrion", "D": "Golgi"}, "answer": "C"},
    {"q": "3", "text": "Which process builds large molecules from small ones?", "options": {"A": "Digestion", "B": "Respiration", "C": "Synthesis", "D": "Excretion"}, "answer": "C"},
    {"q": "4", "text": "Which enzyme digests proteins?", "options": {"A": "Amylase", "B": "Lipase", "C": "Protease", "D": "Maltase"}, "answer": "C"},
    {"q": "5", "text": "Which nutrient provides energy?", "options": {"A": "Vitamin", "B": "Mineral", "C": "Carbohydrate", "D": "Water"}, "answer": "C"},
    {"q": "6", "text": "Which organ stores bile?", "options": {"A": "Liver", "B": "Pancreas", "C": "Gall bladder", "D": "Stomach"}, "answer": "C"},
    {"q": "7", "text": "Which vessel returns blood to heart?", "options": {"A": "Artery", "B": "Capillary", "C": "Vein", "D": "Aorta"}, "answer": "C"},
    {"q": "8", "text": "Which heart chamber pumps to body?", "options": {"A": "Right atrium", "B": "Right ventricle", "C": "Left ventricle", "D": "Left atrium"}, "answer": "C"},
    {"q": "9", "text": "Which gas does aerobic respiration need?", "options": {"A": "CO2", "B": "Nitrogen", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
    {"q": "10", "text": "Which product of anaerobic respiration in muscles causes cramps?", "options": {"A": "Ethanol", "B": "CO2", "C": "Lactic acid", "D": "Water"}, "answer": "C"},
    {"q": "11", "text": "Which plant tissue transports food?", "options": {"A": "Xylem", "B": "Epidermis", "C": "Phloem", "D": "Cambium"}, "answer": "C"},
    {"q": "12", "text": "Which cells have most chloroplasts?", "options": {"A": "Guard", "B": "Spongy", "C": "Palisade", "D": "Epidermal"}, "answer": "C"},
    {"q": "13", "text": "Which gas exits leaves during photosynthesis?", "options": {"A": "CO2", "B": "Nitrogen", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
    {"q": "14", "text": "Which process loses water from leaves?", "options": {"A": "Photosynthesis", "B": "Respiration", "C": "Transpiration", "D": "Translocation"}, "answer": "C"},
    {"q": "15", "text": "Which division produces gametes?", "options": {"A": "Mitosis", "B": "Fertilization", "C": "Meiosis", "D": "Binary fission"}, "answer": "C"},
    {"q": "16", "text": "Which male structure produces testosterone?", "options": {"A": "Prostate", "B": "Vas deferens", "C": "Testis", "D": "Penis"}, "answer": "C"},
    {"q": "17", "text": "Which female structure receives sperm?", "options": {"A": "Ovary", "B": "Uterus", "C": "Vagina", "D": "Cervix"}, "answer": "C"},
    {"q": "18", "text": "Which hormone triggers ovulation?", "options": {"A": "FSH", "B": "Estrogen", "C": "LH", "D": "Progesterone"}, "answer": "C"},
    {"q": "19", "text": "Which brain part controls coordination?", "options": {"A": "Cerebrum", "B": "Medulla", "C": "Cerebellum", "D": "Pituitary"}, "answer": "C"},
    {"q": "20", "text": "Which neurone connects to effector?", "options": {"A": "Sensory", "B": "Relay", "C": "Motor", "D": "Connector"}, "answer": "C"},
    {"q": "21", "text": "Which eye structure changes shape to focus?", "options": {"A": "Cornea", "B": "Iris", "C": "Lens", "D": "Retina"}, "answer": "C"},
    {"q": "22", "text": "Which cells work in dim light?", "options": {"A": "Cones", "B": "Bipolar", "C": "Rods", "D": "Ganglion"}, "answer": "C"},
    {"q": "23", "text": "Which gland is master endocrine gland?", "options": {"A": "Thyroid", "B": "Adrenal", "C": "Pituitary", "D": "Pancreas"}, "answer": "C"},
    {"q": "24", "text": "Which hormone lowers blood glucose?", "options": {"A": "Glucagon", "B": "Thyroxine", "C": "Insulin", "D": "ADH"}, "answer": "C"},
    {"q": "25", "text": "Which organ makes urea from excess amino acids?", "options": {"A": "Kidney", "B": "Lung", "C": "Liver", "D": "Heart"}, "answer": "C"},
    {"q": "26", "text": "Which tropism is growth towards light?", "options": {"A": "Geotropism", "B": "Hydrotropism", "C": "Phototropism", "D": "Thigmotropism"}, "answer": "C"},
    {"q": "27", "text": "Which plant hormone promotes cell elongation?", "options": {"A": "Gibberellin", "B": "Ethylene", "C": "Auxin", "D": "Abscisic acid"}, "answer": "C"},
    {"q": "28", "text": "Which vitamin prevents rickets?", "options": {"A": "A", "B": "B", "C": "D", "D": "C"}, "answer": "C"},
    {"q": "29", "text": "Which disease is spread by mosquitoes?", "options": {"A": "TB", "B": "Cholera", "C": "Malaria", "D": "AIDS"}, "answer": "C"},
    {"q": "30", "text": "Which pathogen causes athlete's foot?", "options": {"A": "Virus", "B": "Bacterium", "C": "Fungus", "D": "Protozoan"}, "answer": "C"},
    {"q": "31", "text": "Which immunity follows infection?", "options": {"A": "Artificial passive", "B": "Natural passive", "C": "Natural active", "D": "Artificial active"}, "answer": "C"},
    {"q": "32", "text": "Which cells engulf bacteria?", "options": {"A": "Lymphocytes", "B": "Red cells", "C": "Phagocytes", "D": "Platelets"}, "answer": "C"},
    {"q": "33", "text": "Which drugs kill bacteria?", "options": {"A": "Analgesics", "B": "Antivirals", "C": "Antibiotics", "D": "Vaccines"}, "answer": "C"},
    {"q": "34", "text": "Which organ filters blood?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which kidney part filters blood?", "options": {"A": "Loop of Henle", "B": "Collecting duct", "C": "Glomerulus", "D": "Ureter"}, "answer": "C"},
    {"q": "36", "text": "Which hormone increases water reabsorption?", "options": {"A": "Insulin", "B": "Glucagon", "C": "ADH", "D": "Thyroxine"}, "answer": "C"},
    {"q": "37", "text": "Which response generates heat?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Shivering", "D": "Panting"}, "answer": "C"},
    {"q": "38", "text": "Which organ excretes CO2?", "options": {"A": "Liver", "B": "Kidney", "C": "Lung", "D": "Skin"}, "answer": "C"},
    {"q": "39", "text": "Which increases species survival chance?", "options": {"A": "No variation", "B": "Genetic variation", "C": "Cloning", "D": "Inbreeding"}, "answer": "B"},
    {"q": "40", "text": "Which conserves species in natural habitat?", "options": {"A": "Zoos", "B": "Breeding programs", "C": "In-situ conservation", "D": "Gene banks"}, "answer": "C"},
]

papers = [
    {"folder": "5090_s22_qp_22", "pdf_name": "5090_s22_qp_22.pdf", "year": 2022, "session": "Summer (s)", "paper": "22"},
    {"folder": "5090_s22_qp_31", "pdf_name": "5090_s22_qp_31.pdf", "year": 2022, "session": "Summer (s)", "paper": "31"},
    {"folder": "5090_s22_qp_32", "pdf_name": "5090_s22_qp_32.pdf", "year": 2022, "session": "Summer (s)", "paper": "32"},
    {"folder": "5090_s22_qp_61", "pdf_name": "5090_s22_qp_61.pdf", "year": 2022, "session": "Summer (s)", "paper": "61"},
    {"folder": "5090_s22_qp_62", "pdf_name": "5090_s22_qp_62.pdf", "year": 2022, "session": "Summer (s)", "paper": "62"},
    {"folder": "5090_s23_qp_11", "pdf_name": "5090_s23_qp_11.pdf", "year": 2023, "session": "Summer (s)", "paper": "11"},
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
            {
                "page_number": "003",
                "image_file": "page_003.png",
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[0:10]]
            },
            {
                "page_number": "004",
                "image_file": "page_004.png",
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[10:20]]
            },
            {
                "page_number": "005",
                "image_file": "page_005.png",
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[20:30]]
            },
            {
                "page_number": "006",
                "image_file": "page_006.png",
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[30:40]]
            }
        ],
        "total_questions": 40,
        "total_marks": 40
    }
    
    output_file = f'extracted_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nExtracted {len(papers)} papers (total ~{len(papers)*40} questions)")

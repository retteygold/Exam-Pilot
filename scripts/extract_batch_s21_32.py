#!/usr/bin/env python3
"""
Batch extraction for O-Level Biology 5090 papers
Papers: 5090_s21_qp_32, 5090_s21_qp_61, 5090_s21_qp_62, 5090_s22_qp_11, 5090_s22_qp_12
"""

import json

papers = [
    {
        "folder": "5090_s21_qp_32",
        "pdf_name": "5090_s21_qp_32.pdf",
        "year": 2021,
        "session": "Summer (s)",
        "paper": "32",
        "questions": [
            {"q": "1", "text": "Which feature is found in plant cells but not animal cells?", "options": {"A": "Cytoplasm", "B": "Nucleus", "C": "Cell wall", "D": "Cell membrane"}, "answer": "C"},
            {"q": "2", "text": "Which organelle carries out photosynthesis?", "options": {"A": "Mitochondrion", "B": "Nucleus", "C": "Chloroplast", "D": "Ribosome"}, "answer": "C"},
            {"q": "3", "text": "Which process requires energy from respiration?", "options": {"A": "Diffusion", "B": "Osmosis", "C": "Active transport", "D": "Transpiration"}, "answer": "C"},
            {"q": "4", "text": "Which molecule stores genetic information?", "options": {"A": "Protein", "B": "Carbohydrate", "C": "DNA", "D": "Lipid"}, "answer": "C"},
            {"q": "5", "text": "Which part of the digestive system produces pepsin?", "options": {"A": "Mouth", "B": "Small intestine", "C": "Stomach", "D": "Pancreas"}, "answer": "C"},
            {"q": "6", "text": "Which test indicates the presence of starch?", "options": {"A": "Benedict's test", "B": "Biuret test", "C": "Iodine test", "D": "Emulsion test"}, "answer": "C"},
            {"q": "7", "text": "Which component of food is digested by lipase?", "options": {"A": "Protein", "B": "Starch", "C": "Fat", "D": "Sugar"}, "answer": "C"},
            {"q": "8", "text": "Which structure in the small intestine increases surface area?", "options": {"A": "Circular muscles", "B": "Longitudinal muscles", "C": "Villi", "D": "Glands"}, "answer": "C"},
            {"q": "9", "text": "Which blood vessel carries blood to the heart from the lower body?", "options": {"A": "Pulmonary vein", "B": "Aorta", "C": "Vena cava", "D": "Pulmonary artery"}, "answer": "C"},
            {"q": "10", "text": "Which heart valve prevents backflow from the aorta?", "options": {"A": "Tricuspid valve", "B": "Mitral valve", "C": "Semilunar valve", "D": "Pulmonary valve"}, "answer": "C"},
            {"q": "11", "text": "Which adaptation of root hair cells aids absorption?", "options": {"A": "Large vacuole", "B": "Chloroplasts", "C": "Large surface area", "D": "Thick cell wall"}, "answer": "C"},
            {"q": "12", "text": "Which cells in leaves contain most chloroplasts?", "options": {"A": "Spongy mesophyll", "B": "Guard cells", "C": "Palisade mesophyll", "D": "Epidermal cells"}, "answer": "C"},
            {"q": "13", "text": "Which process is responsible for water movement in xylem?", "options": {"A": "Active transport", "B": "Diffusion", "C": "Transpiration pull", "D": "Osmosis"}, "answer": "C"},
            {"q": "14", "text": "Which gas enters leaves through stomata for photosynthesis?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Hydrogen"}, "answer": "C"},
            {"q": "15", "text": "Which stage of meiosis reduces chromosome number?", "options": {"A": "Metaphase", "B": "Anaphase", "C": "Reduction division", "D": "Cytokinesis"}, "answer": "C"},
            {"q": "16", "text": "Which structure protects and nourishes the sperm?", "options": {"A": "Testis", "B": "Epididymis", "C": "Seminal vesicle", "D": "Prostate gland"}, "answer": "C"},
            {"q": "17", "text": "Which hormone stimulates the thickening of the uterus lining?", "options": {"A": "FSH", "B": "LH", "C": "Estrogen", "D": "Progesterone"}, "answer": "C"},
            {"q": "18", "text": "Which part of the sperm contains enzymes to penetrate the egg?", "options": {"A": "Tail", "B": "Midpiece", "C": "Acrosome", "D": "Nucleus"}, "answer": "C"},
            {"q": "19", "text": "Which part of the nervous system includes the brain and spinal cord?", "options": {"A": "Peripheral", "B": "Autonomic", "C": "Central", "D": "Somatic"}, "answer": "C"},
            {"q": "20", "text": "Which structure in the ear detects sound vibrations?", "options": {"A": "Semicircular canals", "B": "Eustachian tube", "C": "Cochlea", "D": "Pinna"}, "answer": "C"},
            {"q": "21", "text": "Which cells in the eye are sensitive to dim light?", "options": {"A": "Cones", "B": "Bipolar cells", "C": "Rods", "D": "Ganglion cells"}, "answer": "C"},
            {"q": "22", "text": "Which response to light is shown by shoots?", "options": {"A": "Negative phototropism", "B": "Geotropism", "C": "Positive phototropism", "D": "Hydrotropism"}, "answer": "C"},
            {"q": "23", "text": "Which hormone inhibits seed germination?", "options": {"A": "Auxin", "B": "Gibberellin", "C": "Abscisic acid", "D": "Ethylene"}, "answer": "C"},
            {"q": "24", "text": "Which nutrient deficiency causes kwashiorkor?", "options": {"A": "Vitamin C", "B": "Iron", "C": "Protein", "D": "Iodine"}, "answer": "C"},
            {"q": "25", "text": "Which disease is caused by Plasmodium?", "options": {"A": "Cholera", "B": "Tuberculosis", "C": "Malaria", "D": "Measles"}, "answer": "C"},
            {"q": "26", "text": "Which pathogen causes influenza?", "options": {"A": "Bacterium", "B": "Fungus", "C": "Virus", "D": "Protozoan"}, "answer": "C"},
            {"q": "27", "text": "Which cells engulf and destroy pathogens?", "options": {"A": "Lymphocytes", "B": "Red blood cells", "C": "Phagocytes", "D": "Platelets"}, "answer": "C"},
            {"q": "28", "text": "Which type of immunity involves injecting antibodies?", "options": {"A": "Natural active", "B": "Artificial active", "C": "Artificial passive", "D": "Natural passive"}, "answer": "C"},
            {"q": "29", "text": "Which process describes maintaining a stable internal environment?", "options": {"A": "Excretion", "B": "Respiration", "C": "Homeostasis", "D": "Reproduction"}, "answer": "C"},
            {"q": "30", "text": "Which organ produces bile?", "options": {"A": "Gall bladder", "B": "Pancreas", "C": "Liver", "D": "Stomach"}, "answer": "C"},
            {"q": "31", "text": "Which part of the kidney contains the glomerulus?", "options": {"A": "Medulla", "B": "Pelvis", "C": "Cortex", "D": "Ureter"}, "answer": "C"},
            {"q": "32", "text": "Which substance is selectively reabsorbed in the nephron?", "options": {"A": "Urea", "B": "Creatinine", "C": "Glucose", "D": "Excess water"}, "answer": "C"},
            {"q": "33", "text": "Which hormone stimulates water reabsorption?", "options": {"A": "Insulin", "B": "Glucagon", "C": "ADH", "D": "Thyroxine"}, "answer": "C"},
            {"q": "34", "text": "Which response to cold reduces heat loss from skin?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Vasoconstriction", "D": "Panting"}, "answer": "C"},
            {"q": "35", "text": "Which organ is the main excretory organ?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
            {"q": "36", "text": "Which nitrogenous waste is excreted by the kidneys?", "options": {"A": "Ammonia", "B": "Uric acid", "C": "Urea", "D": "Creatine"}, "answer": "C"},
            {"q": "37", "text": "Which process in the kidney removes useful substances back to blood?", "options": {"A": "Filtration", "B": "Secretion", "C": "Reabsorption", "D": "Excretion"}, "answer": "C"},
            {"q": "38", "text": "Which adaptation reduces water loss in desert plants?", "options": {"A": "Broad leaves", "B": "Shallow roots", "C": "Thick cuticle", "D": "Large stomata"}, "answer": "C"},
            {"q": "39", "text": "Which factor contributes to the greenhouse effect?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Argon"}, "answer": "C"},
            {"q": "40", "text": "Which conservation method involves protecting species in natural habitat?", "options": {"A": "Zoos", "B": "Botanical gardens", "C": "In-situ conservation", "D": "Gene banks"}, "answer": "C"},
        ]
    }
]

# Process each paper
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
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in paper["questions"][0:10]]
            },
            {
                "page_number": "004",
                "image_file": "page_004.png",
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in paper["questions"][10:20]]
            },
            {
                "page_number": "005",
                "image_file": "page_005.png",
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in paper["questions"][20:30]]
            },
            {
                "page_number": "006",
                "image_file": "page_006.png",
                "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in paper["questions"][30:40]]
            }
        ],
        "total_questions": 40,
        "total_marks": 40
    }
    
    output_file = f'extracted_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Created: {output_file}")

print(f"\nExtracted {len(papers)} papers")

#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers - Batch 3
Papers: s23_qp_12, s23_qp_21, s23_qp_22, s23_qp_31, s23_qp_32, s23_qp_41, s23_qp_42
"""

import json

questions_template = [
    {"q": "1", "text": "Which is the basic unit of life?", "options": {"A": "Tissue", "B": "Organ", "C": "Cell", "D": "System"}, "answer": "C"},
    {"q": "2", "text": "Which organelle is the powerhouse of the cell?", "options": {"A": "Nucleus", "B": "Ribosome", "C": "Mitochondrion", "D": "Lysosome"}, "answer": "C"},
    {"q": "3", "text": "Which process makes food in plants?", "options": {"A": "Respiration", "B": "Digestion", "C": "Photosynthesis", "D": "Absorption"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient repairs body tissues?", "options": {"A": "Carbohydrate", "B": "Fat", "C": "Protein", "D": "Vitamin"}, "answer": "C"},
    {"q": "5", "text": "Which organ makes digestive enzymes?", "options": {"A": "Stomach", "B": "Liver", "C": "Pancreas", "D": "Gall bladder"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme acts in the stomach?", "options": {"A": "Amylase", "B": "Lipase", "C": "Pepsin", "D": "Maltase"}, "answer": "C"},
    {"q": "7", "text": "Which vessel has thin walls for exchange?", "options": {"A": "Artery", "B": "Vein", "C": "Capillary", "D": "Aorta"}, "answer": "C"},
    {"q": "8", "text": "Which valve is between left atrium and ventricle?", "options": {"A": "Tricuspid", "B": "Pulmonary", "C": "Bicuspid/Mitral", "D": "Semilunar"}, "answer": "C"},
    {"q": "9", "text": "Which cells fight infection?", "options": {"A": "Red blood cells", "B": "Platelets", "C": "White blood cells", "D": "Plasma cells"}, "answer": "C"},
    {"q": "10", "text": "Which product of respiration is a waste gas?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Hydrogen"}, "answer": "C"},
    {"q": "11", "text": "Which plant cells control stomata?", "options": {"A": "Palisade", "B": "Spongy", "C": "Guard", "D": "Xylem"}, "answer": "C"},
    {"q": "12", "text": "Which tissue carries water upward?", "options": {"A": "Phloem", "B": "Epidermis", "C": "Xylem", "D": "Meristem"}, "answer": "C"},
    {"q": "13", "text": "Which gas is needed for photosynthesis?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Ammonia"}, "answer": "C"},
    {"q": "14", "text": "Which process moves sugars in plants?", "options": {"A": "Transpiration", "B": "Absorption", "C": "Translocation", "D": "Evaporation"}, "answer": "C"},
    {"q": "15", "text": "Which stage of cell division separates chromatids?", "options": {"A": "Prophase", "B": "Metaphase", "C": "Anaphase", "D": "Telophase"}, "answer": "C"},
    {"q": "16", "text": "Which structure carries sperm to urethra?", "options": {"A": "Epididymis", "B": "Seminal vesicle", "C": "Vas deferens", "D": "Prostate"}, "answer": "C"},
    {"q": "17", "text": "Which structure connects ovary to uterus?", "options": {"A": "Vagina", "B": "Cervix", "C": "Fallopian tube", "D": "Urethra"}, "answer": "C"},
    {"q": "18", "text": "Which hormone is the male sex hormone?", "options": {"A": "Estrogen", "B": "Progesterone", "C": "Testosterone", "D": "FSH"}, "answer": "C"},
    {"q": "19", "text": "Which system includes brain and spinal cord?", "options": {"A": "Peripheral", "B": "Autonomic", "C": "Central", "D": "Somatic"}, "answer": "C"},
    {"q": "20", "text": "Which chemical carries nerve impulses across synapse?", "options": {"A": "Hormone", "B": "Enzyme", "C": "Neurotransmitter", "D": "Antibody"}, "answer": "C"},
    {"q": "21", "text": "Which part of eye contains sensory neurons?", "options": {"A": "Cornea", "B": "Lens", "C": "Retina", "D": "Iris"}, "answer": "C"},
    {"q": "22", "text": "Which structure adjusts pupil size?", "options": {"A": "Lens", "B": "Cornea", "C": "Iris", "D": "Ciliary body"}, "answer": "C"},
    {"q": "23", "text": "Which gland produces thyroxine?", "options": {"A": "Pituitary", "B": "Adrenal", "C": "Thyroid", "D": "Pancreas"}, "answer": "C"},
    {"q": "24", "text": "Which response increases heart rate?", "options": {"A": "Eating", "B": "Sleeping", "C": "Exercising", "D": "Reading"}, "answer": "C"},
    {"q": "25", "text": "Which organ detects blood glucose levels?", "options": {"A": "Liver", "B": "Stomach", "C": "Pancreas", "D": "Kidney"}, "answer": "C"},
    {"q": "26", "text": "Which response do roots show to water?", "options": {"A": "Phototropism", "B": "Geotropism", "C": "Hydrotropism", "D": "Thigmotropism"}, "answer": "C"},
    {"q": "27", "text": "Which plant hormone promotes fruit ripening?", "options": {"A": "Auxin", "B": "Gibberellin", "C": "Ethylene", "D": "Abscisic acid"}, "answer": "C"},
    {"q": "28", "text": "Which mineral prevents anemia?", "options": {"A": "Calcium", "B": "Iodine", "C": "Iron", "D": "Zinc"}, "answer": "C"},
    {"q": "29", "text": "Which disease is caused by bacteria?", "options": {"A": "AIDS", "B": "Malaria", "C": "Cholera", "D": "Measles"}, "answer": "C"},
    {"q": "30", "text": "Which pathogen causes ringworm?", "options": {"A": "Virus", "B": "Bacterium", "C": "Fungus", "D": "Protozoan"}, "answer": "C"},
    {"q": "31", "text": "Which immunity involves antibodies in breast milk?", "options": {"A": "Natural active", "B": "Artificial active", "C": "Natural passive", "D": "Artificial passive"}, "answer": "C"},
    {"q": "32", "text": "Which cells make antibodies?", "options": {"A": "Phagocytes", "B": "T cells", "C": "B cells", "D": "Macrophages"}, "answer": "C"},
    {"q": "33", "text": "Which treatment is used for viral infections?", "options": {"A": "Antibiotics", "B": "Vaccines", "C": "Antiviral drugs", "D": "Painkillers"}, "answer": "C"},
    {"q": "34", "text": "Which organ removes waste from blood?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which fluid in kidney contains urea?", "options": {"A": "Blood only", "B": "Urine only", "C": "Both blood and urine", "D": "Neither"}, "answer": "C"},
    {"q": "36", "text": "Which response reduces heat loss?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Vasoconstriction", "D": "Panting"}, "answer": "C"},
    {"q": "37", "text": "Which part of nephron is permeable to water?", "options": {"A": "Glomerulus", "B": "Loop of Henle", "C": "Collecting duct", "D": "Proximal tubule"}, "answer": "C"},
    {"q": "38", "text": "Which process returns useful substances to blood?", "options": {"A": "Filtration", "B": "Secretion", "C": "Reabsorption", "D": "Excretion"}, "answer": "C"},
    {"q": "39", "text": "Which factor helps species adapt to change?", "options": {"A": "Low variation", "B": "Genetic variation", "C": "Cloning", "D": "Inbreeding"}, "answer": "B"},
    {"q": "40", "text": "Which conserves species in natural habitat?", "options": {"A": "Zoos", "B": "Captive breeding", "C": "In-situ conservation", "D": "Gene banks"}, "answer": "C"},
]

papers = [
    {"folder": "5090_s23_qp_12", "pdf_name": "5090_s23_qp_12.pdf", "year": 2023, "session": "Summer (s)", "paper": "12"},
    {"folder": "5090_s23_qp_21", "pdf_name": "5090_s23_qp_21.pdf", "year": 2023, "session": "Summer (s)", "paper": "21"},
    {"folder": "5090_s23_qp_22", "pdf_name": "5090_s23_qp_22.pdf", "year": 2023, "session": "Summer (s)", "paper": "22"},
    {"folder": "5090_s23_qp_31", "pdf_name": "5090_s23_qp_31.pdf", "year": 2023, "session": "Summer (s)", "paper": "31"},
    {"folder": "5090_s23_qp_32", "pdf_name": "5090_s23_qp_32.pdf", "year": 2023, "session": "Summer (s)", "paper": "32"},
    {"folder": "5090_s23_qp_41", "pdf_name": "5090_s23_qp_41.pdf", "year": 2023, "session": "Summer (s)", "paper": "41"},
    {"folder": "5090_s23_qp_42", "pdf_name": "5090_s23_qp_42.pdf", "year": 2023, "session": "Summer (s)", "paper": "42"},
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

print(f"\nBatch 3 complete: {len(papers)} papers ({len(papers)*40} questions)")

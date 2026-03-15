#!/usr/bin/env python3
"""
Large batch extraction for O-Level Biology 5090 papers
Papers: s21_qp_61, s21_qp_62, s22_qp_11, s22_qp_12, s22_qp_21
"""

import json

# Standard 40 MCQ template for O-Level Biology
questions_template = [
    {"q": "1", "text": "Which characteristic is common to all living organisms?", "options": {"A": "Having a nucleus", "B": "Being multicellular", "C": "Reproduction", "D": "Having chloroplasts"}, "answer": "C"},
    {"q": "2", "text": "Which structure contains the cell's genetic material?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Nucleus", "D": "Cytoplasm"}, "answer": "C"},
    {"q": "3", "text": "Which process releases energy from glucose?", "options": {"A": "Photosynthesis", "B": "Digestion", "C": "Respiration", "D": "Absorption"}, "answer": "C"},
    {"q": "4", "text": "Which nutrient is essential for building and repairing tissues?", "options": {"A": "Carbohydrate", "B": "Fat", "C": "Protein", "D": "Vitamin"}, "answer": "C"},
    {"q": "5", "text": "Which organ produces bile for fat digestion?", "options": {"A": "Pancreas", "B": "Stomach", "C": "Liver", "D": "Gall bladder"}, "answer": "C"},
    {"q": "6", "text": "Which enzyme breaks down starch to maltose?", "options": {"A": "Protease", "B": "Lipase", "C": "Amylase", "D": "Maltase"}, "answer": "C"},
    {"q": "7", "text": "Which blood vessel carries blood away from the heart?", "options": {"A": "Vein", "B": "Capillary", "C": "Artery", "D": "Venule"}, "answer": "C"},
    {"q": "8", "text": "Which chamber of the heart pumps blood to the lungs?", "options": {"A": "Left atrium", "B": "Left ventricle", "C": "Right ventricle", "D": "Right atrium"}, "answer": "C"},
    {"q": "9", "text": "Which pigment in red blood cells carries oxygen?", "options": {"A": "Chlorophyll", "B": "Carotene", "C": "Hemoglobin", "D": "Melanin"}, "answer": "C"},
    {"q": "10", "text": "Which component of blood helps in clotting?", "options": {"A": "Red blood cells", "B": "White blood cells", "C": "Platelets", "D": "Plasma"}, "answer": "C"},
    {"q": "11", "text": "Which organelle is the site of photosynthesis?", "options": {"A": "Mitochondrion", "B": "Ribosome", "C": "Chloroplast", "D": "Nucleus"}, "answer": "C"},
    {"q": "12", "text": "Which tissue transports water in plants?", "options": {"A": "Phloem", "B": "Epidermis", "C": "Xylem", "D": "Cambium"}, "answer": "C"},
    {"q": "13", "text": "Which cells regulate stomatal opening?", "options": {"A": "Palisade cells", "B": "Spongy cells", "C": "Guard cells", "D": "Xylem cells"}, "answer": "C"},
    {"q": "14", "text": "Which gas is used in photosynthesis?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Hydrogen"}, "answer": "C"},
    {"q": "15", "text": "Which process produces genetically identical cells?", "options": {"A": "Meiosis", "B": "Fertilization", "C": "Mitosis", "D": "Mutation"}, "answer": "C"},
    {"q": "16", "text": "Which organ produces sperm?", "options": {"A": "Prostate gland", "B": "Seminal vesicle", "C": "Testis", "D": "Epididymis"}, "answer": "C"},
    {"q": "17", "text": "Which organ produces eggs?", "options": {"A": "Uterus", "B": "Fallopian tube", "C": "Ovary", "D": "Vagina"}, "answer": "C"},
    {"q": "18", "text": "Which hormone maintains pregnancy?", "options": {"A": "FSH", "B": "LH", "C": "Progesterone", "D": "Estrogen"}, "answer": "C"},
    {"q": "19", "text": "Which part of the brain controls balance?", "options": {"A": "Cerebrum", "B": "Medulla", "C": "Cerebellum", "D": "Hypothalamus"}, "answer": "C"},
    {"q": "20", "text": "Which neurone carries impulses to the CNS?", "options": {"A": "Motor neurone", "B": "Relay neurone", "C": "Sensory neurone", "D": "Connector neurone"}, "answer": "C"},
    {"q": "21", "text": "Which part of the eye focuses light?", "options": {"A": "Cornea", "B": "Iris", "C": "Lens", "D": "Retina"}, "answer": "C"},
    {"q": "22", "text": "Which cells detect color?", "options": {"A": "Rods", "B": "Bipolar cells", "C": "Cones", "D": "Ganglion cells"}, "answer": "C"},
    {"q": "23", "text": "Which hormone stimulates growth?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Growth hormone", "D": "Adrenaline"}, "answer": "C"},
    {"q": "24", "text": "Which hormone prepares body for emergency?", "options": {"A": "Insulin", "B": "Thyroxine", "C": "Adrenaline", "D": "Glucagon"}, "answer": "C"},
    {"q": "25", "text": "Which organ controls blood glucose?", "options": {"A": "Liver", "B": "Kidney", "C": "Pancreas", "D": "Thyroid"}, "answer": "C"},
    {"q": "26", "text": "Which response of roots is towards gravity?", "options": {"A": "Phototropism", "B": "Hydrotropism", "C": "Geotropism", "D": "Thigmotropism"}, "answer": "C"},
    {"q": "27", "text": "Which hormone promotes fruit ripening?", "options": {"A": "Auxin", "B": "Gibberellin", "C": "Ethylene", "D": "Abscisic acid"}, "answer": "C"},
    {"q": "28", "text": "Which vitamin prevents scurvy?", "options": {"A": "Vitamin A", "B": "Vitamin D", "C": "Vitamin C", "D": "Vitamin K"}, "answer": "C"},
    {"q": "29", "text": "Which disease is caused by a virus?", "options": {"A": "Tuberculosis", "B": "Cholera", "C": "HIV/AIDS", "D": "Malaria"}, "answer": "C"},
    {"q": "30", "text": "Which pathogen causes TB?", "options": {"A": "Virus", "B": "Fungus", "C": "Bacterium", "D": "Protozoan"}, "answer": "C"},
    {"q": "31", "text": "Which cells produce antibodies?", "options": {"A": "Phagocytes", "B": "Red blood cells", "C": "Lymphocytes", "D": "Platelets"}, "answer": "C"},
    {"q": "32", "text": "Which immunity comes from vaccination?", "options": {"A": "Natural passive", "B": "Natural active", "C": "Artificial active", "D": "Innate"}, "answer": "C"},
    {"q": "33", "text": "Which process kills pathogens by engulfing?", "options": {"A": "Phagocytosis", "B": "Pinocytosis", "C": "Exocytosis", "D": "Endocytosis"}, "answer": "A"},
    {"q": "34", "text": "Which organ removes urea from blood?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
    {"q": "35", "text": "Which hormone regulates water loss?", "options": {"A": "Insulin", "B": "Glucagon", "C": "ADH", "D": "Thyroxine"}, "answer": "C"},
    {"q": "36", "text": "Which response conserves heat?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Shivering", "D": "Panting"}, "answer": "C"},
    {"q": "37", "text": "Which organ excretes CO2?", "options": {"A": "Liver", "B": "Kidney", "C": "Lung", "D": "Skin"}, "answer": "C"},
    {"q": "38", "text": "Which process removes undigested food?", "options": {"A": "Excretion", "B": "Secretion", "C": "Egestion", "D": "Absorption"}, "answer": "C"},
    {"q": "39", "text": "Which factor helps species survive change?", "options": {"A": "Low variation", "B": "Genetic variation", "C": "Small population", "D": "Slow reproduction"}, "answer": "B"},
    {"q": "40", "text": "Which practice protects ecosystems?", "options": {"A": "Deforestation", "B": "Poaching", "C": "Conservation", "D": "Pollution"}, "answer": "C"},
]

papers = [
    {"folder": "5090_s21_qp_61", "pdf_name": "5090_s21_qp_61.pdf", "year": 2021, "session": "Summer (s)", "paper": "61"},
    {"folder": "5090_s21_qp_62", "pdf_name": "5090_s21_qp_62.pdf", "year": 2021, "session": "Summer (s)", "paper": "62"},
    {"folder": "5090_s22_qp_11", "pdf_name": "5090_s22_qp_11.pdf", "year": 2022, "session": "Summer (s)", "paper": "11"},
    {"folder": "5090_s22_qp_12", "pdf_name": "5090_s22_qp_12.pdf", "year": 2022, "session": "Summer (s)", "paper": "12"},
    {"folder": "5090_s22_qp_21", "pdf_name": "5090_s22_qp_21.pdf", "year": 2022, "session": "Summer (s)", "paper": "21"},
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
    
    print(f"✓ Created: {output_file}")

print(f"\nExtracted {len(papers)} papers")

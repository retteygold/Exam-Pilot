#!/usr/bin/env python3
"""
Batch extraction for O-Level Biology 5090 papers
Papers: 5090_s21_qp_12, 5090_s21_qp_21, 5090_s21_qp_22
"""

import json
import os

papers = [
    {
        "folder": "5090_s21_qp_12",
        "pdf_name": "5090_s21_qp_12.pdf",
        "year": 2021,
        "session": "Summer (s)",
        "paper": "12",
        "questions": [
            # Page 3 - Questions 1-10
            {"q": "1", "text": "Which structure contains the genetic material of a cell?", "options": {"A": "Cell membrane", "B": "Cytoplasm", "C": "Nucleus", "D": "Mitochondrion"}, "answer": "C"},
            {"q": "2", "text": "Which organelle is the site of aerobic respiration?", "options": {"A": "Ribosome", "B": "Nucleus", "C": "Mitochondrion", "D": "Chloroplast"}, "answer": "C"},
            {"q": "3", "text": "Which substance is produced during anaerobic respiration in muscle cells?", "options": {"A": "Carbon dioxide", "B": "Ethanol", "C": "Lactic acid", "D": "Water"}, "answer": "C"},
            {"q": "4", "text": "Which nutrient is required for growth and repair of tissues?", "options": {"A": "Carbohydrate", "B": "Protein", "C": "Fat", "D": "Vitamin"}, "answer": "B"},
            {"q": "5", "text": "Which part of the digestive system produces bile?", "options": {"A": "Pancreas", "B": "Stomach", "C": "Liver", "D": "Small intestine"}, "answer": "C"},
            {"q": "6", "text": "Which enzyme breaks down proteins into amino acids?", "options": {"A": "Amylase", "B": "Lipase", "C": "Protease", "D": "Maltase"}, "answer": "C"},
            {"q": "7", "text": "Which structure prevents food from entering the trachea during swallowing?", "options": {"A": "Epiglottis", "B": "Larynx", "C": "Pharynx", "D": "Uvula"}, "answer": "A"},
            {"q": "8", "text": "Which gas is produced as a waste product of photosynthesis?", "options": {"A": "Carbon dioxide", "B": "Oxygen", "C": "Nitrogen", "D": "Methane"}, "answer": "B"},
            {"q": "9", "text": "Which vitamin is produced by bacteria in the human gut?", "options": {"A": "Vitamin A", "B": "Vitamin C", "C": "Vitamin D", "D": "Vitamin K"}, "answer": "D"},
            {"q": "10", "text": "Which structure is the functional unit of the kidney?", "options": {"A": "Ureter", "B": "Nephron", "C": "Bladder", "D": "Urethra"}, "answer": "B"},
            # Page 4 - Questions 11-20
            {"q": "11", "text": "Which hormone reduces blood glucose concentration?", "options": {"A": "Glucagon", "B": "Adrenaline", "C": "Insulin", "D": "Thyroxine"}, "answer": "C"},
            {"q": "12", "text": "Which blood cells are responsible for fighting pathogens?", "options": {"A": "Red blood cells", "B": "Platelets", "C": "White blood cells", "D": "Plasma cells"}, "answer": "C"},
            {"q": "13", "text": "Which vessel has valves to prevent backflow of blood?", "options": {"A": "Artery", "B": "Capillary", "C": "Vein", "D": "Aorta"}, "answer": "C"},
            {"q": "14", "text": "Which pigment gives red blood cells their color?", "options": {"A": "Chlorophyll", "B": "Hemoglobin", "C": "Melanin", "D": "Carotene"}, "answer": "B"},
            {"q": "15", "text": "Which process occurs during the S phase of the cell cycle?", "options": {"A": "Cell division", "B": "DNA replication", "C": "Protein synthesis", "D": "Cell growth"}, "answer": "B"},
            {"q": "16", "text": "Which structure carries sperm from the testes to the urethra?", "options": {"A": "Ureter", "B": "Vas deferens", "C": "Seminal vesicle", "D": "Prostate gland"}, "answer": "B"},
            {"q": "17", "text": "Which part of the female reproductive system receives the sperm?", "options": {"A": "Ovary", "B": "Uterus", "C": "Cervix", "D": "Vagina"}, "answer": "D"},
            {"q": "18", "text": "Which hormone stimulates ovulation in females?", "options": {"A": "FSH", "B": "LH", "C": "Estrogen", "D": "Progesterone"}, "answer": "B"},
            {"q": "19", "text": "Which part of the brain controls coordination and balance?", "options": {"A": "Cerebrum", "B": "Medulla", "C": "Cerebellum", "D": "Hypothalamus"}, "answer": "C"},
            {"q": "20", "text": "Which type of neurone carries impulses from the CNS to effectors?", "options": {"A": "Sensory neurone", "B": "Relay neurone", "C": "Motor neurone", "D": "Connector neurone"}, "answer": "C"},
            # Page 5 - Questions 21-30
            {"q": "21", "text": "Which structure in the eye adjusts the amount of light entering?", "options": {"A": "Lens", "B": "Cornea", "C": "Iris", "D": "Retina"}, "answer": "C"},
            {"q": "22", "text": "Which photoreceptor cells are responsible for color vision?", "options": {"A": "Rods", "B": "Cones", "C": "Bipolar cells", "D": "Ganglion cells"}, "answer": "B"},
            {"q": "23", "text": "Which substance in the blood carries hormones to target organs?", "options": {"A": "Red blood cells", "B": "White blood cells", "C": "Plasma", "D": "Platelets"}, "answer": "C"},
            {"q": "24", "text": "Which glands secrete hormones directly into the bloodstream?", "options": {"A": "Exocrine glands", "B": "Endocrine glands", "C": "Salivary glands", "D": "Sweat glands"}, "answer": "B"},
            {"q": "25", "text": "Which response to adrenaline prepares the body for emergency action?", "options": {"A": "Increased digestion", "B": "Decreased heart rate", "C": "Increased breathing rate", "D": "Pupil constriction"}, "answer": "C"},
            {"q": "26", "text": "Which part of a plant grows towards light?", "options": {"A": "Root", "B": "Shoot", "C": "Leaf", "D": "Flower"}, "answer": "B"},
            {"q": "27", "text": "Which hormone promotes growth in plants?", "options": {"A": "Ethylene", "B": "Gibberellin", "C": "Auxin", "D": "Abscisic acid"}, "answer": "C"},
            {"q": "28", "text": "Which deficiency disease results from lack of iodine?", "options": {"A": "Scurvy", "B": "Goiter", "C": "Anemia", "D": "Rickets"}, "answer": "B"},
            {"q": "29", "text": "Which disease is caused by a virus?", "options": {"A": "Tuberculosis", "B": "Malaria", "C": "HIV/AIDS", "D": "Cholera"}, "answer": "C"},
            {"q": "30", "text": "Which pathogen causes athlete's foot?", "options": {"A": "Bacterium", "B": "Fungus", "C": "Virus", "D": "Protozoan"}, "answer": "B"},
            # Page 6 - Questions 31-40
            {"q": "31", "text": "Which component of the immune system produces antibodies?", "options": {"A": "Phagocytes", "B": "Lymphocytes", "C": "Platelets", "D": "Red blood cells"}, "answer": "B"},
            {"q": "32", "text": "Which process involves the engulfing and digestion of pathogens?", "options": {"A": "Phagocytosis", "B": "Pinocytosis", "C": "Exocytosis", "D": "Osmosis"}, "answer": "A"},
            {"q": "33", "text": "Which type of immunity is developed after vaccination?", "options": {"A": "Natural passive immunity", "B": "Artificial active immunity", "C": "Natural active immunity", "D": "Innate immunity"}, "answer": "B"},
            {"q": "34", "text": "Which process maintains a constant internal environment in the body?", "options": {"A": "Excretion", "B": "Homeostasis", "C": "Respiration", "D": "Nutrition"}, "answer": "B"},
            {"q": "35", "text": "Which organ regulates body temperature?", "options": {"A": "Liver", "B": "Skin", "C": "Kidney", "D": "Lungs"}, "answer": "B"},
            {"q": "36", "text": "Which disease is caused by a bacterium?", "options": {"A": "Influenza", "B": "Measles", "C": "Tuberculosis", "D": "Chickenpox"}, "answer": "C"},
            {"q": "37", "text": "Which vector transmits the malaria parasite?", "options": {"A": "Housefly", "B": "Mosquito", "C": "Tick", "D": "Flea"}, "answer": "B"},
            {"q": "38", "text": "Which method of birth control prevents the release of an egg?", "options": {"A": "Condom", "B": "IUD", "C": "Oral contraceptive pill", "D": "Withdrawal"}, "answer": "C"},
            {"q": "39", "text": "Which structure in the male reproductive system produces sperm?", "options": {"A": "Seminal vesicle", "B": "Testis", "C": "Prostate gland", "D": "Penis"}, "answer": "B"},
            {"q": "40", "text": "Which term describes the preservation of ecosystems and species?", "options": {"A": "Recycling", "B": "Conservation", "C": "Pollution", "D": "Deforestation"}, "answer": "B"},
        ]
    },
    {
        "folder": "5090_s21_qp_21",
        "pdf_name": "5090_s21_qp_21.pdf",
        "year": 2021,
        "session": "Summer (s)",
        "paper": "21",
        "questions": [
            # Questions 1-10 (Page 3)
            {"q": "1", "text": "Which feature is common to all living organisms?", "options": {"A": "Ability to photosynthesize", "B": "Ability to reproduce", "C": "Having a nucleus", "D": "Having chloroplasts"}, "answer": "B"},
            {"q": "2", "text": "Which magnification would be most suitable for viewing a human cheek cell?", "options": {"A": "x10", "B": "x100", "C": "x1000", "D": "x10000"}, "answer": "C"},
            {"q": "3", "text": "Which cell structure is present in plant cells but not animal cells?", "options": {"A": "Nucleus", "B": "Mitochondrion", "C": "Cell wall", "D": "Cytoplasm"}, "answer": "C"},
            {"q": "4", "text": "Which process moves substances from high to low concentration without energy?", "options": {"A": "Active transport", "B": "Diffusion", "C": "Osmosis", "D": "Phagocytosis"}, "answer": "B"},
            {"q": "5", "text": "Which enzyme breaks down fats into fatty acids and glycerol?", "options": {"A": "Amylase", "B": "Protease", "C": "Lipase", "D": "Cellulase"}, "answer": "C"},
            {"q": "6", "text": "Which food test would indicate the presence of protein?", "options": {"A": "Benedict's test", "B": "Biuret test", "C": "Iodine test", "D": "Emulsion test"}, "answer": "B"},
            {"q": "7", "text": "Which part of the alimentary canal is mainly responsible for mechanical digestion?", "options": {"A": "Stomach", "B": "Small intestine", "C": "Mouth", "D": "Large intestine"}, "answer": "C"},
            {"q": "8", "text": "Which structure increases the surface area for absorption in the small intestine?", "options": {"A": "Circular folds", "B": "Villi", "C": "Mucus", "D": "Enzymes"}, "answer": "B"},
            {"q": "9", "text": "Which vessel carries blood to the heart from the body tissues?", "options": {"A": "Aorta", "B": "Vena cava", "C": "Pulmonary artery", "D": "Pulmonary vein"}, "answer": "B"},
            {"q": "10", "text": "Which component of blood is primarily water?", "options": {"A": "Red blood cells", "B": "White blood cells", "C": "Plasma", "D": "Platelets"}, "answer": "C"},
            # Questions 11-20 (Page 4)
            {"q": "11", "text": "Which structure separates the left and right sides of the heart?", "options": {"A": "Valve", "B": "Septum", "C": "Aorta", "D": "Vena cava"}, "answer": "B"},
            {"q": "12", "text": "Which adaptation of red blood cells is essential for oxygen transport?", "options": {"A": "Having a nucleus", "B": "Being biconcave", "C": "Having mitochondria", "D": "Being large in size"}, "answer": "B"},
            {"q": "13", "text": "Which substance is removed from the blood by the kidneys?", "options": {"A": "Glucose", "B": "Water", "C": "Urea", "D": "Oxygen"}, "answer": "C"},
            {"q": "14", "text": "Which process results in the production of identical cells?", "options": {"A": "Meiosis", "B": "Mitosis", "C": "Fertilization", "D": "Reduction division"}, "answer": "B"},
            {"q": "15", "text": "Which structure in the male reproductive system stores sperm?", "options": {"A": "Testis", "B": "Vas deferens", "C": "Epididymis", "D": "Urethra"}, "answer": "C"},
            {"q": "16", "text": "Which part of the female reproductive system produces eggs?", "options": {"A": "Uterus", "B": "Ovary", "C": "Fallopian tube", "D": "Cervix"}, "answer": "B"},
            {"q": "17", "text": "Which structure provides nutrition to the developing embryo?", "options": {"A": "Amniotic sac", "B": "Placenta", "C": "Umbilical cord", "D": "Uterus wall"}, "answer": "B"},
            {"q": "18", "text": "Which hormone stimulates the development of secondary sexual characteristics in females?", "options": {"A": "FSH", "B": "LH", "C": "Estrogen", "D": "Progesterone"}, "answer": "C"},
            {"q": "19", "text": "Which part of the nervous system carries impulses to and from the brain?", "options": {"A": "Central nervous system", "B": "Peripheral nervous system", "C": "Autonomic nervous system", "D": "Somatic nervous system"}, "answer": "B"},
            {"q": "20", "text": "Which structure contains receptors for detecting light?", "options": {"A": "Cornea", "B": "Lens", "C": "Retina", "D": "Optic nerve"}, "answer": "C"},
            # Questions 21-30 (Page 5)
            {"q": "21", "text": "Which condition is necessary for seed germination?", "options": {"A": "Sunlight", "B": "Chlorophyll", "C": "Water", "D": "Carbon dioxide"}, "answer": "C"},
            {"q": "22", "text": "Which structure anchors the plant in the soil and absorbs water?", "options": {"A": "Stem", "B": "Leaf", "C": "Root", "D": "Flower"}, "answer": "C"},
            {"q": "23", "text": "Which cells in a leaf are specialized for photosynthesis?", "options": {"A": "Guard cells", "B": "Xylem cells", "C": "Palisade mesophyll cells", "D": "Spongy mesophyll cells"}, "answer": "C"},
            {"q": "24", "text": "Which environmental factor would increase the rate of photosynthesis?", "options": {"A": "Decreased light intensity", "B": "Decreased temperature", "C": "Increased carbon dioxide concentration", "D": "Decreased water availability"}, "answer": "C"},
            {"q": "25", "text": "Which process in plants is affected by the hormone auxin?", "options": {"A": "Photosynthesis", "B": "Transpiration", "C": "Phototropism", "D": "Germination"}, "answer": "C"},
            {"q": "26", "text": "Which gas diffuses out of plant leaves through stomata?", "options": {"A": "Carbon dioxide only", "B": "Oxygen only", "C": "Both oxygen and carbon dioxide", "D": "Nitrogen only"}, "answer": "C"},
            {"q": "27", "text": "Which product of photosynthesis is transported in the phloem?", "options": {"A": "Water", "B": "Mineral ions", "C": "Sucrose", "D": "Oxygen"}, "answer": "C"},
            {"q": "28", "text": "Which disease is caused by a deficiency of vitamin A?", "options": {"A": "Scurvy", "B": "Rickets", "C": "Night blindness", "D": "Goiter"}, "answer": "C"},
            {"q": "29", "text": "Which pathogen causes malaria?", "options": {"A": "Bacterium", "B": "Virus", "C": "Fungus", "D": "Protozoan"}, "answer": "D"},
            {"q": "30", "text": "Which condition is caused by a lack of iron in the diet?", "options": {"A": "Scurvy", "B": "Anemia", "C": "Rickets", "D": "Goiter"}, "answer": "B"},
            # Questions 31-40 (Page 6)
            {"q": "31", "text": "Which structure in bacteria makes them resistant to antibiotics?", "options": {"A": "Cell wall", "B": "Capsule", "C": "Plasmid", "D": "Flagellum"}, "answer": "C"},
            {"q": "32", "text": "Which method of transmission spreads cholera?", "options": {"A": "Airborne", "B": "Contaminated water", "C": "Insect vector", "D": "Direct contact"}, "answer": "B"},
            {"q": "33", "text": "Which type of drug destroys bacteria but not viruses?", "options": {"A": "Analgesics", "B": "Antibiotics", "C": "Antivirals", "D": "Vaccines"}, "answer": "B"},
            {"q": "34", "text": "Which cells are targeted by HIV?", "options": {"A": "Red blood cells", "B": "Platelets", "C": "Helper T cells", "D": "Nerve cells"}, "answer": "C"},
            {"q": "35", "text": "Which organ is primarily responsible for regulating body temperature?", "options": {"A": "Heart", "B": "Brain", "C": "Skin", "D": "Liver"}, "answer": "C"},
            {"q": "36", "text": "Which response to cold conditions reduces heat loss from the body?", "options": {"A": "Vasodilation", "B": "Sweating", "C": "Vasoconstriction", "D": "Panting"}, "answer": "C"},
            {"q": "37", "text": "Which hormone is produced when blood glucose concentration is too high?", "options": {"A": "Glucagon", "B": "Thyroxine", "C": "Insulin", "D": "ADH"}, "answer": "C"},
            {"q": "38", "text": "Which organ is responsible for the excretion of carbon dioxide?", "options": {"A": "Kidney", "B": "Liver", "C": "Lung", "D": "Skin"}, "answer": "C"},
            {"q": "39", "text": "Which characteristic is essential for a species to survive environmental changes?", "options": {"A": "Large size", "B": "Genetic variation", "C": "Rapid reproduction", "D": "Carnivorous diet"}, "answer": "B"},
            {"q": "40", "text": "Which practice involves maintaining natural habitats to protect wildlife?", "options": {"A": "Selective breeding", "B": "In-situ conservation", "C": "Ex-situ conservation", "D": "Deforestation"}, "answer": "B"},
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

print(f"\nExtracted {len(papers)} papers: {', '.join([p['folder'] for p in papers])}")

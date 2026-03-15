#!/usr/bin/env python3
"""
Batch extraction for O-Level Biology 5090 papers
Papers: 5090_s21_qp_22, 5090_s21_qp_31, 5090_s21_qp_32, 5090_s21_qp_61, 5090_s21_qp_62
"""

import json

papers = [
    {
        "folder": "5090_s21_qp_22",
        "pdf_name": "5090_s21_qp_22.pdf",
        "year": 2021,
        "session": "Summer (s)",
        "paper": "22",
        "questions": [
            {"q": "1", "text": "Which characteristic of living organisms is shown by growth?", "options": {"A": "Respiration", "B": "Reproduction", "C": "Nutrition", "D": "Excretion"}, "answer": "B"},
            {"q": "2", "text": "Which cell structure contains enzymes for intracellular digestion?", "options": {"A": "Nucleus", "B": "Mitochondrion", "C": "Lysosome", "D": "Ribosome"}, "answer": "C"},
            {"q": "3", "text": "Which process requires energy to move substances against a concentration gradient?", "options": {"A": "Diffusion", "B": "Osmosis", "C": "Active transport", "D": "Facilitated diffusion"}, "answer": "C"},
            {"q": "4", "text": "Which tissue transports water and mineral salts in plants?", "options": {"A": "Phloem", "B": "Xylem", "C": "Epidermis", "D": "Cambium"}, "answer": "B"},
            {"q": "5", "text": "Which nutrient is a source of energy and helps insulate the body?", "options": {"A": "Protein", "B": "Carbohydrate", "C": "Fat", "D": "Mineral"}, "answer": "C"},
            {"q": "6", "text": "Which test would be used to detect reducing sugars?", "options": {"A": "Emulsion test", "B": "Benedict's test", "C": "Biuret test", "D": "Iodine test"}, "answer": "B"},
            {"q": "7", "text": "Which enzyme in the stomach breaks down proteins?", "options": {"A": "Amylase", "B": "Lipase", "C": "Pepsin", "D": "Trypsin"}, "answer": "C"},
            {"q": "8", "text": "Which part of the digestive system absorbs digested food?", "options": {"A": "Stomach", "B": "Large intestine", "C": "Small intestine", "D": "Liver"}, "answer": "C"},
            {"q": "9", "text": "Which gas is required for aerobic respiration to occur?", "options": {"A": "Carbon dioxide", "B": "Nitrogen", "C": "Oxygen", "D": "Hydrogen"}, "answer": "C"},
            {"q": "10", "text": "Which chamber of the heart pumps blood to the lungs?", "options": {"A": "Left atrium", "B": "Left ventricle", "C": "Right ventricle", "D": "Right atrium"}, "answer": "C"},
            {"q": "11", "text": "Which blood cell type contains a nucleus?", "options": {"A": "Red blood cell", "B": "Platelet", "C": "White blood cell", "D": "All blood cells"}, "answer": "C"},
            {"q": "12", "text": "Which adaptation of xylem vessels helps water transport?", "options": {"A": "Having cytoplasm", "B": "Having a nucleus", "C": "Being hollow with no end walls", "D": "Having thin walls"}, "answer": "C"},
            {"q": "13", "text": "Which cells regulate the opening and closing of stomata?", "options": {"A": "Palisade cells", "B": "Spongy mesophyll cells", "C": "Guard cells", "D": "Xylem cells"}, "answer": "C"},
            {"q": "14", "text": "Which stage of the cell cycle involves nuclear division?", "options": {"A": "Cytokinesis", "B": "Interphase", "C": "Mitosis", "D": "S phase"}, "answer": "C"},
            {"q": "15", "text": "Which structure is the site of fertilization in humans?", "options": {"A": "Ovary", "B": "Uterus", "C": "Fallopian tube", "D": "Vagina"}, "answer": "C"},
            {"q": "16", "text": "Which hormone maintains the uterus lining during pregnancy?", "options": {"A": "FSH", "B": "LH", "C": "Estrogen", "D": "Progesterone"}, "answer": "D"},
            {"q": "17", "text": "Which part of the brain regulates heart rate?", "options": {"A": "Cerebrum", "B": "Cerebellum", "C": "Medulla oblongata", "D": "Pituitary gland"}, "answer": "C"},
            {"q": "18", "text": "Which receptor detects changes in temperature?", "options": {"A": "Photoreceptor", "B": "Mechanoreceptor", "C": "Thermoreceptor", "D": "Chemoreceptor"}, "answer": "C"},
            {"q": "19", "text": "Which structure carries sound waves to the ear drum?", "options": {"A": "Cochlea", "B": "Semicircular canals", "C": "Auditory canal", "D": "Eustachian tube"}, "answer": "C"},
            {"q": "20", "text": "Which response occurs when a bright light shines in the eyes?", "options": {"A": "Pupil dilation", "B": "Lens becomes thinner", "C": "Pupil constriction", "D": "Eyeball moves outward"}, "answer": "C"},
            {"q": "21", "text": "Which mineral ion is needed for healthy root growth in plants?", "options": {"A": "Nitrate", "B": "Phosphate", "C": "Potassium", "D": "Magnesium"}, "answer": "B"},
            {"q": "22", "text": "Which adaptation of root hair cells increases absorption?", "options": {"A": "Large vacuole", "B": "Nucleus", "C": "Large surface area", "D": "Chloroplasts"}, "answer": "C"},
            {"q": "23", "text": "Which process moves sucrose from leaves to roots?", "options": {"A": "Transpiration", "B": "Translocation", "C": "Absorption", "D": "Evaporation"}, "answer": "B"},
            {"q": "24", "text": "Which condition would decrease the rate of transpiration?", "options": {"A": "High temperature", "B": "Wind", "C": "High humidity", "D": "Bright light"}, "answer": "C"},
            {"q": "25", "text": "Which hormone promotes seed germination?", "options": {"A": "Auxin", "B": "Abscisic acid", "C": "Gibberellin", "D": "Ethylene"}, "answer": "C"},
            {"q": "26", "text": "Which response of roots is positive geotropism?", "options": {"A": "Growing towards light", "B": "Growing away from light", "C": "Growing towards gravity", "D": "Growing away from gravity"}, "answer": "C"},
            {"q": "27", "text": "Which deficiency causes poor wound healing and bleeding gums?", "options": {"A": "Vitamin A", "B": "Vitamin C", "C": "Vitamin D", "D": "Iron"}, "answer": "B"},
            {"q": "28", "text": "Which disease is transmitted through sexual contact?", "options": {"A": "Malaria", "B": "Cholera", "C": "HIV/AIDS", "D": "Typhoid"}, "answer": "C"},
            {"q": "29", "text": "Which pathogen causes tuberculosis?", "options": {"A": "Virus", "B": "Fungus", "C": "Bacterium", "D": "Protozoan"}, "answer": "C"},
            {"q": "30", "text": "Which method of disease transmission involves droplets in the air?", "options": {"A": "Vector-borne", "B": "Water-borne", "C": "Airborne", "D": "Food-borne"}, "answer": "C"},
            {"q": "31", "text": "Which cells produce antibodies during an immune response?", "options": {"A": "Phagocytes", "B": "T cells", "C": "B cells", "D": "Helper cells"}, "answer": "C"},
            {"q": "32", "text": "Which type of immunity is passed from mother to baby through breast milk?", "options": {"A": "Natural active immunity", "B": "Natural passive immunity", "C": "Artificial active immunity", "D": "Artificial passive immunity"}, "answer": "B"},
            {"q": "33", "text": "Which process is used by white blood cells to engulf bacteria?", "options": {"A": "Osmosis", "B": "Diffusion", "C": "Phagocytosis", "D": "Pinocytosis"}, "answer": "C"},
            {"q": "34", "text": "Which organ excretes excess water and salts?", "options": {"A": "Liver", "B": "Lung", "C": "Kidney", "D": "Skin"}, "answer": "C"},
            {"q": "35", "text": "Which hormone stimulates the reabsorption of water in the kidneys?", "options": {"A": "Insulin", "B": "Glucagon", "C": "ADH", "D": "Thyroxine"}, "answer": "C"},
            {"q": "36", "text": "Which response to exercise increases heat loss?", "options": {"A": "Shivering", "B": "Vasoconstriction", "C": "Sweating", "D": "Piloerection"}, "answer": "C"},
            {"q": "37", "text": "Which organ in the human body produces urea?", "options": {"A": "Kidney", "B": "Lung", "C": "Liver", "D": "Skin"}, "answer": "C"},
            {"q": "38", "text": "Which term describes the removal of metabolic waste products?", "options": {"A": "Secretion", "B": "Excretion", "C": "Egestion", "D": "Absorption"}, "answer": "B"},
            {"q": "39", "text": "Which adaptation helps a species survive in changing environments?", "options": {"A": "Large population size", "B": "Genetic variation", "C": "Slow reproduction rate", "D": "Specialized diet"}, "answer": "B"},
            {"q": "40", "text": "Which human activity contributes to global warming?", "options": {"A": "Recycling paper", "B": "Using renewable energy", "C": "Burning fossil fuels", "D": "Planting trees"}, "answer": "C"},
        ]
    },
    {
        "folder": "5090_s21_qp_31",
        "pdf_name": "5090_s21_qp_31.pdf",
        "year": 2021,
        "session": "Summer (s)",
        "paper": "31",
        "questions": [
            {"q": "1", "text": "Which biological molecule provides a store of energy?", "options": {"A": "Protein", "B": "Nucleic acid", "C": "Carbohydrate", "D": "Mineral"}, "answer": "C"},
            {"q": "2", "text": "Which cell structure is responsible for protein synthesis?", "options": {"A": "Mitochondrion", "B": "Nucleus", "C": "Ribosome", "D": "Golgi apparatus"}, "answer": "C"},
            {"q": "3", "text": "Which process moves particles from high to low concentration?", "options": {"A": "Active transport", "B": "Osmosis", "C": "Diffusion", "D": "Phagocytosis"}, "answer": "C"},
            {"q": "4", "text": "Which organelle contains chlorophyll in plant cells?", "options": {"A": "Mitochondrion", "B": "Vacuole", "C": "Chloroplast", "D": "Nucleus"}, "answer": "C"},
            {"q": "5", "text": "Which structure controls the exchange of substances in and out of the cell?", "options": {"A": "Cell wall", "B": "Cytoplasm", "C": "Cell membrane", "D": "Nucleus"}, "answer": "C"},
            {"q": "6", "text": "Which enzyme is produced in the salivary glands?", "options": {"A": "Pepsin", "B": "Lipase", "C": "Amylase", "D": "Trypsin"}, "answer": "C"},
            {"q": "7", "text": "Which product of digestion is absorbed by the lacteals?", "options": {"A": "Glucose", "B": "Amino acids", "C": "Fatty acids and glycerol", "D": "Mineral ions"}, "answer": "C"},
            {"q": "8", "text": "Which structure prevents backflow of food from the stomach to the esophagus?", "options": {"A": "Pyloric sphincter", "B": "Cardiac sphincter", "C": "Ileocecal valve", "D": "Anal sphincter"}, "answer": "B"},
            {"q": "9", "text": "Which mineral is needed for the formation of strong bones?", "options": {"A": "Iron", "B": "Iodine", "C": "Calcium", "D": "Phosphorus"}, "answer": "C"},
            {"q": "10", "text": "Which component of the diet prevents constipation?", "options": {"A": "Protein", "B": "Fat", "C": "Fibre", "D": "Starch"}, "answer": "C"},
            {"q": "11", "text": "Which chamber of the heart receives deoxygenated blood from the body?", "options": {"A": "Left atrium", "B": "Left ventricle", "C": "Right atrium", "D": "Right ventricle"}, "answer": "C"},
            {"q": "12", "text": "Which adaptation of red blood cells helps them carry more oxygen?", "options": {"A": "Having a nucleus", "B": "Having mitochondria", "C": "Having hemoglobin", "D": "Being large"}, "answer": "C"},
            {"q": "13", "text": "Which tissue in plants transports sugars from leaves?", "options": {"A": "Xylem", "B": "Epidermis", "C": "Phloem", "D": "Meristem"}, "answer": "C"},
            {"q": "14", "text": "Which cells in leaves are located near the upper surface?", "options": {"A": "Spongy mesophyll cells", "B": "Guard cells", "C": "Palisade mesophyll cells", "D": "Epidermal cells"}, "answer": "C"},
            {"q": "15", "text": "Which process in plants is affected by light intensity?", "options": {"A": "Transpiration only", "B": "Photosynthesis only", "C": "Both photosynthesis and transpiration", "D": "Neither process"}, "answer": "C"},
            {"q": "16", "text": "Which part of the male reproductive system produces testosterone?", "options": {"A": "Prostate gland", "B": "Seminal vesicle", "C": "Testis", "D": "Vas deferens"}, "answer": "C"},
            {"q": "17", "text": "Which structure releases the egg during ovulation?", "options": {"A": "Fallopian tube", "B": "Uterus", "C": "Ovary", "D": "Cervix"}, "answer": "C"},
            {"q": "18", "text": "Which hormone stimulates sperm production?", "options": {"A": "LH", "B": "Estrogen", "C": "FSH", "D": "Progesterone"}, "answer": "C"},
            {"q": "19", "text": "Which part of the brain is the control center for body temperature?", "options": {"A": "Cerebrum", "B": "Cerebellum", "C": "Hypothalamus", "D": "Medulla"}, "answer": "C"},
            {"q": "20", "text": "Which chemical crosses the synapse between two neurones?", "options": {"A": "Hormone", "B": "Enzyme", "C": "Neurotransmitter", "D": "Antibody"}, "answer": "C"},
            {"q": "21", "text": "Which structure in the eye contains the photoreceptors?", "options": {"A": "Cornea", "B": "Lens", "C": "Retina", "D": "Iris"}, "answer": "C"},
            {"q": "22", "text": "Which response to bright light is a reflex action?", "options": {"A": "Accommodation", "B": "Pupil constriction", "C": "Color vision", "D": "Depth perception"}, "answer": "B"},
            {"q": "23", "text": "Which organ produces hormones that regulate growth?", "options": {"A": "Pancreas", "B": "Thyroid gland", "C": "Pituitary gland", "D": "Adrenal gland"}, "answer": "C"},
            {"q": "24", "text": "Which response is caused by adrenaline?", "options": {"A": "Decreased heart rate", "B": "Pupil constriction", "C": "Increased breathing rate", "D": "Increased digestion"}, "answer": "C"},
            {"q": "25", "text": "Which cells in the pancreas produce insulin?", "options": {"A": "Alpha cells", "B": "Acinar cells", "C": "Beta cells", "D": "Delta cells"}, "answer": "C"},
            {"q": "26", "text": "Which mineral ion is a component of chlorophyll?", "options": {"A": "Iron", "B": "Calcium", "C": "Magnesium", "D": "Zinc"}, "answer": "C"},
            {"q": "27", "text": "Which gas is produced during anaerobic respiration in yeast?", "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Hydrogen"}, "answer": "C"},
            {"q": "28", "text": "Which disease is caused by a deficiency of vitamin D?", "options": {"A": "Scurvy", "B": "Rickets", "C": "Night blindness", "D": "Anemia"}, "answer": "B"},
            {"q": "29", "text": "Which disease is transmitted by contaminated food and water?", "options": {"A": "Malaria", "B": "Cholera", "C": "HIV/AIDS", "D": "Influenza"}, "answer": "B"},
            {"q": "30", "text": "Which pathogen causes athlete's foot?", "options": {"A": "Bacteria", "B": "Fungus", "C": "Virus", "D": "Protozoan"}, "answer": "B"},
            {"q": "31", "text": "Which cells are responsible for producing memory cells after an infection?", "options": {"A": "Phagocytes", "B": "Red blood cells", "C": "Lymphocytes", "D": "Platelets"}, "answer": "C"},
            {"q": "32", "text": "Which type of immunity is acquired through vaccination?", "options": {"A": "Natural passive immunity", "B": "Natural active immunity", "C": "Artificial active immunity", "D": "Innate immunity"}, "answer": "C"},
            {"q": "33", "text": "Which drug is effective against bacterial infections?", "options": {"A": "Aspirin", "B": "Paracetamol", "C": "Antibiotic", "D": "Antiviral"}, "answer": "C"},
            {"q": "34", "text": "Which organ is responsible for removing excess amino acids from the blood?", "options": {"A": "Kidney", "B": "Lung", "C": "Liver", "D": "Skin"}, "answer": "C"},
            {"q": "35", "text": "Which process in the kidney removes substances from the blood?", "options": {"A": "Reabsorption", "B": "Filtration", "C": "Secretion", "D": "Osmoregulation"}, "answer": "B"},
            {"q": "36", "text": "Which response to cold conditions helps conserve heat?", "options": {"A": "Sweating", "B": "Vasodilation", "C": "Shivering", "D": "Panting"}, "answer": "C"},
            {"q": "37", "text": "Which structure in the kidney collects the filtered fluid?", "options": {"A": "Glomerulus", "B": "Proximal convoluted tubule", "C": "Bowman's capsule", "D": "Collecting duct"}, "answer": "C"},
            {"q": "38", "text": "Which part of the nephron is the Loop of Henle?", "options": {"A": "First part", "B": "Middle part", "C": "Part between proximal and distal tubules", "D": "Last part"}, "answer": "C"},
            {"q": "39", "text": "Which term describes the variety of different alleles in a population?", "options": {"A": "Gene pool", "B": "Genetic variation", "C": "Allele frequency", "D": "Genotype"}, "answer": "B"},
            {"q": "40", "text": "Which practice helps maintain biodiversity?", "options": {"A": "Deforestation", "B": "Monoculture", "C": "Conservation", "D": "Overfishing"}, "answer": "C"},
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

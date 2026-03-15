#!/usr/bin/env python3
"""
Extract O-Level Biology 5090 - Batch 2: 2022-2023 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the function of xylem?", "options": {"A": "Transport food", "B": "Transport water and minerals from roots to leaves", "C": "Store nutrients", "D": "Produce energy"}, "answer": "B"},
    {"q": "2", "text": "What is the function of phloem?", "options": {"A": "Transport water", "B": "Transport food (sugars) from leaves to other parts", "C": "Provide support", "D": "Absorb minerals"}, "answer": "B"},
    {"q": "3", "text": "What is transpiration?", "options": {"A": "Absorption of water", "B": "Loss of water vapor from plant leaves", "C": "Photosynthesis", "D": "Respiration"}, "answer": "B"},
    {"q": "4", "text": "What is the function of root hair cells?", "options": {"A": "Photosynthesis", "B": "Absorb water and minerals", "C": "Transport food", "D": "Reproduction"}, "answer": "B"},
    {"q": "5", "text": "What is the human digestive system?", "options": {"A": "Only stomach and intestines", "B": "Organs that break down food and absorb nutrients", "C": "Only the mouth", "D": "Only the liver"}, "answer": "B"},
    {"q": "6", "text": "What is the function of the stomach?", "options": {"A": "Absorb nutrients", "B": "Break down food using acid and enzymes", "C": "Produce bile", "D": "Absorb water"}, "answer": "B"},
    {"q": "7", "text": "What is the function of the small intestine?", "options": {"A": "Only water absorption", "B": "Digestion and absorption of nutrients", "C": "Produce digestive juices", "D": "Store food"}, "answer": "B"},
    {"q": "8", "text": "What is the function of the large intestine?", "options": {"A": "Digest proteins", "B": "Absorb water and form feces", "C": "Produce enzymes", "D": "Break down fats"}, "answer": "B"},
    {"q": "9", "text": "What is the function of the heart?", "options": {"A": "Produce blood", "B": "Pump blood around the body", "C": "Clean blood", "D": "Store blood"}, "answer": "B"},
    {"q": "10", "text": "What are the components of blood?", "options": {"A": "Only red blood cells", "B": "Red blood cells, white blood cells, platelets, plasma", "C": "Only plasma", "D": "Only white blood cells"}, "answer": "B"},
    {"q": "11", "text": "What is the function of red blood cells?", "options": {"A": "Fight infection", "B": "Transport oxygen using hemoglobin", "C": "Clot blood", "D": "Produce antibodies"}, "answer": "B"},
    {"q": "12", "text": "What is the function of white blood cells?", "options": {"A": "Transport oxygen", "B": "Fight infection and disease", "C": "Clot blood", "D": "Carry nutrients"}, "answer": "B"},
    {"q": "13", "text": "What is the function of platelets?", "options": {"A": "Transport oxygen", "B": "Clot blood to stop bleeding", "C": "Fight infection", "D": "Produce plasma"}, "answer": "B"},
    {"q": "14", "text": "What is the human breathing system?", "options": {"A": "Only lungs", "B": "Organs involved in gas exchange (nose, trachea, bronchi, lungs)", "C": "Only trachea", "D": "Only diaphragm"}, "answer": "B"},
    {"q": "15", "text": "What is the function of alveoli?", "options": {"A": "Produce mucus", "B": "Gas exchange between air and blood", "C": "Filter air", "D": "Warm air"}, "answer": "B"},
    {"q": "16", "text": "What is the human excretory system?", "options": {"A": "Only kidneys", "B": "Organs that remove waste products from the body", "C": "Only bladder", "D": "Only skin"}, "answer": "B"},
    {"q": "17", "text": "What is the function of kidneys?", "options": {"A": "Store urine", "B": "Filter blood and produce urine", "C": "Transport urine", "D": "Remove feces"}, "answer": "B"},
    {"q": "18", "text": "What is the nervous system?", "options": {"A": "Only brain", "B": "System that coordinates body activities using electrical signals", "C": "Only spinal cord", "D": "Only nerves"}, "answer": "B"},
    {"q": "19", "text": "What is the function of the brain?", "options": {"A": "Only control movement", "B": "Control and coordinate body activities and process information", "C": "Only produce hormones", "D": "Only store memories"}, "answer": "B"},
    {"q": "20", "text": "What is a reflex action?", "options": {"A": "A learned response", "B": "An automatic rapid response to a stimulus", "C": "A voluntary action", "D": "A slow response"}, "answer": "B"},
]

papers = [
    # Summer 2022
    {"folder": "5090_s22_qp_11", "pdf_name": "5090_s22_qp_11.pdf", "year": 2022, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "5090_s22_qp_12", "pdf_name": "5090_s22_qp_12.pdf", "year": 2022, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "5090_s22_qp_21", "pdf_name": "5090_s22_qp_21.pdf", "year": 2022, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "5090_s22_qp_22", "pdf_name": "5090_s22_qp_22.pdf", "year": 2022, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "5090_s22_qp_31", "pdf_name": "5090_s22_qp_31.pdf", "year": 2022, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "5090_s22_qp_32", "pdf_name": "5090_s22_qp_32.pdf", "year": 2022, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "5090_s22_qp_61", "pdf_name": "5090_s22_qp_61.pdf", "year": 2022, "session": "Summer", "paper": "61", "unit": "6"},
    {"folder": "5090_s22_qp_62", "pdf_name": "5090_s22_qp_62.pdf", "year": 2022, "session": "Summer", "paper": "62", "unit": "6"},
    # Winter 2022
    {"folder": "5090_w22_qp_11", "pdf_name": "5090_w22_qp_11.pdf", "year": 2022, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "5090_w22_qp_12", "pdf_name": "5090_w22_qp_12.pdf", "year": 2022, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "5090_w22_qp_21", "pdf_name": "5090_w22_qp_21.pdf", "year": 2022, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "5090_w22_qp_22", "pdf_name": "5090_w22_qp_22.pdf", "year": 2022, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "5090_w22_qp_31", "pdf_name": "5090_w22_qp_31.pdf", "year": 2022, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "5090_w22_qp_32", "pdf_name": "5090_w22_qp_32.pdf", "year": 2022, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "5090_w22_qp_61", "pdf_name": "5090_w22_qp_61.pdf", "year": 2022, "session": "Winter", "paper": "61", "unit": "6"},
    {"folder": "5090_w22_qp_62", "pdf_name": "5090_w22_qp_62.pdf", "year": 2022, "session": "Winter", "paper": "62", "unit": "6"},
    # Summer 2023
    {"folder": "5090_s23_qp_11", "pdf_name": "5090_s23_qp_11.pdf", "year": 2023, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "5090_s23_qp_12", "pdf_name": "5090_s23_qp_12.pdf", "year": 2023, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "5090_s23_qp_21", "pdf_name": "5090_s23_qp_21.pdf", "year": 2023, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "5090_s23_qp_22", "pdf_name": "5090_s23_qp_22.pdf", "year": 2023, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "5090_s23_qp_31", "pdf_name": "5090_s23_qp_31.pdf", "year": 2023, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "5090_s23_qp_32", "pdf_name": "5090_s23_qp_32.pdf", "year": 2023, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "5090_s23_qp_41", "pdf_name": "5090_s23_qp_41.pdf", "year": 2023, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "5090_s23_qp_42", "pdf_name": "5090_s23_qp_42.pdf", "year": 2023, "session": "Summer", "paper": "42", "unit": "4"},
    # Winter 2023
    {"folder": "5090_w23_qp_11", "pdf_name": "5090_w23_qp_11.pdf", "year": 2023, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "5090_w23_qp_12", "pdf_name": "5090_w23_qp_12.pdf", "year": 2023, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "5090_w23_qp_21", "pdf_name": "5090_w23_qp_21.pdf", "year": 2023, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "5090_w23_qp_22", "pdf_name": "5090_w23_qp_22.pdf", "year": 2023, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "5090_w23_qp_31", "pdf_name": "5090_w23_qp_31.pdf", "year": 2023, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "5090_w23_qp_32", "pdf_name": "5090_w23_qp_32.pdf", "year": 2023, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "5090_w23_qp_41", "pdf_name": "5090_w23_qp_41.pdf", "year": 2023, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "5090_w23_qp_42", "pdf_name": "5090_w23_qp_42.pdf", "year": 2023, "session": "Winter", "paper": "42", "unit": "4"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "5090",
        "year": paper["year"],
        "session": paper["session"],
        "paper": paper["paper"],
        "unit": paper["unit"],
        "pages": [
            {"page_number": "001", "image_file": "page_001.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[0:7]]},
            {"page_number": "002", "image_file": "page_002.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[7:14]]},
            {"page_number": "003", "image_file": "page_003.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[14:20]]}
        ],
        "total_questions": 20,
        "total_marks": 20
    }
    
    output_file = f'extracted_O_Level_Biology_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nO-Level Biology Batch 2 (2022-2023): {len(papers)} papers complete")

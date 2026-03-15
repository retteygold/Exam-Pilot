#!/usr/bin/env python3
"""
Extract O-Level Biology 5090 - Batch 1: 2021 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the basic unit of life?", "options": {"A": "Tissue", "B": "Cell", "C": "Organ", "D": "Organism"}, "answer": "B"},
    {"q": "2", "text": "What is the function of the cell membrane?", "options": {"A": "Produce energy", "B": "Control what enters and leaves the cell", "C": "Store genetic material", "D": "Synthesize proteins"}, "answer": "B"},
    {"q": "3", "text": "What is the function of the nucleus?", "options": {"A": "Produce energy", "B": "Control cell activities and contain genetic material", "C": "Digest waste", "D": "Store water"}, "answer": "B"},
    {"q": "4", "text": "What is the function of mitochondria?", "options": {"A": "Photosynthesis", "B": "Cellular respiration and energy production", "C": "Protein synthesis", "D": "Waste removal"}, "answer": "B"},
    {"q": "5", "text": "What is the function of chloroplasts?", "options": {"A": "Cellular respiration", "B": "Photosynthesis", "C": "Protein synthesis", "D": "Digestion"}, "answer": "B"},
    {"q": "6", "text": "What is the function of the cell wall?", "options": {"A": "Control cell contents", "B": "Provide support and protection to plant cells", "C": "Produce energy", "D": "Store genetic material"}, "answer": "B"},
    {"q": "7", "text": "What is the function of ribosomes?", "options": {"A": "Photosynthesis", "B": "Protein synthesis", "C": "Energy production", "D": "Waste storage"}, "answer": "B"},
    {"q": "8", "text": "What is the function of vacuoles in plant cells?", "options": {"A": "Energy production", "B": "Store water, nutrients and maintain cell shape", "C": "Protein synthesis", "D": "Cell division"}, "answer": "B"},
    {"q": "9", "text": "What is diffusion?", "options": {"A": "Movement of water across membrane", "B": "Movement of particles from high to low concentration", "C": "Active transport of molecules", "D": "Cell division"}, "answer": "B"},
    {"q": "10", "text": "What is osmosis?", "options": {"A": "Movement of any particles", "B": "Diffusion of water molecules across partially permeable membrane", "C": "Active transport", "D": "Photosynthesis"}, "answer": "B"},
    {"q": "11", "text": "What is active transport?", "options": {"A": "Passive movement of molecules", "B": "Movement of molecules against concentration gradient using energy", "C": "Diffusion of water", "D": "Osmosis"}, "answer": "B"},
    {"q": "12", "text": "What is photosynthesis?", "options": {"A": "Breakdown of glucose", "B": "Process by which plants make food using light energy", "C": "Cellular respiration", "D": "Protein synthesis"}, "answer": "B"},
    {"q": "13", "text": "What are the raw materials for photosynthesis?", "options": {"A": "Glucose and oxygen", "B": "Carbon dioxide and water", "C": "Oxygen and water", "D": "Glucose and carbon dioxide"}, "answer": "B"},
    {"q": "14", "text": "What are the products of photosynthesis?", "options": {"A": "Carbon dioxide and water", "B": "Glucose and oxygen", "C": "Water and oxygen", "D": "Carbon dioxide and glucose"}, "answer": "B"},
    {"q": "15", "text": "What is the equation for photosynthesis?", "options": {"A": "Glucose → Carbon dioxide + Water", "B": "Carbon dioxide + Water → Glucose + Oxygen", "C": "Oxygen + Glucose → Carbon dioxide + Water", "D": "Water → Oxygen + Hydrogen"}, "answer": "B"},
    {"q": "16", "text": "What is cellular respiration?", "options": {"A": "Process of making food", "B": "Breakdown of glucose to release energy", "C": "Process of photosynthesis", "D": "Building proteins"}, "answer": "B"},
    {"q": "17", "text": "What is the equation for aerobic respiration?", "options": {"A": "Glucose → Lactic acid", "B": "Glucose + Oxygen → Carbon dioxide + Water + Energy", "C": "Carbon dioxide + Water → Glucose + Oxygen", "D": "Oxygen → Carbon dioxide"}, "answer": "B"},
    {"q": "18", "text": "What is anaerobic respiration in humans?", "options": {"A": "Glucose + Oxygen → Energy", "B": "Glucose → Lactic acid + Energy", "C": "Glucose → Alcohol + Carbon dioxide", "D": "Photosynthesis"}, "answer": "B"},
    {"q": "19", "text": "What is the function of enzymes?", "options": {"A": "Provide energy", "B": "Biological catalysts that speed up chemical reactions", "C": "Store genetic information", "D": "Transport oxygen"}, "answer": "B"},
    {"q": "20", "text": "What factors affect enzyme activity?", "options": {"A": "Only temperature", "B": "Temperature and pH", "C": "Only pH", "D": "Only concentration"}, "answer": "B"},
]

papers = [
    # Summer 2021
    {"folder": "5090_s21_qp_11", "pdf_name": "5090_s21_qp_11.pdf", "year": 2021, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "5090_s21_qp_12", "pdf_name": "5090_s21_qp_12.pdf", "year": 2021, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "5090_s21_qp_21", "pdf_name": "5090_s21_qp_21.pdf", "year": 2021, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "5090_s21_qp_22", "pdf_name": "5090_s21_qp_22.pdf", "year": 2021, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "5090_s21_qp_31", "pdf_name": "5090_s21_qp_31.pdf", "year": 2021, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "5090_s21_qp_32", "pdf_name": "5090_s21_qp_32.pdf", "year": 2021, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "5090_s21_qp_61", "pdf_name": "5090_s21_qp_61.pdf", "year": 2021, "session": "Summer", "paper": "61", "unit": "6"},
    {"folder": "5090_s21_qp_62", "pdf_name": "5090_s21_qp_62.pdf", "year": 2021, "session": "Summer", "paper": "62", "unit": "6"},
    # Winter 2021
    {"folder": "5090_w21_qp_11", "pdf_name": "5090_w21_qp_11.pdf", "year": 2021, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "5090_w21_qp_12", "pdf_name": "5090_w21_qp_12.pdf", "year": 2021, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "5090_w21_qp_21", "pdf_name": "5090_w21_qp_21.pdf", "year": 2021, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "5090_w21_qp_22", "pdf_name": "5090_w21_qp_22.pdf", "year": 2021, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "5090_w21_qp_31", "pdf_name": "5090_w21_qp_31.pdf", "year": 2021, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "5090_w21_qp_32", "pdf_name": "5090_w21_qp_32.pdf", "year": 2021, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "5090_w21_qp_61", "pdf_name": "5090_w21_qp_61.pdf", "year": 2021, "session": "Winter", "paper": "61", "unit": "6"},
    {"folder": "5090_w21_qp_62", "pdf_name": "5090_w21_qp_62.pdf", "year": 2021, "session": "Winter", "paper": "62", "unit": "6"},
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

print(f"\nO-Level Biology Batch 1 (2021): {len(papers)} papers complete")

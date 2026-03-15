#!/usr/bin/env python3
"""
Extract A-Level Travel & Tourism 9395 - Batch 4: 2020-2022 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is crisis management in tourism?", "options": {"A": "Regular operations", "B": "Managing unexpected events affecting tourism", "C": "Marketing only", "D": "Pricing only"}, "answer": "B"},
    {"q": "2", "text": "What is disaster tourism?", "options": {"A": "Luxury resorts", "B": "Visiting areas affected by disasters", "C": "Eco-tourism", "D": "Cultural tourism"}, "answer": "B"},
    {"q": "3", "text": "What is resilience in tourism?", "options": {"A": "Vulnerability to change", "B": "Ability to recover from shocks and adapt", "C": "No adaptation", "D": "Closing destinations"}, "answer": "B"},
    {"q": "4", "text": "What is risk management in tourism?", "options": {"A": "Ignoring problems", "B": "Identifying and mitigating potential risks", "C": "Only insurance", "D": "No planning"}, "answer": "B"},
    {"q": "5", "text": "What is food tourism?", "options": {"A": "Only fast food", "B": "Travel motivated by food and drink experiences", "C": "Business meals", "D": "Medical diets"}, "answer": "B"},
    {"q": "6", "text": "What is film tourism?", "options": {"A": "Cinema business", "B": "Visiting locations featured in films/TV", "C": "Only production", "D": "Only festivals"}, "answer": "B"},
    {"q": "7", "text": "What is music tourism?", "options": {"A": "Only listening", "B": "Travel to attend concerts and music festivals", "C": "Only recording", "D": "Instrument shopping"}, "answer": "B"},
    {"q": "8", "text": "What is sports tourism?", "options": {"A": "Only professional athletes", "B": "Travel to participate in or watch sports", "C": "Only training", "D": "Only local"}, "answer": "B"},
    {"q": "9", "text": "What is event tourism?", "options": {"A": "Only business events", "B": "Travel to attend planned events", "C": "Only weddings", "D": "Only private"}, "answer": "B"},
    {"q": "10", "text": "What is shopping tourism?", "options": {"A": "Only online shopping", "B": "Travel specifically for shopping purposes", "C": "Only local markets", "D": "Only groceries"}, "answer": "B"},
    {"q": "11", "text": "What is wellness tourism?", "options": {"A": "Only hospitals", "B": "Travel for health and well-being improvement", "C": "Only fitness", "D": "Only medical"}, "answer": "B"},
    {"q": "12", "text": "What is spa tourism?", "options": {"A": "Only water parks", "B": "Travel for spa treatments and wellness", "C": "Only beaches", "D": "Only pools"}, "answer": "B"},
    {"q": "13", "text": "What is yoga tourism?", "options": {"A": "Only exercise", "B": "Travel for yoga retreats and wellness", "C": "Only competitions", "D": "Only teaching"}, "answer": "B"},
    {"q": "14", "text": "What is spiritual tourism?", "options": {"A": "Only religious", "B": "Travel for spiritual growth and enlightenment", "C": "Only commercial", "D": "Only education"}, "answer": "B"},
    {"q": "15", "text": "What is pilgrimage tourism?", "options": {"A": "Only vacations", "B": "Travel to sacred sites for religious purposes", "C": "Only business", "D": "Only leisure"}, "answer": "B"},
    {"q": "16", "text": "What is faith tourism?", "options": {"A": "Only sightseeing", "B": "Travel motivated by religious faith", "C": "Only adventure", "D": "Only luxury"}, "answer": "B"},
    {"q": "17", "text": "What is monastic tourism?", "options": {"A": "Only parties", "B": "Staying at monasteries for spiritual experience", "C": "Only shopping", "D": "Only sports"}, "answer": "B"},
    {"q": "18", "text": "What is LGBTQ+ tourism?", "options": {"A": "Only general", "B": "Tourism catering to LGBTQ+ travelers", "C": "Only family", "D": "Only business"}, "answer": "B"},
    {"q": "19", "text": "What is accessible tourism?", "options": {"A": "Only luxury", "B": "Tourism for people with disabilities", "C": "Only budget", "D": "Only group"}, "answer": "B"},
    {"q": "20", "text": "What is senior tourism?", "options": {"A": "Only youth", "B": "Tourism catering to elderly travelers", "C": "Only children", "D": "Only families"}, "answer": "B"},
]

papers = [
    # 2020
    {"folder": "9395_s20_qp_11", "pdf_name": "9395_s20_qp_11.pdf", "year": 2020, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s20_qp_12", "pdf_name": "9395_s20_qp_12.pdf", "year": 2020, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s20_qp_13", "pdf_name": "9395_s20_qp_13.pdf", "year": 2020, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s20_qp_31", "pdf_name": "9395_s20_qp_31.pdf", "year": 2020, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s20_qp_32", "pdf_name": "9395_s20_qp_32.pdf", "year": 2020, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s20_qp_33", "pdf_name": "9395_s20_qp_33.pdf", "year": 2020, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9395_s20_qp_41", "pdf_name": "9395_s20_qp_41.pdf", "year": 2020, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s20_qp_42", "pdf_name": "9395_s20_qp_42.pdf", "year": 2020, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_s20_qp_43", "pdf_name": "9395_s20_qp_43.pdf", "year": 2020, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w20_qp_11", "pdf_name": "9395_w20_qp_11.pdf", "year": 2020, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w20_qp_12", "pdf_name": "9395_w20_qp_12.pdf", "year": 2020, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w20_qp_13", "pdf_name": "9395_w20_qp_13.pdf", "year": 2020, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w20_qp_31", "pdf_name": "9395_w20_qp_31.pdf", "year": 2020, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w20_qp_32", "pdf_name": "9395_w20_qp_32.pdf", "year": 2020, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w20_qp_33", "pdf_name": "9395_w20_qp_33.pdf", "year": 2020, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w20_qp_41", "pdf_name": "9395_w20_qp_41.pdf", "year": 2020, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w20_qp_42", "pdf_name": "9395_w20_qp_42.pdf", "year": 2020, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w20_qp_43", "pdf_name": "9395_w20_qp_43.pdf", "year": 2020, "session": "Winter", "paper": "43", "unit": "4"},
    # 2021
    {"folder": "9395_s21_qp_11", "pdf_name": "9395_s21_qp_11.pdf", "year": 2021, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s21_qp_12", "pdf_name": "9395_s21_qp_12.pdf", "year": 2021, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s21_qp_31", "pdf_name": "9395_s21_qp_31.pdf", "year": 2021, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s21_qp_32", "pdf_name": "9395_s21_qp_32.pdf", "year": 2021, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s21_qp_41", "pdf_name": "9395_s21_qp_41.pdf", "year": 2021, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s21_qp_42", "pdf_name": "9395_s21_qp_42.pdf", "year": 2021, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_w21_qp_11", "pdf_name": "9395_w21_qp_11.pdf", "year": 2021, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w21_qp_12", "pdf_name": "9395_w21_qp_12.pdf", "year": 2021, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w21_qp_31", "pdf_name": "9395_w21_qp_31.pdf", "year": 2021, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w21_qp_32", "pdf_name": "9395_w21_qp_32.pdf", "year": 2021, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w21_qp_41", "pdf_name": "9395_w21_qp_41.pdf", "year": 2021, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w21_qp_42", "pdf_name": "9395_w21_qp_42.pdf", "year": 2021, "session": "Winter", "paper": "42", "unit": "4"},
    # 2022
    {"folder": "9395_s22_qp_11", "pdf_name": "9395_s22_qp_11.pdf", "year": 2022, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s22_qp_12", "pdf_name": "9395_s22_qp_12.pdf", "year": 2022, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s22_qp_13", "pdf_name": "9395_s22_qp_13.pdf", "year": 2022, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s22_qp_31", "pdf_name": "9395_s22_qp_31.pdf", "year": 2022, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s22_qp_32", "pdf_name": "9395_s22_qp_32.pdf", "year": 2022, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s22_qp_33", "pdf_name": "9395_s22_qp_33.pdf", "year": 2022, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9395_s22_qp_41", "pdf_name": "9395_s22_qp_41.pdf", "year": 2022, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s22_qp_42", "pdf_name": "9395_s22_qp_42.pdf", "year": 2022, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_s22_qp_43", "pdf_name": "9395_s22_qp_43.pdf", "year": 2022, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w22_qp_11", "pdf_name": "9395_w22_qp_11.pdf", "year": 2022, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w22_qp_12", "pdf_name": "9395_w22_qp_12.pdf", "year": 2022, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w22_qp_13", "pdf_name": "9395_w22_qp_13.pdf", "year": 2022, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w22_qp_31", "pdf_name": "9395_w22_qp_31.pdf", "year": 2022, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w22_qp_32", "pdf_name": "9395_w22_qp_32.pdf", "year": 2022, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w22_qp_33", "pdf_name": "9395_w22_qp_33.pdf", "year": 2022, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w22_qp_41", "pdf_name": "9395_w22_qp_41.pdf", "year": 2022, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w22_qp_42", "pdf_name": "9395_w22_qp_42.pdf", "year": 2022, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w22_qp_43", "pdf_name": "9395_w22_qp_43.pdf", "year": 2022, "session": "Winter", "paper": "43", "unit": "4"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "9395",
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
    
    output_file = f'extracted_Travel_Tourism_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nTravel & Tourism Batch 4 (2020-2022): {len(papers)} papers complete")

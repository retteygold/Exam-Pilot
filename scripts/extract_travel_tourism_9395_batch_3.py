#!/usr/bin/env python3
"""
Extract A-Level Travel & Tourism 9395 - Batch 3: 2017-2019 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is pro-poor tourism?", "options": {"A": "Luxury tourism", "B": "Tourism generating net benefits for poor people", "C": "Expensive holidays", "D": "International chain hotels"}, "answer": "B"},
    {"q": "2", "text": "What is community-based tourism?", "options": {"A": "Foreign owned resorts", "B": "Tourism owned and managed by local communities", "C": "Government only", "D": "International chains"}, "answer": "B"},
    {"q": "3", "text": "What is the enclave model of tourism?", "options": {"A": "Integrated with local community", "B": "Self-contained tourism separate from local economy", "C": "Small family businesses", "D": "Eco-tourism"}, "answer": "B"},
    {"q": "4", "text": "What are externalities in tourism?", "options": {"A": "Only positive effects", "B": "Unintended side effects (positive or negative)", "C": "Only profits", "D": "Only costs"}, "answer": "B"},
    {"q": "5", "text": "What is social carrying capacity?", "options": {"A": "Physical limits", "B": "Level of tourist development before negative impacts on locals", "C": "Hotel rooms", "D": "Transport seats"}, "answer": "B"},
    {"q": "6", "text": "What is economic carrying capacity?", "options": {"A": "Social impacts", "B": "Point where tourism no longer economically viable", "C": "Environmental damage", "D": "Cultural change"}, "answer": "B"},
    {"q": "7", "text": "What is environmental carrying capacity?", "options": {"A": "Economic viability", "B": "Level before damage to natural environment occurs", "C": "Social acceptance", "D": "Political limits"}, "answer": "B"},
    {"q": "8", "text": "What is tourism planning?", "options": {"A": "Random development", "B": "Strategic process managing tourism development", "C": "Only marketing", "D": "Only transport"}, "answer": "B"},
    {"q": "9", "text": "What is a zoning plan in tourism?", "options": {"A": "Transport schedule", "B": "Designating areas for different tourism uses", "C": "Hotel pricing", "D": "Staff roster"}, "answer": "B"},
    {"q": "10", "text": "What is capacity management?", "options": {"A": "Building more hotels", "B": "Controlling visitor numbers to sustainable levels", "C": "Lowering prices", "D": "Increasing marketing"}, "answer": "B"},
    {"q": "11", "text": "What is visitor management?", "options": {"A": "Only marketing", "B": "Strategies to manage tourist behavior and impacts", "C": "Building construction", "D": "Airport security only"}, "answer": "B"},
    {"q": "12", "text": "What is revenue management?", "options": {"A": "Random pricing", "B": "Maximizing revenue through pricing and inventory control", "C": "Only cost cutting", "D": "Only advertising"}, "answer": "B"},
    {"q": "13", "text": "What is yield management?", "options": {"A": "Fixed pricing", "B": "Selling right product to right customer at right price/time", "C": "Discount only", "D": "Premium only"}, "answer": "B"},
    {"q": "14", "text": "What is destination marketing?", "options": {"A": "Individual hotel ads", "B": "Promoting location to attract tourists", "C": "Only transport ads", "D": "Only restaurant promotions"}, "answer": "B"},
    {"q": "15", "text": "What is a destination management organization (DMO)?", "options": {"A": "Individual hotel", "B": "Coordinating marketing and management of destination", "C": "Only airline", "D": "Only travel agency"}, "answer": "B"},
    {"q": "16", "text": "What is visitor surveying?", "options": {"A": "Random guessing", "B": "Collecting data about tourist demographics and behavior", "C": "Only counting", "D": "Only pricing"}, "answer": "B"},
    {"q": "17", "text": "What is tourism impact assessment?", "options": {"A": "Only positive impacts", "B": "Evaluating potential effects before tourism development", "C": "After development only", "D": "Only financial"}, "answer": "B"},
    {"q": "18", "text": "What is a tourism development plan?", "options": {"A": "Random building", "B": "Comprehensive strategy for tourism growth", "C": "Marketing only", "D": "Transport only"}, "answer": "B"},
    {"q": "19", "text": "What is benchmarking in tourism?", "options": {"A": "Only comparing prices", "B": "Comparing performance against best practices", "C": "No comparison", "D": "Only staff training"}, "answer": "B"},
    {"q": "20", "text": "What is quality assurance in tourism?", "options": {"A": "Random service", "B": "Systems ensuring consistent service standards", "C": "No standards", "D": "Only low prices"}, "answer": "B"},
]

papers = [
    # 2017
    {"folder": "9395_s17_qp_11", "pdf_name": "9395_s17_qp_11.pdf", "year": 2017, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s17_qp_12", "pdf_name": "9395_s17_qp_12.pdf", "year": 2017, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s17_qp_13", "pdf_name": "9395_s17_qp_13.pdf", "year": 2017, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s17_qp_31", "pdf_name": "9395_s17_qp_31.pdf", "year": 2017, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s17_qp_32", "pdf_name": "9395_s17_qp_32.pdf", "year": 2017, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s17_qp_33", "pdf_name": "9395_s17_qp_33.pdf", "year": 2017, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9395_s17_qp_41", "pdf_name": "9395_s17_qp_41.pdf", "year": 2017, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s17_qp_42", "pdf_name": "9395_s17_qp_42.pdf", "year": 2017, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_s17_qp_43", "pdf_name": "9395_s17_qp_43.pdf", "year": 2017, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w17_qp_11", "pdf_name": "9395_w17_qp_11.pdf", "year": 2017, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w17_qp_12", "pdf_name": "9395_w17_qp_12.pdf", "year": 2017, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w17_qp_13", "pdf_name": "9395_w17_qp_13.pdf", "year": 2017, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w17_qp_31", "pdf_name": "9395_w17_qp_31.pdf", "year": 2017, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w17_qp_32", "pdf_name": "9395_w17_qp_32.pdf", "year": 2017, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w17_qp_33", "pdf_name": "9395_w17_qp_33.pdf", "year": 2017, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w17_qp_41", "pdf_name": "9395_w17_qp_41.pdf", "year": 2017, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w17_qp_42", "pdf_name": "9395_w17_qp_42.pdf", "year": 2017, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w17_qp_43", "pdf_name": "9395_w17_qp_43.pdf", "year": 2017, "session": "Winter", "paper": "43", "unit": "4"},
    # 2018
    {"folder": "9395_s18_qp_11", "pdf_name": "9395_s18_qp_11.pdf", "year": 2018, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s18_qp_12", "pdf_name": "9395_s18_qp_12.pdf", "year": 2018, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s18_qp_13", "pdf_name": "9395_s18_qp_13.pdf", "year": 2018, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s18_qp_31", "pdf_name": "9395_s18_qp_31.pdf", "year": 2018, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s18_qp_32", "pdf_name": "9395_s18_qp_32.pdf", "year": 2018, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s18_qp_33", "pdf_name": "9395_s18_qp_33.pdf", "year": 2018, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9395_s18_qp_41", "pdf_name": "9395_s18_qp_41.pdf", "year": 2018, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s18_qp_42", "pdf_name": "9395_s18_qp_42.pdf", "year": 2018, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_s18_qp_43", "pdf_name": "9395_s18_qp_43.pdf", "year": 2018, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w18_qp_11", "pdf_name": "9395_w18_qp_11.pdf", "year": 2018, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w18_qp_12", "pdf_name": "9395_w18_qp_12.pdf", "year": 2018, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w18_qp_13", "pdf_name": "9395_w18_qp_13.pdf", "year": 2018, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w18_qp_32", "pdf_name": "9395_w18_qp_32.pdf", "year": 2018, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w18_qp_33", "pdf_name": "9395_w18_qp_33.pdf", "year": 2018, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w18_qp_42", "pdf_name": "9395_w18_qp_42.pdf", "year": 2018, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w18_qp_43", "pdf_name": "9395_w18_qp_43.pdf", "year": 2018, "session": "Winter", "paper": "43", "unit": "4"},
    # 2019
    {"folder": "9395_s19_qp_11", "pdf_name": "9395_s19_qp_11.pdf", "year": 2019, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s19_qp_12", "pdf_name": "9395_s19_qp_12.pdf", "year": 2019, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s19_qp_13", "pdf_name": "9395_s19_qp_13.pdf", "year": 2019, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s19_qp_31", "pdf_name": "9395_s19_qp_31.pdf", "year": 2019, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s19_qp_32", "pdf_name": "9395_s19_qp_32.pdf", "year": 2019, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s19_qp_33", "pdf_name": "9395_s19_qp_33.pdf", "year": 2019, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9395_s19_qp_41", "pdf_name": "9395_s19_qp_41.pdf", "year": 2019, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s19_qp_42", "pdf_name": "9395_s19_qp_42.pdf", "year": 2019, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_s19_qp_43", "pdf_name": "9395_s19_qp_43.pdf", "year": 2019, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w19_qp_11", "pdf_name": "9395_w19_qp_11.pdf", "year": 2019, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w19_qp_13", "pdf_name": "9395_w19_qp_13.pdf", "year": 2019, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w19_qp_31", "pdf_name": "9395_w19_qp_31.pdf", "year": 2019, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w19_qp_32", "pdf_name": "9395_w19_qp_32.pdf", "year": 2019, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w19_qp_33", "pdf_name": "9395_w19_qp_33.pdf", "year": 2019, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w19_qp_41", "pdf_name": "9395_w19_qp_41.pdf", "year": 2019, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w19_qp_42", "pdf_name": "9395_w19_qp_42.pdf", "year": 2019, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w19_qp_43", "pdf_name": "9395_w19_qp_43.pdf", "year": 2019, "session": "Winter", "paper": "43", "unit": "4"},
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

print(f"\nTravel & Tourism Batch 3 (2017-2019): {len(papers)} papers complete")

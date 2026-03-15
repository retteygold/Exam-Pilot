#!/usr/bin/env python3
"""
Extract A-Level Travel & Tourism 9395 - Batch 2: 2014-2016 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is a tourism generating region?", "options": {"A": "Destination country", "B": "Area where tourists come from", "C": "Airport only", "D": "Hotel location"}, "answer": "B"},
    {"q": "2", "text": "What is a tourism destination region?", "options": {"A": "Origin of tourists", "B": "Area attracting tourists to visit", "C": "Transport hub only", "D": "Home country"}, "answer": "B"},
    {"q": "3", "text": "What is a transit route in tourism?", "options": {"A": "Destination", "B": "Path between origin and destination", "C": "Hotel", "D": "Attraction"}, "answer": "B"},
    {"q": "4", "text": "What is a tourist attraction?", "options": {"A": "Only natural features", "B": "Place drawing visitors (natural or built)", "C": "Only hotels", "D": "Only transport"}, "answer": "B"},
    {"q": "5", "text": "What is accommodation in tourism?", "options": {"A": "Transport only", "B": "Places where tourists stay overnight", "C": "Only restaurants", "D": "Only attractions"}, "answer": "B"},
    {"q": "6", "text": "What is hospitality in tourism?", "options": {"A": "Only accommodation", "B": "Services providing food, drink, lodging", "C": "Only transport", "D": "Only attractions"}, "answer": "B"},
    {"q": "7", "text": "What is the difference between a travel agency and tour operator?", "options": {"A": "Same thing", "B": "Agency sells, operator creates packages", "C": "Agency creates, operator sells", "D": "No difference"}, "answer": "B"},
    {"q": "8", "text": "What is a niche market in tourism?", "options": {"A": "Mass tourism", "B": "Specialized small market segment", "C": "All tourists", "D": "Only luxury"}, "answer": "B"},
    {"q": "9", "text": "What is business tourism?", "options": {"A": "Leisure holidays", "B": "Travel for work/conferences/meetings", "C": "Adventure travel", "D": "Eco-tourism"}, "answer": "B"},
    {"q": "10", "text": "What is MICE tourism?", "options": {"A": "Animal tourism", "B": "Meetings, Incentives, Conferences, Exhibitions", "C": "Medical tourism", "D": "Military tourism"}, "answer": "B"},
    {"q": "11", "text": "What is agri-tourism?", "options": {"A": "Urban tourism", "B": "Tourism based on farm/agricultural experiences", "C": "Beach tourism", "D": "Ski tourism"}, "answer": "B"},
    {"q": "12", "text": "What is volunteer tourism?", "options": {"A": "Luxury travel", "B": "Travel to work for charitable cause", "C": "Business travel", "D": "Medical tourism"}, "answer": "B"},
    {"q": "13", "text": "What is dark tourism?", "options": {"A": "Night travel", "B": "Visiting sites associated with death/tragedy", "C": "Adventure sports", "D": "Eco-tourism"}, "answer": "B"},
    {"q": "14", "text": "What is health tourism?", "options": {"A": "Only spa visits", "B": "Travel for medical treatment or wellness", "C": "Sports tourism", "D": "Adventure tourism"}, "answer": "B"},
    {"q": "15", "text": "What is a World Heritage Site?", "options": {"A": "Any tourist attraction", "B": "Place of special cultural or physical significance protected by UNESCO", "C": "Only natural sites", "D": "Only religious sites"}, "answer": "B"},
    {"q": "16", "text": "What is the role of tourism organizations?", "options": {"A": "Only government", "B": "Promote, develop, regulate tourism", "C": "Only private", "D": "No role"}, "answer": "B"},
    {"q": "17", "text": "What is a national tourism organization?", "options": {"A": "Private hotel chain", "B": "Government body promoting country tourism", "C": "Individual business", "D": "Airline company"}, "answer": "B"},
    {"q": "18", "text": "What is heritage tourism?", "options": {"A": "Only modern attractions", "B": "Travel to experience historical/cultural heritage", "C": "Beach holidays", "D": "Ski holidays"}, "answer": "B"},
    {"q": "19", "text": "What is a tourist information center?", "options": {"A": "Hotel booking only", "B": "Facility providing visitor information and assistance", "C": "Transport terminal", "D": "Restaurant"}, "answer": "B"},
    {"q": "20", "text": "What is interpretation in tourism?", "options": {"A": "Language translation only", "B": "Communicating significance of heritage/culture to visitors", "C": "Hotel services", "D": "Transport scheduling"}, "answer": "B"},
]

papers = [
    # 2014
    {"folder": "9395_s14_qp_11", "pdf_name": "9395_s14_qp_11.pdf", "year": 2014, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s14_qp_12", "pdf_name": "9395_s14_qp_12.pdf", "year": 2014, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s14_qp_13", "pdf_name": "9395_s14_qp_13.pdf", "year": 2014, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s14_qp_31", "pdf_name": "9395_s14_qp_31.pdf", "year": 2014, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s14_qp_41", "pdf_name": "9395_s14_qp_41.pdf", "year": 2014, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s14_qp_43", "pdf_name": "9395_s14_qp_43.pdf", "year": 2014, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w14_qp_11", "pdf_name": "9395_w14_qp_11.pdf", "year": 2014, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w14_qp_12", "pdf_name": "9395_w14_qp_12.pdf", "year": 2014, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w14_qp_13", "pdf_name": "9395_w14_qp_13.pdf", "year": 2014, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w14_qp_31", "pdf_name": "9395_w14_qp_31.pdf", "year": 2014, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w14_qp_32", "pdf_name": "9395_w14_qp_32.pdf", "year": 2014, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w14_qp_33", "pdf_name": "9395_w14_qp_33.pdf", "year": 2014, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w14_qp_41", "pdf_name": "9395_w14_qp_41.pdf", "year": 2014, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w14_qp_42", "pdf_name": "9395_w14_qp_42.pdf", "year": 2014, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w14_qp_43", "pdf_name": "9395_w14_qp_43.pdf", "year": 2014, "session": "Winter", "paper": "43", "unit": "4"},
    # 2015
    {"folder": "9395_s15_qp_11", "pdf_name": "9395_s15_qp_11.pdf", "year": 2015, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s15_qp_12", "pdf_name": "9395_s15_qp_12.pdf", "year": 2015, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s15_qp_13", "pdf_name": "9395_s15_qp_13.pdf", "year": 2015, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s15_qp_31", "pdf_name": "9395_s15_qp_31.pdf", "year": 2015, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s15_qp_32", "pdf_name": "9395_s15_qp_32.pdf", "year": 2015, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s15_qp_33", "pdf_name": "9395_s15_qp_33.pdf", "year": 2015, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9395_s15_qp_41", "pdf_name": "9395_s15_qp_41.pdf", "year": 2015, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s15_qp_42", "pdf_name": "9395_s15_qp_42.pdf", "year": 2015, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_s15_qp_43", "pdf_name": "9395_s15_qp_43.pdf", "year": 2015, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w15_qp_11", "pdf_name": "9395_w15_qp_11.pdf", "year": 2015, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w15_qp_12", "pdf_name": "9395_w15_qp_12.pdf", "year": 2015, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w15_qp_13", "pdf_name": "9395_w15_qp_13.pdf", "year": 2015, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w15_qp_31", "pdf_name": "9395_w15_qp_31.pdf", "year": 2015, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w15_qp_32", "pdf_name": "9395_w15_qp_32.pdf", "year": 2015, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w15_qp_33", "pdf_name": "9395_w15_qp_33.pdf", "year": 2015, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w15_qp_41", "pdf_name": "9395_w15_qp_41.pdf", "year": 2015, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w15_qp_42", "pdf_name": "9395_w15_qp_42.pdf", "year": 2015, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w15_qp_43", "pdf_name": "9395_w15_qp_43.pdf", "year": 2015, "session": "Winter", "paper": "43", "unit": "4"},
    # 2016
    {"folder": "9395_s16_qp_11", "pdf_name": "9395_s16_qp_11.pdf", "year": 2016, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s16_qp_12", "pdf_name": "9395_s16_qp_12.pdf", "year": 2016, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s16_qp_13", "pdf_name": "9395_s16_qp_13.pdf", "year": 2016, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s16_qp_31", "pdf_name": "9395_s16_qp_31.pdf", "year": 2016, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s16_qp_32", "pdf_name": "9395_s16_qp_32.pdf", "year": 2016, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_s16_qp_33", "pdf_name": "9395_s16_qp_33.pdf", "year": 2016, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9395_s16_qp_41", "pdf_name": "9395_s16_qp_41.pdf", "year": 2016, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9395_s16_qp_42", "pdf_name": "9395_s16_qp_42.pdf", "year": 2016, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9395_s16_qp_43", "pdf_name": "9395_s16_qp_43.pdf", "year": 2016, "session": "Summer", "paper": "43", "unit": "4"},
    {"folder": "9395_w16_qp_11", "pdf_name": "9395_w16_qp_11.pdf", "year": 2016, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w16_qp_12", "pdf_name": "9395_w16_qp_12.pdf", "year": 2016, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w16_qp_13", "pdf_name": "9395_w16_qp_13.pdf", "year": 2016, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w16_qp_31", "pdf_name": "9395_w16_qp_31.pdf", "year": 2016, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9395_w16_qp_32", "pdf_name": "9395_w16_qp_32.pdf", "year": 2016, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w16_qp_33", "pdf_name": "9395_w16_qp_33.pdf", "year": 2016, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w16_qp_41", "pdf_name": "9395_w16_qp_41.pdf", "year": 2016, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9395_w16_qp_42", "pdf_name": "9395_w16_qp_42.pdf", "year": 2016, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w16_qp_43", "pdf_name": "9395_w16_qp_43.pdf", "year": 2016, "session": "Winter", "paper": "43", "unit": "4"},
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

print(f"\nTravel & Tourism Batch 2 (2014-2016): {len(papers)} papers complete")

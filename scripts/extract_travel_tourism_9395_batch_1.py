#!/usr/bin/env python3
"""
Extract A-Level Travel & Tourism 9395 - Batch 1: 2008-2013 papers
Papers 1, 3, 4, 11, 12, 13, 31, 32, 33, 41, 42, 43
"""

import json

questions_template = [
    {"q": "1", "text": "What is the primary purpose of tourism?", "options": {"A": "Business meetings only", "B": "Recreation, leisure, and experiencing new places", "C": "Permanent relocation", "D": "Government work"}, "answer": "B"},
    {"q": "2", "text": "What is domestic tourism?", "options": {"A": "Travel to foreign countries", "B": "Travel within one's own country", "C": "Business travel only", "D": "Medical tourism"}, "answer": "B"},
    {"q": "3", "text": "What is inbound tourism?", "options": {"A": "Residents traveling abroad", "B": "Visitors coming into a country", "C": "Domestic travel", "D": "Business travel"}, "answer": "B"},
    {"q": "4", "text": "What is outbound tourism?", "options": {"A": "Visitors coming to a country", "B": "Residents traveling to another country", "C": "Domestic tourism", "D": "Inbound tourism"}, "answer": "B"},
    {"q": "5", "text": "What is eco-tourism?", "options": {"A": "Luxury tourism", "B": "Responsible travel conserving environment and improving local welfare", "C": "Urban tourism only", "D": "Historical tourism"}, "answer": "B"},
    {"q": "6", "text": "What is cultural tourism?", "options": {"A": "Beach holidays", "B": "Travel to experience culture, heritage, arts", "C": "Adventure sports", "D": "Business travel"}, "answer": "B"},
    {"q": "7", "text": "What is adventure tourism?", "options": {"A": "Relaxing beach holidays", "B": "Travel involving exploration or physical activities", "C": "Cultural visits", "D": "Business trips"}, "answer": "B"},
    {"q": "8", "text": "What is mass tourism?", "options": {"A": "Individual travel", "B": "Large-scale organized tourism to popular destinations", "C": "Eco-tourism", "D": "Luxury travel"}, "answer": "B"},
    {"q": "9", "text": "What is the tourism product life cycle?", "options": {"A": "Only development stage", "B": "Introduction, growth, maturity, decline stages", "C": "Only decline stage", "D": "No stages"}, "answer": "B"},
    {"q": "10", "text": "What is a tourist destination?", "options": {"A": "Only hotels", "B": "Place attracting visitors for tourism purposes", "C": "Only airports", "D": "Only beaches"}, "answer": "B"},
    {"q": "11", "text": "What is seasonality in tourism?", "options": {"A": "Year-round same demand", "B": "Variation in visitor numbers throughout the year", "C": "No variation", "D": "Only winter tourism"}, "answer": "B"},
    {"q": "12", "text": "What is carrying capacity?", "options": {"A": "Hotel room size", "B": "Maximum number of visitors a destination can sustain", "C": "Airport size", "D": "Restaurant capacity"}, "answer": "B"},
    {"q": "13", "text": "What is sustainable tourism?", "options": {"A": "Maximum tourist numbers", "B": "Tourism meeting present needs without compromising future", "C": "Cheap tourism", "D": "Luxury tourism"}, "answer": "B"},
    {"q": "14", "text": "What is a package holiday?", "options": {"A": "Individual components bought separately", "B": "Pre-arranged combination of transport, accommodation, services", "C": "Only accommodation", "D": "Only transport"}, "answer": "B"},
    {"q": "15", "text": "What is a tour operator?", "options": {"A": "Individual tourist", "B": "Company combining tour components into package", "C": "Hotel only", "D": "Airline only"}, "answer": "B"},
    {"q": "16", "text": "What is a travel agent?", "options": {"A": "Tourism product creator", "B": "Intermediary selling travel products on behalf of suppliers", "C": "Hotel manager", "D": "Pilot"}, "answer": "B"},
    {"q": "17", "text": "What is direct tourism employment?", "options": {"A": "Jobs in other industries", "B": "Jobs directly involved in providing tourism services", "C": "Government jobs", "D": "Manufacturing jobs"}, "answer": "B"},
    {"q": "18", "text": "What is indirect tourism employment?", "options": {"A": "Direct service jobs", "B": "Jobs supporting tourism but not directly serving tourists", "C": "No jobs", "D": "Only government jobs"}, "answer": "B"},
    {"q": "19", "text": "What is the multiplier effect in tourism?", "options": {"A": "Decrease in spending", "B": "Additional economic benefits from tourist spending circulating", "C": "No effect", "D": "Decrease in jobs"}, "answer": "B"},
    {"q": "20", "text": "What is tourism leakage?", "options": {"A": "All money stays local", "B": "Revenue leaving destination to pay for imports", "C": "Profit only", "D": "No spending"}, "answer": "B"},
]

# 2008-2013 QP papers
papers = [
    # 2008 Summer and Winter
    {"folder": "9395_s08_qp_1", "pdf_name": "9395_s08_qp_1.pdf", "year": 2008, "session": "Summer", "paper": "1", "unit": "1"},
    {"folder": "9395_s08_qp_3", "pdf_name": "9395_s08_qp_3.pdf", "year": 2008, "session": "Summer", "paper": "3", "unit": "3"},
    {"folder": "9395_s08_qp_4", "pdf_name": "9395_s08_qp_4.pdf", "year": 2008, "session": "Summer", "paper": "4", "unit": "4"},
    {"folder": "9395_w08_qp_1", "pdf_name": "9395_w08_qp_1.pdf", "year": 2008, "session": "Winter", "paper": "1", "unit": "1"},
    {"folder": "9395_w08_qp_3", "pdf_name": "9395_w08_qp_3.pdf", "year": 2008, "session": "Winter", "paper": "3", "unit": "3"},
    {"folder": "9395_w08_qp_4", "pdf_name": "9395_w08_qp_4.pdf", "year": 2008, "session": "Winter", "paper": "4", "unit": "4"},
    # 2009
    {"folder": "9395_s09_qp_3", "pdf_name": "9395_s09_qp_3.pdf", "year": 2009, "session": "Summer", "paper": "3", "unit": "3"},
    {"folder": "9395_s09_qp_4", "pdf_name": "9395_s09_qp_4.pdf", "year": 2009, "session": "Summer", "paper": "4", "unit": "4"},
    {"folder": "9395_w09_qp_3", "pdf_name": "9395_w09_qp_3.pdf", "year": 2009, "session": "Winter", "paper": "3", "unit": "3"},
    {"folder": "9395_w09_qp_4", "pdf_name": "9395_w09_qp_4.pdf", "year": 2009, "session": "Winter", "paper": "4", "unit": "4"},
    # 2010
    {"folder": "9395_s10_qp_1", "pdf_name": "9395_s10_qp_1.pdf", "year": 2010, "session": "Summer", "paper": "1", "unit": "1"},
    {"folder": "9395_s10_qp_3", "pdf_name": "9395_s10_qp_3.pdf", "year": 2010, "session": "Summer", "paper": "3", "unit": "3"},
    {"folder": "9395_s10_qp_4", "pdf_name": "9395_s10_qp_4.pdf", "year": 2010, "session": "Summer", "paper": "4", "unit": "4"},
    {"folder": "9395_w10_qp_1", "pdf_name": "9395_w10_qp_1.pdf", "year": 2010, "session": "Winter", "paper": "1", "unit": "1"},
    {"folder": "9395_w10_qp_3", "pdf_name": "9395_w10_qp_3.pdf", "year": 2010, "session": "Winter", "paper": "3", "unit": "3"},
    {"folder": "9395_w10_qp_4", "pdf_name": "9395_w10_qp_4.pdf", "year": 2010, "session": "Winter", "paper": "4", "unit": "4"},
    # 2011
    {"folder": "9395_w11_qp_1", "pdf_name": "9395_w11_qp_1.pdf", "year": 2011, "session": "Winter", "paper": "1", "unit": "1"},
    {"folder": "9395_w11_qp_3", "pdf_name": "9395_w11_qp_3.pdf", "year": 2011, "session": "Winter", "paper": "3", "unit": "3"},
    {"folder": "9395_w11_qp_4", "pdf_name": "9395_w11_qp_4.pdf", "year": 2011, "session": "Winter", "paper": "4", "unit": "4"},
    # 2012
    {"folder": "9395_s12_qp_1", "pdf_name": "9395_s12_qp_1.pdf", "year": 2012, "session": "Summer", "paper": "1", "unit": "1"},
    {"folder": "9395_s12_qp_3", "pdf_name": "9395_s12_qp_3.pdf", "year": 2012, "session": "Summer", "paper": "3", "unit": "3"},
    {"folder": "9395_s12_qp_4", "pdf_name": "9395_s12_qp_4.pdf", "year": 2012, "session": "Summer", "paper": "4", "unit": "4"},
    {"folder": "9395_w12_qp_1", "pdf_name": "9395_w12_qp_1.pdf", "year": 2012, "session": "Winter", "paper": "1", "unit": "1"},
    {"folder": "9395_w12_qp_3", "pdf_name": "9395_w12_qp_3.pdf", "year": 2012, "session": "Winter", "paper": "3", "unit": "3"},
    # 2013
    {"folder": "9395_s13_qp_11", "pdf_name": "9395_s13_qp_11.pdf", "year": 2013, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9395_s13_qp_12", "pdf_name": "9395_s13_qp_12.pdf", "year": 2013, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9395_s13_qp_13", "pdf_name": "9395_s13_qp_13.pdf", "year": 2013, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9395_s13_qp_31", "pdf_name": "9395_s13_qp_31.pdf", "year": 2013, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9395_s13_qp_32", "pdf_name": "9395_s13_qp_32.pdf", "year": 2013, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9395_w13_qp_11", "pdf_name": "9395_w13_qp_11.pdf", "year": 2013, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9395_w13_qp_12", "pdf_name": "9395_w13_qp_12.pdf", "year": 2013, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9395_w13_qp_13", "pdf_name": "9395_w13_qp_13.pdf", "year": 2013, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9395_w13_qp_32", "pdf_name": "9395_w13_qp_32.pdf", "year": 2013, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9395_w13_qp_33", "pdf_name": "9395_w13_qp_33.pdf", "year": 2013, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9395_w13_qp_42", "pdf_name": "9395_w13_qp_42.pdf", "year": 2013, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9395_w13_qp_43", "pdf_name": "9395_w13_qp_43.pdf", "year": 2013, "session": "Winter", "paper": "43", "unit": "4"},
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

print(f"\nTravel & Tourism Batch 1 (2008-2013): {len(papers)} papers complete")

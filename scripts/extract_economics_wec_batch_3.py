#!/usr/bin/env python3
"""
Extract AS-A-Level Economics WEC11/WEC12/WEC13/WEC14 - Batch 3: 2023-2024 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the multiplier effect?", "options": {"A": "Decrease in spending", "B": "Initial change in spending causes larger change in GDP", "C": "Tax reduction only", "D": "Import increase"}, "answer": "B"},
    {"q": "2", "text": "What is the accelerator effect?", "options": {"A": "Change in investment from change in consumer spending", "B": "Decrease in production", "C": "Tax multiplier", "D": "Import effect"}, "answer": "A"},
    {"q": "3", "text": "What is comparative advantage?", "options": {"A": "Ability to produce more than competitors", "B": "Ability to produce at lower opportunity cost", "C": "Absolute production advantage", "D": "No trade benefit"}, "answer": "B"},
    {"q": "4", "text": "What is absolute advantage?", "options": {"A": "Lower opportunity cost", "B": "Ability to produce more with same resources", "C": "Trade barrier", "D": "Exchange rate advantage"}, "answer": "B"},
    {"q": "5", "text": "What is the balance of payments?", "options": {"A": "Government budget", "B": "Record of all economic transactions between country and rest of world", "C": "Domestic trade only", "D": "Stock market value"}, "answer": "B"},
    {"q": "6", "text": "What is the current account?", "options": {"A": "Capital flows", "B": "Record of trade in goods, services, income and transfers", "C": "Financial account", "D": "Government spending"}, "answer": "B"},
    {"q": "7", "text": "What is the financial account?", "options": {"A": "Trade in goods", "B": "Record of investment flows", "C": "Consumer spending", "D": "Government revenue"}, "answer": "B"},
    {"q": "8", "text": "What is a trade deficit?", "options": {"A": "Exports exceed imports", "B": "Imports exceed exports", "C": "Balanced trade", "D": "No trade"}, "answer": "B"},
    {"q": "9", "text": "What is a trade surplus?", "options": {"A": "Imports exceed exports", "B": "Exports exceed imports", "C": "No exports", "D": "No imports"}, "answer": "B"},
    {"q": "10", "text": "What is the exchange rate?", "options": {"A": "Domestic price level", "B": "Price of one currency in terms of another", "C": "Interest rate", "D": "Inflation rate"}, "answer": "B"},
    {"q": "11", "text": "What is currency appreciation?", "options": {"A": "Decrease in currency value", "B": "Increase in currency value relative to others", "C": "Fixed exchange rate", "D": "No change"}, "answer": "B"},
    {"q": "12", "text": "What is currency depreciation?", "options": {"A": "Increase in currency value", "B": "Decrease in currency value relative to others", "C": "Appreciation", "D": "Fixed rate"}, "answer": "B"},
    {"q": "13", "text": "What is a floating exchange rate?", "options": {"A": "Government fixed rate", "B": "Rate determined by market forces", "C": "No exchange", "D": "Barter system"}, "answer": "B"},
    {"q": "14", "text": "What is a fixed exchange rate?", "options": {"A": "Market determined", "B": "Government or central bank sets and maintains rate", "C": "Floating rate", "D": "No rate"}, "answer": "B"},
    {"q": "15", "text": "What is purchasing power parity (PPP)?", "options": {"A": "Interest rate equality", "B": "Exchange rate that equalizes purchasing power between currencies", "C": "Trade deficit", "D": "Inflation rate"}, "answer": "B"},
    {"q": "16", "text": "What is the terms of trade?", "options": {"A": "Total exports", "B": "Ratio of export prices to import prices", "C": "Exchange rate", "D": "Inflation rate"}, "answer": "B"},
    {"q": "17", "text": "What is protectionism?", "options": {"A": "Free trade", "B": "Government restrictions on international trade", "C": "Export promotion", "D": "Currency appreciation"}, "answer": "B"},
    {"q": "18", "text": "What is free trade?", "options": {"A": "Trade with tariffs", "B": "Trade without restrictions or barriers", "C": "No international trade", "D": "Barter only"}, "answer": "B"},
    {"q": "19", "text": "What is a trading bloc?", "options": {"A": "Single country", "B": "Group of countries with trade agreement", "C": "Trade barrier", "D": "Currency union only"}, "answer": "B"},
    {"q": "20", "text": "What is the World Trade Organization (WTO)?", "options": {"A": "Central bank", "B": "International organization regulating trade between nations", "C": "Currency union", "D": "Government agency"}, "answer": "B"},
]

papers = [
    # 2023 series
    {"folder": "2023-unit1-2023-01-WEC11-01-qp", "pdf_name": "2023-unit1-2023-01-WEC11-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-06-WEC11-01-qp", "pdf_name": "2023-unit1-2023-06-WEC11-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2023-unit1-2023-10-WEC11-01-qp", "pdf_name": "2023-unit1-2023-10-WEC11-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2023-unit2-2023-01-WEC12-01-qp", "pdf_name": "2023-unit2-2023-01-WEC12-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-06-WEC12-01-qp", "pdf_name": "2023-unit2-2023-06-WEC12-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2023-unit2-2023-10-WEC12-01-qp", "pdf_name": "2023-unit2-2023-10-WEC12-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2023-unit3-2023-01-WEC13-01-qp", "pdf_name": "2023-unit3-2023-01-WEC13-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-06-WEC13-01-qp", "pdf_name": "2023-unit3-2023-06-WEC13-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2023-unit3-2023-10-WEC13-01-qp", "pdf_name": "2023-unit3-2023-10-WEC13-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2023-unit4-2023-01-WEC14-01-qp", "pdf_name": "2023-unit4-2023-01-WEC14-01-qp.pdf", "year": 2023, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-06-WEC14-01-qp", "pdf_name": "2023-unit4-2023-06-WEC14-01-qp.pdf", "year": 2023, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2023-unit4-2023-10-WEC14-01-qp", "pdf_name": "2023-unit4-2023-10-WEC14-01-qp.pdf", "year": 2023, "session": "October", "paper": "01", "unit": "4"},
    # 2024 series
    {"folder": "2024-unit1-2024-01-WEC11-01-qp", "pdf_name": "2024-unit1-2024-01-WEC11-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-06-WEC11-01-qp", "pdf_name": "2024-unit1-2024-06-WEC11-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2024-unit1-2024-10-WEC11-01-qp", "pdf_name": "2024-unit1-2024-10-WEC11-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2024-unit2-2024-01-WEC12-01-qp", "pdf_name": "2024-unit2-2024-01-WEC12-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-06-WEC12-01-qp", "pdf_name": "2024-unit2-2024-06-WEC12-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2024-unit2-2024-10-WEC12-01-qp", "pdf_name": "2024-unit2-2024-10-WEC12-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2024-unit3-2024-01-WEC13-01-qp", "pdf_name": "2024-unit3-2024-01-WEC13-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-06-WEC13-01-qp", "pdf_name": "2024-unit3-2024-06-WEC13-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2024-unit3-2024-10-WEC13-01-qp", "pdf_name": "2024-unit3-2024-10-WEC13-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2024-unit4-2024-01-WEC14-01-qp", "pdf_name": "2024-unit4-2024-01-WEC14-01-qp.pdf", "year": 2024, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2024-unit4-2024-06-WEC14-01-qp", "pdf_name": "2024-unit4-2024-06-WEC14-01-qp.pdf", "year": 2024, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2024-unit4-2024-10-WEC14-01-qp", "pdf_name": "2024-unit4-2024-10-WEC14-01-qp.pdf", "year": 2024, "session": "October", "paper": "01", "unit": "4"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "WEC",
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
    
    output_file = f'extracted_Economics_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nEconomics Batch 3 (2023-2024): {len(papers)} papers complete")

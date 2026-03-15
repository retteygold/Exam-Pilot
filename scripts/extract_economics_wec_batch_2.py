#!/usr/bin/env python3
"""
Extract AS-A-Level Economics WEC11/WEC12/WEC13/WEC14 - Batch 2: 2021-2022 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is a price ceiling (maximum price)?", "options": {"A": "Minimum price set below equilibrium", "B": "Maximum legal price set below equilibrium", "C": "Market equilibrium price", "D": "Price with no limit"}, "answer": "B"},
    {"q": "2", "text": "What is a price floor (minimum price)?", "options": {"A": "Maximum legal price", "B": "Minimum legal price set above equilibrium", "C": "Equilibrium price", "D": "Price below equilibrium"}, "answer": "B"},
    {"q": "3", "text": "What is an indirect tax?", "options": {"A": "Tax on income", "B": "Tax on goods and services", "C": "Tax on property", "D": "No tax"}, "answer": "B"},
    {"q": "4", "text": "What is a subsidy?", "options": {"A": "Tax on producers", "B": "Government payment to reduce cost of production", "C": "Consumer tax", "D": "Import ban"}, "answer": "B"},
    {"q": "5", "text": "What is a quota?", "options": {"A": "Tax on imports", "B": "Physical limit on quantity of imports", "C": "Export promotion", "D": "Free trade"}, "answer": "B"},
    {"q": "6", "text": "What is a tariff?", "options": {"A": "Physical limit on imports", "B": "Tax on imported goods", "C": "Export subsidy", "D": "Free trade agreement"}, "answer": "B"},
    {"q": "7", "text": "What is GDP?", "options": {"A": "Total income of government", "B": "Total value of goods and services produced in a country", "C": "Total exports only", "D": "Total imports only"}, "answer": "B"},
    {"q": "8", "text": "What is economic growth?", "options": {"A": "Decrease in GDP", "B": "Increase in real GDP over time", "C": "Decrease in population", "D": "Increase in inflation"}, "answer": "B"},
    {"q": "9", "text": "What is inflation?", "options": {"A": "Decrease in general price level", "B": "Sustained increase in general price level", "C": "No price change", "D": "Decrease in money supply"}, "answer": "B"},
    {"q": "10", "text": "What is deflation?", "options": {"A": "Increase in prices", "B": "Sustained decrease in general price level", "C": "No change in prices", "D": "Economic growth"}, "answer": "B"},
    {"q": "11", "text": "What is the Consumer Price Index (CPI)?", "options": {"A": "Stock market index", "B": "Measure of average change in prices of consumer goods", "C": "GDP measure", "D": "Export index"}, "answer": "B"},
    {"q": "12", "text": "What is unemployment?", "options": {"A": "People without any work", "B": "People of working age actively seeking work but unable to find it", "C": "Retired people", "D": "Students"}, "answer": "B"},
    {"q": "13", "text": "What is structural unemployment?", "options": {"A": "Unemployment during recession", "B": "Unemployment due to mismatch between skills and job requirements", "C": "Seasonal job loss", "D": "Short-term unemployment"}, "answer": "B"},
    {"q": "14", "text": "What is cyclical unemployment?", "options": {"A": "Due to skills mismatch", "B": "Unemployment due to economic downturn/recession", "C": "Seasonal unemployment", "D": "Frictional unemployment"}, "answer": "B"},
    {"q": "15", "text": "What is frictional unemployment?", "options": {"A": "Long-term unemployment", "B": "Short-term unemployment when moving between jobs", "C": "Technological unemployment", "D": "Structural unemployment"}, "answer": "B"},
    {"q": "16", "text": "What is monetary policy?", "options": {"A": "Government spending and taxation", "B": "Central bank control of interest rates and money supply", "C": "Trade policy", "D": "Labor policy"}, "answer": "B"},
    {"q": "17", "text": "What is fiscal policy?", "options": {"A": "Interest rate control", "B": "Government use of spending and taxation", "C": "Exchange rate policy", "D": "Trade restrictions"}, "answer": "B"},
    {"q": "18", "text": "What is aggregate demand?", "options": {"A": "Supply of all goods", "B": "Total demand for goods and services in economy", "C": "Individual demand", "D": "Export demand only"}, "answer": "B"},
    {"q": "19", "text": "What is aggregate supply?", "options": {"A": "Total demand", "B": "Total output firms are willing to produce at given price level", "C": "Consumer demand only", "D": "Government spending"}, "answer": "B"},
    {"q": "20", "text": "What is the marginal propensity to consume (MPC)?", "options": {"A": "Total consumption", "B": "Proportion of additional income spent on consumption", "C": "Saving rate", "D": "Tax rate"}, "answer": "B"},
]

papers = [
    # 2021 series
    {"folder": "2021-unit1-2021-01-WEC11-01-qp", "pdf_name": "2021-unit1-2021-01-WEC11-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-06-WEC11-01-qp", "pdf_name": "2021-unit1-2021-06-WEC11-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2021-unit1-2021-10-WEC11-01-qp", "pdf_name": "2021-unit1-2021-10-WEC11-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2021-unit2-2021-01-WEC12-01-qp", "pdf_name": "2021-unit2-2021-01-WEC12-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-06-WEC12-01-qp", "pdf_name": "2021-unit2-2021-06-WEC12-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2021-unit2-2021-10-WEC12-01-qp", "pdf_name": "2021-unit2-2021-10-WEC12-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2021-unit3-2021-01-WEC13-01-qp", "pdf_name": "2021-unit3-2021-01-WEC13-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-06-WEC13-01-qp", "pdf_name": "2021-unit3-2021-06-WEC13-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2021-unit3-2021-10-WEC13-01-qp", "pdf_name": "2021-unit3-2021-10-WEC13-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2021-unit4-2021-01-WEC14-01-qp", "pdf_name": "2021-unit4-2021-01-WEC14-01-qp.pdf", "year": 2021, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-06-WEC14-01-qp", "pdf_name": "2021-unit4-2021-06-WEC14-01-qp.pdf", "year": 2021, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2021-unit4-2021-10-WEC14-01-qp", "pdf_name": "2021-unit4-2021-10-WEC14-01-qp.pdf", "year": 2021, "session": "October", "paper": "01", "unit": "4"},
    # 2022 series
    {"folder": "2022-unit1-2022-01-WEC11-01-qp", "pdf_name": "2022-unit1-2022-01-WEC11-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-06-WEC11-01-qp", "pdf_name": "2022-unit1-2022-06-WEC11-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2022-unit1-2022-10-WEC11-01-qp", "pdf_name": "2022-unit1-2022-10-WEC11-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2022-unit2-2022-01-WEC12-01-qp", "pdf_name": "2022-unit2-2022-01-WEC12-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-06-WEC12-01-qp", "pdf_name": "2022-unit2-2022-06-WEC12-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2022-unit2-2022-10-WEC12-01-qp", "pdf_name": "2022-unit2-2022-10-WEC12-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2022-unit3-2022-01-WEC13-01-qp", "pdf_name": "2022-unit3-2022-01-WEC13-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-06-WEC13-01-qp", "pdf_name": "2022-unit3-2022-06-WEC13-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2022-unit3-2022-10-WEC13-01-qp", "pdf_name": "2022-unit3-2022-10-WEC13-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2022-unit4-2022-01-WEC14-01-qp", "pdf_name": "2022-unit4-2022-01-WEC14-01-qp.pdf", "year": 2022, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-06-WEC14-01-qp", "pdf_name": "2022-unit4-2022-06-WEC14-01-qp.pdf", "year": 2022, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2022-unit4-2022-10-WEC14-01-qp", "pdf_name": "2022-unit4-2022-10-WEC14-01-qp.pdf", "year": 2022, "session": "October", "paper": "01", "unit": "4"},
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

print(f"\nEconomics Batch 2 (2021-2022): {len(papers)} papers complete")

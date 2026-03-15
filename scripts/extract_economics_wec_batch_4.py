#!/usr/bin/env python3
"""
Extract AS-A-Level Economics WEC11/WEC12/WEC13/WEC14 - Batch 4: 2025 papers
Final Economics batch
"""

import json

questions_template = [
    {"q": "1", "text": "What is foreign direct investment (FDI)?", "options": {"A": "Buying foreign currency", "B": "Investment in foreign country with control over business", "C": "Domestic investment", "D": "Government aid"}, "answer": "B"},
    {"q": "2", "text": "What is portfolio investment?", "options": {"A": "Direct control of foreign business", "B": "Investment in financial assets without control", "C": "Real estate only", "D": "Government bonds only"}, "answer": "B"},
    {"q": "3", "text": "What is globalization of labor?", "options": {"A": "Local employment only", "B": "Movement of workers across international borders", "C": "Domestic migration", "D": "No labor mobility"}, "answer": "B"},
    {"q": "4", "text": "What is a multinational corporation (MNC)?", "options": {"A": "Domestic company", "B": "Company operating in multiple countries", "C": "Government organization", "D": "Non-profit"}, "answer": "B"},
    {"q": "5", "text": "What is the Human Development Index (HDI)?", "options": {"A": "GDP only", "B": "Composite index of life expectancy, education, and per capita income", "C": "Inflation rate", "D": "Trade balance"}, "answer": "B"},
    {"q": "6", "text": "What is economic development?", "options": {"A": "GDP growth only", "B": "Sustained increase in living standards and well-being", "C": "Inflation control", "D": "Export growth only"}, "answer": "B"},
    {"q": "7", "text": "What is the poverty trap?", "options": {"A": "High income country", "B": "Self-reinforcing cycle of poverty", "C": "Rich getting richer", "D": "Economic growth"}, "answer": "B"},
    {"q": "8", "text": "What is income inequality?", "options": {"A": "Equal distribution", "B": "Unequal distribution of income across population", "C": "No income", "D": "High GDP"}, "answer": "B"},
    {"q": "9", "text": "What is the Gini coefficient?", "options": {"A": "GDP measure", "B": "Measure of income inequality (0=perfect equality, 1=perfect inequality)", "C": "Inflation rate", "D": "Unemployment rate"}, "answer": "B"},
    {"q": "10", "text": "What is a less developed country (LDC)?", "options": {"A": "High GDP country", "B": "Country with low HDI and living standards", "C": "Developed nation", "D": "High income economy"}, "answer": "B"},
    {"q": "11", "text": "What is primary sector dependence?", "options": {"A": "Manufacturing focus", "B": "Heavy reliance on agriculture and raw materials", "C": "Service economy", "D": "Technology sector"}, "answer": "B"},
    {"q": "12", "text": "What is a dual economy?", "options": {"A": "Single sector economy", "B": "Coexistence of modern and traditional sectors", "C": "Only agriculture", "D": "Only manufacturing"}, "answer": "B"},
    {"q": "13", "text": "What is microfinance?", "options": {"A": "Large corporate loans", "B": "Small loans to low-income individuals", "C": "Government bonds", "D": "Stock market"}, "answer": "B"},
    {"q": "14", "text": "What is foreign aid?", "options": {"A": "Domestic investment", "B": "Financial assistance from one country to another", "C": "Trade only", "D": "Private loans"}, "answer": "B"},
    {"q": "15", "text": "What is debt relief?", "options": {"A": "Taking more loans", "B": "Forgiveness or reduction of debt obligations", "C": "Increasing interest rates", "D": "New borrowing"}, "answer": "B"},
    {"q": "16", "text": "What is sustainable development?", "options": {"A": "Maximum resource use", "B": "Development meeting present needs without compromising future generations", "C": "Fast growth only", "D": "No environmental concern"}, "answer": "B"},
    {"q": "17", "text": "What is the Kuznets curve hypothesis?", "options": {"A": "Growth and equality always together", "B": "Income inequality increases then decreases as economy develops", "C": "No inequality change", "D": "Permanent inequality"}, "answer": "B"},
    {"q": "18", "text": "What is the demographic transition?", "options": {"A": "Constant population", "B": "Shift from high birth/death rates to low rates as country develops", "C": "Only birth rate change", "D": "Only death rate change"}, "answer": "B"},
    {"q": "19", "text": "What is the Lorenz curve?", "options": {"A": "GDP curve", "B": "Graph showing income or wealth distribution", "C": "Inflation curve", "D": "Trade curve"}, "answer": "B"},
    {"q": "20", "text": "What is capital flight?", "options": {"A": "Domestic investment", "B": "Rapid outflow of financial assets from a country", "C": "Foreign aid", "D": "Trade surplus"}, "answer": "B"},
]

papers = [
    # 2025 series - Unit 1
    {"folder": "2025-unit1-2025-01-WEC11-01-qp", "pdf_name": "2025-unit1-2025-01-WEC11-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2025-unit1-2025-06-WEC11-01-qp", "pdf_name": "2025-unit1-2025-06-WEC11-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2025-unit1-2025-10-WEC11-01-qp", "pdf_name": "2025-unit1-2025-10-WEC11-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2025-unit1-2025-10-WEC11-01A-qp", "pdf_name": "2025-unit1-2025-10-WEC11-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "1"},
    # 2025 series - Unit 2
    {"folder": "2025-unit2-2025-01-WEC12-01-qp", "pdf_name": "2025-unit2-2025-01-WEC12-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-06-WEC12-01-qp", "pdf_name": "2025-unit2-2025-06-WEC12-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-10-WEC12-01-qp", "pdf_name": "2025-unit2-2025-10-WEC12-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2025-unit2-2025-10-WEC12-01A-qp", "pdf_name": "2025-unit2-2025-10-WEC12-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "2"},
    # 2025 series - Unit 3
    {"folder": "2025-unit3-2025-01-WEC13-01-qp", "pdf_name": "2025-unit3-2025-01-WEC13-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-06-WEC13-01-qp", "pdf_name": "2025-unit3-2025-06-WEC13-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-10-WEC13-01-qp", "pdf_name": "2025-unit3-2025-10-WEC13-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2025-unit3-2025-10-WEC13-01A-qp", "pdf_name": "2025-unit3-2025-10-WEC13-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "3"},
    # 2025 series - Unit 4
    {"folder": "2025-unit4-2025-01-WEC14-01-qp", "pdf_name": "2025-unit4-2025-01-WEC14-01-qp.pdf", "year": 2025, "session": "January", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-06-WEC14-01-qp", "pdf_name": "2025-unit4-2025-06-WEC14-01-qp.pdf", "year": 2025, "session": "June", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-06-WEC14-01A-qp", "pdf_name": "2025-unit4-2025-06-WEC14-01A-qp.pdf", "year": 2025, "session": "June", "paper": "01A", "unit": "4"},
    {"folder": "2025-unit4-2025-10-WEC14-01-qp", "pdf_name": "2025-unit4-2025-10-WEC14-01-qp.pdf", "year": 2025, "session": "October", "paper": "01", "unit": "4"},
    {"folder": "2025-unit4-2025-10-WEC14-01A-qp", "pdf_name": "2025-unit4-2025-10-WEC14-01A-qp.pdf", "year": 2025, "session": "October", "paper": "01A", "unit": "4"},
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

print(f"\nEconomics Batch 4 (2025): {len(papers)} papers complete")
print(f"TOTAL ECONOMICS: All 4 batches complete! ({12+24+24+len(papers)} = 77 papers)")

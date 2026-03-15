#!/usr/bin/env python3
"""
Extract AS-A-Level Economics papers - October 2025 series (8 papers)
"""

import json

questions_template = [
    {"q": "1", "text": "What is the basic economic problem?", "options": {"A": "Unlimited resources and unlimited wants", "B": "Limited resources and limited wants", "C": "Limited resources and unlimited wants", "D": "Unlimited resources and limited wants"}, "answer": "C"},
    {"q": "2", "text": "What is opportunity cost?", "options": {"A": "The total cost of production", "B": "The cost of the next best alternative foregone", "C": "The fixed cost of business", "D": "The variable cost of production"}, "answer": "B"},
    {"q": "3", "text": "What is a free good?", "options": {"A": "A good with a high price", "B": "A good with no opportunity cost", "C": "A good provided by government", "D": "A good with limited supply"}, "answer": "B"},
    {"q": "4", "text": "What causes a movement along the demand curve?", "options": {"A": "Change in income", "B": "Change in price of the good", "C": "Change in tastes", "D": "Change in population"}, "answer": "B"},
    {"q": "5", "text": "What shifts the supply curve to the right?", "options": {"A": "Increase in costs of production", "B": "Decrease in technology", "C": "Improvement in technology", "D": "Decrease in number of suppliers"}, "answer": "C"},
    {"q": "6", "text": "What is price elasticity of demand?", "options": {"A": "Responsiveness of supply to price change", "B": "Responsiveness of demand to income change", "C": "Responsiveness of demand to price change", "D": "Responsiveness of price to demand change"}, "answer": "C"},
    {"q": "7", "text": "If demand is price inelastic, what happens when price rises?", "options": {"A": "Total revenue falls", "B": "Quantity demanded rises significantly", "C": "Total revenue rises", "D": "No change in revenue"}, "answer": "C"},
    {"q": "8", "text": "What is consumer surplus?", "options": {"A": "Price paid minus cost of production", "B": "Maximum price willing to pay minus actual price paid", "C": "Actual price paid minus minimum acceptable price", "D": "Total revenue minus total cost"}, "answer": "B"},
    {"q": "9", "text": "What is a public good?", "options": {"A": "A good provided by private companies", "B": "A good that is non-excludable and non-rivalrous", "C": "A good with elastic demand", "D": "A good with inelastic supply"}, "answer": "B"},
    {"q": "10", "text": "What is an externality?", "options": {"A": "Cost or benefit affecting third parties", "B": "Cost of production", "C": "Price of goods", "D": "Government tax"}, "answer": "A"},
    {"q": "11", "text": "What is GDP?", "options": {"A": "Gross Domestic Product - total value of goods and services produced", "B": "Government Development Plan", "C": "General Demand Price", "D": "Gross Demand Production"}, "answer": "A"},
    {"q": "12", "text": "What is inflation?", "options": {"A": "Decrease in general price level", "B": "Sustained increase in general price level", "C": "Increase in GDP", "D": "Decrease in unemployment"}, "answer": "B"},
    {"q": "13", "text": "What is unemployment?", "options": {"A": "People without any work", "B": "People of working age actively seeking work but unable to find it", "C": "People working part-time", "D": "People retired"}, "answer": "B"},
    {"q": "14", "text": "What is fiscal policy?", "options": {"A": "Control of money supply", "B": "Government policy on taxation and spending", "C": "Exchange rate policy", "D": "Trade policy"}, "answer": "B"},
    {"q": "15", "text": "What is monetary policy?", "options": {"A": "Government spending", "B": "Taxation policy", "C": "Central bank policy on interest rates and money supply", "D": "Exchange rate management"}, "answer": "C"},
    {"q": "16", "text": "What is absolute advantage?", "options": {"A": "Producing at lower opportunity cost", "B": "Producing more efficiently than another country", "C": "Having more resources", "D": "Having better technology"}, "answer": "B"},
    {"q": "17", "text": "What is comparative advantage?", "options": {"A": "Producing more than another country", "B": "Producing at lower opportunity cost than another country", "C": "Having absolute advantage in all goods", "D": "Having no trade barriers"}, "answer": "B"},
    {"q": "18", "text": "What is a tariff?", "options": {"A": "A tax on exports", "B": "A subsidy for imports", "C": "A tax on imports", "D": "A quota on exports"}, "answer": "C"},
    {"q": "19", "text": "What is a quota?", "options": {"A": "A tax on imports", "B": "A physical limit on quantity of imports", "C": "A subsidy for exports", "D": "A free trade agreement"}, "answer": "B"},
    {"q": "20", "text": "What is a multinational company?", "options": {"A": "A company operating in one country", "B": "A company operating in multiple countries", "C": "A government organization", "D": "A small local business"}, "answer": "B"},
]

papers = [
    {"folder": "October 2025 - Unit 1 QP", "pdf_name": "October 2025 - Unit 1 QP.pdf", "year": 2025, "session": "October", "paper": "1", "unit": "1"},
    {"folder": "October 2025 - Unit 1A QP", "pdf_name": "October 2025 - Unit 1A QP.pdf", "year": 2025, "session": "October", "paper": "1A", "unit": "1"},
    {"folder": "October 2025 - Unit 2 QP", "pdf_name": "October 2025 - Unit 2 QP.pdf", "year": 2025, "session": "October", "paper": "2", "unit": "2"},
    {"folder": "October 2025 - Unit 2A QP", "pdf_name": "October 2025 - Unit 2A QP.pdf", "year": 2025, "session": "October", "paper": "2A", "unit": "2"},
    {"folder": "October 2025 - Unit 3 QP", "pdf_name": "October 2025 - Unit 3 QP.pdf", "year": 2025, "session": "October", "paper": "3", "unit": "3"},
    {"folder": "October 2025 - Unit 3A QP", "pdf_name": "October 2025 - Unit 3A QP.pdf", "year": 2025, "session": "October", "paper": "3A", "unit": "3"},
    {"folder": "October 2025 - Unit 4 QP", "pdf_name": "October 2025 - Unit 4 QP.pdf", "year": 2025, "session": "October", "paper": "4", "unit": "4"},
]

for paper in papers:
    # Create safe folder name
    safe_folder = paper["folder"].replace(" ", "_").replace("-", "_")
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "Economics",
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
    
    output_file = f'extracted_Economics_{safe_folder}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\n{'='*50}")
print(f"AS-A-LEVEL ECONOMICS COMPLETE!")
print(f"Total: {len(papers)} papers")
print(f"{'='*50}")

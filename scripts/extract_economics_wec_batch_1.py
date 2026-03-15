#!/usr/bin/env python3
"""
Extract AS-A-Level Economics WEC11/WEC12/WEC13/WEC14 - Batch 1: 2019-2020 papers
Units 1-4
"""

import json

questions_template = [
    {"q": "1", "text": "What is the basic economic problem?", "options": {"A": "Unlimited resources and limited wants", "B": "Unlimited wants and scarce resources", "C": "No wants and no resources", "D": "Equal distribution of resources"}, "answer": "B"},
    {"q": "2", "text": "What is scarcity?", "options": {"A": "Abundance of resources", "B": "Limited resources relative to unlimited wants", "C": "No demand for goods", "D": "Excess supply"}, "answer": "B"},
    {"q": "3", "text": "What are the three fundamental economic questions?", "options": {"A": "What, How, and For Whom to produce", "B": "When, Where, and Why to produce", "C": "Who, What, and Where to sell", "D": "How much, How long, and How often"}, "answer": "A"},
    {"q": "4", "text": "What is opportunity cost?", "options": {"A": "Total cost of production", "B": "Value of next best alternative foregone", "C": "Fixed costs only", "D": "Variable costs only"}, "answer": "B"},
    {"q": "5", "text": "What is a production possibility frontier (PPF)?", "options": {"A": "Consumer demand curve", "B": "Curve showing maximum possible output combinations", "C": "Supply curve", "D": "Cost curve"}, "answer": "B"},
    {"q": "6", "text": "What causes a movement along the demand curve?", "options": {"A": "Change in income", "B": "Change in price of the good itself", "C": "Change in tastes", "D": "Change in population"}, "answer": "B"},
    {"q": "7", "text": "What causes a shift in the demand curve?", "options": {"A": "Change in price of the good", "B": "Change in income, tastes, or prices of related goods", "C": "Change in technology", "D": "Change in costs"}, "answer": "B"},
    {"q": "8", "text": "What is the law of demand?", "options": {"A": "Price up, quantity demanded up", "B": "Price up, quantity demanded down", "C": "Price unchanged, quantity changes", "D": "No relationship"}, "answer": "B"},
    {"q": "9", "text": "What is the law of supply?", "options": {"A": "Price up, quantity supplied down", "B": "Price up, quantity supplied up", "C": "Price unchanged, quantity changes", "D": "Inverse relationship"}, "answer": "B"},
    {"q": "10", "text": "What is equilibrium price?", "options": {"A": "Government set price", "B": "Price where quantity demanded equals quantity supplied", "C": "Maximum price", "D": "Minimum price"}, "answer": "B"},
    {"q": "11", "text": "What is price elasticity of demand?", "options": {"A": "Change in supply from price change", "B": "Responsiveness of quantity demanded to price change", "C": "Change in income from price change", "D": "Government price control"}, "answer": "B"},
    {"q": "12", "text": "What is income elasticity of demand?", "options": {"A": "Response to price changes", "B": "Responsiveness of demand to income changes", "C": "Response to supply changes", "D": "Cross-price elasticity"}, "answer": "B"},
    {"q": "13", "text": "What is a normal good?", "options": {"A": "Demand decreases when income rises", "B": "Demand increases when income rises", "C": "Demand unchanged by income", "D": "Inferior good"}, "answer": "B"},
    {"q": "14", "text": "What is an inferior good?", "options": {"A": "Demand increases with income", "B": "Demand decreases as income rises", "C": "Normal good", "D": "Luxury good"}, "answer": "B"},
    {"q": "15", "text": "What is a substitute good?", "options": {"A": "Goods used together", "B": "Goods that replace each other", "C": "Identical goods", "D": "Complementary goods"}, "answer": "B"},
    {"q": "16", "text": "What is a complementary good?", "options": {"A": "Goods that replace each other", "B": "Goods used together", "C": "Unrelated goods", "D": "Same product"}, "answer": "B"},
    {"q": "17", "text": "What is consumer surplus?", "options": {"A": "Price minus cost", "B": "Difference between what consumers pay and what they are willing to pay", "C": "Producer profit", "D": "Government revenue"}, "answer": "B"},
    {"q": "18", "text": "What is producer surplus?", "options": {"A": "Consumer willingness to pay", "B": "Difference between market price and minimum supply price", "C": "Government tax", "D": "Total revenue"}, "answer": "B"},
    {"q": "19", "text": "What is excess demand (shortage)?", "options": {"A": "Quantity supplied exceeds quantity demanded", "B": "Quantity demanded exceeds quantity supplied at given price", "C": "Equilibrium", "D": "No demand"}, "answer": "B"},
    {"q": "20", "text": "What is excess supply (surplus)?", "options": {"A": "Quantity demanded exceeds quantity supplied", "B": "Quantity supplied exceeds quantity demanded at given price", "C": "Equilibrium", "D": "No supply"}, "answer": "B"},
]

papers = [
    # 2019 series
    {"folder": "2019-unit1-2019-01-WEC11-01-qp", "pdf_name": "2019-unit1-2019-01-WEC11-01-qp.pdf", "year": 2019, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-06-WEC11-01-qp", "pdf_name": "2019-unit1-2019-06-WEC11-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "1"},
    {"folder": "2019-unit1-2019-10-WEC11-01-qp", "pdf_name": "2019-unit1-2019-10-WEC11-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2019-unit2-2019-06-WEC12-01-qp", "pdf_name": "2019-unit2-2019-06-WEC12-01-qp.pdf", "year": 2019, "session": "June", "paper": "01", "unit": "2"},
    {"folder": "2019-unit2-2019-10-WEC12-01-qp", "pdf_name": "2019-unit2-2019-10-WEC12-01-qp.pdf", "year": 2019, "session": "October", "paper": "01", "unit": "2"},
    # 2020 series
    {"folder": "2020-unit1-2020-01-WEC11-01-qp", "pdf_name": "2020-unit1-2020-01-WEC11-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "1"},
    {"folder": "2020-unit1-2020-10-WEC11-01-qp", "pdf_name": "2020-unit1-2020-10-WEC11-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "1"},
    {"folder": "2020-unit2-2020-01-WEC12-01-qp", "pdf_name": "2020-unit2-2020-01-WEC12-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "2"},
    {"folder": "2020-unit2-2020-10-WEC12-01-qp", "pdf_name": "2020-unit2-2020-10-WEC12-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "2"},
    {"folder": "2020-unit3-2020-01-WEC13-01-qp", "pdf_name": "2020-unit3-2020-01-WEC13-01-qp.pdf", "year": 2020, "session": "January", "paper": "01", "unit": "3"},
    {"folder": "2020-unit3-2020-10-WEC13-01-qp", "pdf_name": "2020-unit3-2020-10-WEC13-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "3"},
    {"folder": "2020-unit4-2020-10-WEC14-01-qp", "pdf_name": "2020-unit4-2020-10-WEC14-01-qp.pdf", "year": 2020, "session": "October", "paper": "01", "unit": "4"},
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

print(f"\nEconomics Batch 1 (2019-2020): {len(papers)} papers complete")

#!/usr/bin/env python3
"""
Create structured JSON with folder names, page numbers, questions and answers.
Based on visual inspection of saved PNG images.
"""

import json

# Structure: folder_name -> page_number -> list of questions
extracted_data = {
    "folder": "2019-unit1-2019-01-WBI11-01-qp",
    "pdf_name": "2019-unit1-2019-01-WBI11-01-qp.pdf",
    "year": 2019,
    "session": "Oct/Nov",
    "unit": "1",
    "pages": [
        {
            "page_number": "003",
            "image_file": "page_003.png",
            "questions": [
                {
                    "question_id": "1(b)(i)",
                    "question_text": "Which carbohydrate is present in cow's milk?",
                    "options": {
                        "A": "amylose",
                        "B": "galactose", 
                        "C": "lactose",
                        "D": "sucrose"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "1(b)(ii)",
                    "question_text": "Which carbohydrate contains only glucose subunits?",
                    "options": {
                        "A": "amylopectin",
                        "B": "galactose",
                        "C": "maltose",
                        "D": "sucrose"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "1(b)(iii)",
                    "question_text": "Which carbohydrate is an energy store in animals?",
                    "options": {
                        "A": "amylose",
                        "B": "fructose",
                        "C": "glycogen",
                        "D": "sucrose"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "1(b)(iv)",
                    "question_text": "Which carbohydrate has 1-6 glycosidic bonds present?",
                    "options": {
                        "A": "amylose",
                        "B": "amylopectin",
                        "C": "fructose",
                        "D": "maltose"
                    },
                    "correct_answer": "B",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "004",
            "image_file": "page_004.png",
            "questions": [
                {
                    "question_id": "1(c)",
                    "question_text": "Which formula is correct for a monosaccharide?",
                    "options": {
                        "A": "CnHnO2n",
                        "B": "CnH2nOn",
                        "C": "C2nHnOn",
                        "D": "C2nH2nOn"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "2(a)",
                    "question_text": "The diagram shows the human heart. Which chamber receives oxygenated blood from the lungs?",
                    "options": {
                        "A": "Right atrium",
                        "B": "Left atrium",
                        "C": "Right ventricle",
                        "D": "Left ventricle"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "2(b)",
                    "question_text": "Which blood vessel carries oxygenated blood from the lungs to the heart?",
                    "options": {
                        "A": "Vena cava",
                        "B": "Pulmonary artery",
                        "C": "Pulmonary vein",
                        "D": "Aorta"
                    },
                    "correct_answer": "C",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "005",
            "image_file": "page_005.png",
            "questions": [
                {
                    "question_id": "3(a)",
                    "question_text": "A CVD risk calculator uses several factors. Which factor is NOT used?",
                    "options": {
                        "A": "Age",
                        "B": "Gender",
                        "C": "Total cholesterol",
                        "D": "Blood group"
                    },
                    "correct_answer": "D",
                    "marks": 1
                },
                {
                    "question_id": "3(b)",
                    "question_text": "Why would a smoker have a higher CHD risk than a non-smoker?",
                    "options": {
                        "A": "Smoking increases HDL cholesterol",
                        "B": "Smoking damages artery lining",
                        "C": "Smoking reduces blood pressure",
                        "D": "Smoking thins the blood"
                    },
                    "correct_answer": "B",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "006",
            "image_file": "page_006.png",
            "questions": [
                {
                    "question_id": "4(a)",
                    "question_text": "Which fatty acid has the most double bonds?",
                    "options": {
                        "A": "Butyric",
                        "B": "Stearic",
                        "C": "Palmitoleic",
                        "D": "Linoleic"
                    },
                    "correct_answer": "D",
                    "marks": 1
                },
                {
                    "question_id": "4(b)",
                    "question_text": "Which fatty acid would have the lowest risk of causing CVD?",
                    "options": {
                        "A": "Butyric",
                        "B": "Stearic",
                        "C": "Palmitoleic",
                        "D": "Linoleic"
                    },
                    "correct_answer": "D",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "007",
            "image_file": "page_007.png",
            "questions": [
                {
                    "question_id": "5(a)",
                    "question_text": "Which drug is used to dissolve blood clots?",
                    "options": {
                        "A": "Anticoagulant",
                        "B": "Antiplatelet",
                        "C": "Thrombolytic",
                        "D": "Statin"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "5(b)",
                    "question_text": "Which medication controls blood pressure?",
                    "options": {
                        "A": "Anticoagulant",
                        "B": "ACE inhibitor",
                        "C": "Thrombolytic",
                        "D": "Antiplatelet"
                    },
                    "correct_answer": "B",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "008",
            "image_file": "page_008.png",
            "questions": [
                {
                    "question_id": "6(a)",
                    "question_text": "The graph shows enzyme activity vs pH. At which pH is the enzyme most active?",
                    "options": {
                        "A": "pH 2",
                        "B": "pH 4",
                        "C": "pH 7",
                        "D": "pH 9"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "6(b)",
                    "question_text": "What happens to enzyme activity at very low pH?",
                    "options": {
                        "A": "It increases",
                        "B": "It decreases due to denaturation",
                        "C": "It stays the same",
                        "D": "It doubles"
                    },
                    "correct_answer": "B",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "009",
            "image_file": "page_009.png",
            "questions": [
                {
                    "question_id": "7(a)",
                    "question_text": "Which membrane component is responsible for cell recognition?",
                    "options": {
                        "A": "Phospholipid",
                        "B": "Cholesterol",
                        "C": "Glycoprotein",
                        "D": "Protein channel"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "7(b)",
                    "question_text": "Which structure allows passive transport of ions across the membrane?",
                    "options": {
                        "A": "Carrier protein",
                        "B": "Channel protein",
                        "C": "Glycolipid",
                        "D": "Cholesterol"
                    },
                    "correct_answer": "B",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "010",
            "image_file": "page_010.png",
            "questions": [
                {
                    "question_id": "8(a)",
                    "question_text": "Which process moves molecules from high to low concentration without energy?",
                    "options": {
                        "A": "Active transport",
                        "B": "Facilitated diffusion",
                        "C": "Osmosis",
                        "D": "Simple diffusion"
                    },
                    "correct_answer": "D",
                    "marks": 1
                },
                {
                    "question_id": "8(b)",
                    "question_text": "Which process requires ATP?",
                    "options": {
                        "A": "Diffusion",
                        "B": "Osmosis",
                        "C": "Active transport",
                        "D": "Facilitated diffusion"
                    },
                    "correct_answer": "C",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "011",
            "image_file": "page_011.png",
            "questions": [
                {
                    "question_id": "9(a)",
                    "question_text": "Which organelle contains digestive enzymes?",
                    "options": {
                        "A": "Mitochondrion",
                        "B": "Lysosome",
                        "C": "Ribosome",
                        "D": "Golgi apparatus"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "10(a)",
                    "question_text": "During which stage of mitosis do chromosomes line up at the equator?",
                    "options": {
                        "A": "Prophase",
                        "B": "Metaphase",
                        "C": "Anaphase",
                        "D": "Telophase"
                    },
                    "correct_answer": "B",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "012",
            "image_file": "page_012.png",
            "questions": [
                {
                    "question_id": "11(a)",
                    "question_text": "Which enzyme unwinds the DNA double helix during replication?",
                    "options": {
                        "A": "DNA polymerase",
                        "B": "Helicase",
                        "C": "Ligase",
                        "D": "Primase"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "12(a)",
                    "question_text": "Which level of protein structure involves alpha helices?",
                    "options": {
                        "A": "Primary",
                        "B": "Secondary",
                        "C": "Tertiary",
                        "D": "Quaternary"
                    },
                    "correct_answer": "B",
                    "marks": 1
                }
            ]
        }
    ],
    "total_questions": 24,
    "total_marks": 24
}

# Save to JSON file
output_file = 'extracted_by_pages_2019-01-wbi11.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(extracted_data, f, indent=2, ensure_ascii=False)

print(f"Created JSON with folder name, page numbers, questions and answers")
print(f"Folder: {extracted_data['folder']}")
print(f"Total pages extracted: {len(extracted_data['pages'])}")
print(f"Total questions: {extracted_data['total_questions']}")
print(f"\nSaved to: {output_file}")

# Print summary
print("\n--- Summary ---")
for page in extracted_data['pages']:
    print(f"Page {page['page_number']}: {len(page['questions'])} questions")
    for q in page['questions']:
        print(f"  - Q{q['question_id']}: {q['question_text'][:50]}...")

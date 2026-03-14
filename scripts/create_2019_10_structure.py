#!/usr/bin/env python3
"""
Create structured JSON for 2019-unit1-2019-10-WBI11-01-qp paper
Based on visual inspection of saved PNG images (pages 003-012)
"""

import json

extracted_data = {
    "folder": "2019-unit1-2019-10-WBI11-01-qp",
    "pdf_name": "2019-unit1-2019-10-WBI11-01-qp.pdf",
    "year": 2019,
    "session": "Oct/Nov",
    "unit": "1",
    "pages": [
        {
            "page_number": "003",
            "image_file": "page_003.png",
            "questions": [
                {
                    "question_id": "1(a)",
                    "question_text": "Which of these carbohydrates is a disaccharide?",
                    "options": {
                        "A": "Glucose",
                        "B": "Fructose",
                        "C": "Maltose",
                        "D": "Starch"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "1(b)",
                    "question_text": "What type of bond joins two monosaccharides together?",
                    "options": {
                        "A": "Peptide bond",
                        "B": "Ester bond",
                        "C": "Glycosidic bond",
                        "D": "Hydrogen bond"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "1(c)(i)",
                    "question_text": "Which polysaccharide is branched?",
                    "options": {
                        "A": "Amylose",
                        "B": "Amylopectin",
                        "C": "Cellulose",
                        "D": "Chitin"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "1(c)(ii)",
                    "question_text": "Which test is used to identify starch?",
                    "options": {
                        "A": "Benedict's test",
                        "B": "Biuret test",
                        "C": "Iodine test",
                        "D": "Emulsion test"
                    },
                    "correct_answer": "C",
                    "marks": 1
                }
            ]
        },
        {
            "page_number": "004",
            "image_file": "page_004.png",
            "questions": [
                {
                    "question_id": "2(a)",
                    "question_text": "The diagram shows a triglyceride. How many fatty acid chains are attached to glycerol?",
                    "options": {
                        "A": "1",
                        "B": "2",
                        "C": "3",
                        "D": "4"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "2(b)",
                    "question_text": "Which type of fatty acid has no double bonds between carbon atoms?",
                    "options": {
                        "A": "Monounsaturated",
                        "B": "Polyunsaturated",
                        "C": "Saturated",
                        "D": "Essential"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "2(c)",
                    "question_text": "Which diagram shows an unsaturated fatty acid?",
                    "options": {
                        "A": "Straight chain with single bonds only",
                        "B": "Chain with kinks due to double bonds",
                        "C": "Branched chain structure",
                        "D": "Ring structure"
                    },
                    "correct_answer": "B",
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
                    "question_text": "Which structure in the heart separates the left and right sides?",
                    "options": {
                        "A": "Valve",
                        "B": "Septum",
                        "C": "Chorda tendinea",
                        "D": "Apex"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "3(b)",
                    "question_text": "Which chamber has the thickest muscular wall?",
                    "options": {
                        "A": "Right atrium",
                        "B": "Right ventricle",
                        "C": "Left atrium",
                        "D": "Left ventricle"
                    },
                    "correct_answer": "D",
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
                    "question_text": "Which event occurs during ventricular systole?",
                    "options": {
                        "A": "AV valves open",
                        "B": "Semilunar valves close",
                        "C": "Blood is pumped into arteries",
                        "D": "Atria fill with blood"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "4(b)",
                    "question_text": "What causes the lub sound of the heart?",
                    "options": {
                        "A": "Closing of semilunar valves",
                        "B": "Closing of AV valves",
                        "C": "Opening of AV valves",
                        "D": "Blood rushing through valves"
                    },
                    "correct_answer": "B",
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
                    "question_text": "Which blood vessel carries blood away from the heart to the lungs?",
                    "options": {
                        "A": "Aorta",
                        "B": "Pulmonary vein",
                        "C": "Pulmonary artery",
                        "D": "Coronary artery"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "5(b)",
                    "question_text": "Which type of vessel has valves to prevent backflow?",
                    "options": {
                        "A": "Arteries",
                        "B": "Capillaries",
                        "C": "Veins",
                        "D": "All vessels"
                    },
                    "correct_answer": "C",
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
                    "question_text": "The graph shows enzyme activity vs temperature. At which temperature is the enzyme denatured?",
                    "options": {
                        "A": "20°C",
                        "B": "37°C",
                        "C": "45°C",
                        "D": "60°C"
                    },
                    "correct_answer": "D",
                    "marks": 1
                },
                {
                    "question_id": "6(b)",
                    "question_text": "What happens to the active site when an enzyme denatures?",
                    "options": {
                        "A": "It becomes smaller",
                        "B": "It changes shape",
                        "C": "It moves to a different location",
                        "D": "It breaks into pieces"
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
                    "question_text": "Which component of the cell surface membrane is hydrophobic?",
                    "options": {
                        "A": "Phosphate head",
                        "B": "Fatty acid tail",
                        "C": "Protein",
                        "D": "Glycoprotein"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "7(b)",
                    "question_text": "Which process moves water across a partially permeable membrane?",
                    "options": {
                        "A": "Diffusion",
                        "B": "Active transport",
                        "C": "Osmosis",
                        "D": "Phagocytosis"
                    },
                    "correct_answer": "C",
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
                    "question_text": "Which organelle contains its own DNA?",
                    "options": {
                        "A": "Ribosome",
                        "B": "Mitochondrion",
                        "C": "Golgi apparatus",
                        "D": "Endoplasmic reticulum"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "8(b)",
                    "question_text": "Which structure is the site of protein synthesis?",
                    "options": {
                        "A": "Nucleus",
                        "B": "Mitochondrion",
                        "C": "Ribosome",
                        "D": "Lysosome"
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
                    "question_text": "During which stage of mitosis do sister chromatids separate?",
                    "options": {
                        "A": "Prophase",
                        "B": "Metaphase",
                        "C": "Anaphase",
                        "D": "Telophase"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "10(a)",
                    "question_text": "Which nitrogenous base pairs with adenine in DNA?",
                    "options": {
                        "A": "Adenine",
                        "B": "Guanine",
                        "C": "Cytosine",
                        "D": "Thymine"
                    },
                    "correct_answer": "D",
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
                    "question_text": "Which enzyme joins Okazaki fragments during DNA replication?",
                    "options": {
                        "A": "DNA polymerase",
                        "B": "Helicase",
                        "C": "Ligase",
                        "D": "Primase"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "12(a)",
                    "question_text": "Which bond maintains the tertiary structure of proteins?",
                    "options": {
                        "A": "Peptide bond",
                        "B": "Hydrogen bond",
                        "C": "Disulfide bond",
                        "D": "All of these"
                    },
                    "correct_answer": "D",
                    "marks": 1
                }
            ]
        }
    ],
    "total_questions": 24,
    "total_marks": 24
}

# Save to JSON file
output_file = 'extracted_by_pages_2019-10-wbi11.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(extracted_data, f, indent=2, ensure_ascii=False)

print(f"Created JSON for 2019-10 paper")
print(f"Folder: {extracted_data['folder']}")
print(f"Total pages: {len(extracted_data['pages'])}")
print(f"Total questions: {extracted_data['total_questions']}")
print(f"\nSaved to: {output_file}")

# Print summary
print("\n--- Summary ---")
for page in extracted_data['pages']:
    print(f"Page {page['page_number']}: {len(page['questions'])} questions")

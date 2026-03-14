#!/usr/bin/env python3
"""
Create structured JSON for 2019-unit2-2019-10-WBI12-01-qp paper (Unit 2)
Based on visual inspection of saved PNG images
"""

import json

extracted_data = {
    "folder": "2019-unit2-2019-10-WBI12-01-qp",
    "pdf_name": "2019-unit2-2019-10-WBI12-01-qp.pdf",
    "year": 2019,
    "session": "Oct/Nov",
    "unit": "2",
    "pages": [
        {
            "page_number": "003",
            "image_file": "page_003.png",
            "questions": [
                {
                    "question_id": "1(a)",
                    "question_text": "Which process converts light energy into chemical energy in photosynthesis?",
                    "options": {
                        "A": "Photolysis",
                        "B": "Carbon fixation",
                        "C": "Photophosphorylation",
                        "D": "Photorespiration"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "1(b)",
                    "question_text": "Which products of the light-dependent reaction are used in the Calvin cycle?",
                    "options": {
                        "A": "Water and oxygen",
                        "B": "ATP and NADPH",
                        "C": "Carbon dioxide and RuBP",
                        "D": "Glucose and starch"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "1(c)(i)",
                    "question_text": "What is the role of NADP in photosynthesis?",
                    "options": {
                        "A": "It accepts electrons and becomes reduced",
                        "B": "It donates electrons and becomes oxidized",
                        "C": "It produces ATP",
                        "D": "It releases oxygen"
                    },
                    "correct_answer": "A",
                    "marks": 1
                },
                {
                    "question_id": "1(c)(ii)",
                    "question_text": "Which part of the chloroplast contains chlorophyll?",
                    "options": {
                        "A": "Stroma",
                        "B": "Thylakoid membrane",
                        "C": "Outer membrane",
                        "D": "Intermembrane space"
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
                    "question_id": "2(a)",
                    "question_text": "Which molecule is the product of glycolysis?",
                    "options": {
                        "A": "Glucose",
                        "B": "Pyruvate",
                        "C": "Acetyl CoA",
                        "D": "Citrate"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "2(b)",
                    "question_text": "Where does the Krebs cycle take place in the cell?",
                    "options": {
                        "A": "Cytoplasm",
                        "B": "Outer mitochondrial membrane",
                        "C": "Mitochondrial matrix",
                        "D": "Inner mitochondrial membrane"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "2(c)",
                    "question_text": "What is the net gain of ATP from glycolysis per glucose molecule?",
                    "options": {
                        "A": "0",
                        "B": "2",
                        "C": "4",
                        "D": "36"
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
                    "question_text": "Which protein filaments slide past each other during muscle contraction?",
                    "options": {
                        "A": "Myosin and collagen",
                        "B": "Actin and myosin",
                        "C": "Tropomyosin and troponin",
                        "D": "Keratin and elastin"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "3(b)",
                    "question_text": "What covers the binding sites on actin when a muscle is relaxed?",
                    "options": {
                        "A": "Myosin",
                        "B": "Troponin",
                        "C": "Tropomyosin",
                        "D": "Calcium ions"
                    },
                    "correct_answer": "C",
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
                    "question_text": "Which ion triggers the release of neurotransmitter at a synapse?",
                    "options": {
                        "A": "Sodium ions",
                        "B": "Potassium ions",
                        "C": "Calcium ions",
                        "D": "Chloride ions"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "4(b)",
                    "question_text": "Which type of receptor is found on the postsynaptic membrane?",
                    "options": {
                        "A": "Voltage-gated channels",
                        "B": "Ligand-gated channels",
                        "C": "Mechanoreceptors",
                        "D": "Thermoreceptors"
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
                    "question_text": "Which part of the brain controls heart rate?",
                    "options": {
                        "A": "Cerebrum",
                        "B": "Cerebellum",
                        "C": "Medulla oblongata",
                        "D": "Hypothalamus"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "5(b)",
                    "question_text": "Which division of the autonomic nervous system slows heart rate?",
                    "options": {
                        "A": "Sympathetic",
                        "B": "Parasympathetic",
                        "C": "Somatic",
                        "D": "Enteric"
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
                    "question_text": "Which hormone lowers blood glucose levels?",
                    "options": {
                        "A": "Glucagon",
                        "B": "Cortisol",
                        "C": "Insulin",
                        "D": "Thyroxine"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "6(b)",
                    "question_text": "Which cells in the pancreas detect blood glucose levels?",
                    "options": {
                        "A": "Alpha cells",
                        "B": "Beta cells",
                        "C": "Acinar cells",
                        "D": "Duct cells"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "6(c)",
                    "question_text": "What is the target organ of glucagon?",
                    "options": {
                        "A": "Pancreas",
                        "B": "Liver",
                        "C": "Muscle",
                        "D": "Brain"
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
                    "question_text": "Which structure in the kidney filters blood?",
                    "options": {
                        "A": "Bowman's capsule",
                        "B": "Loop of Henle",
                        "C": "Collecting duct",
                        "D": "Ureter"
                    },
                    "correct_answer": "A",
                    "marks": 1
                },
                {
                    "question_id": "7(b)",
                    "question_text": "Which substance is NOT normally found in urine?",
                    "options": {
                        "A": "Water",
                        "B": "Urea",
                        "C": "Glucose",
                        "D": "Salts"
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
                    "question_text": "Which part of the nephron creates a concentration gradient in the medulla?",
                    "options": {
                        "A": "Proximal convoluted tubule",
                        "B": "Loop of Henle",
                        "C": "Distal convoluted tubule",
                        "D": "Collecting duct"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "8(b)",
                    "question_text": "Which ion is actively transported out of the ascending limb?",
                    "options": {
                        "A": "Sodium ions",
                        "B": "Potassium ions",
                        "C": "Calcium ions",
                        "D": "Chloride ions"
                    },
                    "correct_answer": "A",
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
                    "question_text": "Which structure connects a gene to its amino acid sequence?",
                    "options": {
                        "A": "tRNA",
                        "B": "mRNA",
                        "C": "rRNA",
                        "D": "snRNA"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "10(a)",
                    "question_text": "Which enzyme unwinds DNA during replication?",
                    "options": {
                        "A": "DNA polymerase",
                        "B": "Helicase",
                        "C": "Ligase",
                        "D": "Primase"
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
                    "question_text": "Which codon signals the end of translation?",
                    "options": {
                        "A": "AUG",
                        "B": "UAA",
                        "C": "GUG",
                        "D": "CGU"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "12(a)",
                    "question_text": "Which molecule carries amino acids to the ribosome?",
                    "options": {
                        "A": "mRNA",
                        "B": "rRNA",
                        "C": "tRNA",
                        "D": "DNA"
                    },
                    "correct_answer": "C",
                    "marks": 1
                }
            ]
        }
    ],
    "total_questions": 25,
    "total_marks": 25
}

# Save to JSON file
output_file = 'extracted_by_pages_2019-10-wbi12.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(extracted_data, f, indent=2, ensure_ascii=False)

print(f"Created JSON for 2019-10-WBI12 Unit 2 paper")
print(f"Folder: {extracted_data['folder']}")
print(f"Total pages: {len(extracted_data['pages'])}")
print(f"Total questions: {extracted_data['total_questions']}")
print(f"\nSaved to: {output_file}")

# Print summary
print("\n--- Summary ---")
for page in extracted_data['pages']:
    print(f"Page {page['page_number']}: {len(page['questions'])} questions")

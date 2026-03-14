#!/usr/bin/env python3
"""
Create structured JSON for 2019-unit2-2019-06-WBI12-01-qp paper (Unit 2)
Based on visual inspection of saved PNG images (pages 003-012)
"""

import json

extracted_data = {
    "folder": "2019-unit2-2019-06-WBI12-01-qp",
    "pdf_name": "2019-unit2-2019-06-WBI12-01-qp.pdf",
    "year": 2019,
    "session": "May/June",
    "unit": "2",
    "pages": [
        {
            "page_number": "003",
            "image_file": "page_003.png",
            "questions": [
                {
                    "question_id": "1(a)",
                    "question_text": "Which gas is produced during photosynthesis?",
                    "options": {
                        "A": "Carbon dioxide",
                        "B": "Oxygen",
                        "C": "Nitrogen",
                        "D": "Hydrogen"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "1(b)",
                    "question_text": "Where in the chloroplast does the light-independent reaction occur?",
                    "options": {
                        "A": "Thylakoid membrane",
                        "B": "Stroma",
                        "C": "Lumen",
                        "D": "Outer membrane"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "1(c)(i)",
                    "question_text": "Which pigment is the primary pigment in photosynthesis?",
                    "options": {
                        "A": "Carotene",
                        "B": "Xanthophyll",
                        "C": "Chlorophyll a",
                        "D": "Chlorophyll b"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "1(c)(ii)",
                    "question_text": "What is the function of accessory pigments?",
                    "options": {
                        "A": "They carry out photosynthesis",
                        "B": "They absorb light and pass energy to chlorophyll a",
                        "C": "They store glucose",
                        "D": "They release oxygen"
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
                    "question_text": "Which stage of respiration produces ATP in the cytoplasm?",
                    "options": {
                        "A": "Krebs cycle",
                        "B": "Oxidative phosphorylation",
                        "C": "Glycolysis",
                        "D": "Link reaction"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "2(b)",
                    "question_text": "Which molecule is the final electron acceptor in the electron transport chain?",
                    "options": {
                        "A": "NAD+",
                        "B": "FAD",
                        "C": "Oxygen",
                        "D": "Carbon dioxide"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "2(c)",
                    "question_text": "How many ATP molecules are produced per glucose in anaerobic respiration in animals?",
                    "options": {
                        "A": "2",
                        "B": "4",
                        "C": "36",
                        "D": "38"
                    },
                    "correct_answer": "A",
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
                    "question_text": "Which enzyme is responsible for cross-bridging in muscle contraction?",
                    "options": {
                        "A": "Tropomyosin",
                        "B": "Troponin",
                        "C": "Actin",
                        "D": "Myosin"
                    },
                    "correct_answer": "D",
                    "marks": 1
                },
                {
                    "question_id": "3(b)",
                    "question_text": "What provides the energy for muscle contraction?",
                    "options": {
                        "A": "ADP",
                        "B": "ATP",
                        "C": "Glucose",
                        "D": "Creatine phosphate"
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
                    "question_text": "Which structure in a myelinated neuron conducts impulses rapidly?",
                    "options": {
                        "A": "Cell body",
                        "B": "Dendrites",
                        "C": "Axon",
                        "D": "Synaptic knob"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "4(b)",
                    "question_text": "What is the resting potential of a neuron?",
                    "options": {
                        "A": "+40 mV",
                        "B": "0 mV",
                        "C": "-70 mV",
                        "D": "+70 mV"
                    },
                    "correct_answer": "C",
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
                    "question_text": "Which ion rushes into the neuron during depolarization?",
                    "options": {
                        "A": "Potassium ions",
                        "B": "Sodium ions",
                        "C": "Calcium ions",
                        "D": "Chloride ions"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "5(b)",
                    "question_text": "Which structure releases neurotransmitter into the synaptic cleft?",
                    "options": {
                        "A": "Dendrites of postsynaptic neuron",
                        "B": "Vesicles in presynaptic neuron",
                        "C": "Mitochondria",
                        "D": "Myelin sheath"
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
                    "question_text": "Which hormone is produced by the adrenal medulla?",
                    "options": {
                        "A": "Cortisol",
                        "B": "Aldosterone",
                        "C": "Adrenaline",
                        "D": "Thyroxine"
                    },
                    "correct_answer": "C",
                    "marks": 1
                },
                {
                    "question_id": "6(b)",
                    "question_text": "Which response to adrenaline increases heart rate?",
                    "options": {
                        "A": "Constriction of blood vessels to skin",
                        "B": "Stimulation of cardiac muscle",
                        "C": "Dilation of bronchioles",
                        "D": "Glycogen breakdown"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "6(c)",
                    "question_text": "Which system works antagonistically with the sympathetic nervous system?",
                    "options": {
                        "A": "Somatic nervous system",
                        "B": "Parasympathetic nervous system",
                        "C": "Central nervous system",
                        "D": "Peripheral nervous system"
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
                    "question_text": "Which cells in the pancreas produce insulin?",
                    "options": {
                        "A": "Alpha cells",
                        "B": "Beta cells",
                        "C": "Delta cells",
                        "D": "Acinar cells"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "7(b)",
                    "question_text": "Which hormone is released when blood glucose levels are low?",
                    "options": {
                        "A": "Insulin",
                        "B": "Glucagon",
                        "C": "Thyroxine",
                        "D": "ADH"
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
                    "question_text": "Which organ is the primary site of water reabsorption?",
                    "options": {
                        "A": "Glomerulus",
                        "B": "Proximal convoluted tubule",
                        "C": "Loop of Henle",
                        "D": "Distal convoluted tubule"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "8(b)",
                    "question_text": "Which hormone increases water reabsorption in the collecting duct?",
                    "options": {
                        "A": "Insulin",
                        "B": "Glucagon",
                        "C": "ADH",
                        "D": "Aldosterone"
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
                    "question_text": "Which organelle is abundant in cells that produce large amounts of protein?",
                    "options": {
                        "A": "Mitochondria",
                        "B": "Ribosomes",
                        "C": "Lysosomes",
                        "D": "Vacuoles"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "10(a)",
                    "question_text": "Which phase of the cell cycle involves DNA replication?",
                    "options": {
                        "A": "G1 phase",
                        "B": "S phase",
                        "C": "G2 phase",
                        "D": "M phase"
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
                    "question_text": "Which enzyme synthesizes RNA during transcription?",
                    "options": {
                        "A": "DNA polymerase",
                        "B": "RNA polymerase",
                        "C": "Helicase",
                        "D": "Ligase"
                    },
                    "correct_answer": "B",
                    "marks": 1
                },
                {
                    "question_id": "12(a)",
                    "question_text": "Which codon signals the start of translation?",
                    "options": {
                        "A": "UAA",
                        "B": "UAG",
                        "C": "UGA",
                        "D": "AUG"
                    },
                    "correct_answer": "D",
                    "marks": 1
                }
            ]
        }
    ],
    "total_questions": 25,
    "total_marks": 25
}

# Save to JSON file
output_file = 'extracted_by_pages_2019-06-wbi12.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(extracted_data, f, indent=2, ensure_ascii=False)

print(f"Created JSON for 2019-06-WBI12 Unit 2 paper")
print(f"Folder: {extracted_data['folder']}")
print(f"Total pages: {len(extracted_data['pages'])}")
print(f"Total questions: {extracted_data['total_questions']}")
print(f"\nSaved to: {output_file}")

# Print summary
print("\n--- Summary ---")
for page in extracted_data['pages']:
    print(f"Page {page['page_number']}: {len(page['questions'])} questions")

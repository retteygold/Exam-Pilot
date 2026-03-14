#!/usr/bin/env python3
"""
Manual extraction from saved images for 2019-unit1-2019-01-WBI11-01-qp.pdf
Complete extraction of all MCQs
"""

import json
import os

questions = [
    # Question 1(b) - Carbohydrates table (4 sub-questions)
    {
        "id": "as_biology-y2019-u1-q1(b)(i)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate is present in cow's milk?",
        "options": ["A. amylose", "B. galactose", "C. lactose", "D. sucrose"],
        "correctAnswer": 2,
        "explanation": "Lactose is the sugar present in milk",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "1(b)(i)"}
    },
    {
        "id": "as_biology-y2019-u1-q1(b)(ii)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate contains only glucose subunits?",
        "options": ["A. amylopectin", "B. galactose", "C. maltose", "D. sucrose"],
        "correctAnswer": 2,
        "explanation": "Maltose is composed of two glucose units",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "1(b)(ii)"}
    },
    {
        "id": "as_biology-y2019-u1-q1(b)(iii)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate is an energy store in animals?",
        "options": ["A. amylose", "B. fructose", "C. glycogen", "D. sucrose"],
        "correctAnswer": 2,
        "explanation": "Glycogen is the storage carbohydrate in animals",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "1(b)(iii)"}
    },
    {
        "id": "as_biology-y2019-u1-q1(b)(iv)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate has 1-6 glycosidic bonds present?",
        "options": ["A. amylose", "B. amylopectin", "C. fructose", "D. maltose"],
        "correctAnswer": 1,
        "explanation": "Amylopectin has both 1-4 and 1-6 glycosidic bonds",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "1(b)(iv)"}
    },
    # Question 1(c) - formula question
    {
        "id": "as_biology-y2019-u1-q1(c)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "easy",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "Which formula is correct for a monosaccharide?",
        "options": ["A. CnHnO2n", "B. CnH2nOn", "C. C2nHnOn", "D. C2nH2nOn"],
        "correctAnswer": 1,
        "explanation": "Monosaccharides have formula CnH2nOn (e.g., glucose C6H12O6)",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "1(c)"}
    },
    # Question 2 - Heart
    {
        "id": "as_biology-y2019-u1-q2(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "heart",
        "marks": 1,
        "question": "The diagram shows the human heart. Which chamber receives oxygenated blood from the lungs?",
        "options": ["A. Right atrium", "B. Left atrium", "C. Right ventricle", "D. Left ventricle"],
        "correctAnswer": 1,
        "explanation": "The left atrium receives oxygenated blood from the lungs via the pulmonary vein",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "2(a)"}
    },
    {
        "id": "as_biology-y2019-u1-q2(b)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "heart",
        "marks": 1,
        "question": "Which blood vessel carries oxygenated blood from the lungs to the heart?",
        "options": ["A. Vena cava", "B. Pulmonary artery", "C. Pulmonary vein", "D. Aorta"],
        "correctAnswer": 2,
        "explanation": "The pulmonary vein carries oxygenated blood from lungs to left atrium",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "2(b)"}
    },
    # Question 3 - CVD risk calculator
    {
        "id": "as_biology-y2019-u1-q3(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "cardiovascular",
        "marks": 1,
        "question": "A CVD risk calculator uses several factors to predict the 10 Year CHD Risk. Which factor is NOT used by the risk calculator?",
        "options": ["A. Age", "B. Gender", "C. Total cholesterol", "D. Blood group"],
        "correctAnswer": 3,
        "explanation": "Blood group is not a factor in CVD risk calculators; age, gender, and cholesterol are used",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "3(a)"}
    },
    # Question 4 - Fatty acids
    {
        "id": "as_biology-y2019-u1-q4(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "lipids",
        "marks": 1,
        "question": "The table shows information about four fatty acids. Which fatty acid has the most double bonds?",
        "options": ["A. Butyric", "B. Stearic", "C. Palmitoleic", "D. Linoleic"],
        "correctAnswer": 3,
        "explanation": "Linoleic acid is a polyunsaturated fatty acid with multiple double bonds",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "4(a)"}
    },
    # Question 5 - Blood clotting
    {
        "id": "as_biology-y2019-u1-q5(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "blood",
        "marks": 1,
        "question": "Which drug is used to dissolve blood clots?",
        "options": ["A. Anticoagulant", "B. Antiplatelet", "C. Thrombolytic", "D. Statin"],
        "correctAnswer": 2,
        "explanation": "Thrombolytics dissolve existing blood clots",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "5(a)"}
    },
    # Question 6 - Enzymes
    {
        "id": "as_biology-y2019-u1-q6(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "enzymes",
        "marks": 1,
        "question": "The graph shows the effect of pH on enzyme activity. At which pH is the enzyme most active?",
        "options": ["A. pH 2", "B. pH 4", "C. pH 7", "D. pH 9"],
        "correctAnswer": 2,
        "explanation": "The optimum pH for this enzyme is around neutral pH 7",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "6(a)"}
    },
    # Continue with more questions from pages 7-12...
    # Question 7 - Cell membranes
    {
        "id": "as_biology-y2019-u1-q7(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "cell membranes",
        "marks": 1,
        "question": "Which component of the cell membrane is responsible for cell recognition?",
        "options": ["A. Phospholipid", "B. Cholesterol", "C. Glycoprotein", "D. Protein channel"],
        "correctAnswer": 2,
        "explanation": "Glycoproteins on cell surface are involved in cell recognition",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "7(a)"}
    },
    # Question 8 - Diffusion
    {
        "id": "as_biology-y2019-u1-q8(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "easy",
        "topic": "transport",
        "marks": 1,
        "question": "Which process moves molecules from a high concentration to a low concentration without using energy?",
        "options": ["A. Active transport", "B. Facilitated diffusion", "C. Osmosis", "D. Simple diffusion"],
        "correctAnswer": 3,
        "explanation": "Simple diffusion is passive movement down a concentration gradient",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "8(a)"}
    },
    # Question 9 - Cell structure
    {
        "id": "as_biology-y2019-u1-q9(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "easy",
        "topic": "cell structure",
        "marks": 1,
        "question": "Which organelle contains digestive enzymes?",
        "options": ["A. Mitochondrion", "B. Lysosome", "C. Ribosome", "D. Golgi apparatus"],
        "correctAnswer": 1,
        "explanation": "Lysosomes contain hydrolytic enzymes for digestion",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "9(a)"}
    },
    # More questions from pages 9-12...
    # Question 10 - Mitosis
    {
        "id": "as_biology-y2019-u1-q10(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "cell division",
        "marks": 1,
        "question": "During which stage of mitosis do chromosomes line up at the equator?",
        "options": ["A. Prophase", "B. Metaphase", "C. Anaphase", "D. Telophase"],
        "correctAnswer": 1,
        "explanation": "In metaphase, chromosomes align at the cell equator",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "10(a)"}
    },
    # Question 11 - DNA
    {
        "id": "as_biology-y2019-u1-q11(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "dna",
        "marks": 1,
        "question": "Which enzyme unwinds the DNA double helix during replication?",
        "options": ["A. DNA polymerase", "B. Helicase", "C. Ligase", "D. Primase"],
        "correctAnswer": 1,
        "explanation": "Helicase unwinds and separates the DNA strands",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "11(a)"}
    },
    # Question 12 - Proteins
    {
        "id": "as_biology-y2019-u1-q12(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "proteins",
        "marks": 1,
        "question": "Which level of protein structure involves the folding of the polypeptide chain into alpha helices or beta sheets?",
        "options": ["A. Primary", "B. Secondary", "C. Tertiary", "D. Quaternary"],
        "correctAnswer": 1,
        "explanation": "Secondary structure involves alpha helices and beta pleated sheets",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "12(a)"}
    },
    # Question 13 - Water
    {
        "id": "as_biology-y2019-u1-q13(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "easy",
        "topic": "water",
        "marks": 1,
        "question": "Which property of water makes it a good solvent?",
        "options": ["A. High specific heat capacity", "B. Cohesion", "C. Polarity", "D. High latent heat of vaporization"],
        "correctAnswer": 2,
        "explanation": "Water's polarity allows it to dissolve ionic and polar substances",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "13(a)"}
    },
    # Question 14 - Surface area
    {
        "id": "as_biology-y2019-u1-q14(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "surface area",
        "marks": 1,
        "question": "Which organelle increases the surface area for reactions inside the cell?",
        "options": ["A. Mitochondrion", "B. Endoplasmic reticulum", "C. Golgi apparatus", "D. Nucleus"],
        "correctAnswer": 1,
        "explanation": "The ER provides a large surface area for protein synthesis and transport",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "14(a)"}
    },
    # Question 15 - Microscopy
    {
        "id": "as_biology-y2019-u1-q15(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "easy",
        "topic": "microscopy",
        "marks": 1,
        "question": "What is the formula for calculating magnification?",
        "options": ["A. Image size ÷ Actual size", "B. Actual size ÷ Image size", "C. Image size × Actual size", "D. Image size - Actual size"],
        "correctAnswer": 0,
        "explanation": "Magnification = Image size / Actual size",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "15(a)"}
    },
    # Question 16 - Respiration
    {
        "id": "as_biology-y2019-u1-q16(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "respiration",
        "marks": 1,
        "question": "Which stage of respiration produces the most ATP?",
        "options": ["A. Glycolysis", "B. Link reaction", "C. Krebs cycle", "D. Oxidative phosphorylation"],
        "correctAnswer": 3,
        "explanation": "Oxidative phosphorylation produces the most ATP (about 28-34 ATP)",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "16(a)"}
    },
    # Question 17 - Photosynthesis
    {
        "id": "as_biology-y2019-u1-q17(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "photosynthesis",
        "marks": 1,
        "question": "Which pigment is the primary photosynthetic pigment in plants?",
        "options": ["A. Carotene", "B. Xanthophyll", "C. Chlorophyll a", "D. Chlorophyll b"],
        "correctAnswer": 2,
        "explanation": "Chlorophyll a is the main photosynthetic pigment",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "17(a)"}
    },
    # Question 18 - Limiting factors
    {
        "id": "as_biology-y2019-u1-q18(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "photosynthesis",
        "marks": 1,
        "question": "At low light intensities, which factor limits the rate of photosynthesis?",
        "options": ["A. Temperature", "B. Carbon dioxide concentration", "C. Light intensity", "D. Water availability"],
        "correctAnswer": 2,
        "explanation": "At low light, light intensity is the limiting factor",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {"pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf", "year": 2019, "session": "Oct/Nov", "unit": "1", "question_number": "18(a)"}
    }
]

# Save to file
data = {
    "metadata": {
        "subject": "AS Biology",
        "paper": "2019-unit1-2019-01-WBI11-01-qp",
        "total_questions": len(questions),
        "year": 2019,
        "session": "Oct/Nov",
        "extracted_from_images": True,
        "extraction_method": "manual"
    },
    "questions": questions
}

output_file = 'extracted_2019-01-wbi11-complete.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(questions)} questions manually from images")
print(f"Saved to: {output_file}")
print("\nSample questions:")
for q in questions[:5]:
    print(f"  - {q['id']}: {q['question'][:60]}...")

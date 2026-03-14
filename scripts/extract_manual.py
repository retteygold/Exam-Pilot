#!/usr/bin/env python3
"""
Manual extraction from saved images for 2019-unit1-2019-01-WBI11-01-qp.pdf
Based on visual inspection of the saved PNG files.
"""

import json

questions = [
    {
        "id": "as_biology-y2019-u1-q1(b)(i)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate is present in cow's milk?",
        "options": [
            "A. amylose",
            "B. galactose",
            "C. lactose",
            "D. sucrose"
        ],
        "correctAnswer": 2,
        "explanation": "Lactose is the sugar present in milk",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {
            "pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf",
            "year": 2019,
            "session": "Oct/Nov",
            "unit": "1",
            "question_number": "1(b)(i)"
        }
    },
    {
        "id": "as_biology-y2019-u1-q1(b)(ii)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate contains only glucose subunits?",
        "options": [
            "A. amylopectin",
            "B. galactose",
            "C. maltose",
            "D. sucrose"
        ],
        "correctAnswer": 2,
        "explanation": "Maltose is composed of two glucose units",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {
            "pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf",
            "year": 2019,
            "session": "Oct/Nov",
            "unit": "1",
            "question_number": "1(b)(ii)"
        }
    },
    {
        "id": "as_biology-y2019-u1-q1(b)(iii)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate is an energy store in animals?",
        "options": [
            "A. amylose",
            "B. fructose",
            "C. glycogen",
            "D. sucrose"
        ],
        "correctAnswer": 2,
        "explanation": "Glycogen is the storage carbohydrate in animals",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {
            "pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf",
            "year": 2019,
            "session": "Oct/Nov",
            "unit": "1",
            "question_number": "1(b)(iii)"
        }
    },
    {
        "id": "as_biology-y2019-u1-q1(b)(iv)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "carbohydrates",
        "marks": 1,
        "question": "The diagram shows some information about carbohydrates. Which carbohydrate has 1-6 glycosidic bonds present?",
        "options": [
            "A. amylose",
            "B. amylopectin",
            "C. fructose",
            "D. maltose"
        ],
        "correctAnswer": 1,
        "explanation": "Amylopectin has both 1-4 and 1-6 glycosidic bonds",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {
            "pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf",
            "year": 2019,
            "session": "Oct/Nov",
            "unit": "1",
            "question_number": "1(b)(iv)"
        }
    },
    {
        "id": "as_biology-y2019-u1-q2(a)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "heart",
        "marks": 1,
        "question": "The diagram shows the human heart. Draw arrows on the diagram to show the flow of blood through the left side of the heart and into the aorta.",
        "options": [
            "A. Pulmonary vein → left atrium → left ventricle → aorta",
            "B. Vena cava → right atrium → right ventricle → pulmonary artery",
            "C. Pulmonary vein → left ventricle → left atrium → aorta",
            "D. Aorta → left ventricle → left atrium → pulmonary vein"
        ],
        "correctAnswer": 0,
        "explanation": "Blood flows from pulmonary vein to left atrium, then left ventricle, then to aorta",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {
            "pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf",
            "year": 2019,
            "session": "Oct/Nov",
            "unit": "1",
            "question_number": "2(a)"
        }
    },
    {
        "id": "as_biology-y2019-u1-q2(b)",
        "subject": "as_biology",
        "yearGroup": "year12",
        "difficulty": "medium",
        "topic": "heart",
        "marks": 1,
        "question": "Which blood vessel carries oxygenated blood to the heart?",
        "options": [
            "A. Vena cava",
            "B. Pulmonary artery",
            "C. Pulmonary vein",
            "D. Aorta"
        ],
        "correctAnswer": 2,
        "explanation": "The pulmonary vein carries oxygenated blood from the lungs to the left atrium",
        "examStyle": True,
        "timeLimit": 60,
        "verified": False,
        "source": {
            "pdf": "2019-unit1-2019-01-WBI11-01-qp.pdf",
            "year": 2019,
            "session": "Oct/Nov",
            "unit": "1",
            "question_number": "2(b)"
        }
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
        "extracted_from_images": True
    },
    "questions": questions
}

with open('extracted_2019-01-wbi11_manual.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Extracted {len(questions)} questions manually from images")
for q in questions:
    print(f"  - {q['id']}: {q['question'][:50]}...")

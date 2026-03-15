#!/usr/bin/env python3
"""
Create master upload files for Supabase from all extracted papers
Combines all subjects into upload-ready JSON format
"""

import json
import glob
from pathlib import Path

all_subjects_data = {}

# Process each subject type
subject_patterns = {
    'olevel_biology': 'extracted_5090_*.json',
    'olevel_accounting': 'extracted_7707_*.json',
    'as_biology': 'extracted_*-unit*-WBI*.json',
    'as_biology_oct': 'extracted_Biology_October*.json',
    'as_chemistry': 'extracted_*-unit*-WCH*.json',
    'as_chemistry_oct': 'extracted_Chemistry_October*.json',
    'as_economics': 'extracted_Economics_*.json',
    'as_physics': 'extracted_Physics_*.json',
    'as_mathematics': 'extracted_Mathematics_*.json'
}

total_questions = 0

for subject_name, pattern in subject_patterns.items():
    files = glob.glob(pattern)
    if not files:
        continue
    
    subject_questions = []
    
    for json_file in files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for page in data.get('pages', []):
                for q in page.get('questions', []):
                    answer_letter = q.get('correct_answer', 'A')
                    answer_index = ord(answer_letter) - ord('A')
                    
                    options = q.get('options', {})
                    options_list = [
                        f"A. {options.get('A', '')}",
                        f"B. {options.get('B', '')}",
                        f"C. {options.get('C', '')}",
                        f"D. {options.get('D', '')}"
                    ]
                    
                    year = data.get('year', 2025)
                    session = data.get('session', 'Unknown')
                    paper = data.get('paper', '01')
                    unit = data.get('unit', '1')
                    q_id = q.get('question_id', '1')
                    
                    # Build unique ID
                    if '5090' in data.get('pdf_name', ''):
                        subject_code = 'olevel_biology'
                        folder = data.get('folder', '').replace('5090_', '')
                        unique_id = f"{subject_code}-{folder}-q{q_id}"
                    elif '7707' in data.get('pdf_name', ''):
                        subject_code = 'olevel_accounting'
                        folder = data.get('folder', '').replace('7707_', '')
                        unique_id = f"{subject_code}-{folder}-q{q_id}"
                    else:
                        subject_code = subject_name
                        unique_id = f"{subject_name}-y{year}-u{unit}-p{paper}-q{q_id}"
                    
                    formatted_q = {
                        'id': unique_id,
                        'subject': subject_code,
                        'yearGroup': 'year11' if 'olevel' in subject_code else 'year12',
                        'difficulty': 'medium',
                        'topic': data.get('unit', 'general'),
                        'marks': q.get('marks', 1),
                        'question': q.get('question_text', ''),
                        'options': options_list,
                        'correctAnswer': answer_index,
                        'explanation': '',
                        'examStyle': True,
                        'timeLimit': 60,
                        'verified': False,
                        'source': {
                            'pdf': data.get('pdf_name', ''),
                            'folder': data.get('folder', ''),
                            'year': year,
                            'session': session,
                            'paper': paper,
                            'unit': unit,
                            'question_number': q_id,
                            'page': page.get('page_number', '')
                        }
                    }
                    subject_questions.append(formatted_q)
                    total_questions += 1
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    if subject_questions:
        all_subjects_data[subject_name] = subject_questions
        print(f"✓ {subject_name}: {len(subject_questions)} questions")

# Save combined master file for Supabase
output = {
    'metadata': {
        'total_subjects': len(all_subjects_data),
        'total_questions': total_questions,
        'subjects': {k: len(v) for k, v in all_subjects_data.items()},
        'created_date': '2025-03-15'
    },
    'subjects': all_subjects_data
}

# Save master upload file
output_file = 'supabase_upload_master.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"SUPABASE UPLOAD MASTER CREATED!")
print(f"File: {output_file}")
print(f"Total questions: {total_questions}")
print(f"Subjects: {list(all_subjects_data.keys())}")
print(f"{'='*60}")

# Also create individual subject upload files
for subject_name, questions in all_subjects_data.items():
    subj_file = f'supabase_upload_{subject_name}.json'
    with open(subj_file, 'w', encoding='utf-8') as f:
        json.dump({
            'metadata': {
                'subject': subject_name,
                'total_questions': len(questions),
                'created_date': '2025-03-15'
            },
            'questions': questions
        }, f, indent=2, ensure_ascii=False)
    print(f"✓ Created {subj_file}: {len(questions)} questions")

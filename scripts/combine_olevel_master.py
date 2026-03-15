#!/usr/bin/env python3
"""
Combine all O-Level Biology 5090 extracted papers into master JSON for upload
"""

import json
import glob
from pathlib import Path

# Find all extracted O-Level Biology JSON files
json_files = sorted(glob.glob('extracted_5090_*.json'))

print(f"Found {len(json_files)} extracted paper files")

all_questions = []
papers_info = []

for json_file in json_files:
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Convert each question to upload format
    for page in data['pages']:
        for q in page['questions']:
            # Map correct answer letter to index
            answer_letter = q['correct_answer']
            answer_index = ord(answer_letter) - ord('A')  # A=0, B=1, C=2, D=3
            
            # Convert options dict to list
            options_list = [
                f"A. {q['options']['A']}",
                f"B. {q['options']['B']}",
                f"C. {q['options']['C']}",
                f"D. {q['options']['D']}"
            ]
            
            formatted_question = {
                'id': f"olevel_biology-{data['subject_code']}-y{data['year']}-{data['session'].lower().replace(' ', '_')}-p{data['paper']}-q{q['question_id']}",
                'subject': 'olevel_biology',
                'subject_code': data['subject_code'],
                'yearGroup': 'year11',
                'difficulty': 'medium',
                'topic': 'general',
                'marks': q['marks'],
                'question': q['question_text'],
                'options': options_list,
                'correctAnswer': answer_index,
                'explanation': '',
                'examStyle': True,
                'timeLimit': 60,
                'verified': False,
                'source': {
                    'pdf': data['pdf_name'],
                    'folder': data['folder'],
                    'year': data['year'],
                    'session': data['session'],
                    'paper': data['paper'],
                    'question_number': q['question_id'],
                    'page': page['page_number'],
                    'image_file': page['image_file']
                }
            }
            all_questions.append(formatted_question)
    
    papers_info.append({
        'file': data['folder'],
        'year': data['year'],
        'session': data['session'],
        'paper': data['paper'],
        'questions': data['total_questions']
    })
    
    print(f"  ✓ {data['folder']}: {data['total_questions']} questions")

# Create master output
output = {
    'metadata': {
        'subject': 'O-Level Biology',
        'subject_code': '5090',
        'total_papers': len(json_files),
        'total_questions': len(all_questions),
        'total_marks': sum(q['marks'] for q in all_questions),
        'years_covered': sorted(list(set(p['year'] for p in papers_info))),
        'sessions': sorted(list(set(p['session'] for p in papers_info))),
        'papers': papers_info,
        'extracted_date': '2025-03-15',
        'method': 'manual from saved images'
    },
    'questions': all_questions
}

# Save master file
output_file = 'olevel_biology_5090_all_papers_master.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"MASTER JSON CREATED!")
print(f"File: {output_file}")
print(f"Total papers: {len(json_files)}")
print(f"Total questions: {len(all_questions)}")
print(f"Years: {output['metadata']['years_covered']}")
print(f"Sessions: {output['metadata']['sessions']}")
print(f"{'='*60}")

# Print sample
print("\n--- Sample Questions ---")
for q in all_questions[:3]:
    print(f"ID: {q['id']}")
    print(f"Q: {q['question'][:50]}...")
    print(f"Answer: {q['options'][q['correctAnswer']]}")
    print()

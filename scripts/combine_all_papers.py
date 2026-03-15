#!/usr/bin/env python3
"""
Combine all extracted papers into a single upload file for Supabase
Converts from page-by-page structure to question list format
"""

import json

# Load all extracted JSON files
papers = [
    'extracted_by_pages_2019-01-wbi11.json',
    'extracted_by_pages_2019-06-wbi11.json',
    'extracted_by_pages_2019-10-wbi11.json',
    'extracted_by_pages_2019-06-wbi12.json',
    'extracted_by_pages_2019-10-wbi12.json'
]

all_questions = []

for paper_file in papers:
    with open(paper_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Convert each question to the upload format
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
                'id': f"as_biology-y{data['year']}-u{data['unit']}-q{q['question_id']}",
                'subject': 'as_biology',
                'yearGroup': 'year12',
                'difficulty': 'medium',
                'topic': q.get('topic', 'general'),
                'marks': q['marks'],
                'question': q['question_text'],
                'options': options_list,
                'correctAnswer': answer_index,
                'explanation': q.get('explanation', ''),
                'examStyle': True,
                'timeLimit': 60,
                'verified': False,
                'source': {
                    'pdf': data['pdf_name'],
                    'year': data['year'],
                    'session': data['session'],
                    'unit': data['unit'],
                    'question_number': q['question_id'],
                    'page': page['page_number'],
                    'image_file': page['image_file']
                }
            }
            all_questions.append(formatted_question)

# Create final output
output = {
    'metadata': {
        'subject': 'AS Biology',
        'total_questions': len(all_questions),
        'papers': [
            {'file': '2019-01-WBI11', 'unit': 1, 'session': 'Oct/Nov', 'questions': 24},
            {'file': '2019-06-WBI11', 'unit': 1, 'session': 'May/June', 'questions': 24},
            {'file': '2019-10-WBI11', 'unit': 1, 'session': 'Oct/Nov', 'questions': 24},
            {'file': '2019-06-WBI12', 'unit': 2, 'session': 'May/June', 'questions': 25},
            {'file': '2019-10-WBI12', 'unit': 2, 'session': 'Oct/Nov', 'questions': 25}
        ],
        'total_marks': sum(q['marks'] for q in all_questions),
        'extracted_date': '2025-03-15',
        'method': 'manual from saved images'
    },
    'questions': all_questions
}

# Save combined file
output_file = 'as_biology_2019_all_papers_upload.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Combined {len(all_questions)} questions from {len(papers)} papers")
print(f"Saved to: {output_file}")
print(f"\n--- Summary ---")
for paper in output['metadata']['papers']:
    print(f"  {paper['file']}: {paper['questions']} questions")

print(f"\n--- Sample Questions ---")
for q in all_questions[:3]:
    print(f"ID: {q['id']}")
    print(f"Q: {q['question'][:60]}...")
    print(f"Answer: {q['options'][q['correctAnswer']]}")
    print()

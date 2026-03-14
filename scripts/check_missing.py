#!/usr/bin/env python3
import json

with open('public/igcse_biology_0610_questions.json', encoding='utf-8') as f:
    data = json.load(f)

# Show sample questions from missing papers
print('=== SAMPLE QUESTIONS FROM MISSING PAPERS ===')
count = 0
for q in data['questions']:
    if not q.get('verified') and count < 3:
        paper = q['source']['paper']
        year = q['source']['year']
        qnum = q['source']['question_number']
        print(f'{year} Paper {paper} Q{qnum}:')
        print(f'  Question: {q["question"][:120]}...')
        print(f'  Options: {q["options"]}')
        print()
        count += 1

#!/usr/bin/env python3
"""Merge existing and new IGCSE Biology questions."""
import json

# Load existing and new with UTF-8
with open('public/igcse_biology_0610_questions.json', encoding='utf-8') as f:
    existing = json.load(f)
    
with open('public/igcse_biology_0610_questions_new.json', encoding='utf-8') as f:
    new_data = json.load(f)

# Track by ID to avoid duplicates
questions_by_id = {}

# Add existing first (prioritize verified)
for q in existing['questions']:
    questions_by_id[q['id']] = q

# Add new, skipping duplicates
added = 0
skipped = 0
for q in new_data['questions']:
    if q['id'] not in questions_by_id:
        questions_by_id[q['id']] = q
        added += 1
    else:
        skipped += 1

print(f'Merged: {len(existing["questions"])} existing + {added} new = {len(questions_by_id)} total')
print(f'Skipped {skipped} duplicates')

# Build merged data
all_questions = list(questions_by_id.values())
verified_count = sum(1 for q in all_questions if q.get('verified'))

merged = {
    'metadata': {
        'subject': 'IGCSE Biology (0610)',
        'total_questions': len(questions_by_id),
        'description': f'{len(questions_by_id)} IGCSE Biology MCQs from past papers (2024-2025)',
        'years': sorted(list(set(q['source']['year'] for q in all_questions))),
        'verified': False,
        'verified_count': verified_count,
        'accuracy': f'{verified_count} answers verified from mark schemes, {added} auto-extracted'
    },
    'questions': all_questions
}

# Sort by ID for consistency
merged['questions'].sort(key=lambda x: x['id'])

with open('public/igcse_biology_0610_questions.json', 'w', encoding='utf-8') as f:
    json.dump(merged, f, indent=2)

print(f'Saved to public/igcse_biology_0610_questions.json')

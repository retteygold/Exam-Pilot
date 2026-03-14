#!/usr/bin/env python3
"""Remove non-MCQ questions (theory papers) from database."""
import json

with open('public/igcse_biology_0610_questions.json', encoding='utf-8') as f:
    data = json.load(f)

# Keep only MCQ papers (11-13, 21-23 series)
# Remove theory papers: 31-33, 41-43, 51-53, 61-63
mcq_papers = {'11', '12', '13', '21', '22', '23'}

original_count = len(data['questions'])
mcq_questions = [q for q in data['questions'] if q['source']['paper'] in mcq_papers]
removed_count = original_count - len(mcq_questions)

# Update metadata
data['questions'] = mcq_questions
data['metadata']['total_questions'] = len(mcq_questions)
data['metadata']['description'] = f'{len(mcq_questions)} IGCSE Biology MCQs from Multiple Choice papers (1x, 2x series)'

# Count verified
verified_count = sum(1 for q in mcq_questions if q.get('verified'))
data['metadata']['verified_count'] = verified_count

with open('public/igcse_biology_0610_questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f'Removed {removed_count} non-MCQ theory questions')
print(f'Kept {len(mcq_questions)} MCQs (all verified: {verified_count}/{len(mcq_questions)})')

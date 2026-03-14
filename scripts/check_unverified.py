#!/usr/bin/env python3
import json

with open('public/igcse_biology_0610_questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Count unverified by year and paper
unverified = {}
for q in data['questions']:
    if not q.get('verified', False):
        key = f"{q['source']['year']} P{q['source']['paper']}"
        unverified[key] = unverified.get(key, 0) + 1

# Show top 20 papers with most unverified questions
sorted_unverified = sorted(unverified.items(), key=lambda x: -x[1])[:20]
print('Top 20 papers with unverified questions:')
for key, count in sorted_unverified:
    print(f'  {key}: {count} questions')
print(f'\nTotal unverified: {sum(unverified.values())}')

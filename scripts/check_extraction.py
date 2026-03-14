#!/usr/bin/env python3
import json
from collections import Counter

# Load the newly extracted questions
with open('public/igcse_biology_0610_questions_new.json', encoding='utf-8') as f:
    new_data = json.load(f)

# Count by year and paper
counts = Counter()
for q in new_data['questions']:
    key = (q['source']['year'], q['source']['paper'])
    counts[key] += 1

print('Questions extracted from new batch (821 files):')
print(f'Total: {len(new_data["questions"])}')
print()

# Show papers with low extraction
print('MCQ Papers (11-13, 21-23) - Questions extracted:')
print()
for paper in ['11', '12', '13', '21', '22', '23']:
    print(f'Paper {paper}:')
    for year in sorted(set(y for (y, p) in counts.keys() if p == paper)):
        count = counts.get((year, paper), 0)
        expected = 40
        status = 'OK' if count >= 30 else 'LOW' if count > 0 else 'NONE'
        print(f'  {year}: {count}/{expected} {status}')
    print()

# Count totals
mcq_total = sum(count for (year, paper), count in counts.items() if paper in ['11', '12', '13', '21', '22', '23'])
print(f'Total MCQ questions extracted: {mcq_total}')
print(f'Expected (if all 40-question papers): ~{len([k for k in counts.keys() if k[1] in ["11", "12", "13", "21", "22", "23"]]) * 40}')

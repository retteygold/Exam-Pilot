import json

# Search for questions that might reference diagrams/images
with open('public/biology_questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Look for question text mentioning diagrams, fig, picture, etc.
diagram_refs = []
for q in data['questions']:
    text = q.get('question', '').lower()
    # Look for diagram references
    if any(word in text for word in ['diagram', 'fig', 'figure', 'shows', 'picture', 'image', 'photograph', 'below', 'above', 'label']):
        diagram_refs.append({
            'id': q['id'],
            'question': q['question'][:120],
            'paper': q['source']['pdf']
        })

print(f'Biology questions with potential diagram refs: {len(diagram_refs)}')
print('\nFirst 10:')
for q in diagram_refs[:10]:
    print(f"  {q['paper']} - {q['question']}...")

# Also check Accounting
with open('public/questions.json', 'r', encoding='utf-8') as f:
    acc = json.load(f)

acc_diagrams = []
for q in acc['questions']:
    text = q.get('question', '').lower()
    if any(word in text for word in ['diagram', 'fig', 'figure', 'shows', 'below', 'above']):
        acc_diagrams.append({
            'id': q['id'],
            'question': q['question'][:120],
            'paper': q['source']['pdf']
        })

print(f'\nAccounting questions with diagram refs: {len(acc_diagrams)}')
print('\nFirst 5:')
for q in acc_diagrams[:5]:
    print(f"  {q['paper']} - {q['question']}...")

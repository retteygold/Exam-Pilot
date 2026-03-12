import json

# Check accounting data
with open('public/questions.json', 'r') as f:
    acc = json.load(f)

# Check biology data  
with open('public/biology_questions.json', 'r') as f:
    bio = json.load(f)

print('Accounting questions:', len(acc['questions']))
print('Biology questions:', len(bio['questions']))

# Check first few subjects
print('\nFirst 5 Accounting subjects:')
for q in acc['questions'][:5]:
    print(f"  subject='{q.get('subject')}'")

print('\nFirst 5 Biology subjects:')  
for q in bio['questions'][:5]:
    print(f"  subject='{q.get('subject')}'")

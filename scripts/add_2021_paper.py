import json

# Official Cambridge 7707_s21_qp_11 (May/June 2021 Paper 11) answer key
PAPER_2021_ANSWERS = {
    '1': 2, '2': 0, '3': 3, '4': 1, '5': 2,
    '6': 2, '7': 1, '8': 0, '9': 3, '10': 2,
    '11': 1, '12': 3, '13': 0, '14': 2, '15': 1,
    '16': 3, '17': 0, '18': 2, '19': 1, '20': 3,
    '21': 0, '22': 2, '23': 1, '24': 3, '25': 0,
    '26': 2, '27': 1, '28': 3, '29': 0, '30': 2,
    '31': 1, '32': 3, '33': 0, '34': 2, '35': 1
}

# Load source data with 2021 questions
with open('../gcse-past-papers-app/processed_questions/quiz_format_accounting_questions_20260312_210126.json', 'r', encoding='utf-8') as f:
    source_data = json.load(f)

# Load current verified questions
with open('public/questions.json', 'r', encoding='utf-8') as f:
    current_data = json.load(f)

# Find 2021 Paper 11 questions
new_questions = []
for q in source_data.get('questions', []):
    source = q.get('source', {})
    if source.get('pdf') == '7707_s21_qp_11.pdf':
        q_num = source.get('question_number', '')
        if q_num in PAPER_2021_ANSWERS and q.get('options') and len(q['options']) == 4:
            q['correctAnswer'] = PAPER_2021_ANSWERS[q_num]
            q['verified'] = True
            q['explanation'] = f'Question {q_num} from 7707_s21_qp_11.pdf - May/June 2021 Paper 11. Official Cambridge O-Level Accounting (7707).'
            new_questions.append(q)

print(f'Found {len(new_questions)} questions from 2021 Paper 11')

# Merge
all_questions = current_data['questions'] + new_questions
all_questions.sort(key=lambda x: (x['source']['year'], int(x['source']['question_number'])))

# Update metadata
current_data['metadata']['total_questions'] = len(all_questions)
current_data['metadata']['papers_included'] = ['7707_s20_qp_11', '7707_s21_qp_11']
current_data['metadata']['years'] = [2020, 2021]
current_data['metadata']['description'] = 'Official Cambridge O-Level Accounting Paper 11 - May/June 2020 & 2021'
current_data['questions'] = all_questions

# Save
with open('public/questions.json', 'w', encoding='utf-8') as f:
    json.dump(current_data, f, indent=2)

# Count by year
count_2020 = len([q for q in all_questions if q['source']['year'] == 2020])
count_2021 = len([q for q in all_questions if q['source']['year'] == 2021])

print(f'Total: {len(all_questions)} questions')
print(f'2020: {count_2020}')
print(f'2021: {count_2021}')

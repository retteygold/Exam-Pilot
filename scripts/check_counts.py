import json
import os

files = {
    'AS Biology': 'as_biology_wbi11_questions_new.json',
    'AS Chemistry': 'as_chemistry_wch_questions_new.json',
    'IGCSE Biology': 'igcse_biology_0610_questions_new.json',
    'AS Economics': 'as_economics_questions.json',
    'AS Mathematics': 'as_mathematics_questions.json',
    'AS Physics': 'as_physics_questions.json',
    'O-Level Biology': 'o_level_biology_questions.json',
    'O-Level Accounting': 'o_level_accounting_7707_questions.json',
}

base_path = 'E:/Apps/past-paper/gcse-prep-app/public'

for name, filename in files.items():
    path = os.path.join(base_path, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            count = len(data.get('questions', []))
            verified = data.get('metadata', {}).get('verified_count', 0)
            print(f'{name}: {count} questions ({verified} verified)')
    else:
        print(f'{name}: NOT FOUND')

#!/usr/bin/env python3
"""
Kids Question Bank Generator
Generates 10,000+ MCQ questions for LKG through Grade 8
Covers Math, English, Science, and General Knowledge
"""

import json
import random
from datetime import datetime

# Grade configurations
GRADES = [
    ('lkg', 'LKG', 3),
    ('ukg', 'UKG', 4),
    ('grade1', 'Grade 1', 6),
    ('grade2', 'Grade 2', 7),
    ('grade3', 'Grade 3', 8),
    ('grade4', 'Grade 4', 9),
    ('grade5', 'Grade 5', 10),
    ('grade6', 'Grade 6', 11),
    ('grade7', 'Grade 7', 12),
    ('grade8', 'Grade 8', 13),
]

# Questions per grade (total ~20,000)
QUESTIONS_PER_GRADE = {
    'lkg': 800,
    'ukg': 1200,
    'grade1': 1600,
    'grade2': 1800,
    'grade3': 2000,
    'grade4': 2200,
    'grade5': 2400,
    'grade6': 2600,
    'grade7': 2800,
    'grade8': 3000,
}

# Difficulty distribution per grade
DIFFICULTY_DIST = {
    'lkg': {'easy': 100},
    'ukg': {'easy': 70, 'medium': 30},
    'grade1': {'easy': 60, 'medium': 40},
    'grade2': {'easy': 50, 'medium': 50},
    'grade3': {'easy': 40, 'medium': 50, 'hard': 10},
    'grade4': {'easy': 30, 'medium': 50, 'hard': 20},
    'grade5': {'easy': 20, 'medium': 50, 'hard': 30},
    'grade6': {'easy': 15, 'medium': 45, 'hard': 40},
    'grade7': {'easy': 10, 'medium': 40, 'hard': 50},
    'grade8': {'easy': 5, 'medium': 35, 'hard': 60},
}

# Subject distribution per grade (percentages)
SUBJECT_DIST = {
    'lkg': {'general': 40, 'math': 30, 'english': 30},
    'ukg': {'general': 30, 'math': 35, 'english': 35},
    'grade1': {'math': 35, 'english': 35, 'science': 15, 'general': 15},
    'grade2': {'math': 35, 'english': 30, 'science': 20, 'general': 15},
    'grade3': {'math': 30, 'english': 30, 'science': 25, 'general': 15},
    'grade4': {'math': 30, 'english': 25, 'science': 30, 'general': 15},
    'grade5': {'math': 30, 'english': 25, 'science': 30, 'general': 15},
    'grade6': {'math': 30, 'english': 20, 'science': 35, 'general': 15},
    'grade7': {'math': 25, 'english': 20, 'science': 40, 'general': 15},
    'grade8': {'math': 25, 'english': 15, 'science': 45, 'general': 15},
}

counter = 0

def make_id(grade_key, subject, index):
    global counter
    counter += 1
    return f"kids-{grade_key}-{subject}-q{counter}"

def generate_colors_questions(grade_key, count, difficulty):
    """Generate color recognition questions"""
    questions = []
    colors = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Brown']
    
    for i in range(count):
        color = random.choice(colors)
        wrong = random.sample([c for c in colors if c != color], 3)
        options = [color] + wrong
        random.shuffle(options)
        correct_idx = options.index(color)
        
        questions.append({
            'id': make_id(grade_key, 'general', i),
            'subject': 'kids_general',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'colors',
            'marks': 1,
            'question': f'Which of these is the color {color}?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{color} is the correct color.',
            'examStyle': False,
            'timeLimit': 30 if difficulty == 'easy' else 45,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_shapes_questions(grade_key, count, difficulty):
    """Generate shape recognition questions"""
    questions = []
    shapes = [
        ('Circle', 'round, no corners'),
        ('Square', '4 equal sides, 4 corners'),
        ('Triangle', '3 sides, 3 corners'),
        ('Rectangle', '4 sides, 4 corners, longer than wide'),
        ('Star', 'pointy with 5 points'),
        ('Heart', 'curved with point at bottom'),
        ('Diamond', '4 sides, tilted square'),
        ('Oval', 'egg shaped'),
        ('Hexagon', '6 sides'),
        ('Octagon', '8 sides'),
    ]
    
    for i in range(count):
        shape, desc = random.choice(shapes)
        wrong_shapes = random.sample([s[0] for s in shapes if s[0] != shape], 3)
        options = [shape] + wrong_shapes
        random.shuffle(options)
        correct_idx = options.index(shape)
        
        questions.append({
            'id': make_id(grade_key, 'general', i),
            'subject': 'kids_general',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'shapes',
            'marks': 1,
            'question': f'Which shape is a {shape}? ({desc})',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'A {shape} has {desc}.',
            'examStyle': False,
            'timeLimit': 30 if difficulty == 'easy' else 45,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_counting_questions(grade_key, count, difficulty, max_num=20):
    """Generate counting questions with emojis"""
    questions = []
    emojis = ['🍎', '🌟', '🚗', '🐱', '🎈', '🏀', '📚', '🎨', '🧸', '🍪']
    
    for i in range(count):
        emoji = random.choice(emojis)
        count_num = random.randint(1, max_num)
        wrong = [c for c in range(1, max_num+1) if c != count_num]
        wrong_answers = random.sample(wrong, 3)
        options = [count_num] + wrong_answers
        random.shuffle(options)
        correct_idx = options.index(count_num)
        
        emoji_str = emoji * count_num
        
        questions.append({
            'id': make_id(grade_key, 'math', i),
            'subject': 'kids_math',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'counting',
            'marks': 1,
            'question': f'How many {emoji} are there? {emoji_str}',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'There are {count_num} {emoji}.',
            'examStyle': False,
            'timeLimit': 30 if difficulty == 'easy' else 45,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_addition_questions(grade_key, count, difficulty, max_val=20):
    """Generate addition problems"""
    questions = []
    
    for i in range(count):
        if difficulty == 'easy':
            a, b = random.randint(1, 10), random.randint(1, 10)
        elif difficulty == 'medium':
            a, b = random.randint(5, 50), random.randint(5, 50)
        else:
            a, b = random.randint(10, max_val), random.randint(10, max_val)
        
        answer = a + b
        wrong = [answer + random.randint(-10, 10) for _ in range(3)]
        wrong = [w for w in wrong if w != answer and w > 0][:3]
        while len(wrong) < 3:
            wrong.append(answer + random.randint(1, 15))
        
        options = [answer] + wrong[:3]
        random.shuffle(options)
        correct_idx = options.index(answer)
        
        questions.append({
            'id': make_id(grade_key, 'math', i),
            'subject': 'kids_math',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'addition',
            'marks': 1,
            'question': f'What is {a} + {b}?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{a} + {b} = {answer}',
            'examStyle': False,
            'timeLimit': 45 if difficulty == 'easy' else 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_subtraction_questions(grade_key, count, difficulty, max_val=30):
    """Generate subtraction problems"""
    questions = []
    
    for i in range(count):
        if difficulty == 'easy':
            a, b = random.randint(5, 15), random.randint(1, 10)
        elif difficulty == 'medium':
            a, b = random.randint(20, 60), random.randint(5, 30)
        else:
            a, b = random.randint(30, max_val), random.randint(10, max_val)
        
        # Ensure a > b for positive result
        a, b = max(a, b), min(a, b)
        answer = a - b
        
        wrong = [answer + random.randint(-10, 10) for _ in range(3)]
        wrong = [w for w in wrong if w != answer and w >= 0][:3]
        while len(wrong) < 3:
            wrong.append(abs(answer + random.randint(1, 10)))
        
        options = [answer] + wrong[:3]
        random.shuffle(options)
        correct_idx = options.index(answer)
        
        questions.append({
            'id': make_id(grade_key, 'math', i),
            'subject': 'kids_math',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'subtraction',
            'marks': 1,
            'question': f'What is {a} - {b}?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{a} - {b} = {answer}',
            'examStyle': False,
            'timeLimit': 45 if difficulty == 'easy' else 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_multiplication_questions(grade_key, count, difficulty):
    """Generate multiplication tables"""
    questions = []
    
    for i in range(count):
        if difficulty == 'easy':
            a, b = random.randint(1, 5), random.randint(1, 5)
        elif difficulty == 'medium':
            a, b = random.randint(2, 9), random.randint(2, 9)
        else:
            a, b = random.randint(3, 12), random.randint(3, 12)
        
        answer = a * b
        wrong = [answer + random.randint(-10, 10) for _ in range(3)]
        wrong = [w for w in wrong if w != answer and w > 0][:3]
        while len(wrong) < 3:
            wrong.append(answer + random.randint(1, 15))
        
        options = [answer] + wrong[:3]
        random.shuffle(options)
        correct_idx = options.index(answer)
        
        questions.append({
            'id': make_id(grade_key, 'math', i),
            'subject': 'kids_math',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'multiplication',
            'marks': 1,
            'question': f'What is {a} × {b}?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{a} × {b} = {answer}',
            'examStyle': False,
            'timeLimit': 45 if difficulty == 'easy' else 75,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_division_questions(grade_key, count, difficulty):
    """Generate simple division problems"""
    questions = []
    
    for i in range(count):
        if difficulty == 'easy':
            b = random.randint(2, 5)
            answer = random.randint(1, 5)
        elif difficulty == 'medium':
            b = random.randint(2, 9)
            answer = random.randint(2, 9)
        else:
            b = random.randint(3, 12)
            answer = random.randint(3, 12)
        
        a = b * answer  # Ensure clean division
        
        wrong = [answer + random.randint(-5, 5) for _ in range(3)]
        wrong = [w for w in wrong if w != answer and w > 0][:3]
        while len(wrong) < 3:
            wrong.append(answer + random.randint(1, 5))
        
        options = [answer] + wrong[:3]
        random.shuffle(options)
        correct_idx = options.index(answer)
        
        questions.append({
            'id': make_id(grade_key, 'math', i),
            'subject': 'kids_math',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'division',
            'marks': 1,
            'question': f'What is {a} ÷ {b}?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{a} ÷ {b} = {answer} because {b} × {answer} = {a}',
            'examStyle': False,
            'timeLimit': 60 if difficulty == 'easy' else 90,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_fractions_questions(grade_key, count, difficulty):
    """Generate fraction problems"""
    questions = []
    
    for i in range(count):
        if difficulty == 'easy':
            numer = random.randint(1, 3)
            denom = random.randint(2, 4)
        elif difficulty == 'medium':
            numer = random.randint(1, 5)
            denom = random.randint(3, 8)
        else:
            numer = random.randint(2, 9)
            denom = random.randint(4, 12)
        
        # Find equivalent fraction
        mult = random.randint(2, 4)
        eq_numer = numer * mult
        eq_denom = denom * mult
        
        wrong = [
            [numer+1, denom],
            [numer, denom+1],
            [numer+1, denom+1]
        ]
        
        options = [[eq_numer, eq_denom]] + random.sample(wrong, 3)
        random.shuffle(options)
        correct_idx = options.index([eq_numer, eq_denom])
        
        questions.append({
            'id': make_id(grade_key, 'math', i),
            'subject': 'kids_math',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'fractions',
            'marks': 1,
            'question': f'Which fraction is equal to {numer}/{denom}?',
            'options': [f'A. {options[0][0]}/{options[0][1]}', f'B. {options[1][0]}/{options[1][1]}', 
                       f'C. {options[2][0]}/{options[2][1]}', f'D. {options[3][0]}/{options[3][1]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{numer}/{denom} = {eq_numer}/{eq_denom} because both numerator and denominator are multiplied by {mult}.',
            'examStyle': False,
            'timeLimit': 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_algebra_questions(grade_key, count, difficulty):
    """Generate simple algebra equations"""
    questions = []
    
    for i in range(count):
        if difficulty == 'easy':
            x = random.randint(1, 10)
            a = random.randint(1, 5)
            b = x + a
            equation = f"x + {a} = {b}"
        elif difficulty == 'medium':
            x = random.randint(2, 15)
            a = random.randint(2, 10)
            op = random.choice(['+', '-'])
            if op == '+':
                b = x + a
                equation = f"x + {a} = {b}"
            else:
                b = x + a
                equation = f"x - {a} = {x - a}" if x > a else f"{a} + x = {b}"
        else:
            x = random.randint(3, 20)
            a = random.randint(2, 10)
            b = random.randint(2, 5)
            equation = f"{a}x + {b} = {a*x + b}"
        
        wrong = [x + random.randint(-5, 5) for _ in range(3)]
        wrong = [w for w in wrong if w != x and w > 0][:3]
        while len(wrong) < 3:
            wrong.append(x + random.randint(1, 5))
        
        options = [x] + wrong[:3]
        random.shuffle(options)
        correct_idx = options.index(x)
        
        questions.append({
            'id': make_id(grade_key, 'math', i),
            'subject': 'kids_math',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'algebra',
            'marks': 1,
            'question': f'Solve for x: {equation}',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'x = {x}. Substitute back: {equation.replace("x", str(x))}',
            'examStyle': False,
            'timeLimit': 75 if difficulty == 'hard' else 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_alphabet_questions(grade_key, count, difficulty):
    """Generate alphabet sequence questions"""
    questions = []
    alphabet = list('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    
    for i in range(count):
        idx = random.randint(0, 23)  # Leave room for next letters
        letter = alphabet[idx]
        next_letter = alphabet[idx + 1]
        
        wrong = random.sample([alphabet[j] for j in range(len(alphabet)) if alphabet[j] != next_letter], 3)
        options = [next_letter] + wrong
        random.shuffle(options)
        correct_idx = options.index(next_letter)
        
        questions.append({
            'id': make_id(grade_key, 'english', i),
            'subject': 'kids_english',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'alphabet',
            'marks': 1,
            'question': f'Which letter comes after {letter}?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{next_letter} comes after {letter} in the alphabet.',
            'examStyle': False,
            'timeLimit': 30,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_spelling_questions(grade_key, count, difficulty):
    """Generate spelling questions"""
    questions = []
    
    easy_words = ['CAT', 'DOG', 'SUN', 'RUN', 'HAT', 'BIG', 'RED', 'SIT', 'CUP', 'PEN']
    medium_words = ['APPLE', 'TABLE', 'WATER', 'HAPPY', 'SCHOOL', 'FRIEND', 'FAMILY', 'MOTHER', 'FATHER', 'BROTHER']
    hard_words = ['BEAUTIFUL', 'IMPORTANT', 'DIFFERENT', 'FAVORITE', 'ANIMALS', 'PLANETS', 'COUNTRY', 'LEARNING', 'PRACTICE', 'KNOWLEDGE']
    
    words = easy_words if difficulty == 'easy' else medium_words if difficulty == 'medium' else hard_words
    
    for i in range(count):
        word = random.choice(words)
        # Create misspellings
        misspellings = []
        if len(word) > 3:
            # Swap adjacent letters
            idx = random.randint(0, len(word)-2)
            swapped = word[:idx] + word[idx+1] + word[idx] + word[idx+2:]
            misspellings.append(swapped)
            # Wrong letter
            wrong_letter = word[:-1] + random.choice('XYZQ')
            misspellings.append(wrong_letter)
            # Missing letter
            if len(word) > 4:
                missing = word[:2] + word[3:]
                misspellings.append(missing)
        
        while len(misspellings) < 3:
            misspellings.append(word[::-1][:len(word)])
        
        options = [word] + misspellings[:3]
        random.shuffle(options)
        correct_idx = options.index(word)
        
        questions.append({
            'id': make_id(grade_key, 'english', i),
            'subject': 'kids_english',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'spelling',
            'marks': 1,
            'question': f'Which is spelled correctly?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{word} is the correct spelling.',
            'examStyle': False,
            'timeLimit': 45 if difficulty == 'easy' else 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_grammar_questions(grade_key, count, difficulty):
    """Generate grammar/correct sentence questions"""
    questions = []
    
    templates = [
        ('He ___ happy.', ['is', 'are', 'am', 'be'], 0),
        ('They ___ playing.', ['are', 'is', 'am', 'be'], 0),
        ('I ___ a student.', ['am', 'is', 'are', 'be'], 0),
        ('She ___ to school.', ['goes', 'go', 'going', 'gone'], 0),
        ('We ___ football.', ['play', 'plays', 'playing', 'played'], 0),
        ('The cat ___ on the mat.', ['sits', 'sit', 'sitting', 'sat'], 0),
        ('My brother ___ tall.', ['is', 'are', 'am', 'be'], 0),
        ('The dogs ___ barking.', ['are', 'is', 'am', 'be'], 0),
    ]
    
    for i in range(count):
        template = random.choice(templates)
        sentence, options, correct = template
        
        # Shuffle options
        shuffled = options.copy()
        random.shuffle(shuffled)
        correct_idx = shuffled.index(options[correct])
        
        questions.append({
            'id': make_id(grade_key, 'english', i),
            'subject': 'kids_english',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'grammar',
            'marks': 1,
            'question': f'Choose the correct word: {sentence}',
            'options': [f'A. {shuffled[0]}', f'B. {shuffled[1]}', f'C. {shuffled[2]}', f'D. {shuffled[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'"{options[correct]}" is the correct verb form.',
            'examStyle': False,
            'timeLimit': 45,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_phonics_questions(grade_key, count, difficulty):
    """Generate phonics/sound recognition questions"""
    questions = []
    
    sounds = [
        ('Ball', '/b/', ['bat', 'boy', 'book']),
        ('Cat', '/k/', ['car', 'cup', 'cake']),
        ('Dog', '/d/', ['duck', 'door', 'doll']),
        ('Fish', '/f/', ['fan', 'fox', 'farm']),
        ('Goat', '/g/', ['game', 'gift', 'good']),
        ('Hat', '/h/', ['hand', 'house', 'horse']),
        ('Jam', '/j/', ['juice', 'jump', 'jelly']),
        ('Kite', '/k/', ['king', 'key', 'kitchen']),
        ('Lion', '/l/', ['leg', 'lamp', 'leaf']),
        ('Man', '/m/', ['moon', 'milk', 'mouse']),
    ]
    
    for i in range(count):
        word, sound, examples = random.choice(sounds)
        wrong_examples = [e for e, s, ex in sounds if s != sound]
        wrong = random.sample(wrong_examples, 3) if len(wrong_examples) >= 3 else wrong_examples[:3]
        
        options = examples[:1] + wrong[:3]
        random.shuffle(options)
        correct_idx = options.index(examples[0])
        
        questions.append({
            'id': make_id(grade_key, 'english', i),
            'subject': 'kids_english',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'phonics',
            'marks': 1,
            'question': f'Which word starts with the sound {sound} like in "{word}"?',
            'options': [f'A. {options[0].capitalize()}', f'B. {options[1].capitalize()}', 
                       f'C. {options[2].capitalize()}', f'D. {options[3].capitalize()}'],
            'correctAnswer': correct_idx,
            'explanation': f'{examples[0].capitalize()} starts with {sound} like "{word}".',
            'examStyle': False,
            'timeLimit': 30,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_animals_questions(grade_key, count, difficulty):
    """Generate animal science questions"""
    questions = []
    
    animals = [
        ('Bird', 'can fly', ['swim underwater', 'run fast', 'climb trees']),
        ('Fish', 'lives in water', ['flies in air', 'runs on land', 'climbs trees']),
        ('Dog', 'is a pet', ['lives in ocean', 'flies in sky', 'lays eggs']),
        ('Cat', 'says meow', ['says woof', 'says moo', 'says quack']),
        ('Cow', 'gives milk', ['lays eggs', 'eats meat', 'lives in water']),
        ('Frog', 'can jump', ['can fly', 'can swim deep', 'lives in desert']),
        ('Snake', 'has no legs', ['has four legs', 'has wings', 'has fins']),
        ('Butterfly', 'has wings', ['has gills', 'has scales', 'has fur']),
    ]
    
    for i in range(count):
        animal, fact, wrong = random.choice(animals)
        options = [fact] + random.sample(wrong, 3)
        random.shuffle(options)
        correct_idx = options.index(fact)
        
        questions.append({
            'id': make_id(grade_key, 'science', i),
            'subject': 'kids_science',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'animals',
            'marks': 1,
            'question': f'Which is true about a {animal}?',
            'options': [f'A. It {options[0]}', f'B. It {options[1]}', f'C. It {options[2]}', f'D. It {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'A {animal} {fact}.',
            'examStyle': False,
            'timeLimit': 45,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_plants_questions(grade_key, count, difficulty):
    """Generate plant science questions"""
    questions = []
    
    plant_facts = [
        ('leaves', 'make food using sunlight'),
        ('roots', 'absorb water from soil'),
        ('stem', 'supports the plant'),
        ('flower', 'attracts insects'),
        ('seeds', 'grow into new plants'),
    ]
    
    for i in range(count):
        part, fact = random.choice(plant_facts)
        wrong_facts = [f for p, f in plant_facts if p != part]
        wrong = random.sample(wrong_facts, 3)
        
        options = [fact] + wrong
        random.shuffle(options)
        correct_idx = options.index(fact)
        
        questions.append({
            'id': make_id(grade_key, 'science', i),
            'subject': 'kids_science',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'plants',
            'marks': 1,
            'question': f'What do {part} do?',
            'options': [f'A. They {options[0]}', f'B. They {options[1]}', f'C. They {options[2]}', f'D. They {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{part.capitalize()} {fact}.',
            'examStyle': False,
            'timeLimit': 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_forces_questions(grade_key, count, difficulty):
    """Generate forces/motion questions"""
    questions = []
    
    force_facts = [
        ('Gravity', 'pulls objects towards Earth'),
        ('Friction', 'slows down moving objects'),
        ('Magnetism', 'attracts iron and steel'),
        ('Push', 'makes things move away'),
        ('Pull', 'makes things come closer'),
    ]
    
    for i in range(count):
        force, fact = random.choice(force_facts)
        wrong_facts = [f for frc, f in force_facts if frc != force]
        wrong = random.sample(wrong_facts, 3)
        
        options = [fact] + wrong
        random.shuffle(options)
        correct_idx = options.index(fact)
        
        questions.append({
            'id': make_id(grade_key, 'science', i),
            'subject': 'kids_science',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'forces',
            'marks': 1,
            'question': f'What does {force} do?',
            'options': [f'A. It {options[0]}', f'B. It {options[1]}', f'C. It {options[2]}', f'D. It {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{force} {fact}.',
            'examStyle': False,
            'timeLimit': 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_body_questions(grade_key, count, difficulty):
    """Generate human body questions"""
    questions = []
    
    body_parts = [
        ('heart', 'pumps blood'),
        ('lungs', 'help us breathe'),
        ('brain', 'controls the body'),
        ('stomach', 'digests food'),
        ('eyes', 'help us see'),
        ('ears', 'help us hear'),
        ('nose', 'helps us smell'),
        ('skin', 'protects our body'),
    ]
    
    for i in range(count):
        part, function = random.choice(body_parts)
        wrong_functions = [f for p, f in body_parts if p != part]
        wrong = random.sample(wrong_functions, 3)
        
        options = [function] + wrong
        random.shuffle(options)
        correct_idx = options.index(function)
        
        questions.append({
            'id': make_id(grade_key, 'science', i),
            'subject': 'kids_science',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'biology',
            'marks': 1,
            'question': f'What does the {part} do?',
            'options': [f'A. It {options[0]}', f'B. It {options[1]}', f'C. It {options[2]}', f'D. It {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'The {part} {function}.',
            'examStyle': False,
            'timeLimit': 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_planets_questions(grade_key, count, difficulty):
    """Generate space/planets questions"""
    questions = []
    
    space_facts = [
        ('Sun', 'is a star'),
        ('Earth', 'is our home planet'),
        ('Moon', 'orbits around Earth'),
        ('Mars', 'is called the Red Planet'),
        ('Jupiter', 'is the biggest planet'),
        ('Saturn', 'has rings around it'),
    ]
    
    for i in range(count):
        obj, fact = random.choice(space_facts)
        wrong_facts = [f for o, f in space_facts if o != obj]
        wrong = random.sample(wrong_facts, 3)
        
        options = [fact] + wrong
        random.shuffle(options)
        correct_idx = options.index(fact)
        
        questions.append({
            'id': make_id(grade_key, 'science', i),
            'subject': 'kids_science',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'planets',
            'marks': 1,
            'question': f'Which is true about {obj}?',
            'options': [f'A. It {options[0]}', f'B. It {options[1]}', f'C. It {options[2]}', f'D. It {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{obj} {fact}.',
            'examStyle': False,
            'timeLimit': 60,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_general_knowledge_questions(grade_key, count, difficulty):
    """Generate general knowledge questions"""
    questions = []
    
    facts = [
        ('Water', 'freezes at 0 degrees Celsius'),
        ('Rainbow', 'has 7 colors'),
        ('Days', 'There are 7 days in a week'),
        ('Months', 'There are 12 months in a year'),
        ('Seasons', 'There are 4 seasons'),
        ('Continents', 'There are 7 continents'),
        ('Oceans', 'There are 5 oceans'),
        ('Compass', 'shows North, South, East, West'),
    ]
    
    for i in range(count):
        topic, fact = random.choice(facts)
        wrong_facts = [f for t, f in facts if t != topic]
        wrong = random.sample(wrong_facts, 3)
        
        options = [fact] + wrong
        random.shuffle(options)
        correct_idx = options.index(fact)
        
        questions.append({
            'id': make_id(grade_key, 'general', i),
            'subject': 'kids_general',
            'yearGroup': grade_key,
            'difficulty': difficulty,
            'topic': 'general',
            'marks': 1,
            'question': f'Which statement is true?',
            'options': [f'A. {options[0]}', f'B. {options[1]}', f'C. {options[2]}', f'D. {options[3]}'],
            'correctAnswer': correct_idx,
            'explanation': f'{fact}.',
            'examStyle': False,
            'timeLimit': 45,
            'source': {'pdf': 'kids_bank', 'year': 2026, 'session': 'Kids', 'paper': grade_key.upper(), 'question_number': str(i+1)}
        })
    return questions

def generate_questions_for_grade(grade_key, total_count):
    """Generate all questions for a grade"""
    all_questions = []
    
    # Calculate counts per difficulty
    diff_dist = DIFFICULTY_DIST[grade_key]
    subject_dist = SUBJECT_DIST[grade_key]
    
    for difficulty, pct in diff_dist.items():
        diff_count = int(total_count * pct / 100)
        
        # Calculate subject counts for this difficulty
        for subject, subj_pct in subject_dist.items():
            subj_count = int(diff_count * subj_pct / 100)
            if subj_count == 0:
                subj_count = 1  # Ensure at least some questions
            
            # Generate based on subject and grade
            if subject == 'general':
                if grade_key in ['lkg', 'ukg']:
                    all_questions.extend(generate_colors_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_shapes_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_general_knowledge_questions(grade_key, subj_count//3 + subj_count%3, difficulty))
                else:
                    all_questions.extend(generate_general_knowledge_questions(grade_key, subj_count, difficulty))
                    
            elif subject == 'math':
                if grade_key in ['lkg', 'ukg', 'grade1', 'grade2']:
                    all_questions.extend(generate_counting_questions(grade_key, subj_count//4, difficulty))
                    all_questions.extend(generate_addition_questions(grade_key, subj_count//4, difficulty, 20))
                    all_questions.extend(generate_subtraction_questions(grade_key, subj_count//4, difficulty, 20))
                    all_questions.extend(generate_multiplication_questions(grade_key, subj_count//4 + subj_count%4, difficulty))
                elif grade_key in ['grade3', 'grade4', 'grade5']:
                    all_questions.extend(generate_addition_questions(grade_key, subj_count//5, difficulty, 100))
                    all_questions.extend(generate_subtraction_questions(grade_key, subj_count//5, difficulty, 100))
                    all_questions.extend(generate_multiplication_questions(grade_key, subj_count//5, difficulty))
                    all_questions.extend(generate_division_questions(grade_key, subj_count//5, difficulty))
                    all_questions.extend(generate_fractions_questions(grade_key, subj_count//5 + subj_count%5, difficulty))
                else:  # grade6-8
                    all_questions.extend(generate_multiplication_questions(grade_key, subj_count//6, difficulty))
                    all_questions.extend(generate_division_questions(grade_key, subj_count//6, difficulty))
                    all_questions.extend(generate_fractions_questions(grade_key, subj_count//6, difficulty))
                    all_questions.extend(generate_algebra_questions(grade_key, subj_count//6 + subj_count%6, difficulty))
                    
            elif subject == 'english':
                if grade_key in ['lkg', 'ukg', 'grade1', 'grade2']:
                    all_questions.extend(generate_alphabet_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_phonics_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_spelling_questions(grade_key, subj_count//3 + subj_count%3, difficulty))
                else:
                    all_questions.extend(generate_spelling_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_grammar_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_alphabet_questions(grade_key, subj_count//3 + subj_count%3, difficulty))
                    
            elif subject == 'science':
                if grade_key in ['lkg', 'ukg', 'grade1', 'grade2']:
                    all_questions.extend(generate_animals_questions(grade_key, subj_count, difficulty))
                elif grade_key in ['grade3', 'grade4', 'grade5']:
                    all_questions.extend(generate_animals_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_plants_questions(grade_key, subj_count//3, difficulty))
                    all_questions.extend(generate_body_questions(grade_key, subj_count//3 + subj_count%3, difficulty))
                else:  # grade6-8
                    all_questions.extend(generate_body_questions(grade_key, subj_count//4, difficulty))
                    all_questions.extend(generate_forces_questions(grade_key, subj_count//4, difficulty))
                    all_questions.extend(generate_planets_questions(grade_key, subj_count//4, difficulty))
                    all_questions.extend(generate_plants_questions(grade_key, subj_count//4 + subj_count%4, difficulty))
    
    return all_questions

def main():
    print("Generating kids question bank...")
    print(f"Target: 10,000+ questions across {len(GRADES)} grades")
    
    all_questions = []
    
    for grade_key, grade_name, age in GRADES:
        count = QUESTIONS_PER_GRADE[grade_key]
        print(f"\nGenerating {count} questions for {grade_name}...")
        
        questions = generate_questions_for_grade(grade_key, count)
        all_questions.extend(questions)
        print(f"  Generated {len(questions)} questions for {grade_name}")
    
    # Calculate totals
    total = len(all_questions)
    by_grade = {}
    by_subject = {}
    by_difficulty = {}
    
    for q in all_questions:
        g = q['yearGroup']
        s = q['subject']
        d = q['difficulty']
        by_grade[g] = by_grade.get(g, 0) + 1
        by_subject[s] = by_subject.get(s, 0) + 1
        by_difficulty[d] = by_difficulty.get(d, 0) + 1
    
    print(f"\n{'='*50}")
    print(f"TOTAL QUESTIONS GENERATED: {total}")
    print(f"{'='*50}")
    print("\nBy Grade:")
    for grade, count in sorted(by_grade.items()):
        print(f"  {grade}: {count}")
    print("\nBy Subject:")
    for subj, count in sorted(by_subject.items()):
        print(f"  {subj}: {count}")
    print("\nBy Difficulty:")
    for diff, count in sorted(by_difficulty.items()):
        print(f"  {diff}: {count}")
    
    # Save to file
    output = {
        'metadata': {
            'subject': 'kids',
            'source': 'generated',
            'total_questions': total,
            'converted_at': int(datetime.now().timestamp() * 1000),
            'grades': [g[1] for g in GRADES],
            'by_grade': by_grade,
            'by_subject': by_subject,
            'by_difficulty': by_difficulty,
        },
        'questions': all_questions
    }
    
    output_file = 'public/kids_questions.json'
    print(f"\nSaving to {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"Done! File size: {len(json.dumps(output)) / 1024 / 1024:.2f} MB")
    print(f"Total questions: {total:,}")

if __name__ == '__main__':
    main()

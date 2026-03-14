#!/usr/bin/env python3
"""Clean igcse_biology_0610_questions_new.json by filtering invalid questions."""

import json
import re
from pathlib import Path

# Biology keywords to check for
BIOLOGY_KEYWORDS = [
    'cell', 'cells', 'tissue', 'organ', 'organs', 'system', 'body', 'blood', 'heart', 'lung', 'lungs',
    'muscle', 'muscles', 'bone', 'bones', 'skin', 'brain', 'nerve', 'nerves', 'hormone', 'hormones',
    'enzyme', 'enzymes', 'protein', 'proteins', 'dna', 'rna', 'gene', 'genes', 'chromosome', 'chromosomes',
    'nucleus', 'cytoplasm', 'mitochondria', 'chloroplast', 'chloroplasts', 'membrane', 'membranes',
    'photosynthesis', 'respiration', 'digestion', 'circulation', 'excretion', 'reproduction',
    'bacteria', 'virus', 'viruses', 'fungi', 'plant', 'plants', 'animal', 'animals', 'flower',
    'leaf', 'leaves', 'root', 'roots', 'stem', 'stems', 'seed', 'seeds', 'fruit', 'fruits',
    'ecosystem', 'ecosystems', 'habitat', 'habitats', 'food', 'chain', 'web', 'energy', 'pyramid',
    'organism', 'organisms', 'species', 'population', 'community', 'biosphere', 'biodiversity',
    'evolution', 'natural selection', 'adaptation', 'adaptations', 'survival', 'extinction',
    'photosynthesise', 'chlorophyll', 'glucose', 'starch', 'oxygen', 'carbon', 'dioxide',
    'water', 'mineral', 'minerals', 'nutrient', 'nutrients', 'vitamin', 'vitamins',
    'carbohydrate', 'carbohydrates', 'fat', 'fats', 'lipid', 'lipids', 'oil', 'oils',
    'diffusion', 'osmosis', 'active transport', 'transpiration', 'translocation',
    'pollination', 'fertilization', 'germination', 'growth', 'development', 'life cycle',
    'pathogen', 'pathogens', 'disease', 'diseases', 'immunity', 'immune', 'antibody', 'antibodies',
    'vaccine', 'vaccines', 'antibiotic', 'antibiotics', 'drug', 'drugs', 'medicine',
    'alcohol', 'smoking', 'drugs', 'health', 'healthy', 'diet', 'exercise', 'fitness',
    'temperature', 'pressure', 'volume', 'concentration', 'ph', 'acid', 'base', 'alkali',
    'solute', 'solvent', 'solution', 'mixture', 'compound', 'element', 'atom', 'atoms',
    'molecule', 'molecules', 'ion', 'ions', 'bond', 'bonds', 'chemical', 'reaction',
    'rate', 'catalyst', 'catalysts', 'exothermic', 'endothermic', 'energy', 'heat',
    'thermometer', 'temperature', 'degrees', 'celsius', 'kelvin',
]

def is_valid_question(q):
    """Check if a question is valid biology content."""
    question_text = q.get('question', '')
    options = q.get('options', [])
    
    # Must have question text
    if not question_text or len(question_text.strip()) < 20:
        return False, "Too short or empty question"
    
    # Must have exactly 4 options
    if not isinstance(options, list) or len(options) != 4:
        return False, "Invalid options count"
    
    # All options must be non-empty and reasonable length
    for opt in options:
        if not opt or len(opt.strip()) < 2 or len(opt) > 300:
            return False, "Invalid option"
    
    # Check for garbage content patterns
    garbage_patterns = [
        r'chair', r'table', r'furniture', r'assessment', r'criteria', r'cambridge assessment',
        r'examination', r'syllabus', r'paper', r'questions? \d+.*must', r'ucles', r'preparatory',
        r'test conditions', r'supervised', r'sessions?', r'record ideas', r'first-hand',
        r'observation', r'insight', r'intention', r'develop', r'investigation', r'research',
    ]
    
    lower_q = question_text.lower()
    for pattern in garbage_patterns:
        if re.search(pattern, lower_q):
            return False, f"Garbage pattern: {pattern}"
    
    # Must contain at least one biology keyword
    has_bio_keyword = any(keyword in lower_q for keyword in BIOLOGY_KEYWORDS)
    if not has_bio_keyword:
        # Check options too
        has_bio_in_options = any(
            any(keyword in opt.lower() for keyword in BIOLOGY_KEYWORDS)
            for opt in options
        )
        if not has_bio_in_options:
            return False, "No biology keywords"
    
    return True, "Valid"

def clean_questions():
    """Clean the IGCSE biology questions file."""
    input_path = Path("E:/Apps/past-paper/gcse-prep-app/public/igcse_biology_0610_questions_new.json")
    
    print(f"Loading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    original_questions = data.get('questions', [])
    original_count = len(original_questions)
    print(f"Original count: {original_count}")
    
    # Filter valid questions
    valid_questions = []
    removed_reasons = {}
    
    for q in original_questions:
        is_valid, reason = is_valid_question(q)
        if is_valid:
            valid_questions.append(q)
        else:
            removed_reasons[reason] = removed_reasons.get(reason, 0) + 1
    
    cleaned_count = len(valid_questions)
    removed_count = original_count - cleaned_count
    
    print(f"\nCleaning results:")
    print(f"  Valid: {cleaned_count}")
    print(f"  Removed: {removed_count}")
    print(f"\nRemoval reasons:")
    for reason, count in sorted(removed_reasons.items(), key=lambda x: -x[1]):
        print(f"  - {reason}: {count}")
    
    # Update metadata
    if 'metadata' in data:
        data['metadata']['total_questions'] = cleaned_count
        data['metadata']['description'] = f"{cleaned_count} IGCSE Biology MCQs from past papers (cleaned)"
        data['metadata']['original_count'] = original_count
        data['metadata']['cleaned'] = True
    
    # Replace questions with cleaned list
    data['questions'] = valid_questions
    
    # Save back
    print(f"\nSaving cleaned file...")
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Saved {cleaned_count} valid questions")
    print(f"  File: {input_path}")
    
    return {
        'original': original_count,
        'cleaned': cleaned_count,
        'removed': removed_count,
        'reasons': removed_reasons
    }

if __name__ == '__main__':
    stats = clean_questions()
    print(f"\n{'='*50}")
    print(f"SUMMARY: {stats['original']} → {stats['cleaned']} questions")
    print(f"Removed {stats['removed']} invalid questions ({stats['removed']/stats['original']*100:.1f}%)")

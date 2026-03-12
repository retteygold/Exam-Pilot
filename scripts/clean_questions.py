import json
import re

# Read the messy questions file
with open('public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def parse_mcq_question(q_text):
    """Extract stem and options from question text like:
    'What was the total? A $100 B $200 C $300 D $400'
    """
    # Look for pattern: text followed by A ... B ... C ... D ...
    # Match the options pattern
    pattern = r'(.+?)\s+A\s+(.+?)\s+B\s+(.+?)\s+C\s+(.+?)\s+D\s+(.+?)(?:\s+\d+\s*$|$)'
    
    match = re.search(pattern, q_text, re.DOTALL)
    if not match:
        # Try simpler pattern
        pattern2 = r'(.+?)\?\s*A\s+(.+?)\s+B\s+(.+?)\s+C\s+(.+?)\s+D\s+(.+?)(?:\s+[\d©]|$)'
        match = re.search(pattern2, q_text, re.DOTALL)
    
    if match:
        stem = match.group(1).strip()
        options = [
            match.group(2).strip(),
            match.group(3).strip(), 
            match.group(4).strip(),
            match.group(5).strip()
        ]
        # Clean up options - remove trailing numbers and copyright
        options = [re.sub(r'\s+\d+\s*$', '', opt) for opt in options]
        options = [re.sub(r'\s+©.*$', '', opt) for opt in options]
        return stem, options
    
    return None, None

def clean_question(q):
    """Clean up a single question - only true MCQs"""
    text = q.get('question', '')
    
    # Skip header/instruction text
    if 'INSTRUCTIONS' in text or 'You must answer' in text or 'You will need' in text:
        return None
    
    # Skip structured/long-answer questions
    if 'REQUIRED' in text:
        return None
    
    # Skip table formatting (journal/accounting table headers)
    if re.search(r'Date\s+Details?\s*\$|\$\s*\$|\.{6,}', text):
        return None
    
    # Skip if it's just a fragment
    if len(text) < 40:
        return None
    
    # Try to parse MCQ
    stem, options = parse_mcq_question(text)
    
    # Validate it's a true MCQ
    if stem and options and len(options) == 4:
        # Check options are reasonable length (MCQ options are short)
        opt_lengths = [len(opt) for opt in options]
        if max(opt_lengths) > 200:  # Too long for MCQ option
            return None
        
        # Check stem ends with question-like punctuation or word
        stem_clean = stem.strip()
        if not (stem_clean.endswith('?') or 
                re.search(r'\b(is|are|was|were|will|would|should|could|can|may|might|has|have|had|do|does|did|what|which|who|how|where|when|why)\b', stem_clean[-20:].lower())):
            return None
        
        return {
            'id': q['id'],
            'subject': q.get('subject', 'accounting'),
            'yearGroup': q.get('yearGroup', 'year10'),
            'difficulty': q.get('difficulty', 'medium'),
            'topic': q.get('topic', 'general'),
            'marks': q.get('marks', 1),
            'question': stem,
            'options': options,
            'correctAnswer': 0,
            'explanation': f"From {q.get('source', {}).get('pdf', 'past paper')} - {q.get('source', {}).get('year', '')} {q.get('source', {}).get('session', '')}",
            'examStyle': True,
            'source': q.get('source', {})
        }
    
    return None

# Process all questions
mcq_questions = []
for q in data.get('questions', []):
    cleaned = clean_question(q)
    if cleaned:
        mcq_questions.append(cleaned)

# Create clean output
clean_data = {
    'metadata': {
        'subject': 'Accounting (7707)',
        'source': 'Cambridge O-Level Past Papers',
        'total_questions': len(mcq_questions),
        'converted_at': '2026-03-12',
        'note': 'Questions from 7707_s20_qp_11 and other papers. Correct answers need verification from mark schemes.'
    },
    'questions': mcq_questions
}

# Save
with open('public/questions_clean.json', 'w', encoding='utf-8') as f:
    json.dump(clean_data, f, indent=2, ensure_ascii=False)

print(f'Extracted {len(mcq_questions)} clean MCQ questions')
print(f'Sample: {json.dumps(mcq_questions[0], indent=2) if mcq_questions else "None"}')

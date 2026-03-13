#!/usr/bin/env python3
"""
Extract Biology 5090 questions from PDFs
"""

import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    import os
    os.system("pip install pdfplumber")
    import pdfplumber

PDF_DIR = Path("database/Cambridge_O-Level/Biology")

def _preprocess_full_text(full_text):
    """Remove common front-matter/headers/footers and start from Q1."""
    if not full_text:
        return ''

    text = full_text

    # Remove common footer/header fragments that often break parsing.
    text = re.sub(r'\*\d{6,}\*', ' ', text)
    text = re.sub(r'©\s*UCLES\s*\d{4}', ' ', text, flags=re.IGNORECASE)
    text = re.sub(r'\bUCLES\b', ' ', text, flags=re.IGNORECASE)
    text = re.sub(r'\bTurn over\b', ' ', text, flags=re.IGNORECASE)

    # Collapse repeated whitespace early.
    text = re.sub(r'[ \t\r\f\v]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Cut everything before the first real question number "1".
    m = re.search(r'(^|\n)\s*1\s+\S', text)
    if m:
        text = text[m.start():]

    return text

def _clean_question_text(question_text):
    if not question_text:
        return ''

    q = question_text

    # Remove common instruction blocks that sometimes leak into the capture.
    q = re.sub(r'\bINSTRUCTIONS\b.*', ' ', q, flags=re.IGNORECASE)
    q = re.sub(r'\bINFORMATION\b.*', ' ', q, flags=re.IGNORECASE)
    q = re.sub(r'\bYou must answer\b.*', ' ', q, flags=re.IGNORECASE)

    # If a page number is glued before the question number (e.g., "2 1 ..."), drop the leading number.
    q = re.sub(r'^\s*\d+\s+(?=\d+\s+)', '', q)

    q = q.strip().replace('\n', ' ')
    q = re.sub(r'\s{2,}', ' ', q).strip()
    return q

def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF"""
    pages = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages, 1):
                def _words_to_text():
                    words = page.extract_words(use_text_flow=True, keep_blank_chars=False)
                    if not words:
                        return None

                    lines = {}
                    for w in words:
                        top = w.get('top')
                        if top is None:
                            continue
                        key = int(round(top))
                        lines.setdefault(key, []).append(w)

                    out_lines = []
                    for key in sorted(lines.keys()):
                        parts = sorted(lines[key], key=lambda x: x.get('x0', 0))
                        out_lines.append(' '.join(p.get('text', '') for p in parts if p.get('text')))

                    text = '\n'.join([ln.strip() for ln in out_lines if ln.strip()])
                    return text or None

                # Some papers only parse correctly with layout-aware extraction.
                text = None
                try:
                    text = page.extract_text(layout=True, x_tolerance=2, y_tolerance=2)
                except Exception:
                    text = None

                if not text:
                    try:
                        text = page.extract_text(x_tolerance=2, y_tolerance=2)
                    except Exception:
                        text = None

                if not text:
                    try:
                        text = page.extract_text()
                    except Exception:
                        text = None

                if not text:
                    try:
                        text = _words_to_text()
                    except Exception:
                        text = None
                if text:
                    pages.append({'page': i, 'text': text})
    except Exception as e:
        print(f"  Error: {e}")
    return pages

def parse_mcqs_from_text(pages):
    """Parse MCQs from extracted text"""
    questions = []
    full_text = "\n".join([p['text'] for p in pages])
    full_text = _preprocess_full_text(full_text)
    
    # Split into question blocks by question numbers at line start.
    # This is more robust than a single giant regex (papers vary in layout).
    q_starts = list(
        re.finditer(
            r'^\s*(\d{1,2})\s+(?=[A-Za-z\(])',
            full_text,
            flags=re.MULTILINE,
        )
    )
    if not q_starts:
        return questions

    def _looks_like_instructions(txt):
        t = (txt or '').lower()
        return any(
            kw in t
            for kw in [
                'multiple choice answer sheet',
                'instructions',
                'information',
                'do not write',
                'candidate number',
                'there are forty questions',
                'choose the one you consider correct',
            ]
        )

    def _options_are_plausible(opts):
        if not opts or len(opts) != 4:
            return False
        bad_kw = [
            'multiple choice answer sheet',
            'instructions',
            'information',
            'bar code',
            'candidate number',
            'centre number',
            'turn over',
        ]
        for o in opts:
            if not o:
                return False
            o2 = re.sub(r'\s+', ' ', o).strip().lower()
            # Very short "options" are usually not real options (common when matching front matter).
            if len(o2) < 6:
                return False
            if any(k in o2 for k in bad_kw):
                return False
        return True

    def _extract_options(block):
        # Try newline-separated A/B/C/D first.
        m = re.search(
            r'(?:^|\n)\s*A\s+(.+?)(?:\n\s*B\s+)(.+?)(?:\n\s*C\s+)(.+?)(?:\n\s*D\s+)(.+?)(?=\n\s*\d{1,2}\s+|\Z)',
            block,
            flags=re.DOTALL
        )
        if m:
            opts = [m.group(1), m.group(2), m.group(3), m.group(4)]
            return opts if _options_are_plausible(opts) else None

        # Fallback: inline A ... B ... C ... D ...
        m = re.search(
            r'\bA\s+(.+?)\s+\bB\s+(.+?)\s+\bC\s+(.+?)\s+\bD\s+(.+?)(?=\n\s*\d{1,2}\s+|\Z)',
            block,
            flags=re.DOTALL
        )
        if m:
            opts = [m.group(1), m.group(2), m.group(3), m.group(4)]
            return opts if _options_are_plausible(opts) else None

        return None

    for idx, start in enumerate(q_starts):
        q_num = int(start.group(1))
        if q_num < 1 or q_num > 40:
            continue

        end_pos = q_starts[idx + 1].start() if idx + 1 < len(q_starts) else len(full_text)
        block = full_text[start.start():end_pos]

        # Skip obvious instruction blocks.
        if _looks_like_instructions(block[:600]):
            continue

        # Remove the leading question number from the block.
        block_wo_num = re.sub(r'^\s*\d{1,2}\s+', '', block, count=1, flags=re.MULTILINE)

        options = _extract_options(block_wo_num)
        if not options:
            continue

        # Everything before the first option marker is the stem.
        stem = re.split(r'(?:^|\n)\s*A\s+|\bA\s+', block_wo_num, maxsplit=1, flags=re.IGNORECASE)[0]
        stem = _clean_question_text(stem)

        if not stem or _looks_like_instructions(stem):
            continue
        
        cleaned_options = [opt.strip().replace('\n', ' ') for opt in options]
        cleaned_options = [re.sub(r'\s{2,}', ' ', opt).strip() for opt in cleaned_options]

        questions.append({
            'number': q_num,
            'question': stem,
            'options': cleaned_options
        })
    
    return questions

def parse_paper_info(pdf_name):
    """Extract info from filename"""
    match = re.match(r'5090_([sw])(\d+)_(\w+)_(\d+)', pdf_name)
    if match:
        session_code = match.group(1)
        year_short = match.group(2)
        paper_num = match.group(4)
        year = 2000 + int(year_short)
        session = 'May/June' if session_code == 's' else 'Oct/Nov'
        return {'year': year, 'session': session, 'paper': paper_num}
    return None

def determine_topic(question_text):
    """Determine Biology topic"""
    text_lower = question_text.lower()
    
    topics = {
        'cells': ['cell', 'membrane', 'nucleus', 'cytoplasm', 'organelle'],
        'biological_molecules': ['protein', 'carbohydrate', 'lipid', 'enzyme', 'dna', 'rna'],
        'enzymes': ['enzyme', 'catalyst', 'substrate', 'active site'],
        'plant_nutrition': ['photosynthesis', 'chlorophyll', 'stomata', 'transpiration'],
        'human_nutrition': ['digestion', 'absorption', 'nutrition', 'vitamin'],
        'transport': ['circulation', 'heart', 'blood', 'vessel', 'xylem', 'phloem'],
        'gas_exchange': ['respiration', 'breathing', 'lung', 'gaseous exchange'],
        'coordination': ['nervous', 'hormone', 'reflex', 'receptor'],
        'reproduction': ['reproduction', 'gamete', 'fertilisation', 'pregnancy'],
        'inheritance': ['gene', 'allele', 'chromosome', 'inheritance', 'genetic'],
        'ecosystems': ['ecosystem', 'food chain', 'food web', 'population'],
        'human_impact': ['pollution', 'conservation', 'deforestation'],
    }
    
    for topic, keywords in topics.items():
        for kw in keywords:
            if kw in text_lower:
                return topic
    return 'general'

def process_all_biology():
    """Process all Biology papers"""
    # Paper 1 is the Multiple Choice paper (A-D options). Other papers are structured/practical.
    # We only extract MCQs from Paper 1 variants (11/12/13).
    all_papers = sorted(PDF_DIR.glob("*_qp_*.pdf"))
    papers = []
    for p in all_papers:
        info = parse_paper_info(p.name)
        if not info:
            continue
        if str(info.get('paper', '')).startswith('1'):
            papers.append(p)
    
    print(f"Found {len(papers)} Biology question papers")
    print("=" * 60)
    
    all_questions = []
    
    for paper in papers:
        print(f"\nProcessing: {paper.name}")
        
        info = parse_paper_info(paper.name)
        if not info:
            print("  Skipping - couldn't parse info")
            continue
        
        # Extract text
        pages = extract_text_from_pdf(paper)
        print(f"  Pages: {len(pages)}")
        
        # Parse questions
        mcqs = parse_mcqs_from_text(pages)
        print(f"  MCQs found: {len(mcqs)}")
        
        for mcq in mcqs:
            q = {
                'id': f"5090-y{info['year']}-p{info['paper']}-q{mcq['number']}",
                'subject': 'biology',
                'yearGroup': 'year10',
                'difficulty': 'medium',
                'topic': determine_topic(mcq['question']),
                'marks': 1,
                'question': mcq['question'],
                'options': mcq['options'],
                'correctAnswer': 0,
                'examStyle': True,
                'timeLimit': 60,
                'verified': False,
                'source': {
                    'pdf': paper.name,
                    'year': info['year'],
                    'session': info['session'],
                    'paper': info['paper'],
                    'question_number': str(mcq['number'])
                }
            }
            all_questions.append(q)
    
    # Create output
    output = {
        'metadata': {
            'subject': 'Biology (5090)',
            'total_questions': len(all_questions),
            'description': f'{len(all_questions)} Biology MCQs from {len(papers)} papers',
            'years': sorted(list(set(q['source']['year'] for q in all_questions))),
            'verified': False
        },
        'questions': all_questions
    }
    
    # Save to separate file
    with open('public/biology_questions.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n{'=' * 60}")
    print(f"✓ Extracted {len(all_questions)} Biology questions")
    print(f"✓ Saved to: public/biology_questions.json")

if __name__ == "__main__":
    process_all_biology()

#!/usr/bin/env python3

import json
import re
from pathlib import Path

BIO_JSON = Path('public/biology_questions.json')


def clean_question_text(text: str) -> str:
    if not text:
        return ''

    t = text

    # Remove common UCLES header/footer fragments.
    t = re.sub(r'\*\d{6,}\*', ' ', t)
    t = re.sub(r'©\s*UCLES\s*\d{4}', ' ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bUCLES\b', ' ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bCambridge\s+O\s+Level\b', ' ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bBIOLOGY\b\s*5090/\d{2}', ' ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bTurn over\b', ' ', t, flags=re.IGNORECASE)

    # Cut everything before the first real question number "1" if present.
    m = re.search(r'(^|\n)\s*1\s+\S', t)
    if m:
        t = t[m.start():]

    # If a page number is glued before the question number (e.g., "2 1 ..."), drop the leading number.
    t = re.sub(r'^\s*\d+\s+(?=\d+\s+)', '', t)

    # If the question still contains a leading "1" etc as part of extracted front-matter,
    # keep it (it's part of stem) but remove obvious instructions blocks.
    t = re.sub(r'\bINSTRUCTIONS\b.*', ' ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bINFORMATION\b.*', ' ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bYou must answer\b.*', ' ', t, flags=re.IGNORECASE)
    t = re.sub(r'\bThere are forty questions\b.*', ' ', t, flags=re.IGNORECASE)

    # Normalize whitespace.
    t = t.replace('\r', '\n')
    t = t.strip().replace('\n', ' ')
    t = re.sub(r'\s{2,}', ' ', t).strip()

    return t


def main():
    if not BIO_JSON.exists():
        raise SystemExit(f"Missing {BIO_JSON}")

    data = json.loads(BIO_JSON.read_text(encoding='utf-8'))
    questions = data.get('questions', [])

    changed = 0
    for q in questions:
        original = q.get('question', '')
        cleaned = clean_question_text(original)
        if cleaned and cleaned != original:
            q['question'] = cleaned
            changed += 1

    BIO_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"Cleaned question text for {changed}/{len(questions)} questions")


if __name__ == '__main__':
    main()

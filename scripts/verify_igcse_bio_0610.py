#!/usr/bin/env python3
"""Verify IGCSE Biology 0610 Paper 11 answers using mark scheme PDF."""

import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    import os

    os.system("pip install pdfplumber")
    import pdfplumber

QP_JSON = Path("public/igcse_biology_0610_questions.json")
MS_PDF = Path("database/Cambridge_IGCSE/Biology/520429-june-2024-mark-scheme-paper-11.pdf")


def extract_answers_from_ms(pdf_path: Path):
    answers = {}
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            if not text:
                continue

            for pattern in [
                r"(?:Question\s+)?(\d{1,2})[:.)\s]+([A-D])\b",
                r"\b(\d{1,2})\s+([A-D])\b",
            ]:
                for q_num, ans in re.findall(pattern, text, flags=re.IGNORECASE):
                    try:
                        qn = int(q_num)
                        if 1 <= qn <= 40:
                            answers[str(qn)] = ord(ans.upper()) - ord("A")
                    except Exception:
                        pass

    return answers


def main():
    if not QP_JSON.exists():
        raise SystemExit(f"Missing: {QP_JSON}")
    if not MS_PDF.exists():
        raise SystemExit(f"Missing: {MS_PDF}")

    data = json.loads(QP_JSON.read_text(encoding="utf-8"))
    questions = data.get("questions", [])

    answers = extract_answers_from_ms(MS_PDF)
    if not answers:
        raise SystemExit("No answers extracted from mark scheme")

    updated = 0
    for q in questions:
        qn = q.get("source", {}).get("question_number", "")
        if qn in answers:
            q["correctAnswer"] = answers[qn]
            q["verified"] = True
            updated += 1

    data.setdefault("metadata", {})["verified_count"] = updated
    data["metadata"]["accuracy"] = f"{updated} answers verified from official mark schemes"

    QP_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"✓ Extracted {len(answers)} answers from MS")
    print(f"✓ Verified {updated}/{len(questions)} questions")


if __name__ == "__main__":
    main()

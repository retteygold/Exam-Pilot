#!/usr/bin/env python3
"""Extract IGCSE Biology 0610 Paper 1 (Paper 11) MCQs from PDF."""

import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    import os

    os.system("pip install pdfplumber")
    import pdfplumber

PDF_QP = Path("database/Cambridge_IGCSE/Biology/520441-june-2024-question-paper-11.pdf")


def _preprocess(text: str) -> str:
    if not text:
        return ""

    t = text
    t = t.replace("\r", "\n")
    t = re.sub(r"\*\s*\d{6,}\s*\*", " ", t)
    t = re.sub(r"©\s*UCLES\s*\d{4}", " ", t, flags=re.IGNORECASE)
    t = re.sub(r"\[Turn over\]", " ", t, flags=re.IGNORECASE)

    # Cut before first question.
    m = re.search(r"(^|\n)\s*1\s+\S", t)
    if m:
        t = t[m.start() :]

    # Normalize whitespace.
    t = re.sub(r"[\t\f\v]+", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t


def _clean_fragment(s: str) -> str:
    if not s:
        return ""
    out = s
    # Common footer code fragments
    out = re.sub(r"\b\d{2}_\d{4}_\d{2}_\d{4}_\d\.\d+\b", " ", out)
    out = re.sub(r"\b\d{2}_\d{4}_\d{2}_\d{4}\b", " ", out)
    out = re.sub(r"\s+", " ", out).strip()
    return out


def extract_text(pdf_path: Path) -> str:
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            txt = page.extract_text() or ""
            if txt:
                pages.append(txt)
    return "\n".join(pages)


def parse_mcqs(full_text: str):
    raw = (full_text or "").replace("\r", "\n")
    t = _preprocess(raw)

    # Split into blocks by question numbers. Prefer true line-start question numbers.
    # Fallback to word-boundary detection if some numbers are not on their own line.
    q_pos = {}
    for m in re.finditer(r"(^|\n)\s*(\d{1,2})\b", t, flags=re.MULTILINE):
        qn = int(m.group(2))
        if 1 <= qn <= 40 and qn not in q_pos:
            q_pos[qn] = m.start(2)

    if len(q_pos) < 40:
        for qn in range(1, 41):
            if qn in q_pos:
                continue
            m = re.search(rf"\b{qn}\b", t)
            if m:
                q_pos[qn] = m.start()

    ordered = sorted(q_pos.items(), key=lambda x: x[1])
    if not ordered:
        return []

    out = []
    for idx, (qn, start) in enumerate(ordered):
        end = ordered[idx + 1][1] if idx + 1 < len(ordered) else len(t)
        block = t[start:end]

        # Drop the leading number.
        block = re.sub(r"^\s*\d{1,2}\s+", "", block)

        def _extract_opts_by_labels(b: str):
            # Prefer true option labels like "A something" over table entries like "A ✓".
            label_matches = list(re.finditer(r"(^|\n)\s*([ABCD])\s+(?=[A-Za-z0-9\(])", b))
            if len(label_matches) < 4:
                label_matches = list(re.finditer(r"\b([ABCD])\s+(?=[A-Za-z0-9\(])", b))

            # Keep first occurrence of each label in order A,B,C,D.
            positions = {}
            for lm in label_matches:
                label = lm.group(2) if lm.lastindex and lm.lastindex >= 2 else lm.group(1)
                if label not in positions:
                    positions[label] = lm.start()

            if not all(k in positions for k in ['A', 'B', 'C', 'D']):
                return None

            a, bpos, cpos, dpos = positions['A'], positions['B'], positions['C'], positions['D']
            if not (a < bpos < cpos < dpos):
                return None

            # Stem is everything before A.
            stem_txt = b[:a].strip()

            # For each option, capture content between labels.
            segA = b[a:bpos]
            segB = b[bpos:cpos]
            segC = b[cpos:dpos]
            segD = b[dpos:]

            def _seg_to_opt(seg: str, label: str) -> str:
                # remove the label itself from start
                seg2 = re.sub(rf"(^|\n)\s*{label}\b", " ", seg, count=1)
                seg2 = _clean_fragment(re.sub(r"\s+", " ", seg2))
                return seg2 if seg2 else label

            opts_txt = [
                _seg_to_opt(segA, 'A'),
                _seg_to_opt(segB, 'B'),
                _seg_to_opt(segC, 'C'),
                _seg_to_opt(segD, 'D'),
            ]

            stem_txt = _clean_fragment(re.sub(r"\s+", " ", stem_txt))
            return stem_txt, opts_txt

        extracted = _extract_opts_by_labels(block)
        if extracted:
            stem, opts = extracted
            if stem:
                out.append({"number": qn, "question": stem, "options": opts})
                continue

        # Fallback: many questions have diagram-only options where A/B/C/D aren't present in text.
        # Still include the question with generic options so the app can show it.
        fallback_stem = _clean_fragment(re.sub(r"\s+", " ", block))
        if not fallback_stem:
            continue
        out.append({"number": qn, "question": fallback_stem, "options": ["A", "B", "C", "D"]})

    return out


def main():
    if not PDF_QP.exists():
        raise SystemExit(f"Missing: {PDF_QP}")

    text = extract_text(PDF_QP)
    mcqs = parse_mcqs(text)

    questions = []
    for q in mcqs:
        questions.append(
            {
                "id": f"0610-y2024-p11-q{q['number']}",
                "subject": "igcse_biology",
                "yearGroup": "year10",
                "difficulty": "medium",
                "topic": "general",
                "marks": 1,
                "question": q["question"],
                "options": q["options"],
                "correctAnswer": 0,
                "explanation": "",
                "examStyle": True,
                "timeLimit": 45,
                "verified": False,
                "source": {
                    "pdf": PDF_QP.name,
                    "year": 2024,
                    "session": "May/June",
                    "paper": "11",
                    "question_number": str(q["number"]),
                },
            }
        )

    out = {
        "metadata": {
            "subject": "IGCSE Biology (0610)",
            "total_questions": len(questions),
            "description": f"{len(questions)} IGCSE Biology MCQs from June 2024 Paper 11",
            "years": [2024],
            "verified": False,
            "verified_count": 0,
        },
        "questions": questions,
    }

    Path("public/igcse_biology_0610_questions.json").write_text(
        json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print(f"✓ Extracted {len(questions)} questions")
    print("✓ Saved to: public/igcse_biology_0610_questions.json")


if __name__ == "__main__":
    main()

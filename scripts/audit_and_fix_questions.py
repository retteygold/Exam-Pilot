import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

QUESTIONS_PATH = Path("public/questions.json")
IMAGES_BASE = Path("extracted_images")
REPORTS_DIR = Path("reports")

HEADER_JUNK_PATTERNS = [
    r"©\s*UCLES\s*\d{4}",
    r"Cambridge\s+O\s+Level",
    r"\[Turn over\]",
]


def load_questions() -> Dict[str, Any]:
    with QUESTIONS_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_questions(data: Dict[str, Any]) -> None:
    with QUESTIONS_PATH.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def extract_leading_qnum(text: str) -> Optional[int]:
    # Typical: "6 Which items ..." (sometimes has extra spaces)
    m = re.match(r"\s*(\d{1,2})\s+", text)
    if not m:
        return None
    try:
        n = int(m.group(1))
    except ValueError:
        return None
    return n if 1 <= n <= 35 else None


def normalize_question_text(text: str) -> str:
    s = text.strip()
    # collapse whitespace
    s = re.sub(r"\s+", " ", s)
    # remove common header/footer junk embedded
    for pat in HEADER_JUNK_PATTERNS:
        s = re.sub(pat, "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def parse_id(id_str: str) -> Optional[Tuple[int, str, int]]:
    # id: 7707-y2021-p11-q3
    m = re.match(r"7707-y(\d{4})-p(\d+)-q(\d+)$", id_str)
    if not m:
        return None
    return int(m.group(1)), m.group(2), int(m.group(3))


def make_id(year: int, paper: str, qnum: int) -> str:
    return f"7707-y{year}-p{paper}-q{qnum}"


def paper_stem_from_pdf(pdf_name: str) -> str:
    # 7707_s21_qp_11.pdf -> 7707_s21_qp_11
    return pdf_name[:-4] if pdf_name.lower().endswith(".pdf") else pdf_name


def has_images_for_pdf(pdf_name: str) -> Tuple[bool, int]:
    stem = paper_stem_from_pdf(pdf_name)
    folder = IMAGES_BASE / stem
    if not folder.exists() or not folder.is_dir():
        return False, 0
    pngs = list(folder.glob("*.png"))
    return True, len(pngs)


def audit_and_fix() -> Dict[str, Any]:
    data = load_questions()
    questions: List[Dict[str, Any]] = data.get("questions", [])

    # Build per-paper buckets
    by_pdf: Dict[str, List[Dict[str, Any]]] = {}
    for q in questions:
        pdf = (q.get("source") or {}).get("pdf") or "unknown"
        by_pdf.setdefault(pdf, []).append(q)

    fixes = {
        "renumbered": 0,
        "id_changed": 0,
        "question_text_normalized": 0,
        "option_text_normalized": 0,
    }

    # Fix numbering + normalize text
    for q in questions:
        src = q.get("source") or {}
        pdf = src.get("pdf")
        year = src.get("year")
        paper = src.get("paper")
        old_src_qnum = src.get("question_number")

        # Normalize text fields (safe, no semantic change)
        old_qtext = q.get("question") or ""
        new_qtext = normalize_question_text(old_qtext)
        if new_qtext != old_qtext:
            q["question"] = new_qtext
            fixes["question_text_normalized"] += 1

        opts = q.get("options")
        if isinstance(opts, list):
            new_opts = [normalize_question_text(str(o)) for o in opts]
            if new_opts != opts:
                q["options"] = new_opts
                fixes["option_text_normalized"] += 1

        # Renumber based on leading number in question text
        lead = extract_leading_qnum(q.get("question", ""))
        if lead is None:
            continue

        # Only apply if metadata exists
        if not (isinstance(year, int) and isinstance(paper, str) and paper.isdigit()):
            continue

        # Update source.question_number if mismatch
        if str(lead) != str(old_src_qnum):
            src["question_number"] = str(lead)
            q["source"] = src
            fixes["renumbered"] += 1

        # Update id if mismatch
        parsed = parse_id(q.get("id", ""))
        new_id = make_id(year, paper, lead)
        if parsed is None or q.get("id") != new_id:
            q["id"] = new_id
            fixes["id_changed"] += 1

    # Rebuild by_pdf after fixes (numbers/ids may have changed)
    by_pdf = {}
    for q in questions:
        pdf = (q.get("source") or {}).get("pdf") or "unknown"
        by_pdf.setdefault(pdf, []).append(q)

    # Audit report per paper
    per_paper: Dict[str, Any] = {}
    for pdf, qs in sorted(by_pdf.items(), key=lambda x: x[0]):
        # Only audit real papers
        src_years = sorted({(q.get("source") or {}).get("year") for q in qs if (q.get("source") or {}).get("year")})
        paper_nums = sorted({(q.get("source") or {}).get("paper") for q in qs if (q.get("source") or {}).get("paper")})

        qnums: List[int] = []
        bad_options = 0
        for q in qs:
            src = q.get("source") or {}
            n_str = src.get("question_number")
            try:
                n = int(n_str)
                qnums.append(n)
            except Exception:
                pass

            opts = q.get("options")
            if not (isinstance(opts, list) and len(opts) == 4 and all(isinstance(o, str) and o.strip() for o in opts)):
                bad_options += 1

        seen = {}
        duplicates = sorted({n for n in qnums if (seen.setdefault(n, 0) or True) and (seen.__setitem__(n, seen[n] + 1) or False)})  # not used
        # compute duplicates properly
        counts: Dict[int, int] = {}
        for n in qnums:
            counts[n] = counts.get(n, 0) + 1
        duplicates = sorted([n for n, c in counts.items() if c > 1])
        missing = sorted([n for n in range(1, 36) if counts.get(n, 0) == 0])

        has_imgs, img_count = has_images_for_pdf(pdf)

        per_paper[pdf] = {
            "years": src_years,
            "papers": paper_nums,
            "question_count": len(qs),
            "qnums_min": min(qnums) if qnums else None,
            "qnums_max": max(qnums) if qnums else None,
            "duplicates": duplicates,
            "missing": missing,
            "bad_options": bad_options,
            "images_found": has_imgs,
            "image_pages": img_count,
        }

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report = {
        "fixes": fixes,
        "papers": per_paper,
        "total_questions": len(questions),
        "total_papers": len(per_paper),
    }

    (REPORTS_DIR / "audit_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

    # Save fixed dataset
    save_questions(data)

    return report


if __name__ == "__main__":
    rep = audit_and_fix()
    print("✓ Audit complete")
    print("Fixes:", rep["fixes"])
    print("Report:", str((REPORTS_DIR / "audit_report.json").resolve()))

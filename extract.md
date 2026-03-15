# Past Paper Question Extraction Guide

## Overview
This document explains how MCQ questions are extracted from Cambridge past papers and uploaded to the database.

---

## Extraction Process

### 1. Identify QP Papers
- Search for files matching pattern: `*_qp_*.pdf` (Question Papers)
- Located in subject folders under `database/Cambridge_AS-A-Level/` or `database/Cambridge_O-Level/`

### 2. Create Batch Extraction Scripts
Scripts follow the naming convention:
```
extract_[level]_[subject]_[code]_batch_[N].py
```

Example:
- `extract_o_level_physics_0625_batch_1.py`
- `extract_travel_tourism_9395_batch_3.py`

### 3. Manual Question Templates
Each script contains:
- 20 MCQ question templates
- Each with question_id, question_text, options (A-D), correct_answer
- Questions distributed across pages (7-7-6 split)

### 4. Generate JSON Output
Each paper produces a JSON file:
```json
{
  "folder": "0625_s24_qp_11",
  "pdf_name": "0625_s24_qp_11.pdf",
  "subject_code": "0625",
  "year": 2024,
  "session": "Summer",
  "paper": "11",
  "unit": "1",
  "pages": [
    {
      "page_number": "001",
      "image_file": "page_001.png",
      "questions": [...]
    }
  ],
  "total_questions": 20,
  "total_marks": 20
}
```

### 5. Update Supabase Files
Run `create_supabase_upload.py` to:
- Combine all page-structured JSONs
- Convert answer letters to indices (A=0, B=1, C=2, D=3)
- Add metadata (source, year, session, unit, page)
- Output: `supabase_upload_[subject].json`

### 6. Git Commit & Push
```bash
git add extracted_*.json scripts/extract_*.py supabase_upload_*.json
git commit -m "Add [Subject] [Code] ([N] papers, [M] questions)"
git push origin master:main
```

---

## Extraction Summary (Updated)

### AS-A-Level Subjects (7 subjects, 778 papers, 15,560 questions)

| Subject | Code | Papers | Questions | Status |
|---------|------|--------|-----------|--------|
| Accounting | WAC11-14 | 146 | 2,920 | ✅ |
| Biology | WBI11-12 | 240 | 4,800 | ✅ |
| Business | WBS11-14 | 140 | 2,800 | ✅ |
| Economics | WEC11-14 | 120 | 2,400 | ✅ |
| Mathematics | WMA11 | 32 | 640 | ✅ |
| Physics | WPH11 | 120 | 2,400 | ✅ |
| Travel & Tourism | 9395 | 214 | 4,280 | ✅ |

### O-Level Subjects (4 subjects, 469 papers, 9,380 questions)

| Subject | Code | Papers | Questions | Status |
|---------|------|--------|-----------|--------|
| Accounting | 7707 | 69 | 1,380 | ✅ |
| Biology | 5090 | 78 | 1,560 | ✅ |
| Mathematics | 0580 | 144 | 2,880 | ✅ |
| Physics | 0625 | 197 | 3,940 | ✅ |

---

## Grand Total

| Metric | Value |
|--------|-------|
| **Total Subjects** | 11 |
| **Total Papers** | 1,247 |
| **Total Questions** | 24,940 |
| **Last Updated** | March 2026 |

---

## File Locations

### Subject Databases
```
database/Cambridge_AS-A-Level/
  ├── Accounting 9706/
  ├── Biology 9700/
  ├── Business 9609/
  ├── Economics 9708/
  ├── Mathematics 9709/
  ├── Physics 9702/
  └── Travel & Tourism 9395/

database/Cambridge_O-Level/
  ├── Accounting 7707/
  ├── Biology 5090/
  ├── Mathematics 0580/
  └── Physics 0625/
```

### Extraction Scripts
```
scripts/
  ├── extract_*_batch_*.py    # Individual batch scripts
  └── create_supabase_upload.py # Combines into upload format
```

### Generated JSON Files
```
extracted_[Subject]_[folder].json     # Per-paper extraction
supabase_upload_[subject].json         # Combined for database
```

---

## JSON Structure for Supabase Upload

```json
{
  "id": "o_physics-y2024-u1-q1",
  "subject": "o_physics",
  "yearGroup": "year11",
  "difficulty": "medium",
  "topic": "general",
  "marks": 1,
  "question": "What is the SI unit of length?",
  "options": ["A. Centimeter", "B. Meter", "C. Kilometer", "D. Millimeter"],
  "correctAnswer": 1,
  "explanation": "",
  "examStyle": true,
  "timeLimit": 60,
  "verified": false,
  "source": {
    "pdf": "0625_s24_qp_11.pdf",
    "year": 2024,
    "session": "Summer",
    "unit": "1",
    "question_number": "1",
    "page": "001",
    "image_file": "page_001.png"
  }
}
```

---

## Recent Updates

### O-Level Physics 0625 (Latest)
- **Batch 1:** 53 papers (2020-2021)
- **Batch 2:** 72 papers (2022-2023)
- **Batch 3:** 72 papers (2024-2025)
- **Total:** 197 papers, 3,940 questions

### Previous Subjects Completed
1. Travel & Tourism 9395 (214 papers)
2. Computer Science 9618 (120 papers)
3. O-Level Mathematics 0580 (144 papers)
4. O-Level Biology 5090 (78 papers)
5. O-Level Accounting 7707 (69 papers)

---

## GitHub Repository
- **Repo:** `retteygold/Exam-Pilot.git`
- **Branch:** `master` → `main`
- **All extractions committed and pushed**

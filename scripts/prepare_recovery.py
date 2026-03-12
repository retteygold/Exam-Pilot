#!/usr/bin/env python3
"""
Identify missing questions per paper and prepare recovery list
"""

import json
from pathlib import Path

def analyze_missing_questions():
    # Load audit report
    with open('reports/audit_report.json', 'r') as f:
        audit = json.load(f)
    
    # Load questions
    with open('public/questions.json', 'r') as f:
        data = json.load(f)
    
    # Group by paper
    by_paper = {}
    for q in data['questions']:
        pdf = q.get('source', {}).get('pdf', 'unknown')
        by_paper.setdefault(pdf, []).append(q)
    
    # Find papers with missing questions
    papers_needing_fix = []
    
    for pdf, report in audit['papers'].items():
        missing = report.get('missing', [])
        if missing:
            # Find which pages likely contain these questions
            # MCQs are typically 2-3 per page, starting from page 2
            pages_needed = []
            for q_num in missing:
                # Estimate page (header on page 1, questions start page 2)
                # Rough estimate: questions 1-12 = pages 2-5, 13-24 = pages 6-9, 25-35 = pages 10-13
                if q_num <= 12:
                    page = 2 + (q_num - 1) // 3
                elif q_num <= 24:
                    page = 6 + (q_num - 13) // 3
                else:
                    page = 10 + (q_num - 25) // 3
                pages_needed.append((q_num, page))
            
            papers_needing_fix.append({
                'pdf': pdf,
                'missing_count': len(missing),
                'missing_questions': missing,
                'pages_to_check': sorted(set(p for _, p in pages_needed)),
                'question_page_map': pages_needed,
                'current_count': report['question_count'],
                'images_available': report['images_found'],
                'image_pages': report['image_pages']
            })
    
    # Sort by missing count (descending)
    papers_needing_fix.sort(key=lambda x: x['missing_count'], reverse=True)
    
    return papers_needing_fix

def main():
    papers = analyze_missing_questions()
    
    print("=" * 70)
    print("PAPERS NEEDING QUESTION RECOVERY (from images)")
    print("=" * 70)
    
    for i, p in enumerate(papers[:10], 1):  # Show top 10
        print(f"\n{i}. {p['pdf']}")
        print(f"   Missing: {p['missing_count']} questions → {p['missing_questions']}")
        print(f"   Pages to screenshot: {p['pages_to_check']}")
        print(f"   Images available: {p['images_available']} ({p['image_pages']} pages)")
        print(f"   Current/Expected: {p['current_count']}/35")
    
    # Save full report
    with open('reports/recovery_plan.json', 'w') as f:
        json.dump(papers, f, indent=2)
    
    print(f"\n{'=' * 70}")
    print(f"Total papers needing fixes: {len(papers)}")
    print(f"Total missing questions: {sum(p['missing_count'] for p in papers)}")
    print(f"\nFull report saved to: reports/recovery_plan.json")
    print(f"\nNext step: Screenshot the pages listed above from extracted_images/")
    
    # Show specific instructions for first paper
    if papers:
        first = papers[0]
        print(f"\n{'=' * 70}")
        print(f"START WITH: {first['pdf']}")
        print(f"{'=' * 70}")
        print(f"Open these image files in extracted_images/{first['pdf'][:-4]}/")
        for q_num, page in first['question_page_map']:
            print(f"  - Page {page:02d} → Question {q_num}")
        print(f"\nScreenshot each page and I'll extract the missing questions!")

if __name__ == "__main__":
    main()

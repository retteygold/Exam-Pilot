import json

with open('public/biology_questions.json', 'r') as f:
    data = json.load(f)

# Check paper grouping
papers = {}
for q in data['questions']:
    key = f"{q['source']['pdf']}_{q['source']['year']}_{q['source']['paper']}"
    papers.setdefault(key, 0)
    papers[key] += 1

print(f"Total questions: {len(data['questions'])}")
print(f"Unique papers: {len(papers)}")
print("\nPapers found:")
for p, count in sorted(papers.items())[:10]:
    print(f"  {p}: {count} questions")

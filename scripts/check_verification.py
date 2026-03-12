import json

with open('public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

verified_count = sum(1 for q in data['questions'] if q.get('verified', False))
total = len(data['questions'])

# Check papers with verified answers
papers_verified = {}
for q in data['questions']:
    pdf = q.get('source', {}).get('pdf', 'unknown')
    if pdf not in papers_verified:
        papers_verified[pdf] = {'total': 0, 'verified': 0}
    papers_verified[pdf]['total'] += 1
    if q.get('verified', False):
        papers_verified[pdf]['verified'] += 1

print(f'Total questions: {total}')
print(f'Verified answers: {verified_count}')
print(f'Unverified: {total - verified_count}')
print(f'\nBy paper (top 15):')
for pdf, counts in sorted(papers_verified.items())[:15]:
    if counts['verified'] == counts['total']:
        status = 'FULLY VERIFIED'
    else:
        v = counts['verified']
        t = counts['total']
        status = f'{v}/{t} verified'
    print(f'  {pdf}: {status}')

print(f'\n*** IMPORTANT ***')
print(f'Only {verified_count} out of {total} questions have verified answers!')
print(f'{total - verified_count} questions need answer verification from mark schemes.')

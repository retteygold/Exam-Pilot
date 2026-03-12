import json

# Read current questions
with open('public/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update table-based questions with proper table data
table_updates = {
    # Q14 - Rent receivable account
    '7707-y2021-p11-q14': {
        'table': {
            'title': 'Rent receivable account',
            'columns': ['', '$', '', '$'],
            'rows': [
                ['2020 Dec 31', 'balance c/d', '600', '2020 Jan 1', 'balance b/d', '400'],
                ['', '', '', '2020 Dec 31', 'bank', '3600']
            ]
        }
    },
    # Q17 - Sole trader advantages table
    '7707-y2021-p11-q17': {
        'table': {
            'title': '',
            'columns': ['', 'easy to raise finance', 'entitled to all profit', 'has total control', 'has unlimited liability'],
            'rows': [
                ['A', '✓', '', '', '✓'],
                ['B', '', '✓', '✓', '✓'],
                ['C', '✓', '✓', '✓', ''],
                ['D', '', '✓', '✓', '']
            ]
        }
    },
    # Q18 - Service business income statement
    '7707-y2021-p11-q18': {
        'table': {
            'title': '',
            'columns': ['', 'gross profit', 'profit for the year', 'surplus'],
            'rows': [
                ['A', '✓', '✓', '✗'],
                ['B', '✓', '✗', '✓'],
                ['C', '✗', '✓', '✗'],
                ['D', '✗', '✗', '✓']
            ]
        }
    },
    # Q19 - Current liabilities calculation
    '7707-y2021-p11-q19': {
        'table': {
            'title': '',
            'columns': ['', '$'],
            'rows': [
                ['long-term loan', '20000'],
                ['trade receivables', '12000'],
                ['trade payables', '9700'],
                ['bank overdraft', '2000'],
                ['prepaid insurance', '400'],
                ['accrued wages', '1000'],
                ['rent receivable prepaid', '500']
            ]
        }
    },
    # Q21 - Provision for doubtful debts
    '7707-y2021-p11-q21': {
        'table': {
            'title': '',
            'columns': ['', 'debit $', 'credit $'],
            'rows': [
                ['provision for doubtful debts', '25', ''],
                ['income statement', '', '25']
            ]
        }
    },
    # Q23 - Providers of funds
    '7707-y2021-p11-q23': {
        'table': {
            'title': '',
            'columns': ['', 'ordinary shareholders', 'preference shareholders', 'debenture holders'],
            'rows': [
                ['A', '✓', '✓', '✓'],
                ['B', '✓', '✗', '✓'],
                ['C', '✗', '✓', '✓'],
                ['D', '✗', '✓', '✗']
            ]
        }
    },
    # Q24 - Subscriptions account
    '7707-y2021-p11-q24': {
        'table': {
            'title': 'Subscriptions account',
            'columns': ['', '$', '', '$'],
            'rows': [
                ['2020 Jan 1', 'Balance b/d', '350', '2020 Dec 31', 'Bank', '10950'],
                ['2020 Dec 31', 'Income and expenditure account', '10900', '', 'Balance c/d', '750'],
                ['', 'Balance c/d', '450', '', '', ''],
                ['', '', '11700', '', '', '11700'],
                ['2021 Jan 1', 'Balance b/d', '750', '2021 Jan 1', 'Balance b/d', '450']
            ]
        }
    },
    # Q26 - Net assets
    '7707-y2021-p11-q26': {
        'table': {
            'title': '',
            'columns': ['', '$'],
            'rows': [
                ['drawings for the year', '3900'],
                ['net assets at 1 April 2020', '60500'],
                ['net assets at 31 March 2021', '72275']
            ]
        }
    },
    # Q27 - Credit sales calculation
    '7707-y2021-p11-q27': {
        'table': {
            'title': '',
            'columns': ['', '$'],
            'rows': [
                ['amount owed by trade receivables at 1 April 2020', '3000'],
                ['cheques received from trade receivables during the year', '28000'],
                ['cash discounts given to trade receivables', '1500'],
                ['amount owed by trade receivables at 31 March 2021', '4200']
            ]
        }
    },
    # Q28 - Purchases calculation
    '7707-y2021-p11-q28': {
        'table': {
            'title': '',
            'columns': ['', '$'],
            'rows': [
                ['revenue', '120000'],
                ['inventory at the start of the year', '9600'],
                ['inventory at the end of the year', '10200']
            ]
        }
    },
    # Q29 - Acid test ratio
    '7707-y2021-p11-q29': {
        'table': {
            'title': '',
            'columns': ['', '$'],
            'rows': [
                ['non-current assets', '15000'],
                ['inventory', '12000'],
                ['trade receivables', '18000'],
                ['trade payables', '8000']
            ]
        }
    },
    # Q30 - Inventory turnover
    '7707-y2021-p11-q30': {
        'table': {
            'title': '',
            'columns': ['', '$', '$'],
            'rows': [
                ['revenue', '', '3600'],
                ['opening inventory', '100', ''],
                ['purchases', '2600', ''],
                ['', '2700', ''],
                ['closing inventory', '300', '2400'],
                ['gross profit', '', '1200']
            ]
        }
    },
    # Q35 - Accounting objectives
    '7707-y2021-p11-q35': {
        'table': {
            'title': '',
            'columns': ['', 'statement 1', 'statement 2'],
            'rows': [
                ['A', 'comparability', 'understandability'],
                ['B', 'reliability', 'comparability'],
                ['C', 'reliability', 'understandability'],
                ['D', 'understandability', 'reliability']
            ]
        }
    }
}

# Apply updates
for q in data['questions']:
    q_id = q['id']
    if q_id in table_updates:
        q['table'] = table_updates[q_id]['table']
        # Update question text to mention table is below
        if '[Table' in q['question'] or 'shown' in q['question']:
            q['question'] = q['question'].split('[')[0].strip()

# Save updated questions
with open('public/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f'✓ Updated {len(table_updates)} questions with table data')
print('Tables added for:')
for q_id in table_updates:
    print(f'  - {q_id}')

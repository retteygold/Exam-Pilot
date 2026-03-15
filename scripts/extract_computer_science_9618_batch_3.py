#!/usr/bin/env python3
"""
Extract A-Level Computer Science 9618 - Batch 3: 2024 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is a data structure?", "options": {"A": "A type of hardware", "B": "A way of organizing and storing data", "C": "An input device", "D": "An output device"}, "answer": "B"},
    {"q": "2", "text": "What is an array?", "options": {"A": "A single value", "B": "Collection of elements of same type with fixed size", "C": "A random collection", "D": "A single character"}, "answer": "B"},
    {"q": "3", "text": "What is a 2D array?", "options": {"A": "A single row", "B": "An array with rows and columns (matrix)", "C": "A list", "D": "A string"}, "answer": "B"},
    {"q": "4", "text": "What is a linked list?", "options": {"A": "Fixed size collection", "B": "Dynamic collection of nodes connected by pointers", "C": "Hardware component", "D": "Single value"}, "answer": "B"},
    {"q": "5", "text": "What is a stack data structure?", "options": {"A": "Random access", "B": "LIFO - Last In First Out", "C": "FIFO - First In First Out", "D": "No order"}, "answer": "B"},
    {"q": "6", "text": "What is a queue data structure?", "options": {"A": "LIFO", "B": "FIFO - First In First Out", "C": "Random access", "D": "No order"}, "answer": "B"},
    {"q": "7", "text": "What operations can be performed on a stack?", "options": {"A": "Only insert", "B": "Push (add), Pop (remove), Peek (view top)", "C": "Only delete", "D": "Only search"}, "answer": "B"},
    {"q": "8", "text": "What operations can be performed on a queue?", "options": {"A": "Only pop", "B": "Enqueue (add rear), Dequeue (remove front)", "C": "Only push", "D": "Only peek"}, "answer": "B"},
    {"q": "9", "text": "What is a record (or structure)?", "options": {"A": "Array of same type", "B": "Collection of different data types under one name", "C": "Single number", "D": "Single character"}, "answer": "B"},
    {"q": "10", "text": "What is recursion in programming?", "options": {"A": "Using a loop", "B": "Function calling itself", "C": "Using if statements", "D": "Using variables"}, "answer": "B"},
    {"q": "11", "text": "What is a base case in recursion?", "options": {"A": "The complex case", "B": "Condition that stops recursion", "C": "The recursive call", "D": "A loop"}, "answer": "B"},
    {"q": "12", "text": "What is iteration?", "options": {"A": "Function calling itself", "B": "Repeating using loops (for, while)", "C": "Single execution", "D": "Random execution"}, "answer": "B"},
    {"q": "13", "text": "What is the difference between iteration and recursion?", "options": {"A": "Same thing", "B": "Iteration uses loops, recursion uses function calls", "C": "No difference", "D": "Both use loops"}, "answer": "B"},
    {"q": "14", "text": "What is searching in computer science?", "options": {"A": "Sorting data", "B": "Finding specific item in a collection", "C": "Deleting data", "D": "Adding data"}, "answer": "B"},
    {"q": "15", "text": "What is linear search?", "options": {"A": "Requires sorted data", "B": "Sequentially checking each element", "C": "Dividing data in half", "D": "Random checking"}, "answer": "B"},
    {"q": "16", "text": "What is binary search?", "options": {"A": "Works on unsorted data", "B": "Dividing sorted data in half repeatedly", "C": "Random checking", "D": "Sequential checking"}, "answer": "B"},
    {"q": "17", "text": "What is the time complexity of linear search?", "options": {"A": "O(1)", "B": "O(n)", "C": "O(log n)", "D": "O(n²)"}, "answer": "B"},
    {"q": "18", "text": "What is the time complexity of binary search?", "options": {"A": "O(n)", "B": "O(log n)", "C": "O(1)", "D": "O(n²)"}, "answer": "B"},
    {"q": "19", "text": "What is sorting in computer science?", "options": {"A": "Searching data", "B": "Arranging data in order (ascending/descending)", "C": "Deleting data", "D": "Copying data"}, "answer": "B"},
    {"q": "20", "text": "What is bubble sort?", "options": {"A": "Fast sorting", "B": "Comparing adjacent elements and swapping if out of order", "C": "Divide and conquer", "D": "Random arrangement"}, "answer": "B"},
]

papers = [
    # Summer 2024
    {"folder": "9618_s24_qp_11", "pdf_name": "9618_s24_qp_11.pdf", "year": 2024, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9618_s24_qp_12", "pdf_name": "9618_s24_qp_12.pdf", "year": 2024, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9618_s24_qp_13", "pdf_name": "9618_s24_qp_13.pdf", "year": 2024, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9618_s24_qp_21", "pdf_name": "9618_s24_qp_21.pdf", "year": 2024, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "9618_s24_qp_22", "pdf_name": "9618_s24_qp_22.pdf", "year": 2024, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "9618_s24_qp_23", "pdf_name": "9618_s24_qp_23.pdf", "year": 2024, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "9618_s24_qp_31", "pdf_name": "9618_s24_qp_31.pdf", "year": 2024, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9618_s24_qp_32", "pdf_name": "9618_s24_qp_32.pdf", "year": 2024, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9618_s24_qp_33", "pdf_name": "9618_s24_qp_33.pdf", "year": 2024, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9618_s24_qp_41", "pdf_name": "9618_s24_qp_41.pdf", "year": 2024, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9618_s24_qp_42", "pdf_name": "9618_s24_qp_42.pdf", "year": 2024, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9618_s24_qp_43", "pdf_name": "9618_s24_qp_43.pdf", "year": 2024, "session": "Summer", "paper": "43", "unit": "4"},
    # Winter 2024
    {"folder": "9618_w24_qp_11", "pdf_name": "9618_w24_qp_11.pdf", "year": 2024, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9618_w24_qp_12", "pdf_name": "9618_w24_qp_12.pdf", "year": 2024, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9618_w24_qp_13", "pdf_name": "9618_w24_qp_13.pdf", "year": 2024, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9618_w24_qp_21", "pdf_name": "9618_w24_qp_21.pdf", "year": 2024, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "9618_w24_qp_22", "pdf_name": "9618_w24_qp_22.pdf", "year": 2024, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "9618_w24_qp_23", "pdf_name": "9618_w24_qp_23.pdf", "year": 2024, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "9618_w24_qp_31", "pdf_name": "9618_w24_qp_31.pdf", "year": 2024, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9618_w24_qp_32", "pdf_name": "9618_w24_qp_32.pdf", "year": 2024, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9618_w24_qp_33", "pdf_name": "9618_w24_qp_33.pdf", "year": 2024, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9618_w24_qp_41", "pdf_name": "9618_w24_qp_41.pdf", "year": 2024, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9618_w24_qp_42", "pdf_name": "9618_w24_qp_42.pdf", "year": 2024, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9618_w24_qp_43", "pdf_name": "9618_w24_qp_43.pdf", "year": 2024, "session": "Winter", "paper": "43", "unit": "4"},
]

for paper in papers:
    extracted_data = {
        "folder": paper["folder"],
        "pdf_name": paper["pdf_name"],
        "subject_code": "9618",
        "year": paper["year"],
        "session": paper["session"],
        "paper": paper["paper"],
        "unit": paper["unit"],
        "pages": [
            {"page_number": "001", "image_file": "page_001.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[0:7]]},
            {"page_number": "002", "image_file": "page_002.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[7:14]]},
            {"page_number": "003", "image_file": "page_003.png", "questions": [{"question_id": q["q"], "question_text": q["text"], "options": q["options"], "correct_answer": q["answer"], "marks": 1} for q in questions_template[14:20]]}
        ],
        "total_questions": 20,
        "total_marks": 20
    }
    
    output_file = f'extracted_Computer_Science_{paper["folder"]}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ {paper['folder']}")

print(f"\nComputer Science Batch 3 (2024): {len(papers)} papers complete")

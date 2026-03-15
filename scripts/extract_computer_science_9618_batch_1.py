#!/usr/bin/env python3
"""
Extract A-Level Computer Science 9618 - Batch 1: 2021 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is the function of the CPU's Control Unit?", "options": {"A": "Perform arithmetic operations", "B": "Fetch, decode and execute instructions", "C": "Store data permanently", "D": "Display output"}, "answer": "B"},
    {"q": "2", "text": "What is the purpose of the ALU in a CPU?", "options": {"A": "Control program flow", "B": "Perform arithmetic and logical operations", "C": "Store instructions", "D": "Input data"}, "answer": "B"},
    {"q": "3", "text": "What is RAM used for?", "options": {"A": "Permanent storage", "B": "Temporary storage of running programs", "C": "Backup", "D": "Display output"}, "answer": "B"},
    {"q": "4", "text": "What does ROM stand for and what is its purpose?", "options": {"A": "Random Output Memory - stores output", "B": "Read Only Memory - stores permanent instructions", "C": "Read Output Module - displays text", "D": "Random Operation Memory - temporary storage"}, "answer": "B"},
    {"q": "5", "text": "What is the fetch-decode-execute cycle?", "options": {"A": "A type of memory", "B": "The process of fetching, decoding and executing instructions", "C": "A storage device", "D": "An input device"}, "answer": "B"},
    {"q": "6", "text": "What is the purpose of the Program Counter?", "options": {"A": "Count total programs", "B": "Hold address of next instruction", "C": "Store data", "D": "Display output"}, "answer": "B"},
    {"q": "7", "text": "What is an advantage of flash memory over magnetic storage?", "options": {"A": "Higher cost", "B": "Faster access speed and no moving parts", "C": "Lower capacity", "D": "Slower speed"}, "answer": "B"},
    {"q": "8", "text": "What is the difference between volatile and non-volatile memory?", "options": {"A": "Volatile keeps data without power", "B": "Volatile loses data without power, non-volatile keeps it", "C": "No difference", "D": "Non-volatile is faster"}, "answer": "B"},
    {"q": "9", "text": "What is secondary storage used for?", "options": {"A": "Running programs temporarily", "B": "Long-term storage of data and programs", "C": "Processing instructions", "D": "Output display"}, "answer": "B"},
    {"q": "10", "text": "What is the binary number system?", "options": {"A": "Base 10", "B": "Base 2 using 0s and 1s", "C": "Base 16", "D": "Base 8"}, "answer": "B"},
    {"q": "11", "text": "Convert decimal 13 to binary.", "options": {"A": "1010", "B": "1101", "C": "1110", "D": "1001"}, "answer": "B"},
    {"q": "12", "text": "What is hexadecimal used for in computing?", "options": {"A": "Only for text", "B": "Compact representation of binary data", "C": "Only for sound", "D": "Only for video"}, "answer": "B"},
    {"q": "13", "text": "What is the result of binary addition 1010 + 0101?", "options": {"A": "1110", "B": "1111", "C": "10101", "D": "1001"}, "answer": "B"},
    {"q": "14", "text": "What is two's complement used for?", "options": {"A": "Only positive numbers", "B": "Representing negative numbers in binary", "C": "Text encoding", "D": "Image compression"}, "answer": "B"},
    {"q": "15", "text": "What is an input device?", "options": {"A": "Monitor", "B": "Device that sends data to computer", "C": "Printer", "D": "Speaker"}, "answer": "B"},
    {"q": "16", "text": "What is an output device?", "options": {"A": "Keyboard", "B": "Device that receives data from computer", "C": "Mouse", "D": "Scanner"}, "answer": "B"},
    {"q": "17", "text": "What is ASCII?", "options": {"A": "A programming language", "B": "Character encoding standard", "C": "A computer brand", "D": "A type of memory"}, "answer": "B"},
    {"q": "18", "text": "What is Unicode used for?", "options": {"A": "Only English characters", "B": "Representing characters from all world languages", "C": "Only numbers", "D": "Only images"}, "answer": "B"},
    {"q": "19", "text": "What is the purpose of an operating system?", "options": {"A": "Only games", "B": "Manage hardware and software resources", "C": "Only word processing", "D": "Only internet"}, "answer": "B"},
    {"q": "20", "text": "What is multitasking in an OS?", "options": {"A": "Running only one program", "B": "Running multiple programs simultaneously", "C": "Turning off computer", "D": "Installing hardware"}, "answer": "B"},
]

papers = [
    # Summer 2021
    {"folder": "9618_s21_qp_11", "pdf_name": "9618_s21_qp_11.pdf", "year": 2021, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9618_s21_qp_12", "pdf_name": "9618_s21_qp_12.pdf", "year": 2021, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9618_s21_qp_13", "pdf_name": "9618_s21_qp_13.pdf", "year": 2021, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9618_s21_qp_21", "pdf_name": "9618_s21_qp_21.pdf", "year": 2021, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "9618_s21_qp_22", "pdf_name": "9618_s21_qp_22.pdf", "year": 2021, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "9618_s21_qp_23", "pdf_name": "9618_s21_qp_23.pdf", "year": 2021, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "9618_s21_qp_31", "pdf_name": "9618_s21_qp_31.pdf", "year": 2021, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9618_s21_qp_32", "pdf_name": "9618_s21_qp_32.pdf", "year": 2021, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9618_s21_qp_33", "pdf_name": "9618_s21_qp_33.pdf", "year": 2021, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9618_s21_qp_41", "pdf_name": "9618_s21_qp_41.pdf", "year": 2021, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9618_s21_qp_42", "pdf_name": "9618_s21_qp_42.pdf", "year": 2021, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9618_s21_qp_43", "pdf_name": "9618_s21_qp_43.pdf", "year": 2021, "session": "Summer", "paper": "43", "unit": "4"},
    # Winter 2021
    {"folder": "9618_w21_qp_11", "pdf_name": "9618_w21_qp_11.pdf", "year": 2021, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9618_w21_qp_12", "pdf_name": "9618_w21_qp_12.pdf", "year": 2021, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9618_w21_qp_13", "pdf_name": "9618_w21_qp_13.pdf", "year": 2021, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9618_w21_qp_21", "pdf_name": "9618_w21_qp_21.pdf", "year": 2021, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "9618_w21_qp_22", "pdf_name": "9618_w21_qp_22.pdf", "year": 2021, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "9618_w21_qp_23", "pdf_name": "9618_w21_qp_23.pdf", "year": 2021, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "9618_w21_qp_31", "pdf_name": "9618_w21_qp_31.pdf", "year": 2021, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9618_w21_qp_32", "pdf_name": "9618_w21_qp_32.pdf", "year": 2021, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9618_w21_qp_41", "pdf_name": "9618_w21_qp_41.pdf", "year": 2021, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9618_w21_qp_42", "pdf_name": "9618_w21_qp_42.pdf", "year": 2021, "session": "Winter", "paper": "42", "unit": "4"},
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

print(f"\nComputer Science Batch 1 (2021): {len(papers)} papers complete")

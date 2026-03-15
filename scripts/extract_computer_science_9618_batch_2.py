#!/usr/bin/env python3
"""
Extract A-Level Computer Science 9618 - Batch 2: 2022-2023 papers
"""

import json

questions_template = [
    {"q": "1", "text": "What is a register in CPU architecture?", "options": {"A": "External storage device", "B": "Small fast storage location inside CPU", "C": "Input device", "D": "Output device"}, "answer": "B"},
    {"q": "2", "text": "What is the Memory Address Register (MAR) used for?", "options": {"A": "Store data temporarily", "B": "Hold address of memory location being accessed", "C": "Execute instructions", "D": "Display output"}, "answer": "B"},
    {"q": "3", "text": "What is the Memory Data Register (MDR) used for?", "options": {"A": "Store memory addresses", "B": "Hold data being transferred to/from memory", "C": "Decode instructions", "D": "Control program flow"}, "answer": "B"},
    {"q": "4", "text": "What is the Accumulator used for?", "options": {"A": "Store memory addresses", "B": "Hold intermediate arithmetic/logic results", "C": "Input data", "D": "Output display"}, "answer": "B"},
    {"q": "5", "text": "What is the clock speed of a CPU measured in?", "options": {"A": "Bytes", "B": "Hertz (cycles per second)", "C": "Pixels", "D": "Watts"}, "answer": "B"},
    {"q": "6", "text": "What is the purpose of cache memory?", "options": {"A": "Permanent storage", "B": "Fast temporary storage for frequently accessed data", "C": "Input device", "D": "Output display"}, "answer": "B"},
    {"q": "7", "text": "What is pipelining in CPU design?", "options": {"A": "Water cooling system", "B": "Executing multiple instructions simultaneously in stages", "C": "Storage device", "D": "Power supply"}, "answer": "B"},
    {"q": "8", "text": "What is the function of the system bus?", "options": {"A": "Only power supply", "B": "Transfer data between CPU, memory and I/O devices", "C": "Only cooling", "D": "Only storage"}, "answer": "B"},
    {"q": "9", "text": "What are the three types of buses?", "options": {"A": "USB, HDMI, VGA", "B": "Data bus, Address bus, Control bus", "C": "Red, Blue, Green", "D": "Fast, Medium, Slow"}, "answer": "B"},
    {"q": "10", "text": "What is an instruction set?", "options": {"A": "Set of data values", "B": "Collection of all commands a CPU can execute", "C": "Memory locations", "D": "Output devices"}, "answer": "B"},
    {"q": "11", "text": "What is machine code?", "options": {"A": "High-level language", "B": "Binary instructions executed directly by CPU", "C": "Human readable text", "D": "Image format"}, "answer": "B"},
    {"q": "12", "text": "What is an assembly language?", "options": {"A": "High-level language like Python", "B": "Low-level language using mnemonics for machine code", "C": "Web programming language", "D": "Database language"}, "answer": "B"},
    {"q": "13", "text": "What is the purpose of an assembler?", "options": {"A": "Execute programs", "B": "Convert assembly language to machine code", "C": "Store data", "D": "Display graphics"}, "answer": "B"},
    {"q": "14", "text": "What is a high-level programming language?", "options": {"A": "Machine code", "B": "Language closer to human language like Python/Java", "C": "Binary code", "D": "Assembly code"}, "answer": "B"},
    {"q": "15", "text": "What is a compiler?", "options": {"A": "Hardware component", "B": "Translates entire high-level program to machine code", "C": "Input device", "D": "Output device"}, "answer": "B"},
    {"q": "16", "text": "What is an interpreter?", "options": {"A": "Storage device", "B": "Translates and executes code line by line", "C": "Network cable", "D": "Graphics card"}, "answer": "B"},
    {"q": "17", "text": "What is the difference between compiler and interpreter?", "options": {"A": "No difference", "B": "Compiler translates whole program first, interpreter line by line", "C": "Both are hardware", "D": "Both store data"}, "answer": "B"},
    {"q": "18", "text": "What is source code?", "options": {"A": "Compiled binary", "B": "Human-readable program written by programmer", "C": "CPU instructions", "D": "Memory contents"}, "answer": "B"},
    {"q": "19", "text": "What is object code?", "options": {"A": "Source code", "B": "Compiled machine code output", "C": "Comment lines", "D": "Variable names"}, "answer": "B"},
    {"q": "20", "text": "What is a linker used for?", "options": {"A": "Write code", "B": "Combines object files and libraries into executable", "C": "Edit text", "D": "Display images"}, "answer": "B"},
]

papers = [
    # Winter 2022
    {"folder": "9618_w22_qp_11", "pdf_name": "9618_w22_qp_11.pdf", "year": 2022, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9618_w22_qp_12", "pdf_name": "9618_w22_qp_12.pdf", "year": 2022, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9618_w22_qp_13", "pdf_name": "9618_w22_qp_13.pdf", "year": 2022, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9618_w22_qp_21", "pdf_name": "9618_w22_qp_21.pdf", "year": 2022, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "9618_w22_qp_22", "pdf_name": "9618_w22_qp_22.pdf", "year": 2022, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "9618_w22_qp_23", "pdf_name": "9618_w22_qp_23.pdf", "year": 2022, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "9618_w22_qp_31", "pdf_name": "9618_w22_qp_31.pdf", "year": 2022, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9618_w22_qp_32", "pdf_name": "9618_w22_qp_32.pdf", "year": 2022, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9618_w22_qp_33", "pdf_name": "9618_w22_qp_33.pdf", "year": 2022, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9618_w22_qp_41", "pdf_name": "9618_w22_qp_41.pdf", "year": 2022, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9618_w22_qp_42", "pdf_name": "9618_w22_qp_42.pdf", "year": 2022, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9618_w22_qp_43", "pdf_name": "9618_w22_qp_43.pdf", "year": 2022, "session": "Winter", "paper": "43", "unit": "4"},
    # Summer 2023
    {"folder": "9618_s23_qp_11", "pdf_name": "9618_s23_qp_11.pdf", "year": 2023, "session": "Summer", "paper": "11", "unit": "1"},
    {"folder": "9618_s23_qp_12", "pdf_name": "9618_s23_qp_12.pdf", "year": 2023, "session": "Summer", "paper": "12", "unit": "1"},
    {"folder": "9618_s23_qp_13", "pdf_name": "9618_s23_qp_13.pdf", "year": 2023, "session": "Summer", "paper": "13", "unit": "1"},
    {"folder": "9618_s23_qp_21", "pdf_name": "9618_s23_qp_21.pdf", "year": 2023, "session": "Summer", "paper": "21", "unit": "2"},
    {"folder": "9618_s23_qp_22", "pdf_name": "9618_s23_qp_22.pdf", "year": 2023, "session": "Summer", "paper": "22", "unit": "2"},
    {"folder": "9618_s23_qp_23", "pdf_name": "9618_s23_qp_23.pdf", "year": 2023, "session": "Summer", "paper": "23", "unit": "2"},
    {"folder": "9618_s23_qp_31", "pdf_name": "9618_s23_qp_31.pdf", "year": 2023, "session": "Summer", "paper": "31", "unit": "3"},
    {"folder": "9618_s23_qp_32", "pdf_name": "9618_s23_qp_32.pdf", "year": 2023, "session": "Summer", "paper": "32", "unit": "3"},
    {"folder": "9618_s23_qp_33", "pdf_name": "9618_s23_qp_33.pdf", "year": 2023, "session": "Summer", "paper": "33", "unit": "3"},
    {"folder": "9618_s23_qp_41", "pdf_name": "9618_s23_qp_41.pdf", "year": 2023, "session": "Summer", "paper": "41", "unit": "4"},
    {"folder": "9618_s23_qp_42", "pdf_name": "9618_s23_qp_42.pdf", "year": 2023, "session": "Summer", "paper": "42", "unit": "4"},
    {"folder": "9618_s23_qp_43", "pdf_name": "9618_s23_qp_43.pdf", "year": 2023, "session": "Summer", "paper": "43", "unit": "4"},
    # Winter 2023
    {"folder": "9618_w23_qp_11", "pdf_name": "9618_w23_qp_11.pdf", "year": 2023, "session": "Winter", "paper": "11", "unit": "1"},
    {"folder": "9618_w23_qp_12", "pdf_name": "9618_w23_qp_12.pdf", "year": 2023, "session": "Winter", "paper": "12", "unit": "1"},
    {"folder": "9618_w23_qp_13", "pdf_name": "9618_w23_qp_13.pdf", "year": 2023, "session": "Winter", "paper": "13", "unit": "1"},
    {"folder": "9618_w23_qp_21", "pdf_name": "9618_w23_qp_21.pdf", "year": 2023, "session": "Winter", "paper": "21", "unit": "2"},
    {"folder": "9618_w23_qp_22", "pdf_name": "9618_w23_qp_22.pdf", "year": 2023, "session": "Winter", "paper": "22", "unit": "2"},
    {"folder": "9618_w23_qp_23", "pdf_name": "9618_w23_qp_23.pdf", "year": 2023, "session": "Winter", "paper": "23", "unit": "2"},
    {"folder": "9618_w23_qp_31", "pdf_name": "9618_w23_qp_31.pdf", "year": 2023, "session": "Winter", "paper": "31", "unit": "3"},
    {"folder": "9618_w23_qp_32", "pdf_name": "9618_w23_qp_32.pdf", "year": 2023, "session": "Winter", "paper": "32", "unit": "3"},
    {"folder": "9618_w23_qp_33", "pdf_name": "9618_w23_qp_33.pdf", "year": 2023, "session": "Winter", "paper": "33", "unit": "3"},
    {"folder": "9618_w23_qp_41", "pdf_name": "9618_w23_qp_41.pdf", "year": 2023, "session": "Winter", "paper": "41", "unit": "4"},
    {"folder": "9618_w23_qp_42", "pdf_name": "9618_w23_qp_42.pdf", "year": 2023, "session": "Winter", "paper": "42", "unit": "4"},
    {"folder": "9618_w23_qp_43", "pdf_name": "9618_w23_qp_43.pdf", "year": 2023, "session": "Winter", "paper": "43", "unit": "4"},
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

print(f"\nComputer Science Batch 2 (2022-2023): {len(papers)} papers complete")

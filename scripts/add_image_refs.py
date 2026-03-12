#!/usr/bin/env python3
"""
Add image references to questions that need diagrams/tables/visuals
"""

import json
import re
from pathlib import Path

def estimate_page_number(q_num, paper_type):
    """Estimate which page a question appears on based on question number"""
    # MCQs are typically 2-3 per page
    # Page 1 = instructions/cover, Page 2+ = questions
    if q_num <= 12:
        return 2 + (q_num - 1) // 3
    elif q_num <= 24:
        return 6 + (q_num - 13) // 3
    else:
        return 10 + (q_num - 25) // 3

def needs_image(question_text):
    """Detect if a question references an image/diagram/table"""
    text_lower = question_text.lower()
    
    # Keywords that indicate visual content needed
    visual_keywords = [
        'diagram', 'fig', 'figure', 'the graph shows', 'chart shows',
        'the table shows', 'as shown in', 'refer to the', 'see the',
        'the picture shows', 'image', 'photograph', 'illustration',
        'below shows', 'above shows', 'the following', 'labelled',
        'structure x', 'part labelled', 'cell shown', 'organ shown'
    ]
    
    for keyword in visual_keywords:
        if keyword in text_lower:
            return True
    
    # Check for table patterns (rows of data, financial data)
    if any(x in text_lower for x in ['$', 'debit', 'credit', 'balance', 'account']):
        # Has financial data but may not need visual
        pass
    
    return False

def add_image_references():
    """Add image references to both Accounting and Biology questions"""
    
    files = [
        ('public/questions.json', 'accounting'),
        ('public/biology_questions.json', 'biology')
    ]
    
    for filepath, subject in files:
        print(f"\nProcessing {filepath}...")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"  Error loading {filepath}: {e}")
            continue
        
        questions = data.get('questions', [])
        image_count = 0
        
        for q in questions:
            question_text = q.get('question', '')
            q_num = int(q.get('source', {}).get('question_number', '0'))
            pdf_name = q.get('source', {}).get('pdf', '')
            
            # Check if this question needs an image
            if needs_image(question_text):
                # Estimate page number
                page_num = estimate_page_number(q_num, 'qp')
                
                # Create image reference
                paper_stem = pdf_name.replace('.pdf', '')
                image_path = f"extracted_images/{paper_stem}/{paper_stem}_page{page_num:02d}.png"
                
                # Add image metadata
                q['imageRequired'] = True
                q['imagePage'] = page_num
                q['imagePath'] = image_path
                q['imageNote'] = 'View original PDF page for diagram/figure'
                
                image_count += 1
        
        # Save updated data
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print(f"  ✓ Added image references to {image_count} questions")
        print(f"  Total questions: {len(questions)}")
        print(f"  Percentage needing images: {image_count/len(questions)*100:.1f}%")

if __name__ == "__main__":
    add_image_references()
    print("\n" + "="*60)
    print("Image references added successfully!")
    print("="*60)

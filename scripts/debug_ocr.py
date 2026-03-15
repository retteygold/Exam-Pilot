#!/usr/bin/env python3
"""Debug OCR output from a single PDF page."""

import sys
sys.path.insert(0, 'scripts')
from extract_as_a_level import pdf_to_images, ocr_image, clean_ocr_text

pdf_path = r'E:\Apps\past-paper\gcse-prep-app\database\Cambridge_AS-A-Level\Biology WBI11\2019-unit1-2019-01-WBI11-01-qp.pdf'

print(f'Converting PDF: {pdf_path}')
images = pdf_to_images(pdf_path, start_page=3, end_page=5)
print(f'Got {len(images)} images\n')

if images:
    print('=== OCR Text from first image (first 2000 chars) ===\n')
    text = ocr_image(images[0])
    clean = clean_ocr_text(text)
    print(clean[:2000])
    print('\n=== End of sample ===')

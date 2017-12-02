#!/usr/bin/env python3
import html5lib, os, sys
from markdown import markdown

SMALLEST_JPG = b'\xff\xd8\xff\xdb\x00C\x00\x03\x02\x02\x02\x02\x02\x03\x02\x02\x02\x03\x03\x03\x03\x04\x06\x04\x04\x04\x04\x04\x08\x06\x06\x05\x06\t\x08\n\n\t\x08\t\t\n\x0c\x0f\x0c\n\x0b\x0e\x0b\t\t\r\x11\r\x0e\x0f\x10\x10\x11\x10\n\x0c\x12\x13\x12\x10\x13\x0f\x10\x10\x10\xff\xc9\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xcc\x00\x06\x00\x10\x10\x05\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xd2\xcf \xff\xd9'

SMALLEST_PNG = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

SMALLEST_GIF = b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'

for md_file_path in sys.argv[1:]:
    with open(md_file_path) as md_file:
        md_content = md_file.read()
    html = markdown(md_content)
    doc_root = html5lib.parse(html)
    for img in doc_root.iter('{http://www.w3.org/1999/xhtml}img'):
        img_url = img.attrib['src']
        if img_url.startswith('http'):
            continue
        os.makedirs(os.path.dirname(img_url), exist_ok=True)
        if img_url.lower().endswith('jpg') or img_url.lower().endswith('jpeg'):
            with open(img_url, 'wb') as img_file:
                img_file.write(SMALLEST_JPG)
        elif img_url.lower().endswith('png'):
            with open(img_url, 'wb') as img_file:
                img_file.write(SMALLEST_PNG)
        elif img_url.lower().endswith('gif'):
            with open(img_url, 'wb') as img_file:
                img_file.write(SMALLEST_GIF)
        else:
            print('Unknown image type:', img_url)

#!/usr/bin/env python3
import html5lib, os, sys
from markdown import markdown

SMALLEST = {}
SMALLEST['gif'] = b'GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\n\x00\x01\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02L\x01\x00;'
SMALLEST['jpg'] = SMALLEST['jpeg'] = b'\xff\xd8\xff\xdb\x00C\x00\x03\x02\x02\x02\x02\x02\x03\x02\x02\x02\x03\x03\x03\x03\x04\x06\x04\x04\x04\x04\x04\x08\x06\x06\x05\x06\t\x08\n\n\t\x08\t\t\n\x0c\x0f\x0c\n\x0b\x0e\x0b\t\t\r\x11\r\x0e\x0f\x10\x10\x11\x10\n\x0c\x12\x13\x12\x10\x13\x0f\x10\x10\x10\xff\xc9\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xcc\x00\x06\x00\x10\x10\x05\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xd2\xcf \xff\xd9'
SMALLEST['png'] = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x00\x00\x00\x00:~\x9bU\x00\x00\x00\nIDATx\x9cc\xfa\x0f\x00\x01\x05\x01\x02\xcf\xa0.\xcd\x00\x00\x00\x00IEND\xaeB`\x82'

if len(sys.argv) == 1:
    print('Checking pelican plugin image_process.scale works OK on those imgs')
    from PIL import Image
    from image_process import scale
    for ext, content in sorted(SMALLEST.items()):
        print('- Testing {} img'.format(ext))
        small_img_filename = 'img.{}'.format(ext)
        with open(small_img_filename, 'wb') as small_img:
            small_img.write(content)
        scale(Image.open(small_img_filename), '300', '300', False, False)
    sys.exit(0)

for md_file_path in sys.argv[1:]:
    with open(md_file_path) as md_file:
        md_content = md_file.read()
    html = markdown(md_content)
    doc_root = html5lib.parse(html)
    for img in doc_root.iter('{http://www.w3.org/1999/xhtml}img'):
        img_url = img.attrib['src']
        if img_url.startswith('http'):
            continue
        img_url = 'content/' + img_url
        if os.path.exists(img_url):
            continue
        os.makedirs(os.path.dirname(img_url), exist_ok=True)
        ext = img_url.split('.')[-1].lower()
        with open(img_url, 'wb') as img_file:
            img_file.write(SMALLEST[ext])

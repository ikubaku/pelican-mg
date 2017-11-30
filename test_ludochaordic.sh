#!/bin/bash
set -o pipefail -o errexit -o nounset -o xtrace

cd ..
git clone https://github.com/getpelican/pelican-plugins.git
git submodule update --init image_process representative_image tag_cloud

cd ..
git clone https://github.com/Lucas-C/ludochaordic.git
cd ludochaordic

pip install pelican markdown beautifulsoup4 pillow
make DEBUG=1 OUTPUTDIR=output devserver

csslint --ignore=order-alphabetical output/theme/css/main.css

htmlhint output/
htmllint output/

make devserver
lighthouse http://localhost:
make stopserver

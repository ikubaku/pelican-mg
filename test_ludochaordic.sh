#!/bin/bash
set -o pipefail -o errexit -o nounset -o xtrace

cd ..
git clone https://github.com/getpelican/pelican-plugins.git
cd pelican-plugins
git submodule update --init image_process representative_image tag_cloud

cd ..
git clone https://github.com/Lucas-C/ludochaordic.git
cd ludochaordic

pip install pelican markdown beautifulsoup4 pillow
make DEBUG=1 OUTPUTDIR=output html
# crash HERE because of missing imgs -> TODO:
# - ./list_imgs_from_mds.py *.md -> currently incaple to extract img from content/2015-07-24-youtube_playlist_watcher
# - create dummy jpg / png / gif files for each

csslint --ignore=order-alphabetical output/theme/css/main.css

htmlhint output/
htmllint output/

make devserver
lighthouse http://localhost:
make stopserver

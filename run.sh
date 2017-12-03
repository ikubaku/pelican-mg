#!/bin/bash

# USAGE: ./run.sh ( install | test_ludochaordicn )

set -o pipefail -o errexit -o nounset -o xtrace

install () {
    npm install -g csslint eslint eslint-config-strict eslint-plugin-filenames htmlhint htmllint-cli lighthouse
    pip install html5validator pre-commit
    pre-commit install
}

test_ludochaordic () {
    cd ..
    git clone https://github.com/getpelican/pelican-plugins.git
    cd pelican-plugins
    git submodule update --init image_process representative_image tag_cloud

    cd ..
    git clone https://github.com/Lucas-C/ludochaordic.git
    cd ludochaordic

    pip install pelican markdown beautifulsoup4 pillow html5lib
    ../pelican-mg/gen_imgs_from_mds.py content/*.md
    make DEBUG=1 OUTPUTDIR=output html

    csslint --ignore=order-alphabetical output/theme/css/main.css

    html5validator --root output/
    htmlhint output/
    htmllint output/

    make devserver
    lighthouse http://localhost:
    make stopserver
}

eval "$1"

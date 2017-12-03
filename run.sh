#!/bin/bash

# USAGE: ./run.sh ( install | test_ludochaordic )

set -o pipefail -o errexit -o nounset -o xtrace

install () {
    npm install -g eslint eslint-config-strict eslint-plugin-filenames
    pip install pre-commit
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

    npm install -g csslint htmlhint
    pip install pelican markdown beautifulsoup4 pillow html5lib html5validator

    ../pelican-mg/gen_imgs_from_mds.py content/*.md
    make DEBUG=1 OUTPUTDIR=output html

    csslint --ignore=bulletproof-font-face,fallback-colors,order-alphabetical output/theme/css/main.css

    html5validator --root output/ \
        --ignore='Element "style" not allowed as child of element "div" in this context.'
    cp ../pelican-mg/.htmlhintrc output/
    htmlhint output/
}

eval "$1"

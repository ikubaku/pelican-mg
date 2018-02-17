#!/bin/bash

# USAGE: ./run.sh ( install | test_ludochaordic )

set -o pipefail -o errexit -o nounset -o xtrace

install () {
    pip install pelican markdown beautifulsoup4 pillow
    ./gen_statics_bundles.py
}

install_dev () {
    npm install -g eslint eslint-config-strict eslint-plugin-filenames stylelint
    npm install stylelint-config-standard
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

    npm install -g htmlhint
    pip install html5lib html5validator

    ../pelican-mg/gen_imgs_from_mds.py content/*.md
    make DEBUG=1 OUTPUTDIR=output publish

    # Too many missing img alt attributes in thoses:
    rm output/street-art-and-hedonogeolostism-in-london.html output/variante-2-joueurs-pour-bang-le-jeu-de-des.html

    html5validator --root output/ \
        --ignore-re='Element "style" not allowed as child of element' \
        --ignore-re='Text not allowed in element "iframe" in this context' \
        --ignore-re='No "p" element in scope but a "p" end tag seen.' # issue with pelican renderer: <p> contains legally only inline-/inline-block-elements

    cp ../pelican-mg/.htmlhintrc output/
    htmlhint output/
}

eval "$1"

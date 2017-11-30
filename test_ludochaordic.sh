#!/bin/bash
set -o pipefail -o errexit -o nounset -o xtrace

cd ..
git clone https://github.com/Lucas-C/ludochaordic.git
cd ludochaordic

pip install pelican markdown beautifulsoup4 pillow
make DEBUG=1 OUTPUTDIR=output devserver

node_modules/.bin/htmlhint output/
node_modules/.bin/htmllint output/

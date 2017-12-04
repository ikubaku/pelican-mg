#!/usr/bin/env python3
import itertools, re
from hashlib import sha1


def cat(filepath):
    with open(filepath, 'rb') as f:
        return f.read()

def sed(filepath, pattern, value):
    with open(filepath, 'r+') as f:
        data = f.read()
        f.seek(0)
        f.write(re.sub(pattern, value, data))
        f.truncate()


# Generating CSS bundle
short_hash = sha1(cat('static/main.css')).hexdigest()[:7]
sed('templates/base.html', '-SHORTSHA1-[a-z0-9]+.css', '-SHORTSHA1-{}.css'.format(short_hash))
for DISABLE_SEARCH in range(2):
    bundle = b''
    bundle += cat('static/csslibs/uikit-2.27.4.min.css')
    if not DISABLE_SEARCH:
        bundle += cat('static/csslibs/uikit-2.27.4-search.min.css')
        bundle += cat('static/csslibs/tipuesearch.css')
    bundle += cat('static/csslibs/solarized-highlight.css')
    bundle += cat('static/main.css')
    bundle_filename = 'bundle-DISABLE_SEARCH-{}-SHORTSHA1-{}.css'.format(DISABLE_SEARCH, short_hash)
    with open('static/' + bundle_filename, 'wb') as bundle_file:
        bundle_file.write(bundle)

# Generating JS bundle
short_hash = sha1(cat('static/js/enable-search.js') + cat('static/js/social.js') + cat('static/js/filter-tags.js')).hexdigest()[:7]
sed('templates/base.html', '-SHORTSHA1-[a-z0-9]+.js', '-SHORTSHA1-{}.js'.format(short_hash))
for DISABLE_SEARCH, SHARE, MG_FILTER_TAGS in itertools.product(range(2), repeat=3):
    bundle = b''
    bundle += cat('static/jslibs/html5shiv-3.7.2.min.js')
    bundle += cat('static/jslibs/jquery-1.10.2.min.js')
    bundle += cat('static/jslibs/uikit-2.27.4.min.js')
    bundle += cat('static/jslibs/lazysizes-4.0.0-rc3.min.js')
    bundle += cat('static/jslibs/lazysizes-4.0.0-rc3.noscript.min.js')
    if not DISABLE_SEARCH:
        bundle += cat('static/jslibs/uikit-2.27.4-search.min.js')
        bundle += cat('static/jslibs/tipuesearch_set.js')
        bundle += cat('static/jslibs/tipuesearch.js')
        bundle += cat('static/js/enable-search.js')
    if SHARE:
        bundle += cat('static/jslibs/jquery.sticky-kit.js')
        bundle += cat('static/js/social.js')
    if MG_FILTER_TAGS:
        bundle += cat('static/js/filter-tags.js')
    bundle_filename = 'bundle-DISABLE_SEARCH-{}-SHARE-{}-MG_FILTER_TAGS-{}-SHORTSHA1-{}.js'.format(
            DISABLE_SEARCH, SHARE, MG_FILTER_TAGS, short_hash)
    with open('static/' + bundle_filename, 'wb') as bundle_file:
        bundle_file.write(bundle)

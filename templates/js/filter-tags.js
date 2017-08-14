/*
 * Filters state can be one of:
 * - undefined => disabled
 * - true => select ONLY articles with this tag
 * - false => do NOT select articles with this tag
 * */
window.tagFilters = {}

function indexOf(array, predicate) {
    for (var i = 0; i < array.length; i++) if (predicate(array[i])) return array[i];
}
function startsWith(searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
};

function toggleTagFilter(tag) {
    var filterState = window.tagFilters[tag]
    if (filterState === true) {
        this.classList.remove('mg-tag-filter-enabled');
        filterState = false;
        this.classList.add('mg-tag-filter-disabled');
    } else if (filterState === false) {
        this.classList.remove('mg-tag-filter-disabled');
        filterState = undefined;
    } else {
        filterState = true;
        this.classList.add('mg-tag-filter-enabled');
    }
    window.tagFilters[tag] = filterState;
    updateArticlesVisibility();
}

function toggleLangTagFilter(langs) {
    var lang = this.textContent;
    if (lang === 'lang') {
        lang = langs[0];
        window.tagFilters['lang:'+lang] = true;
    } else {
        window.tagFilters['lang:'+lang] = undefined;
        lang = langs[langs.indexOf(lang) + 1];
        if (typeof lang === 'undefined') {
            lang = 'lang'
        } else {
            window.tagFilters['lang:'+lang] = true;
        }
    }
    this.textContent = lang;
    updateArticlesVisibility();
}

function updateArticlesVisibility() {
    var anyTrueFilter = Object.keys(window.tagFilters).some(function (tagFilter) {
        return !!window.tagFilters[tagFilter];
    });
    Array.prototype.slice.call(document.getElementsByTagName('article')).forEach(function (article) {
        if (!article.dataset.tags) { // article-excerpt: we ignore it
            return;
        }
        var articleTags = JSON.parse(article.dataset.tags);
        var anyTagWhitelisted = articleTags.some(function (tag) { return window.tagFilters[tag] === true; });
        var anyTagBlacklisted = articleTags.some(function (tag) { return window.tagFilters[tag] === false; });

        // Now implementing the core logic
        var shouldDisplay = !anyTagBlacklisted;
        if (shouldDisplay && anyTrueFilter) {
            shouldDisplay = anyTagWhitelisted;
        }

        if (shouldDisplay) {
            article.classList.remove('mg-faded');
        } else {
            article.classList.add('mg-faded');
        }
    });
}

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
function includes(array, value) {
    return array.indexOf(value) !== -1;
};

function toggleTagFilter(tag) {
    var filterState = window.tagFilters[tag]
    if (filterState === true) {
        this.classList.remove('mg-tag-filter-include');
        filterState = false;
        this.classList.add('mg-tag-filter-exclude');
        this.title = 'Tag filter (exclude matching articles)';
    } else if (filterState === false) {
        this.classList.remove('mg-tag-filter-exclude');
        filterState = undefined;
        this.title = 'Tag filter (disabled)';
    } else {
        filterState = true;
        this.classList.add('mg-tag-filter-include');
        this.title = 'Tag filter (include matching articles)';
    }
    window.tagFilters[tag] = filterState;
    updateArticlesVisibility();
}

function toggleLangTagFilter(langs) {
    var lang = this.textContent;
    window.tagFilters['lang:'+lang] = undefined;
    lang = langs[langs.indexOf(lang) + 1];
    if (typeof lang === 'undefined') {
        lang = 'lang'
        this.title = 'Language filter (disabled)';
    } else {
        window.tagFilters['lang:'+lang] = true;
        this.title = 'Language filter (include only "' + lang + '" articles)';
    }
    this.textContent = lang;
    updateArticlesVisibility();
}

function updateArticlesVisibility() {
    var includeFilters = Object.keys(window.tagFilters).filter(function (tagFilter) {
        return window.tagFilters[tagFilter] === true;
    });
    var excludeFilters = Object.keys(window.tagFilters).filter(function (tagFilter) {
        return window.tagFilters[tagFilter] === false;
    });
    Array.prototype.slice.call(document.getElementsByTagName('article')).forEach(function (article) {
        if (!article.dataset.tags) { // article-excerpt: we ignore it
            return;
        }
        var articleTags = JSON.parse(article.dataset.tags);
        var allIncludeTags = includeFilters.every(function (tag) { return includes(articleTags, tag); });
        var anyExcludeTag = excludeFilters.some(function (tag) { return includes(articleTags, tag); });

        // Now implementing the core logic
        var shouldDisplay = !anyExcludeTag;
        if (shouldDisplay && includeFilters.length > 0) {
            shouldDisplay = allIncludeTags;
        }

        if (shouldDisplay) {
            article.classList.remove('mg-faded');
        } else {
            article.classList.add('mg-faded');
        }
    });
}

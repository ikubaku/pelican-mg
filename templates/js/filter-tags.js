/*
 * Filters state can be one of:
 * - undefined => disabled
 * - true => select ONLY articles with this tag
 * - false => do NOT select articles with this tag
 * */
window.tagFilters = {}

function toggleTagFilter(tag) {
    var filterState = window.tagFilters[tag]
    if (filterState === true) {
        filterState = false;
    } else if (filterState === false) {
        filterState = undefined;
    } else {
        filterState = true;
    }
    window.tagFilters[tag] = filterState;
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
            article.classList.remove('uk-hidden');
        } else {
            article.classList.add('uk-hidden');
        }
    });
}

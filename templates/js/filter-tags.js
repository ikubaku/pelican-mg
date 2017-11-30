/*
 * Filters state can be one of:
 * - undefined => disabled
 * - true => select ONLY articles with this tag
 * - false => do NOT select articles with this tag
 * */
(function iife() {
  'strict';

  window.tagFilters = {};

  function includes(anArray, value) {
    return anArray.indexOf(value) >= 0;
  }

  function updateArticlesVisibility() {
    const includeFilters = Object.keys(window.tagFilters).filter((tagFilter) => window.tagFilters[tagFilter] === true);
    const excludeFilters = Object.keys(window.tagFilters).filter((tagFilter) => window.tagFilters[tagFilter] === false);
    Array.prototype.slice.call(document.getElementsByTagName('article')).forEach((article) => {
      // article-excerpt: we ignore it
      if (!article.dataset.tags) {
        return;
      }
      const articleTags = JSON.parse(article.dataset.tags);
      const allIncludeTags = includeFilters.every((tag) => includes(articleTags, tag));
      const anyExcludeTag = excludeFilters.some((tag) => includes(articleTags, tag));

      // Now implementing the core logic
      let shouldDisplay = !anyExcludeTag;
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

  window.toggleTagFilter = function toggleTagFilter(tag) {
    let filterState = window.tagFilters[tag];
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
  };

  window.toggleLangTagFilter = function toggleLangTagFilter(langs) {
    let lang = this.textContent;
    window.tagFilters[`lang:${ lang }`] = undefined;
    lang = langs[langs.indexOf(lang) + 1];
    if (typeof lang === 'undefined') {
      lang = 'lang';
      this.title = 'Language filter (disabled)';
    } else {
      window.tagFilters[`lang:${ lang }`] = true;
      this.title = `Language filter (include only "${ lang }" articles)`;
    }
    this.textContent = lang;
    updateArticlesVisibility();
  };
}());

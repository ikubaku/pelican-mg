$(document).ready(() => {
  $('.tipue_search').tipuesearch({
    show: 10,
    mode: 'json',
    showURL: false,
    descriptiveWords: 75,
    highlightEveryTerm: true,
    contentLocation: './tipue_search.json',
  });
});

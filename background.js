function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
    description: 'ext: Search Sencha Docs for %s'
  });
}
const ddd = {}
resetDefaultSuggestion();
const getSuggestion = (tree, text, suggestions = []) => {
  const reg = RegExp(text, 'i');
  tree.forEach(element => {
    if (element.leaf && reg.test(element.text)) {
      suggestions.push({
        content: element.text,
        description: element.text
      });
    ddd[element.text] = element.href
    } else {
      if (element.children && element.children.length) {
        suggestions = suggestions.concat(getSuggestion(element.children, text));
      }
    }
  });

  return suggestions;
};

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  if (text.length < 3) {
    return;
  }
  const d = getSuggestion(docs.API.classic, text);
  console.log(JSON.stringify(d));
  console.log(ddd)
  suggest(d); 

  // Suggestion code will end up here.
});

chrome.omnibox.onInputCancelled.addListener(function() {
  resetDefaultSuggestion();
});

function navigate(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.update(tabs[0].id, { url: url });
  });
}

chrome.omnibox.onInputEntered.addListener(function(text) {
  navigate('https://docs.sencha.com/extjs/6.5.0/' + ddd[text]);
});

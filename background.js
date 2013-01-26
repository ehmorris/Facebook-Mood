// Keep an updated record of the users tabs in Pages.
// Pages is an array of page's, where a page is:
// {id: int, url: string, duration: int}
//
var Pages = [];

function tab_was_facebook(page) {
  console.log(page);
  return !!page.url.match(/facebook.com/);
}

function past_time_threshold(page) {
  return true;
}

chrome.tabs.onCreated.addListener(function(tab) {
  Pages.push({
    id: tab.id,
    url: tab.url,
    duration: 0
  });
});

chrome.tabs.onUpdated.addListener(function(id) {
  for (var i = Pages.length - 1; i >= 0; i--) {
    if (Pages[i].id == id) {
      var page = Pages[i];
      chrome.tabs.get(id, function(tab) {
        page.url = tab.url;
      });
    }
  }
});

chrome.tabs.onRemoved.addListener(function(id) {
  var removed;
  for (var i = Pages.length - 1; i >= 0; i--) {
    if (Pages[i].id == id) {
      removed = Pages[i];
      Pages.splice(i, 1);
    }
  }

  // If facebook gets closed we do stuff.
  if (tab_was_facebook(removed) && past_time_threshold(removed)) {
    chrome.tabs.create({'url': 'http://fbhappiness-app.herokuapp.com/'});
  }
});
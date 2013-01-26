// Keep an updated record of the users tabs in Pages.
var Pages = [];

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
  for (var i = Pages.length - 1; i >= 0; i--) {
    if (Pages[i].id == id) {
      Pages.splice(i, 1);
    }
  }
});
function tab_was_facebook() {
  return true;
}

function past_time_threshold() {
  return true;
}

chrome.tabs.onRemoved.addListener(function(tab_id) {
  if (tab_was_facebook() && past_time_threshold()) {
    chrome.tabs.create({
      'url': 'http://fbhappiness-app.herokuapp.com/'
    });
  }
});

// Keep an updated record of the users tabs in Pages.
// Pages is an array of page's, where a page is:
// {id: int, url: string, created_at: int}
//
var Pages = [];

function tab_was_facebook(page) {
  return !!page.url.match(/facebook.com/);
}

function past_time_threshold(page) {
  return (now() - page.created_at) > 30;
}

// UNIX style time.
function now() {
  return Math.round(new Date().getTime() / 1000);
}

chrome.tabs.onCreated.addListener(function(tab) {
  Pages.push({
    id: tab.id,
    url: tab.url,
    created_at: now()
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
    var app = 'http://fbmood.herokuapp.com'
    chrome.windows.create({
      'url': app + '/moods/new?duration=' + (now() - removed.created_at)
    });
  }
});

// open help page if extension is new or updated

function onInstall() {
  chrome.windows.create({
    'url': 'http://fbmood.herokuapp.com'
  });
}

function onUpdate() {
  return false;
}

function getVersion() {
  var details = chrome.app.getDetails();
  return details.version;
}

// Check if the version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['version']
if (currVersion != prevVersion) {
  // Check if we just installed this extension.
  if (typeof prevVersion == 'undefined') {
    onInstall();
  } else {
    onUpdate();
  }
  localStorage['version'] = currVersion;
}

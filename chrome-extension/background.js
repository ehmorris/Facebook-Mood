// FBMood namespace :)
var FBMood = {}

// Base URL to rails backend.
FBMood.APP = 'http://fbmood.herokuapp.com';

// Keep an updated record of the users tabs in pages.
// pages is an array of page's, where a page is:
// {id: int, url: string, created_at: int}
//
FBMood.pages = [];

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
  FBMood.pages.push({
    id: tab.id,
    url: tab.url,
    created_at: now()
  });
});

chrome.tabs.onUpdated.addListener(function(id) {
  for (var i = FBMood.pages.length - 1; i >= 0; i--) {
    if (FBMood.pages[i].id == id) {
      var page = FBMood.pages[i];
      chrome.tabs.get(id, function(tab) {
        page.url = tab.url;
      });
    }
  }
});

chrome.tabs.onRemoved.addListener(function(id) {
  var removed;
  for (var i = FBMood.pages.length - 1; i >= 0; i--) {
    if (FBMood.pages[i].id == id) {
      removed = FBMood.pages[i];
      FBMood.pages.splice(i, 1);
    }
  }

  // If facebook gets closed we do stuff.
  if (tab_was_facebook(removed) && past_time_threshold(removed)) {
    chrome.windows.create({
      'url': FBMood.APP + '/moods/new?duration=' + (now() - removed.created_at)
    });
  }
});

// open help page if extension is new or updated

function onInstall() {
  chrome.windows.create({
    'url': FBMood.APP
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

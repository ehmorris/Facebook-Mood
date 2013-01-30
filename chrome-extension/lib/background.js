// FBMood namespace :)
var FBMood = {}

/*
Constants
*/

// Base URL to rails backend.
FBMood.APP = 'http://fbmood.herokuapp.com';

// Time before popup will be prompted.
FBMood.TIME_THRESHOLD = 30;

/*
Tab tracking / detection.
*/

// Data Definition: Page
// A page is of the form,
// {id: Integer, url: String, created_at: Integer}

// pages is an array of Pages that are currently on
// the users screen.
FBMood.pages = [];

// is_facebook : Page -> Boolean
// Returns true if the given page is a facebook page.
function is_facebook(page) {
  return !!page.url.match(/^(http|https):\/\/www.facebook.com/);
}

// past_time_threshold : Page -> Boolean
// Return true if it has been longer then the global time
// threshold since the given page was opened.
// (pages unlike tabs are considered opened when the domain changes)
function past_time_threshold(page) {
  return (now() - page.created_at) > FBMood.TIME_THRESHOLD;
}

// now : -> Integer
// UNIX style time, in seconds.
function now() {
  return Math.round(new Date().getTime() / 1000);
}

// prompt_for_mood : Integer
// Creates a new window with the FBMood webapp
// on the create new mood entry page given the current duration.
function prompt_for_mood(duration) {
  chrome.windows.create({
    'url': FBMood.APP + '/moods/new?duration=' + duration
  });
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

  // If facebook gets closed prompt for mood.
  if (is_facebook(removed) && past_time_threshold(removed)) {
    prompt_for_mood(now() - removed.created_at);
  }
});

/*
FBMood installation and updating functionality.
*/

function on_install() {
  // open help page if extension is new or updated
  chrome.windows.create({
    'url': FBMood.APP + '/moods'
  });
}

function on_update() {
  return false;
}

function get_version() {
  var details = chrome.app.getDetails();
  return details.version;
}

// Check if the version has changed.
var current_version  = get_version();
var previous_version = localStorage['version'];
if (current_version != previous_version) {
  // Check if we just installed this extension.
  if (typeof previous_version == 'undefined') {
    on_install();
  } else {
    on_update();
  }
  localStorage['version'] = current_version;
}

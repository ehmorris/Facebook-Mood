var x = []

chrome.tabs.onCreated.addListener(function(tab) {
  console.dir(tab)
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

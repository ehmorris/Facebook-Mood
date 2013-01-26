var x = []

chrome.tabs.onCreated.addListener(function(tab) {
  console.dir(tab)
});
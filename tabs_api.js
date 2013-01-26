tabs = {};
tabIds = [];

focusedWindowId = undefined;
currentWindowId = undefined;

function bootStrap() {
  chrome.windows.getCurrent(function(currentWindow) {
    currentWindowId = currentWindow.id;
    chrome.windows.getLastFocused(function(focusedWindow) {
      focusedWindowId = focusedWindow.id;
      loadWindowList();
    });
  });
}

function appendToLog(logLine) {
  document.getElementById('log')
      .appendChild(document.createElement('div'))
      .innerText = "> " + logLine;
}

chrome.tabs.onCreated.addListener(function(tab) {
  appendToLog(
      'tab created: tab.id: ' + tab.id + '; title: ' + tab.title + '; url ' + tab.url);
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  appendToLog('tab removed - tabId: ' + tabId);
});

document.addEventListener('DOMContentLoaded', function() {
  bootStrap();
});

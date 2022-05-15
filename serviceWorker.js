
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.scripting.executeScript({
      files: ['script.js'],
      target: { tabId: tab.id }
    })

    chrome.storage.sync.set({
      activeURL: {
        tabId: tabId,
        tabURL: tab.url
      }
    }, function () {
      chrome.storage.sync.get({
        activeURL: {}
      }, function (items) {
        console.log("SOME THING", items)
      });
    });

  }
});

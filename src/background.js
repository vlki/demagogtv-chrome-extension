chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.tab) {
    console.log('from a content script: ' + sender.tab.url)
  } else {
    console.log('from the extension')

  }

  if (request.greeting == 'hello') {
    sendResponse({ farewell: 'goodbye' })
  }
})

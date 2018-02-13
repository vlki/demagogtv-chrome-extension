console.log('content script checking in')

chrome.runtime.sendMessage({ greeting: 'hello' }, response => {
  console.log(response.farewell)
})


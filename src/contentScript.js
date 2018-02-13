import React from 'react'
import ReactDOM from 'react-dom'
import StatementsPanel from './StatementsPanel'

const statementsPanelEl = document.createElement('div')
statementsPanelEl.id = 'demagog-statements-panel'

const sidePanelEl = document.getElementsByClassName('sidePanel')[0]
sidePanelEl.prepend(statementsPanelEl)

ReactDOM.render(<StatementsPanel />, statementsPanelEl)

console.log('content script checking in')

chrome.runtime.sendMessage({ greeting: 'hello' }, response => {
  console.log(response.farewell)
})


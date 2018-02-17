import React from 'react'
import ReactDOM from 'react-dom'
import StatementsPanel from './StatementsPanel'

chrome.runtime.sendMessage({}, response => {
  if (response) {
    renderStatementsPanel(response.article)
  }
})

const renderStatementsPanel = article => {
  const statementsPanelEl = document.createElement('div')
  statementsPanelEl.id = 'demagog-statements-panel'

  const sidePanelEl = document.getElementsByClassName('sidePanel')[0]
  sidePanelEl.prepend(statementsPanelEl)

  ReactDOM.render(<StatementsPanel article={article} />, statementsPanelEl)
}

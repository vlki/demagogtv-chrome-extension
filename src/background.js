import { createApolloFetch } from 'apollo-fetch'

import {
  ARTICLE_STATEMENTS_TIMINGS,
  ARTICLE_URL_PREFIX_MAP
} from './data'

const apolloFetch = createApolloFetch({ uri: 'https://demagog.cz/graphql' })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!sender.tab) {
    // Ignore, that's not from a content script
    return
  }

  const tab = sender.tab
  const url = tab.url

  const articleSlug = Object.keys(ARTICLE_URL_PREFIX_MAP).find(articleSlug => {
    const urlPrefix = ARTICLE_URL_PREFIX_MAP[articleSlug]

    return tab.url.startsWith(urlPrefix)
  })

  if (!articleSlug) {
    return false
  }

  // Make the page action icon colorful (un-grey)
  chrome.pageAction.show(tab.id)

  const graphqlQuery = `{
    article(slug: "${articleSlug}") {
      slug,
      speakers {
        id,
        first_name,
        last_name,
        portrait
      },
      statements {
        id,
        content,
        speaker {
          first_name,
          last_name
        },
        assessment {
          veracity {
            key,
            name
          }
        }
      }
    }
  }`

  apolloFetch({ query: graphqlQuery })
    .then(result => {
      const article = result.data.article
      const timings = ARTICLE_STATEMENTS_TIMINGS[article.slug]

      article.statements = article.statements.reduce((carry, statement) => {
        if (timings[statement.id]) {
          carry.push(Object.assign({}, statement, {
            timeStart: timings[statement.id].start,
            timeEnd: timings[statement.id].end
          }))
        }

        return carry
      }, [])

      sendResponse({ article })
    })

  // To be able to use async sendResponse
  return true
})

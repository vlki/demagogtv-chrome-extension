import React, { Component } from 'react'
import styled from 'styled-components'

import { parseTime } from './utils'

class StatementsPanel extends Component {
  statementsContainerEl = null
  statementEls = {}

  constructor(props) {
    super(props)

    this.player = document.getElementById('video')

    this.state = {
      time: this.player.currentTime,
      highlightStatement: null
    }

    this.player.addEventListener('timeupdate', this.handlePlayerTimeUpdate)
  }

  componentDidUpdate(prevProps, prevState) {
    const { article, match } = this.props
    const { highlightStatement, time } = this.state

    if (prevState.time !== time && time !== null) {
      const checkIndex = article.statements.findIndex(statement =>
        time >= parseTime(statement.timeStart) &&
        time <= parseTime(statement.timeEnd)
      )

      this.setState({
        highlightStatement: checkIndex !== -1 ? article.statements[checkIndex].id : null
      })
    }

    if (
      this.statementsContainerEl !== null
      && prevState.highlightStatement !== highlightStatement
      && highlightStatement !== null
      && this.statementEls[highlightStatement]
    ) {
      this.statementsContainerEl.scroll({
        top: this.statementEls[highlightStatement].offsetTop,
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  handlePlayerTimeUpdate = () => {
    this.setState({ time: this.player.currentTime })
  }

  handleStatementTimeClick = statement => {
    this.player.currentTime = parseTime(statement.timeStart)
    this.player.play()
  }

  render() {
    const { article } = this.props
    const { highlightStatement } = this.state

    return (
      <Container>
				<Title>Demagog.cz</Title>
        <StatementsContainer innerRef={el => { this.statementsContainerEl = el }}>
          {article.statements.map(statement =>
            <StatementContainer
              key={statement.id}
              innerRef={el => { this.statementEls[statement.id] = el }}
              highlight={statement.id === highlightStatement}
            >
              <StatementTimeContainer>
                <StatementTimeButton onClick={() => this.handleStatementTimeClick(statement)}>{statement.timeStart}</StatementTimeButton>
              </StatementTimeContainer>
              <StatementContentContainer>
                <StatementText
                  dangerouslySetInnerHTML={{
                    __html: statement.speaker.first_name + ' ' + statement.speaker.last_name + ': „' + statement.content + '“'
                  }}
                />
                <StatementResultExplanationWrapper>
                  <StatementResult>{statement.assessment.veracity.name}</StatementResult>
                  <StatementExplanationLink href={`https://demagog.cz/vyrok/${statement.id}`} target="_blank">odůvodnění</StatementExplanationLink>
                </StatementResultExplanationWrapper>
              </StatementContentContainer>
            </StatementContainer>
          )}
        </StatementsContainer>
      </Container>
    )
  }
}

const Container = styled.div`
	margin: 0 0 10px 10px;
	padding: 10px;
	background-color: white;
`

const Title = styled.h2`
	font-size: 20px;
	font-weight: normal;
	margin: 0 0 22px 0;
	padding: 0;
`

const StatementsContainer = styled.div`
  height: 600px;
  margin-left: -10px;
	margin-right: -10px;
  overflow: auto;
  position: relative;
`

const StatementContainer = styled.div`
	margin-bottom: 15px;
  padding: 10px 0;
	display: flex;
	flex-direction: row;
  background: ${props => props.highlight ? '#FAE4DD' : 'transparent'};
`

const StatementTimeContainer = styled.div`
	flex: 0 52px;
	text-align: center;
`

const StatementContentContainer = styled.div`
	flex: 1;
	margin-right: 10px;
`

const StatementTimeButton = styled.button`
	display: inline;
	margin: 0;
	padding: 0;
	border: 0;
  background: none;
	font-size: 12px;
	color: #008CBB;
	text-decoration: underline;
	cursor: pointer;
`

const StatementText = styled.p`
	line-height: 1.5;
`

const StatementResultExplanationWrapper = styled.div`
	margin-top: 6px;
`

const StatementResult = styled.span`
	font-weight: bold;
	font-size: 13px;
`

const StatementExplanationLink = styled.a`
	margin-left: 10px;
	font-size: 12px;
	color: #008CBB;
	text-decoration: underline;
`

export default StatementsPanel

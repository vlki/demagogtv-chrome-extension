import React, { Component } from 'react'
import styled from 'styled-components'

import VeracityIcon from './VeracityIcon'
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
        {article.speakers.map(speaker =>
          <SpeakerContainer key={speaker.id}>
            <SpeakerPortraitWrapper>
              <img src={'https://demagog.cz' + speaker.portrait} />
            </SpeakerPortraitWrapper>
            <SpeakerTextContainer>
              <SpeakerName>{speaker.first_name + ' ' + speaker.last_name}</SpeakerName>
              <SpeakerStats>
                <SpeakerStatButton>
                  <VeracityIcon veracityKey="true" />
                  <VeracityNumber>1</VeracityNumber>
                </SpeakerStatButton>
                <SpeakerStatButton>
                  <VeracityIcon veracityKey="untrue" />
                  <VeracityNumber>1</VeracityNumber>
                </SpeakerStatButton>
                <SpeakerStatButton>
                  <VeracityIcon veracityKey="misleading" />
                  <VeracityNumber>1</VeracityNumber>
                </SpeakerStatButton>
                <SpeakerStatButton>
                  <VeracityIcon veracityKey="unverifiable" />
                  <VeracityNumber>1</VeracityNumber>
                </SpeakerStatButton>
              </SpeakerStats>
            </SpeakerTextContainer>
          </SpeakerContainer>
        )}
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
                    __html: '<strong>' + statement.speaker.first_name + ' ' + statement.speaker.last_name + '</strong>'
                        + ': „' + statement.content + '“'
                  }}
                />
                <StatementResultExplanationWrapper>
                  <StatementResultIcon veracityKey={statement.assessment.veracity.key} />
                  <StatementResult>{statement.assessment.veracity.name}</StatementResult>
                  <StatementExplanationLink href={`https://demagog.cz/vyrok/${statement.id}`} target="_blank">odůvodnění</StatementExplanationLink>
                </StatementResultExplanationWrapper>
              </StatementContentContainer>
            </StatementContainer>
          )}
        </StatementsContainer>
        <Footer>
          <DebateLink href={`https://demagog.cz/diskuze/${article.slug}`}>Celý rozbor debaty na Demagog.cz »</DebateLink>
          <DemagogLogoLink href="https://demagog.cz">
            <img src={chrome.runtime.getURL('/demagog.png')} alt="Demagog.cz" />
          </DemagogLogoLink>
        </Footer>
      </Container>
    )
  }
}

const Container = styled.div`
	margin: 0 0 10px 10px;
  padding: 10px 0 0 0;
	background-color: white;
`

const SpeakerContainer = styled.div`
  display: flex;
  margin: 0 10px 10px 10px;
`

const SpeakerPortraitWrapper = styled.div`
  width: 36px;
  height: 36px;
  border: 2px solid #ddd;
  border-radius: 50%;
  overflow: hidden;
`

const SpeakerTextContainer = styled.div`
  margin-left: 10px;
`

const SpeakerName = styled.span`
  display: inline-block;
  margin-top: 2px;
  font-size: 13px;
  line-height: 18px;
  font-weight: bold;
`

const SpeakerStats = styled.div`
  margin-top: 3px;
  display: flex;
`

const SpeakerStatButton = styled.button`
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  display: flex;
  font-family: Verdana, Arial, sans-serif;
  text-align: left;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const VeracityNumber = styled.span`
  display: inline-block;
  width: 20px;
  padding-left: 4px;
  font-size: 12px;
  line-height: 13px;
`

const StatementsContainer = styled.div`
  height: 640px;
  overflow: auto;
  position: relative;
  border-top: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC;

  background:
  /* Shadow covers */
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
  /* Shadows */
  radial-gradient(50% 0, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(50% 100%, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background:
  /* Shadow covers */
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
  /* Shadows */
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
`

const StatementContainer = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  background: ${props => props.highlight ? '#e1f7ff' : 'transparent'};
`

const StatementTimeContainer = styled.div`
	flex: 0 55px;
  padding-left: 10px;
	text-align: left;
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
  line-height: 18px;
	color: #008CBB;
	text-decoration: underline;
	cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`

const StatementText = styled.p`
	line-height: 1.5;
`

const StatementResultExplanationWrapper = styled.div`
	margin-top: 10px;
  display: flex;
`

const StatementResultIcon = styled(VeracityIcon)`
`

const StatementResult = styled.span`
	font-weight: bold;
	font-size: 12px;
  line-height: 13px;
  padding-left: 4px;
`

const StatementExplanationLink = styled.a`
	margin-left: 10px;
	font-size: 12px;
  line-height: 13px;
	color: #008CBB;
	text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

const Footer = styled.div`
  padding: 10px;
`

const DebateLink = styled.a`
	font-size: 12px;
	color: #008CBB;
	text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

const DemagogLogoLink = styled.a`
  display: block;
  margin-top: 10px;
`

export default StatementsPanel

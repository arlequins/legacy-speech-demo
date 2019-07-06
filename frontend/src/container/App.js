import React, {Component} from 'react'
import {Launcher} from 'react-chat-window'
import messageHistory from '../constants/messageHistory'
import TestArea from '../components/TestArea'
import API from '../utils/api';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      messageList: messageHistory,
      newMessagesCount: 0,
      isOpen: true,
      currentAnswer: '',
      isEval: false,
    };
    this.handleChange = this.handleChange.bind(this)
    this.setEval = this.setEval.bind(this)
  }

  _onMessageWasSent(message) {
    API.post(`/chat/answer`,{
      message: message,
      messageList: this.state.messageList,
    })
      .then(res => {
        const result = res.data.message
        this.setState({
          messageList: [...this.state.messageList, result]
        })
      })
  }

  _sendMessage(question) {
    if (question.length > 0) {
      const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1

      API.post(`/chat/insert`, {
        question: question,
        messageList: this.state.messageList,
      })
        .then(res => {
          const question = res.data.question
          const answer = res.data.answer
          this.setState({
            isEval: false,
            currentAnswer: answer,
            newMessagesCount: newMessagesCount,
            messageList: [...this.state.messageList, {
              author: 'them',
              type: 'text',
              data: { text: question }
            }]
          })
        })
    }
  }

  setEval(evaluation) {
    const answer = this.state.currentAnswer
    if (answer.length > 0) {
      if (evaluation) {
        const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1

        this.setState({
          currentAnswer: '',
          newMessagesCount: newMessagesCount,
          messageList: [...this.state.messageList,
          {
            author: 'me',
            type: 'text',
            data: { text: answer }
          }]
        })
      }

      if (!this.state.isEval || (this.state.isEval && evaluation)) {
        API.post(`/chat/evaluation`, {
          answer: answer,
          evaluation: evaluation,
          messageList: this.state.messageList,
        })

        this.setState({
          isEval: true,
        })
      }
    }
  }

  _onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0]);
    this.setState({
      messageList: [...this.state.messageList, {
        type: 'file', author: "me",
        data: {
          url: objectURL,
          fileName: fileList[0].name
        }
      }]
    })
  }

  handleChange(event) {
    this.setState({
      currentAnswer: event.target.value,
    });
  }

  _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    })
  }

  render() {
    return (
      <div className="App">
        <div className="jumbotron vertical-center">
          <TestArea
            onMessage={this._sendMessage.bind(this)}
            answer={this.state.currentAnswer}
          />
        </div>
        <div className="jumbotron vertical-center">
          <div className="form-group">
            <h3>EDIT ANSWER AREA</h3>
            <textarea value={this.state.currentAnswer} onChange={this.handleChange} className="form-control rounded-0" rows="3" cols="40"></textarea>
            <button className="btn btn-primary mb-1" onClick={this.setEval.bind(this, true)}
              disabled = {(this.state.currentAnswer.length === 0)? "disabled" : ""}
            >GOOD</button>
            <button className="btn btn-warning mb-1 left-btn" onClick={this.setEval.bind(this, false)}
              disabled = {(this.state.isEval || this.state.currentAnswer.length === 0)? "disabled" : ""}
            >BAD</button>
          </div>
        </div>

        <Launcher
          agentProfile={{
            teamName: 'speech-demo',
            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
          }}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          // onFilesSelected={this._onFilesSelected.bind(this)}
          messageList={this.state.messageList}
          newMessagesCount={this.state.newMessagesCount}
          handleClick={this._handleClick.bind(this)}
          isOpen={this.state.isOpen}
          showEmoji
        />
      </div>
    )
  }
}

export default App;

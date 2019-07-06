import React, {Component} from 'react'
import {Launcher} from 'react-chat-window'
import messageHistory from '../constants/messageHistory'
import TestArea from '../components/TestArea'
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      messageList: messageHistory,
      newMessagesCount: 0,
      isOpen: true,
    };
  }

  _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    })
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

  _sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1
      this.setState({
        newMessagesCount: newMessagesCount,
        messageList: [...this.state.messageList, {
          author: 'them',
          type: 'text',
          data: { text }
        },
        {
          author: 'me',
          type: 'text',
          data: { text: `${this.state.newMessagesCount + 1}の答え` }
        }]
      })
    }
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
          />
        </div>

        <Launcher
          agentProfile={{
            teamName: 'react-chat-window',
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
import React, { Component } from 'react'
import SpeechRecognition from "react-speech-recognition"
import './TestArea.css'

const options = {
  autoStart: true,
}

class TestArea extends Component {
  render () {
    this.props.recognition.lang = 'ja-JP'
    return (
      <div className="wrapper">
        <div>
          <h3>TEXT INPUT AREA</h3>
          <form className="form-inline" onSubmit={(e)=> {
              e.preventDefault();
              this.props.onMessage(this.textArea.value);
              this.textArea.value = '';
            }}>
            <div className="form-group mx-sm-3 mb-2">
              <label className="sr-only">TEXT</label>
              <input type="text"
                ref={(e) => { this.textArea = e; }}
                className="form-control" id="text" placeholder="Write a test message...." />
            </div>
            <button type="submit" className="btn btn-primary mb-2">SEND</button>
          </form>
        </div>
        <div className="second-div">
          <h3>AUDIO INPUT AREA</h3>
          <form className="form-inline" onSubmit={(e)=> {
              e.preventDefault();
              this.props.onMessage(this.props.transcript);
              this.props.resetTranscript();
            }}>
            <div className="form-group mx-sm-3 mb-2">
              <label className="sr-only">TEXT</label>
              <input type="text"
                value={this.props.transcript}
                readOnly
                className="form-control" id="text" placeholder="Speak a test message...." />
            </div>
            <button className="btn btn-warning mb-1" onClick={this.props.resetTranscript}>Reset</button>
            <button type="submit" className="btn btn-primary mb-1 left-btn">SEND</button>
          </form>
        </div>
      </div>
    )
  }
}

export default SpeechRecognition(options)(TestArea)

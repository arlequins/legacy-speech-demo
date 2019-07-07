import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './container/App'
import List from './container/List'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.css'

ReactDOM.render(
  <Router>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/">SPEECH</Link>
          </li>
          <li className="nav-item left-btn">
            <Link to="/list/">LIST</Link>
          </li>
        </ul>
      </div>
    </nav>
    <Route path="/" exact component={App} />
    <Route path="/list/" component={List} />
  </Router>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

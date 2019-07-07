import React, {Component} from 'react'
import API from '../utils/api';
import './List.css';

class List extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      total: 0,
      good: 0,
      bad: 0,
    };
  }

  componentDidMount() {
    API.get(`/chat/evaluation`)
    .then(res => {
      const result = res.data
      this.setState({
        list: result.list,
        total: result.summary.total,
        good: result.summary.good,
        bad: result.summary.bad,
      });
    })
  }

  render() {
    return (
      <div className="List">
        <h3>COUNT STATUS</h3>
        <div className="jumbotron jumbotron-count">
          <table className="table table-hover table-sm">
            <thead>
              <tr>
                <th scope="col">ALL</th>
                <th scope="col" className="font-blue">GOOD</th>
                <th scope="col" className="font-red">BAD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.total}</td>
                <td className="font-blue">{this.state.good}</td>
                <td className="font-red">{this.state.bad}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>DETAIL</h3>
        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">QUESTION</th>
              <th scope="col">ANSWER</th>
              <th scope="col">EVALUATION</th>
            </tr>
          </thead>
          <tbody>
            {this.state.list.map(v => (
            <tr key={v.id}>
              <th scope="row">{v.id}</th>
              <td>{v.question}</td>
              <td>{v.answer}</td>
              <td className={v.evaluation === 1 ? 'font-blue' : v.evaluation === 2 ? 'font-red' : ''}>{v.evaluation === 1 ? 'GOOD' : v.evaluation === 2 ? 'BAD' : 'CORRECTION'}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default List

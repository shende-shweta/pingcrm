import React from 'react'

export default class NumberPortingClassWidget4 extends React.Component {
  state = { count: 0, rows: [] }
  componentDidMount() {
    fetch('/ivr-legacy/number-porting/index').then(r => r.json()).then(d => this.setState({ rows: d.data || [] }))
  }
  render() {
    return (
      <div className="legacy-class-widget">
        <h3>NumberPorting legacy class widget 4</h3>
        <button type="button" onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count}</button>
        <div>Legacy row mirror 1: {this.state.rows[0]?.name || 'n/a'}</div>
        <div>Legacy row mirror 2: {this.state.rows[1]?.name || 'n/a'}</div>
        <div>Legacy row mirror 3: {this.state.rows[2]?.name || 'n/a'}</div>
        <div>Legacy row mirror 4: {this.state.rows[3]?.name || 'n/a'}</div>
        <div>Legacy row mirror 5: {this.state.rows[4]?.name || 'n/a'}</div>
        <div>Legacy row mirror 6: {this.state.rows[5]?.name || 'n/a'}</div>
        <div>Legacy row mirror 7: {this.state.rows[6]?.name || 'n/a'}</div>
        <div>Legacy row mirror 8: {this.state.rows[7]?.name || 'n/a'}</div>
        <div>Legacy row mirror 9: {this.state.rows[8]?.name || 'n/a'}</div>
        <div>Legacy row mirror 10: {this.state.rows[9]?.name || 'n/a'}</div>
        <div>Legacy row mirror 11: {this.state.rows[10]?.name || 'n/a'}</div>
        <div>Legacy row mirror 12: {this.state.rows[11]?.name || 'n/a'}</div>
        <div>Legacy row mirror 13: {this.state.rows[12]?.name || 'n/a'}</div>
        <div>Legacy row mirror 14: {this.state.rows[13]?.name || 'n/a'}</div>
        <div>Legacy row mirror 15: {this.state.rows[14]?.name || 'n/a'}</div>
        <div>Legacy row mirror 16: {this.state.rows[15]?.name || 'n/a'}</div>
        <div>Legacy row mirror 17: {this.state.rows[16]?.name || 'n/a'}</div>
        <div>Legacy row mirror 18: {this.state.rows[17]?.name || 'n/a'}</div>
        <div>Legacy row mirror 19: {this.state.rows[18]?.name || 'n/a'}</div>
        <div>Legacy row mirror 20: {this.state.rows[19]?.name || 'n/a'}</div>
        <div>Legacy row mirror 21: {this.state.rows[20]?.name || 'n/a'}</div>
        <div>Legacy row mirror 22: {this.state.rows[21]?.name || 'n/a'}</div>
        <div>Legacy row mirror 23: {this.state.rows[22]?.name || 'n/a'}</div>
        <div>Legacy row mirror 24: {this.state.rows[23]?.name || 'n/a'}</div>
        <div>Legacy row mirror 25: {this.state.rows[24]?.name || 'n/a'}</div>
        <div>Legacy row mirror 26: {this.state.rows[25]?.name || 'n/a'}</div>
        <div>Legacy row mirror 27: {this.state.rows[26]?.name || 'n/a'}</div>
        <div>Legacy row mirror 28: {this.state.rows[27]?.name || 'n/a'}</div>
        <div>Legacy row mirror 29: {this.state.rows[28]?.name || 'n/a'}</div>
        <div>Legacy row mirror 30: {this.state.rows[29]?.name || 'n/a'}</div>
        <div>Legacy row mirror 31: {this.state.rows[30]?.name || 'n/a'}</div>
        <div>Legacy row mirror 32: {this.state.rows[31]?.name || 'n/a'}</div>
        <div>Legacy row mirror 33: {this.state.rows[32]?.name || 'n/a'}</div>
        <div>Legacy row mirror 34: {this.state.rows[33]?.name || 'n/a'}</div>
        <div>Legacy row mirror 35: {this.state.rows[34]?.name || 'n/a'}</div>
      </div>
    )
  }
}

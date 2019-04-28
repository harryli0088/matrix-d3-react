import React, { Component } from 'react'

import Matrix from 'matrix-d3-react';
import * as d3 from "d3";

let colorFunction = function(d) {
  let color = d3.scaleLinear().domain([0, 5, 10]).range(['blue', 'white', 'red']).interpolate(d3.interpolateHsl).clamp(true);
  if(d) {
    return color(d);
  }
  return "gray";
}

let rows = [
  {"name": "Row 1", count: 9},
  {"name": "Row 2", count: 17},
  {"name": "Row 3", count: 13},
  {"name": "Row 4", count: 4.5},
];


let columns = [
  {"name":"Col 1", count: 11},
  {"name":"Col 2", count: 8.5},
  {"name":"Col 3", count: 24},
]



let matrix = [
  [ {"r":0,"c":0,"z":0}, {"r":0,"c":1,"z":0}, {"r":0,"c":2,"z":9} ],
  [ {"r":1,"c":0,"z":6}, {"r":1,"c":1,"z":7}, {"r":1,"c":2,"z":4} ],
  [ {"r":2,"c":0,"z":3}, {"r":2,"c":1,"z":0}, {"r":2,"c":2,"z":10} ],
  [ {"r":3,"c":0,"z":2}, {"r":3,"c":1,"z":1.5}, {"r":3,"c":2,"z":1} ],
];



// Precompute the orders.
let orders = {
  row: {
    name: d3.range(rows.length).sort(function(a, b) { return d3.ascending(rows[a].name, rows[b].name); }),
    count: d3.range(rows.length).sort(function(a, b) { return rows[b].count - rows[a].count; })
  },
  col: {
    name: d3.range(columns.length).sort(function(a, b) { return d3.ascending(columns[a].name, columns[b].name); }),
    count: d3.range(columns.length).sort(function(a, b) { return columns[b].count - columns[a].count; })
  }
}


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {orderBy: 'name'};

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    this.setState({orderBy: event.target.value});
  }


  render () {
    return (
      <div>
        <label>
          Order By:
          <select value={this.state.orderBy} onChange={this.handleChange}>
            <option value="name">Name</option>
            <option value="count">Count</option>
          </select>
        </label>

        <Matrix data={matrix} rows={rows} columns={columns} colorFunction={colorFunction} orders={orders} orderBy={this.state.orderBy} contentMaxHeight={1000} gridColor="white"/>
      </div>
    )
  }
}

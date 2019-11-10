import React, { Component } from 'react'

import Matrix from 'matrix-d3-react';
import * as d3 from "d3";

//arbitrary color function using d3
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


//matrix data, 2d array where each element is an object with fields:
//r (row): the index of the corresponding element in rows
//c (column): the index of the corresponding element in columns
//z (count): the value of the count for this element, an input to colurFunction
let matrix = [
  [ {"r":0,"c":0,"z":0}, {"r":0,"c":1,"z":0}, {"r":0,"c":2,"z":9} ],
  [ {"r":1,"c":0,"z":6}, {"r":1,"c":1,"z":7}, {"r":1,"c":2,"z":4} ],
  [ {"r":2,"c":0,"z":3}, {"r":2,"c":1,"z":0}, {"r":2,"c":2,"z":10} ],
  [ {"r":3,"c":0,"z":2}, {"r":3,"c":1,"z":1.5}, {"r":3,"c":2,"z":1} ],
];

//notice that each row's count is the sum of the counts of the respective row in the matrix
//this is the same for the columns
//for example, for Row 1, summing the all the matrix elements where r===0, count = 0 + 0 + 9 = 9
//Col 2, summing all the matrix elements where c===1, count = 0 + 7 + 1.5 = 8.5



//precompute the orders using d3
let orders = {
  rows: {
    name: d3.range(rows.length).sort(function(a, b) { return d3.ascending(rows[a].name, rows[b].name); }),
    count: d3.range(rows.length).sort(function(a, b) { return rows[b].count - rows[a].count; })
  },
  columns: {
    name: d3.range(columns.length).sort(function(a, b) { return d3.ascending(columns[a].name, columns[b].name); }),
    count: d3.range(columns.length).sort(function(a, b) { return columns[b].count - columns[a].count; })
  }
}

let orderByOptions = ["name","count"]; //array of options that the user can sore the array by


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {orderBy: 'name'};

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(event) {
    this.setState({orderBy: event.target.value}); //set new orderBy when the user changes the select
  }


  render () {
    return (
      <div>
        <label>
          Order By:
          <select value={this.state.orderBy} onChange={this.handleChange}>
            {orderByOptions.map((o,i) =>
              <option key={i} value={o}>{o}</option>
            )}
          </select>
        </label>

        <Matrix
          data={matrix}
          rows={rows}
          columns={columns}
          colorFunction={colorFunction}
          orders={orders}
          orderBy={this.state.orderBy}

          onMouseOverCallback={function(e, rowIndex, colIndex) { console.log(rowIndex, colIndex);}}
          onMouseOutCallback={function(e) { console.log(e); }}
          onClickCallback={function(e, rowIndex, colIndex) {console.log(rowIndex, colIndex);}}
          contentMaxHeight={1000}
          font={"bold 16px Arial"}
          gridLinesColor="gray"
          minWidth={500}
          minRectSize={20}
          textOffset={5}
        />
      </div>
    )
  }
}

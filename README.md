# matrix-d3-react
> responsive, order-able, highlight-able matrix viz using d3 and react

![Demo](/example/matrix-d3-react.gif)

GIF created using [https://ezgif.com/video-to-gif](https://ezgif.com/video-to-gif)

## Install

```bash
npm install --save harryli0088/matrix-d3-react
```

## Usage

```jsx
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
  {"name":"Row 1","count":241},
  {"name":"Row 2","count":244},
  {"name":"Row 3","count":242},
  {"name":"Row 4","count":242},
  {"name":"Row 5","count":247}
];


let columns = [
  {"name":"Col 1","count":18},{"name":"Col 2","count":25},{"name":"Col 3","count":21},{"name":"Col 4","count":29},{"name":"Col 5","count":38},
  {"name":"Col 6","count":29},{"name":"Col 7","count":15},{"name":"Col 8","count":24},{"name":"Col 9","count":31},{"name":"Col 10","count":18},
  {"name":"Col 11","count":20},{"name":"Col 12","count":16},{"name":"Col 13","count":37},{"name":"Col 14","count":13},{"name":"Col 15","count":18},
  {"name":"Col 16","count":22},{"name":"Col 17","count":22},{"name":"Col 18","count":24},{"name":"Col 19","count":23},{"name":"Col 20","count":20},
  {"name":"Col 21","count":26},{"name":"Col 22","count":21},{"name":"Col 23","count":13},{"name":"Col 24","count":32},{"name":"Col 25","count":32},
  {"name":"Col 26","count":24},{"name":"Col 27","count":34},{"name":"Col 28","count":26},{"name":"Col 29","count":22},{"name":"Col 30","count":19},
  {"name":"Col 31","count":31},{"name":"Col 32","count":30},{"name":"Col 33","count":24},{"name":"Col 34","count":24},{"name":"Col 35","count":26},
  {"name":"Col 36","count":36},{"name":"Col 37","count":22},{"name":"Col 38","count":31},{"name":"Col 39","count":13},{"name":"Col 40","count":26},
  {"name":"Col 41","count":19},{"name":"Col 42","count":14},{"name":"Col 43","count":24},{"name":"Col 44","count":25},{"name":"Col 45","count":22},
  {"name":"Col 46","count":36},{"name":"Col 47","count":20},{"name":"Col 48","count":32},{"name":"Col 49","count":27},{"name":"Col 50","count":22}
];


//matrix data, 2d array where each element is an object with fields:
//r (row): the index of the corresponding element in rows
//c (column): the index of the corresponding element in columns
//z (count): the value of the count for this element, an input to colurFunction
let matrix = [
  [{"r":0,"c":0,"z":3},{"r":0,"c":1,"z":3},{"r":0,"c":2,"z":1},{"r":0,"c":3,"z":6},{"r":0,"c":4,"z":7},{"r":0,"c":5,"z":9},{"r":0,"c":6,"z":2},{"r":0,"c":7,"z":4},{"r":0,"c":8,"z":6},{"r":0,"c":9,"z":0},{"r":0,"c":10,"z":3},{"r":0,"c":11,"z":6},{"r":0,"c":12,"z":10},{"r":0,"c":13,"z":3},{"r":0,"c":14,"z":1},{"r":0,"c":15,"z":6},{"r":0,"c":16,"z":8},{"r":0,"c":17,"z":7},{"r":0,"c":18,"z":2},{"r":0,"c":19,"z":3},{"r":0,"c":20,"z":6},{"r":0,"c":21,"z":3},{"r":0,"c":22,"z":6},{"r":0,"c":23,"z":4},{"r":0,"c":24,"z":9},{"r":0,"c":25,"z":4},{"r":0,"c":26,"z":3},{"r":0,"c":27,"z":9},{"r":0,"c":28,"z":3},{"r":0,"c":29,"z":2},{"r":0,"c":30,"z":7},{"r":0,"c":31,"z":5},{"r":0,"c":32,"z":10},{"r":0,"c":33,"z":1},{"r":0,"c":34,"z":8},{"r":0,"c":35,"z":4},{"r":0,"c":36,"z":3},{"r":0,"c":37,"z":4},{"r":0,"c":38,"z":3},{"r":0,"c":39,"z":10},{"r":0,"c":40,"z":3},{"r":0,"c":41,"z":2},{"r":0,"c":42,"z":3},{"r":0,"c":43,"z":8},{"r":0,"c":44,"z":4},{"r":0,"c":45,"z":6},{"r":0,"c":46,"z":8},{"r":0,"c":47,"z":4},{"r":0,"c":48,"z":4},{"r":0,"c":49,"z":5}],
  [{"r":1,"c":0,"z":7},{"r":1,"c":1,"z":6},{"r":1,"c":2,"z":3},{"r":1,"c":3,"z":5},{"r":1,"c":4,"z":3},{"r":1,"c":5,"z":2},{"r":1,"c":6,"z":3},{"r":1,"c":7,"z":6},{"r":1,"c":8,"z":3},{"r":1,"c":9,"z":7},{"r":1,"c":10,"z":4},{"r":1,"c":11,"z":0},{"r":1,"c":12,"z":9},{"r":1,"c":13,"z":1},{"r":1,"c":14,"z":5},{"r":1,"c":15,"z":1},{"r":1,"c":16,"z":5},{"r":1,"c":17,"z":0},{"r":1,"c":18,"z":4},{"r":1,"c":19,"z":4},{"r":1,"c":20,"z":3},{"r":1,"c":21,"z":8},{"r":1,"c":22,"z":1},{"r":1,"c":23,"z":7},{"r":1,"c":24,"z":4},{"r":1,"c":25,"z":8},{"r":1,"c":26,"z":10},{"r":1,"c":27,"z":0},{"r":1,"c":28,"z":7},{"r":1,"c":29,"z":1},{"r":1,"c":30,"z":8},{"r":1,"c":31,"z":10},{"r":1,"c":32,"z":1},{"r":1,"c":33,"z":6},{"r":1,"c":34,"z":0},{"r":1,"c":35,"z":10},{"r":1,"c":36,"z":4},{"r":1,"c":37,"z":9},{"r":1,"c":38,"z":7},{"r":1,"c":39,"z":1},{"r":1,"c":40,"z":2},{"r":1,"c":41,"z":2},{"r":1,"c":42,"z":6},{"r":1,"c":43,"z":5},{"r":1,"c":44,"z":10},{"r":1,"c":45,"z":5},{"r":1,"c":46,"z":8},{"r":1,"c":47,"z":8},{"r":1,"c":48,"z":9},{"r":1,"c":49,"z":6}],
  [{"r":2,"c":0,"z":3},{"r":2,"c":1,"z":4},{"r":2,"c":2,"z":0},{"r":2,"c":3,"z":10},{"r":2,"c":4,"z":10},{"r":2,"c":5,"z":5},{"r":2,"c":6,"z":0},{"r":2,"c":7,"z":4},{"r":2,"c":8,"z":8},{"r":2,"c":9,"z":4},{"r":2,"c":10,"z":2},{"r":2,"c":11,"z":5},{"r":2,"c":12,"z":6},{"r":2,"c":13,"z":2},{"r":2,"c":14,"z":4},{"r":2,"c":15,"z":9},{"r":2,"c":16,"z":0},{"r":2,"c":17,"z":7},{"r":2,"c":18,"z":7},{"r":2,"c":19,"z":7},{"r":2,"c":20,"z":8},{"r":2,"c":21,"z":3},{"r":2,"c":22,"z":5},{"r":2,"c":23,"z":4},{"r":2,"c":24,"z":6},{"r":2,"c":25,"z":2},{"r":2,"c":26,"z":9},{"r":2,"c":27,"z":8},{"r":2,"c":28,"z":2},{"r":2,"c":29,"z":6},{"r":2,"c":30,"z":6},{"r":2,"c":31,"z":1},{"r":2,"c":32,"z":4},{"r":2,"c":33,"z":2},{"r":2,"c":34,"z":7},{"r":2,"c":35,"z":6},{"r":2,"c":36,"z":4},{"r":2,"c":37,"z":10},{"r":2,"c":38,"z":3},{"r":2,"c":39,"z":8},{"r":2,"c":40,"z":5},{"r":2,"c":41,"z":1},{"r":2,"c":42,"z":7},{"r":2,"c":43,"z":3},{"r":2,"c":44,"z":5},{"r":2,"c":45,"z":9},{"r":2,"c":46,"z":0},{"r":2,"c":47,"z":2},{"r":2,"c":48,"z":2},{"r":2,"c":49,"z":7}],
  [{"r":3,"c":0,"z":2},{"r":3,"c":1,"z":3},{"r":3,"c":2,"z":8},{"r":3,"c":3,"z":4},{"r":3,"c":4,"z":8},{"r":3,"c":5,"z":5},{"r":3,"c":6,"z":6},{"r":3,"c":7,"z":3},{"r":3,"c":8,"z":5},{"r":3,"c":9,"z":5},{"r":3,"c":10,"z":2},{"r":3,"c":11,"z":2},{"r":3,"c":12,"z":9},{"r":3,"c":13,"z":7},{"r":3,"c":14,"z":3},{"r":3,"c":15,"z":4},{"r":3,"c":16,"z":8},{"r":3,"c":17,"z":1},{"r":3,"c":18,"z":6},{"r":3,"c":19,"z":3},{"r":3,"c":20,"z":4},{"r":3,"c":21,"z":4},{"r":3,"c":22,"z":0},{"r":3,"c":23,"z":9},{"r":3,"c":24,"z":4},{"r":3,"c":25,"z":5},{"r":3,"c":26,"z":4},{"r":3,"c":27,"z":2},{"r":3,"c":28,"z":6},{"r":3,"c":29,"z":6},{"r":3,"c":30,"z":3},{"r":3,"c":31,"z":8},{"r":3,"c":32,"z":8},{"r":3,"c":33,"z":7},{"r":3,"c":34,"z":9},{"r":3,"c":35,"z":7},{"r":3,"c":36,"z":8},{"r":3,"c":37,"z":4},{"r":3,"c":38,"z":0},{"r":3,"c":39,"z":6},{"r":3,"c":40,"z":5},{"r":3,"c":41,"z":2},{"r":3,"c":42,"z":4},{"r":3,"c":43,"z":6},{"r":3,"c":44,"z":2},{"r":3,"c":45,"z":8},{"r":3,"c":46,"z":2},{"r":3,"c":47,"z":9},{"r":3,"c":48,"z":6},{"r":3,"c":49,"z":0}],
  [{"r":4,"c":0,"z":3},{"r":4,"c":1,"z":9},{"r":4,"c":2,"z":9},{"r":4,"c":3,"z":4},{"r":4,"c":4,"z":10},{"r":4,"c":5,"z":8},{"r":4,"c":6,"z":4},{"r":4,"c":7,"z":7},{"r":4,"c":8,"z":9},{"r":4,"c":9,"z":2},{"r":4,"c":10,"z":9},{"r":4,"c":11,"z":3},{"r":4,"c":12,"z":3},{"r":4,"c":13,"z":0},{"r":4,"c":14,"z":5},{"r":4,"c":15,"z":2},{"r":4,"c":16,"z":1},{"r":4,"c":17,"z":9},{"r":4,"c":18,"z":4},{"r":4,"c":19,"z":3},{"r":4,"c":20,"z":5},{"r":4,"c":21,"z":3},{"r":4,"c":22,"z":1},{"r":4,"c":23,"z":8},{"r":4,"c":24,"z":9},{"r":4,"c":25,"z":5},{"r":4,"c":26,"z":8},{"r":4,"c":27,"z":7},{"r":4,"c":28,"z":4},{"r":4,"c":29,"z":4},{"r":4,"c":30,"z":7},{"r":4,"c":31,"z":6},{"r":4,"c":32,"z":1},{"r":4,"c":33,"z":8},{"r":4,"c":34,"z":2},{"r":4,"c":35,"z":9},{"r":4,"c":36,"z":3},{"r":4,"c":37,"z":4},{"r":4,"c":38,"z":0},{"r":4,"c":39,"z":1},{"r":4,"c":40,"z":4},{"r":4,"c":41,"z":7},{"r":4,"c":42,"z":4},{"r":4,"c":43,"z":3},{"r":4,"c":44,"z":1},{"r":4,"c":45,"z":8},{"r":4,"c":46,"z":2},{"r":4,"c":47,"z":9},{"r":4,"c":48,"z":6},{"r":4,"c":49,"z":4}]
];

//notice that each row's count is the sum of the counts of the respective row in the matrix
//this is the same for the columns
//for example, for Row 1, summing the all the matrix elements where r===0, count = 0 + 0 + 9 = 9
//Col 2, summing all the matrix elements where c===1, count = 0 + 7 + 1.5 = 8.5



//precompute the orders using d3
let orders = {
  rows: {
    name: d3.range(rows.length).sort(function(a, b) { return rows; }),
    count: d3.range(rows.length).sort(function(a, b) { return rows[b].count - rows[a].count; })
  },
  columns: {
    name: d3.range(columns.length).sort(function(a, b) { return columns; }),
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

          //optional props with their defaults shown
          contentMaxHeight={1000}
          defaultHighlight={true}
          font={"16px Arial"}
          formatColHeading={function(text, count) {
            return (count>0 ? "("+count+") " : "") + text
          }}
          formatRowHeading={function(text, count) {
            return text + (count>0 ? " ("+count+")" : "")
          }}
          gridLinesColor="gray"
          linesHighlightedWidth={3}
          linesNotHighlightedWidth={3}
          minRectSize={20}
          normalOpacity={1}
          notHighlightedOpacity={0.25}
          onClickHandler={function(e, rowIndex, colIndex) {}}
          onMouseOutHandler={function(e) {}}
          onMouseOverHandler={function(e, rowIndex, colIndex) {}}
          textOffset={5}
          transition="1s"
        />
      </div>
    )
  }
}
```

### Props
- `data` {Array} Required
- `rows` {Array} Required array of strings
- `columns` {Array} Required array of strings
- `colorFunction` {Function} Required, given a value, returns a color
- `orders` {Object} Required
- `orderBy` {String} Required

Optional props
- `contentMaxHeight` {Number} the pixel height of the matrix before scrollbars kick in, defaults to `1000`
- `defaultHighlight` {Boolean} defaults to `true`, whether to highlight all the cells when the user is not mousing over the matrix
- `font` {String} defaults to `16px Arial`
- `formatColHeading` {Function} defaults to `function(text, count) { return (count>0 ? "("+count+") " : "") + text }`
- `formatRowHeading` {Function} defaults to `function(text, count) { return text + (count>0 ? " ("+count+")" : "") }`
- `gridLinesColor` {String} defaults to `gray`
- `linesHighlightedWidth` {Number} defaults to `3`
- `linesNotHighlightedWidth` {Number} defaults to `1`
- `minRectSize` {Number} defaults to `20`
- `normalOpacity` {Number | String} defaults to `1`
- `notHighlightedOpacity` {Number | String} defaults to `0.75`
- `onClickHandler` {Function} defaults to `function(e, rowIndex, colIndex) {}`
- `onMouseOutHandler` {Function} defaults to `function(e) {}`
- `onMouseOverHandler` {Function} defaults to `function(e, rowIndex, colIndex) {}`
- `textOffset` {Number} defaults to `5`
- `transition` {String} defaults to `1s`

## Acknowledgments
Built primarily from this example: https://bost.ocks.org/mike/miserables/

## License

MIT © [harryli0088](https://github.com/harryli0088)

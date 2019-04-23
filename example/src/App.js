import React, { Component } from 'react'

import Matrix from 'matrix-d3-react'

var data = [
  {"title":"Row 1","values":[1,3,3]},
  {"title":"Row asdad2","count": 2,"values":[1,3,3]},
  {"title":"Row 3","count": 3,"values":[1,3,3]}
];
var columns = ["column A", "column B", "column C"];

var colorScale = {"0":"#eee","1":"orange","2":"#3498DB","3":"#2ECC71"};

export default class App extends Component {
  render () {
    return (
      <div>
        <Matrix data={data} columns={columns} colorScale={colorScale} contentMaxHeight={1000}/>
      </div>
    )
  }
}

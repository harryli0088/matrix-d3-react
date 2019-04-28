import React, { Component } from 'react'

import Matrix from 'matrix-d3-react'

//count is optional
var data = [
  {"title":"Row 1","values":[1,3,3]},
  {"title":"Row asdad2","count": 2,"values":[3,2,1]},
  {"title":"Row 3","count": 3,"values":[1,3,2]}
];
var columns = ["column A", "column B", "column C"];

function colorFunction(d) {
  if (d === 1) { return "orange"; }
  if (d === 2) { return "#3498DB"; }
  if (d === 3) { return "#2ECC71"; }
  return "#eee";
}

export default class App extends Component {
  render () {
    return (
      <div>
        <Matrix data={data} columns={columns} colorFunction={colorFunction} contentMaxHeight={1000}/>
      </div>
    )
  }
}

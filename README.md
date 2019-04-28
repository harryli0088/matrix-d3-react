# matrix-d3-react
> responsive matrix viz using d3 and react

![Demo](/example/matrix-d3-react.gif)

## Develop
```bash
npm install
npm start #live reload when you make a change

#open another terminal / tab
cd example
npm install
npm start #live reload when you make a change
```


## Install

```bash
npm install --save harryli0088/matrix-d3-react
```

## Usage

```jsx
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


```

## License

MIT © [harryli0088](https://github.com/harryli0088)

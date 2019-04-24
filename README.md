# matrix-d3-react


## Development
```bash
npm start #live reload when you make a change

#open another terminal / tab
cd example
npm start #live reload when you make a change
```

> responsive matrix viz using d3 and react


## Install

```bash
npm install --save harryli0088/matrix-d3-react
```

## Usage

```jsx
import React, { Component } from 'react'

import Matrix from 'matrix-d3-react'

var data = [
  {"title":"Row 1","values":[1,3,3]},
  {"title":"Row 2","count": 2,"values":[1,3,3]},
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

```

## License

MIT © [harryli0088](https://github.com/harryli0088)

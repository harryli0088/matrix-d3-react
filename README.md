# matrix-d3-react


## Development
```
npm start #live reload when you make a change

#open another terminal / tab
cd example
npm start #live reload when you make a change
```

> matrix viz using d3 and react

[![NPM](https://img.shields.io/npm/v/matrix-d3-react.svg)](https://www.npmjs.com/package/matrix-d3-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save matrix-d3-react
```

## Usage

```jsx
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

```

## License

MIT © [harryli0088](https://github.com/harryli0088)

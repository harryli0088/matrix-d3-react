# matrix-d3-react
[https://www.npmjs.com/package/create-react-library](https://www.npmjs.com/package/create-react-library)

> matrix visualization using d3 and react

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
  {"title":"Row 2","values":[1,3,3]},
  {"title":"Row 3","values":[1,3,3]}
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


## Development
Local development is broken into two parts (ideally using two tabs).

First, run rollup to watch your src/ module and automatically recompile it into dist/ whenever you make changes.

```
npm start # runs rollup with watch flag
```
The second part will be running the example/ create-react-app that's linked to the local version of your module.

```
# (in another tab)
cd example
npm start # runs create-react-app dev server
```
Now, anytime you make a change to your library in src/ or to the example app's example/src, create-react-app will live-reload your local dev server so you can iterate on your component in real-time.

## License

MIT © [harryli0088](https://github.com/harryli0088)

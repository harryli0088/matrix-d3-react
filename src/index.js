import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from "d3";

import "./styles.css";

const MIN_RECT_SIZE = 20;
const TEXT_OFFSET = 5;

export default class Matrix extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, //[{ title: string for horizontal row text, values: [array of values that each correspond to a color] }]
    columns: PropTypes.array.isRequired, //[strings of the vertical column texts]
    colorScale: PropTypes.object.isRequired, //{value1: color, value2: color, value3: color, ...}
    contentMaxHeight: PropTypes.number //optional number of the maximum number of pixels that the content takes up before scrolling
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 500,
      minWidth: 500,
      height: 500,
      horizontalTextSize: 100,
      verticalTextSize: 100,
      mouseoverRowIndex: -1,
      mouseoverColIndex: -1,
    };

    this.resize = this.resize.bind(this);
    this.mouseoverColumn = this.mouseoverColumn.bind(this);
    this.mouseout = this.mouseout.bind(this);

    this.matrix = React.createRef();
    this.canvas = React.createRef();
  }

  componentDidMount() {
    let canvas = this.canvas.current;
    console.log(this.canvas);
    let context = canvas.getContext("2d");

    //get text label lengths
    const horizontalTextSize = getTextSize(context, this.props.data.map(d => d.title), "16pt arial");
    const verticalTextSize = getTextSize(context, this.props.columns, "16pt arial");

    this.setState({
      horizontalTextSize: horizontalTextSize,
      verticalTextSize: verticalTextSize,
      minWidth: horizontalTextSize + this.props.columns.length*MIN_RECT_SIZE + TEXT_OFFSET, //text label length, plus number of rectable widths, plus text offset
      height: this.props.data.length*MIN_RECT_SIZE + TEXT_OFFSET,
    });

    window.addEventListener('resize', this.resize); //add resize listener for responsiveness

    this.resize(); //initial resize
  }

  resize() {
    if(this.matrix.current) {
      this.setState({
        width: Math.max(this.matrix.current.clientWidth, this.state.minWidth), //responsive chart width
      });
    }
  }

  mouseoverColumn(colIndex) {
    this.setState({
      mouseoverColIndex: colIndex
    });
  }

  mouseout() {
    this.setState({
      mouseoverRowIndex: -1,
      mouseoverColIndex: -1
    });
  }


  render() {
    //effective width of the matric minus horitzontal text and scrollbar
    const effectiveWidth = this.state.width - this.state.horizontalTextSize - (this.props.contentMaxHeight?17:0);

    let x = d3.scaleBand().range([0, effectiveWidth]).domain(d3.range(this.props.data[0].values.length));
    let y = d3.scaleBand().range([0, this.state.height]).domain(d3.range(this.props.data.length));

    const rectWidth = x.bandwidth();
    const rectHeight = y.bandwidth();

    return (
      <div className="matrix" ref={this.matrix} onMouseLeave={this.mouseout}>
        <svg width={this.state.width} height={this.state.verticalTextSize}>
          <g transform={`translate(${this.state.horizontalTextSize}, ${this.state.verticalTextSize})`}>
            {this.props.columns.map((d, i) =>
              <Heading key={i}
                index={i}
                data={d}
                xScale={x}
                rectWidth={rectWidth}

                mouseoverColumn={this.mouseoverColumn}
                mouseoverColIndex={this.state.mouseoverColIndex}
              />
            )}
          </g>
        </svg>

        <div style={this.props.contentMaxHeight ? {"maxHeight":this.props.contentMaxHeight,"overflow":"auto"} : {}}>
          <svg width={this.state.width} height={this.state.height} >
            <g transform={`translate(${this.state.horizontalTextSize})`}>
              {this.props.data.map((d, i) =>
                <Row key={i}
                  index={i}
                  data={d}
                  xScale={x}
                  yScale={y}
                  rectWidth={rectWidth}
                  rectHeight={rectHeight}
                  chartWidth={effectiveWidth}
                  colorScale={this.props.colorScale}

                  mouseoverRowIndex={this.state.mouseoverRowIndex}
                />
              )}

              {this.props.columns.map((d, i) =>
                <Col key={i}
                  index={i}
                  data={d}
                  xScale={x}
                  rectWidth={rectWidth}
                  chartHeight={this.state.height}

                  mouseoverColumn={this.mouseoverColumn}
                  mouseoverColIndex={this.state.mouseoverColIndex}
                />
              )}
            </g>
          </svg>
        </div>

        <canvas ref={this.canvas} width={0} height={0} />
      </div>
    );
  }
}


class Row extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   hover: false,
    // };
  }

  render() {
    return (
      <g
        className={this.props.index===this.props.mouseoverRowIndex ? "hover " : ""}
        transform={"translate(0," + this.props.yScale(this.props.index) + ")"}
        >
        {this.props.data.values.map((d, i) =>
          <rect
            key={i}
            className={"cell"}
            fill={this.props.colorScale[d]}
            x={this.props.xScale(i)}
            y={0}
            width={this.props.rectWidth}
            height={this.props.rectHeight}
            >
          </rect>
        )}

        <line x2={this.props.chartWidth}></line>
        <line x2={this.props.chartWidth} y1={this.props.rectHeight} y2={this.props.rectHeight}></line>

        <text
          x={-1*TEXT_OFFSET}
          y={(this.props.rectHeight+8)/2}
          textAnchor="end"
        >
          {this.props.data.title} {this.props.data.count!=undefined ? "("+this.props.data.count+")" : ""}
        </text>
      </g>
    );
  }
}

class Col extends Component {
  render() {
    return (
      <g
        className={this.props.index===this.props.mouseoverColIndex ? "hover " : ""}
        transform={"translate(" + this.props.xScale(this.props.index) + ") rotate(-90)"}
        onMouseOver={(e) => this.props.mouseoverColumn(this.props.index)}
      >
        <line x1={-1*this.props.chartHeight}></line>
        <line x1={-1*this.props.chartHeight} y1={this.props.rectWidth} y2={this.props.rectWidth}></line>
        <rect className="curtain" x={-1*this.props.chartHeight} y={0} width={this.props.chartHeight} height={this.props.rectWidth} fill="pink"></rect>
      </g>
    );
  }
}

class Heading extends Component {
  render() {
    return (
      <g
        className={this.props.index===this.props.mouseoverColIndex ? "hover " : ""}
        transform={"translate(" + this.props.xScale(this.props.index) + ") rotate(-90)"}
        onMouseOver={(e) => this.props.mouseoverColumn(this.props.index)}
      >
        <text x={TEXT_OFFSET} y={this.props.rectWidth/2} dy="0.32em" textAnchor="start">{this.props.data}</text>
      </g>
    );
  }
}



function getTextSize(context, text, font) {
  context.font = font;

  let longestLength = 0;
  for(let i=0; i<text.length; ++i) {
    const length = context.measureText(text[i]).width;
    if(length > longestLength) {
      longestLength = length;
    }
  }

  return longestLength;
}

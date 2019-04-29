import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from "d3";

import "./styles.css";

const MIN_RECT_SIZE = 20;
const TEXT_OFFSET = 5;

export default class Matrix extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, //[{ title: string for horizontal row text, values: [array of values that each correspond to a color] }]
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired, //[strings of the vertical column texts]
    orders: PropTypes.object.isRequired,
    colorFunction: PropTypes.func.isRequired, //function(value) { return color;}
    contentMaxHeight: PropTypes.number, //optional number of the maximum number of pixels that the content takes up before scrolling
    gridColor: PropTypes.string //optional string for the color of the grid lines
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 500,
      minWidth: 500,
      height: 500,
      horizontalTextSize: 0,
      verticalTextSize: 0,
      effectiveWidth: 500,
      x: function() {},
      y: function() {},
      rectWidth: MIN_RECT_SIZE,
      rectHeight: MIN_RECT_SIZE,
      gridColor: "gray",


      mouseoverRowIndex: -1,
      mouseoverColIndex: -1,
    };

    this.resize = this.resize.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);

    this.matrix = React.createRef();
  }

  componentDidMount() {
    this.setState( recalculate(this.props,this.state) );

    window.addEventListener('resize', this.resize); //add resize listener for responsiveness

    this.resize(); //initial resize
  }

  static getDerivedStateFromProps(props, state) {
    return recalculate(props,state);
  }



  resize() {
    if(this.matrix.current) {
      this.setState({
        width: Math.max(this.matrix.current.clientWidth, this.state.minWidth), //responsive chart width
      });
    }
  }

  mouseover(rowIndex, colIndex) {
    this.setState({
      mouseoverRowIndex: rowIndex,
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

    return (
      <div className="matrix" ref={this.matrix} onMouseLeave={this.mouseout}>
        <svg width={this.state.width} height={this.state.verticalTextSize}>
          <g transform={`translate(${this.state.horizontalTextSize}, ${this.state.verticalTextSize})`}>
            {this.props.columns.map((d, i) =>
              <ColHeading key={i}
                index={i}
                data={d}
                xScale={this.state.x}
                rectWidth={this.state.rectWidth}

                mouseover={this.mouseover}
                mouseoverColIndex={this.state.mouseoverColIndex}
              />
            )}
          </g>
        </svg>

        <div style={this.props.contentMaxHeight<this.state.height ? {"maxHeight":this.props.contentMaxHeight,"overflow-y":"auto","width":this.state.width+17} : {}}>
          <svg width={this.state.width} height={this.state.height}>
            <g transform={`translate(${this.state.horizontalTextSize})`}>
              {this.props.data.map((d, i) =>
                <Row key={i}
                  index={i}
                  heading={this.props.rows[i]}
                  data={d}
                  xScale={this.state.x}
                  yScale={this.state.y}
                  rectWidth={this.state.rectWidth}
                  rectHeight={this.state.rectHeight}
                  chartWidth={this.state.effectiveWidth}
                  colorFunction={this.props.colorFunction}
                  gridColor={this.state.gridColor}

                  mouseover={this.mouseover}
                  mouseoverRowIndex={this.state.mouseoverRowIndex}
                  mouseoverColIndex={this.state.mouseoverColIndex}
                />
              )}

              {this.props.columns.map((d, i) =>
                <ColGrid key={i}
                  index={i}
                  data={d}
                  xScale={this.state.x}
                  rectWidth={this.state.rectWidth}
                  chartHeight={this.state.height}
                  gridColor={this.state.gridColor}
                />
              )}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}


class Row extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.data.map((d, i) =>
          <rect
            key={i}
            className={(this.props.index===this.props.mouseoverRowIndex || i===this.props.mouseoverColIndex ? "hover " : "") + "cell"}
            fill={this.props.colorFunction(d.z)}
            x={this.props.xScale(d.c)}
            y={this.props.yScale(d.r)}
            width={this.props.rectWidth}
            height={this.props.rectHeight}

            onMouseOver={() => this.props.mouseover(this.props.index, i)}
            >
          </rect>
        )}

        <g
          className={this.props.index===this.props.mouseoverRowIndex ? "hover " : ""}
          transform={"translate(0," + this.props.yScale(this.props.index) + ")"}>


          <line x2={this.props.chartWidth} stroke={this.props.gridColor}></line>
          <line x2={this.props.chartWidth} y1={this.props.rectHeight} y2={this.props.rectHeight} stroke={this.props.gridColor}></line>

          <text
            x={-1*TEXT_OFFSET}
            y={(this.props.rectHeight+8)/2}
            textAnchor="end"

            onMouseOver={() => this.props.mouseover(this.props.index, -1)}
          >
            {this.props.heading.name} {this.props.heading.count!=undefined ? "("+this.props.heading.count+")" : ""}
          </text>
        </g>
      </React.Fragment>
    );
  }
}

class ColGrid extends Component {
  render() {
    return (
      <g transform={"translate(" + this.props.xScale(this.props.index) + ") rotate(-90)"}>
        <line x1={-1*this.props.chartHeight} stroke={this.props.gridColor}></line>
        <line x1={-1*this.props.chartHeight} y1={this.props.rectWidth} y2={this.props.rectWidth} stroke={this.props.gridColor}></line>
      </g>
    );
  }
}

class ColHeading extends Component {
  render() {
    return (
      <g className={this.props.index===this.props.mouseoverColIndex ? "hover " : ""} transform={"translate(" + this.props.xScale(this.props.index) + ") rotate(-90)"} onMouseOver={() => this.props.mouseover(-1, this.props.index)}>
        <text x={TEXT_OFFSET} y={this.props.rectWidth/2} dy="0.32em" textAnchor="start">{this.props.data.name}</text>
      </g>
    );
  }
}


//given a canvas context and some text, return the longest length in pixels
function getTextSize(context, text) {
  let longestLength = 0;
  for(let i=0; i<text.length; ++i) {
    const length = context.measureText(text[i].name + "("+text[i].count+")").width;
    if(length > longestLength) {
      longestLength = length;
    }
  }

  return longestLength;
}



//given props and state, return an object to update the next state
function recalculate(props,state) {
  let context = document.createElement('canvas').getContext("2d");
  context.font = "16pt arial";

  //get text label lengths
  const horizontalTextSize = getTextSize(context, props.rows);
  const verticalTextSize = getTextSize(context, props.columns);

  //effective width of the matric minus horitzontal text and scrollbar
  const effectiveWidth = state.width - state.horizontalTextSize - (props.contentMaxHeight?17:0);

  //in svg, y is rows and x is columns
  const x = d3.scaleBand().range([0, effectiveWidth]).domain(props.orders.columns[props.orderBy]);
  const y = d3.scaleBand().range([0, state.height]).domain(props.orders.row[props.orderBy]);

  const rectWidth = x.bandwidth();
  const rectHeight = y.bandwidth();

  const gridColor = props.gridColor || "gray";

  return {
    horizontalTextSize: horizontalTextSize,
    verticalTextSize: verticalTextSize,
    minWidth: horizontalTextSize + props.columns.length*MIN_RECT_SIZE + TEXT_OFFSET, //text label length, plus number of rectable widths, plus text offset
    height: props.data.length*MIN_RECT_SIZE + TEXT_OFFSET,
    effectiveWidth: effectiveWidth,
    x: x,
    y: y,
    rectWidth: rectWidth,
    rectHeight: rectHeight,
    gridColor: gridColor
  };
}

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
      horizontalTextSize: 100,
      verticalTextSize: 100,
      mouseoverRowIndex: -1,
      mouseoverColIndex: -1,
    };

    this.resize = this.resize.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);

    this.matrix = React.createRef();
    this.canvas = React.createRef();
  }

  componentDidMount() {
    let canvas = this.canvas.current;
    console.log(this.canvas);
    let context = canvas.getContext("2d");

    //get text label lengths
    const horizontalTextSize = getTextSize(context, this.props.rows, "16pt arial");
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

  static getDerivedStateFromProps(props, state) {
    return {
      height: props.data.length*MIN_RECT_SIZE + TEXT_OFFSET
    };
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
    //effective width of the matric minus horitzontal text and scrollbar
    const effectiveWidth = this.state.width - this.state.horizontalTextSize - (this.props.contentMaxHeight?17:0);

    //in svg, y is rows and x is columns
    const x = d3.scaleBand().range([0, effectiveWidth]).domain(this.props.orders.columns[this.props.orderBy]);
    const y = d3.scaleBand().range([0, this.state.height]).domain(this.props.orders.row[this.props.orderBy]);

    const rectWidth = x.bandwidth();
    const rectHeight = y.bandwidth();

    const gridColor = this.props.gridColor || "gray";

    return (
      <div className="matrix" ref={this.matrix} onMouseLeave={this.mouseout}>
        <svg width={this.state.width} height={this.state.verticalTextSize}>
          <g transform={`translate(${this.state.horizontalTextSize}, ${this.state.verticalTextSize})`}>
            {this.props.columns.map((d, i) =>
              <ColHeading key={i}
                index={i}
                data={d}
                xScale={x}
                rectWidth={rectWidth}

                mouseover={this.mouseover}
                mouseoverColIndex={this.state.mouseoverColIndex}
              />
            )}
          </g>
        </svg>


          <svg width={this.state.width} height={this.state.height} style={this.props.contentMaxHeight ? {"maxHeight":this.props.contentMaxHeight,"overflow":"auto"} : {}}>
            <g transform={`translate(${this.state.horizontalTextSize})`}>
              {this.props.data.map((d, i) =>
                <Row key={i}
                  index={i}
                  heading={this.props.rows[i]}
                  data={d}
                  xScale={x}
                  yScale={y}
                  rectWidth={rectWidth}
                  rectHeight={rectHeight}
                  chartWidth={effectiveWidth}
                  colorFunction={this.props.colorFunction}
                  gridColor={gridColor}

                  mouseover={this.mouseover}
                  mouseoverRowIndex={this.state.mouseoverRowIndex}
                  mouseoverColIndex={this.state.mouseoverColIndex}
                />
              )}

              {this.props.columns.map((d, i) =>
                <ColGrid key={i}
                  index={i}
                  data={d}
                  xScale={x}
                  rectWidth={rectWidth}
                  chartHeight={this.state.height}
                  gridColor={gridColor}
                />
              )}
            </g>
          </svg>

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
    // console.log("d",this.props.data);
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
    console.log("d",this.props.index);
    return (
      <g className={this.props.index===this.props.mouseoverColIndex ? "hover " : ""} transform={"translate(" + this.props.xScale(this.props.index) + ") rotate(-90)"} onMouseOver={() => this.props.mouseover(-1, this.props.index)}>
        <text x={TEXT_OFFSET} y={this.props.rectWidth/2} dy="0.32em" textAnchor="start">{this.props.data.name}</text>
      </g>
    );
  }
}



function getTextSize(context, text, font) {
  context.font = font;

  let longestLength = 0;
  for(let i=0; i<text.length; ++i) {
    const length = context.measureText(text[i].name + "("+text[i].count+")").width;
    if(length > longestLength) {
      longestLength = length;
    }
  }

  return longestLength;
}

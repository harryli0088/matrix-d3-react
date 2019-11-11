import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from "d3";

import "./styles.css";

const SCROLLBAR_SIZE = 17;

export default class Matrix extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, //[{ title: string for horizontal row text, values: [array of values that each correspond to a color] }]
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired, //[strings of the vertical column texts]
    orders: PropTypes.object.isRequired,
    orderBy: PropTypes.string.isRequired,
    colorFunction: PropTypes.func.isRequired, //function(value) { return color;}

    //optional props
    onMouseOverCallback: PropTypes.func,
    onMouseOutCallback: PropTypes.func,
    onClickCallback: PropTypes.func,
    contentMaxHeight: PropTypes.number, //optional number of the maximum number of pixels that the content takes up before scrolling
    font: PropTypes.string, //optional string to do text pixel size calculations, defaults to "bold 16px Arial"
    gridLinesColor: PropTypes.string, //optional string for the color of the grid lines
    minWidth: PropTypes.number,
    minRectSize: PropTypes.number,
    textOffset: PropTypes.number,
    highlightOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    normalOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    transition: PropTypes.string,
  }

  static defaultProps = {
    onMouseOverCallback: function(e, rowIndex, colIndex) {},
    onMouseOutCallback: function(e) {},
    onClickCallback: function(e, rowIndex, colIndex) {},
    //no contentMaxHeight default,
    font: "16px Arial",
    gridLinesColor: "gray",
    minWidth: 500,
    minRectSize: 20,
    textOffset: 5,
    highlightOpacity: 1,
    normalOpacity: 0.75,
    transition: "1s",
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 500,

      mouseoverRowIndex: -1,
      mouseoverColIndex: -1,
    };

    this.matrix = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize); //add resize listener for responsiveness

    this.resize(); //initial resize
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }


  resize = () => {
    if(this.matrix.current) {
      this.setState({
        width: Math.max(this.matrix.current.clientWidth, this.props.minWidth), //responsive chart width
      });
    }
  }

  mouseover = (e, rowIndex, colIndex) => {
    this.setState({
      mouseoverRowIndex: rowIndex,
      mouseoverColIndex: colIndex
    });

    this.props.onMouseOverCallback(e, rowIndex, colIndex);
  }

  mouseout = e => {
    this.setState({
      mouseoverRowIndex: -1,
      mouseoverColIndex: -1
    });

    this.props.onMouseOutCallback(e);
  }


  render() {
    const {
      data,
      rows,
      columns,
      orders,
      orderBy,
      colorFunction,

      //onMouseOverCallback not used here
      //onMouseOutCallback not used here
      onClickCallback,
      contentMaxHeight,
      font,
      gridLinesColor,
      //minWidth not used here
      minRectSize,
      textOffset,
      highlightOpacity,
      normalOpacity,
      transition,
    } = this.props

    let context = document.createElement('canvas').getContext("2d");
    context.font = font;

    //get text label lengths
    const horizontalTextSize = getTextSize(context, rows, textOffset);
    const verticalTextSize = getTextSize(context, columns, textOffset);

    //effective width of the matric minus horitzontal text and scrollbar
    const effectiveWidth = this.state.width - horizontalTextSize - (contentMaxHeight?SCROLLBAR_SIZE:0);
    const height = data.length*minRectSize;

    //in svg, y is rows and x is columns
    const x = d3.scaleBand().range([0, effectiveWidth]).domain(orders.columns[orderBy]);
    const y = d3.scaleBand().range([0, height]).domain(orders.rows[orderBy]);

    const rectWidth = x.bandwidth();
    const rectHeight = y.bandwidth();


    return (
      <div className="matrix" ref={this.matrix} onMouseLeave={this.mouseout}>
        <svg width={this.state.width} height={verticalTextSize}>
          <g transform={`translate(${horizontalTextSize}, ${verticalTextSize})`}>
            {columns.map((d, i) =>
              <ColHeading key={i}
                index={i}
                data={d}
                xScale={x}
                rectWidth={rectWidth}
                textOffset={textOffset}
                font={font}
                highlightOpacity={highlightOpacity}
                normalOpacity={normalOpacity}
                transition={transition}

                mouseover={this.mouseover}
                mouseoverColIndex={this.state.mouseoverColIndex}
                onClickCallback={onClickCallback}
              />
            )}
          </g>
        </svg>

        <div style={contentMaxHeight<height ? {"maxHeight":contentMaxHeight,"overflowY":"auto","width":this.state.width+SCROLLBAR_SIZE} : {}}>
          <svg width={this.state.width} height={height}>
            <g transform={`translate(${horizontalTextSize})`}>
              {data.map((d, i) =>
                <Row
                  key={i}
                  index={i}
                  heading={rows[i]}
                  data={d}
                  columns={columns}
                  xScale={x}
                  yScale={y}
                  rectWidth={rectWidth}
                  rectHeight={rectHeight}
                  chartWidth={effectiveWidth}
                  colorFunction={colorFunction}
                  font={font}
                  gridLinesColor={gridLinesColor}
                  textOffset={textOffset}
                  highlightOpacity={highlightOpacity}
                  normalOpacity={normalOpacity}
                  transition={transition}

                  mouseover={this.mouseover}
                  onClickCallback={onClickCallback}
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
                  chartHeight={height}
                  gridLinesColor={gridLinesColor}
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
      <g
        style={{
          opacity: (this.props.index===this.props.mouseoverRowIndex) ? this.props.highlightOpacity : this.props.normalOpacity,
          fontWeight: (this.props.index===this.props.mouseoverRowIndex) ? "bold" : "",
          font:this.props.font,
          transform: "translateY(" + this.props.yScale(this.props.index) + "px)",
          transition: this.props.transition,
          transitionProperty: "transform",
        }}
      >
        {this.props.data.map((d, i) =>
          <rect
            key={i}
            fill={this.props.colorFunction(d.z)}
            x={this.props.xScale(d.c)}
            y={0}
            width={this.props.rectWidth}
            height={this.props.rectHeight}

            onMouseOver={e => this.props.mouseover(e, this.props.index, i)}
            onClick={e => this.props.onClickCallback(e, this.props.index, i)}

            style={{
              opacity:(this.props.index===this.props.mouseoverRowIndex || i===this.props.mouseoverColIndex) ? this.props.highlightOpacity : this.props.normalOpacity,
              transition: this.props.transition,
              transitionProperty: "x",
            }}
          >
            <title>{this.props.heading.name + ", " + this.props.columns[i].name + ": " + d.z}</title>
          </rect>
        )}


        <line x2={this.props.chartWidth} stroke={this.props.gridLinesColor}></line>
        <line x2={this.props.chartWidth} y1={this.props.rectHeight} y2={this.props.rectHeight} stroke={this.props.gridLinesColor}></line>

        <text
          x={-1*this.props.textOffset}
          y={this.props.rectHeight}
          dy="-0.35em"
          textAnchor="end"

          onMouseOver={e => this.props.mouseover(e, this.props.index, -1)}
          onClick={e => this.props.onClickCallback(e, this.props.index, -1)}
        >
          {this.props.heading.name} {this.props.heading.count!=undefined ? "("+this.props.heading.count+")" : ""}
        </text>
      </g>
    );
  }
}

class ColGrid extends Component {
  render() {
    return (
      <g transform={"translate(" + this.props.xScale(this.props.index) + ") rotate(-90)"}>
        <line x1={-1*this.props.chartHeight} stroke={this.props.gridLinesColor}></line>
        <line x1={-1*this.props.chartHeight} y1={this.props.rectWidth} y2={this.props.rectWidth} stroke={this.props.gridLinesColor}></line>
      </g>
    );
  }
}

class ColHeading extends Component {
  render() {
    return (
      <g
        onMouseOver={e => this.props.mouseover(e, -1, this.props.index)}
        onClick={e => this.props.onClickCallback(e, -1, this.props.index)}

        style={{
          opacity: (this.props.index===this.props.mouseoverColIndex) ? this.props.highlightOpacity : this.props.normalOpacity,
          fontWeight: (this.props.index===this.props.mouseoverColIndex) ? "bold" : "",
          font: this.props.font,
          transform: "translateX(" + this.props.xScale(this.props.index) + "px) rotate(-90deg)",
          transition: this.props.transition,
          transitionProperty: "transform",
        }}
      >
        <text x={this.props.textOffset} y={this.props.rectWidth/2} dy="0.32em" textAnchor="start">
          {this.props.data.count!=undefined ? "("+this.props.data.count+")" : ""} {this.props.data.name}
        </text>
      </g>
    );
  }
}


//given a canvas context and some text, return the longest length in pixels
function getTextSize(context, text, textOffset) {
  let longestLength = 0;
  for(let i=0; i<text.length; ++i) {
    const length = context.measureText(text[i].name + "("+text[i].count+")").width;
    if(length > longestLength) {
      longestLength = length;
    }
  }

  return longestLength + textOffset + 20;
}

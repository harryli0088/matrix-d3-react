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
    onMouseOverHandler: PropTypes.func,
    onMouseOutHandler: PropTypes.func,
    onClickHandler: PropTypes.func,
    contentMaxHeight: PropTypes.number, //optional number of the maximum number of pixels that the content takes up before scrolling
    font: PropTypes.string, //optional string to do text pixel size calculations, defaults to "bold 16px Arial"
    formatRowHeading: PropTypes.func,
    formatColHeading: PropTypes.func,
    gridLinesColor: PropTypes.string, //optional string for the color of the grid lines
    minRectSize: PropTypes.number,
    textOffset: PropTypes.number,
    normalOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    notHighlightedOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    defaultHighlight: PropTypes.bool,
    transition: PropTypes.string,
  }

  static defaultProps = {
    onMouseOverHandler: function(e, rowIndex, colIndex) {},
    onMouseOutHandler: function(e) {},
    onClickHandler: function(e, rowIndex, colIndex) {},
    //no contentMaxHeight default,
    font: "16px Arial",
    formatRowHeading: function(text, count) { return text + (count>0 ? " ("+count+")" : "") },
    formatColHeading: function(text, count) { return (count>0 ? "("+count+") " : "") + text },
    gridLinesColor: "gray",
    minRectSize: 20,
    textOffset: 5,
    normalOpacity: 1,
    notHighlightedOpacity: 0.75,
    defaultHighlight: true,
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
        width: this.matrix.current.clientWidth, //responsive chart width
      });
    }
  }

  mouseover = (e, rowIndex, colIndex) => {
    this.setState({
      mouseoverRowIndex: rowIndex,
      mouseoverColIndex: colIndex
    });

    this.props.onMouseOverHandler(e, rowIndex, colIndex);
  }

  mouseout = e => {
    this.setState({
      mouseoverRowIndex: -1,
      mouseoverColIndex: -1
    });

    this.props.onMouseOutHandler(e);
  }


  render() {
    const {
      data,
      rows,
      columns,
      orders,
      orderBy,
      colorFunction,

      //onMouseOverHandler not used here
      //onMouseOutHandler not used here
      onClickHandler,
      contentMaxHeight,
      font,
      formatRowHeading,
      formatColHeading,
      gridLinesColor,
      minRectSize,
      textOffset,
      normalOpacity,
      notHighlightedOpacity,
      transition,
    } = this.props

    let context = document.createElement('canvas').getContext("2d");
    context.font = font;

    //get text label lengths
    const horizontalTextSize = getTextSize(context, rows, formatRowHeading, textOffset);
    const verticalTextSize = getTextSize(context, columns, formatColHeading, textOffset);

    //effective width of the matric minus horitzontal text and scrollbar
    const minWidth = horizontalTextSize + columns.length*minRectSize + (contentMaxHeight?SCROLLBAR_SIZE:0);
    const width = Math.max(minWidth, this.state.width);
    const effectiveWidth = width - horizontalTextSize - (contentMaxHeight?SCROLLBAR_SIZE:0);
    const height = data.length*minRectSize;

    //in svg, y is rows and x is columns
    const x = d3.scaleBand().range([0, effectiveWidth]).domain(orders.columns[orderBy]);
    const y = d3.scaleBand().range([0, height]).domain(orders.rows[orderBy]);

    const rectWidth = x.bandwidth();
    const rectHeight = y.bandwidth();


    return (
      <div className="matrix" ref={this.matrix} onMouseLeave={this.mouseout} style={{font: this.props.font}}>
        <svg width={width} height={verticalTextSize}>
          <g transform={`translate(${horizontalTextSize}, ${verticalTextSize})`}>
            {columns.map((d, i) =>
              <ColHeading key={i}
                index={i}
                data={d}
                xScale={x}
                rectWidth={rectWidth}
                textOffset={textOffset}
                font={font}
                formatColHeading={formatColHeading}
                normalOpacity={normalOpacity}
                notHighlightedOpacity={notHighlightedOpacity}
                defaultHighlight={this.props.defaultHighlight}
                transition={transition}

                mouseover={this.mouseover}
                mouseoverRowIndex={this.state.mouseoverRowIndex}
                mouseoverColIndex={this.state.mouseoverColIndex}
                onClickHandler={onClickHandler}
              />
            )}
          </g>
        </svg>

        <div style={contentMaxHeight<height ? {"maxHeight":contentMaxHeight,"overflowY":"auto","width":width+SCROLLBAR_SIZE} : {}}>
          <svg width={width} height={height}>
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
                  formatRowHeading={formatRowHeading}
                  gridLinesColor={gridLinesColor}
                  textOffset={textOffset}
                  normalOpacity={normalOpacity}
                  notHighlightedOpacity={notHighlightedOpacity}
                  defaultHighlight={this.props.defaultHighlight}
                  transition={transition}

                  mouseover={this.mouseover}
                  onClickHandler={onClickHandler}
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
    const fullName = this.props.heading.name + (this.props.heading.count!=undefined ? " ("+this.props.heading.count+")" : "");

    return (
      <g
        style={{
          fontWeight: (this.props.index===this.props.mouseoverRowIndex) ? "bold" : "normal",
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
            onClick={e => this.props.onClickHandler(e, this.props.index, i)}

            style={{
              opacity:(this.props.index===this.props.mouseoverRowIndex || i===this.props.mouseoverColIndex || (this.props.mouseoverRowIndex===-1&&this.props.mouseoverColIndex===-1&&this.props.defaultHighlight)) ? this.props.normalOpacity : this.props.notHighlightedOpacity,
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
          onClick={e => this.props.onClickHandler(e, this.props.index, -1)}
        >
          <title>{fullName}</title>
          {this.props.formatRowHeading(this.props.heading.name, this.props.heading.count)}
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
    const fullName = (this.props.data.count!=undefined ? "("+this.props.data.count+") " : "") + this.props.data.name;
    return (
      <g
        onMouseOver={e => this.props.mouseover(e, -1, this.props.index)}
        onClick={e => this.props.onClickHandler(e, -1, this.props.index)}

        style={{
          opacity: (this.props.index===this.props.mouseoverColIndex || (this.props.mouseoverRowIndex===-1&&this.props.mouseoverColIndex===-1&&this.props.defaultHighlight)) ? this.props.normalOpacity : this.props.notHighlightedOpacity,
          fontWeight: (this.props.index===this.props.mouseoverColIndex) ? "bold" : "normal",
          transform: "translateX(" + this.props.xScale(this.props.index) + "px) rotate(-90deg)",
          transition: this.props.transition,
          transitionProperty: "transform",
        }}
      >
        <text x={this.props.textOffset} y={this.props.rectWidth/2} dy="0.32em" textAnchor="start">
          <title>{fullName}</title>
          {this.props.formatColHeading(this.props.data.name, this.props.data.count)}
        </text>
      </g>
    );
  }
}


//given a canvas context and some text, return the longest length in pixels
function getTextSize(context, headings, formatText, textOffset) {
  let longestLength = 0;
  for(let i=0; i<headings.length; ++i) {
    const length = context.measureText(formatText(headings[i].name, headings[i].count)).width;
    if(length > longestLength) {
      longestLength = length;
    }
  }

  return longestLength + textOffset + 20;
}

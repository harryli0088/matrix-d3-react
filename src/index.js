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
    contentMaxHeight: PropTypes.number, //optional number of the maximum number of pixels that the content takes up before scrolling
    defaultHighlight: PropTypes.bool,
    font: PropTypes.string, //optional string to do text pixel size calculations, defaults to "bold 16px Arial"
    formatColHeading: PropTypes.func,
    formatRowHeading: PropTypes.func,
    gridLinesColor: PropTypes.string, //optional string for the color of the grid lines
    linesHighlightedWidth: PropTypes.number,
    linesNotHighlightedWidth: PropTypes.number,
    minRectSize: PropTypes.number,
    normalOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    notHighlightedOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onClickHandler: PropTypes.func,
    onMouseOutHandler: PropTypes.func,
    onMouseOverHandler: PropTypes.func,
    textOffset: PropTypes.number,
    transition: PropTypes.string,
  }

  static defaultProps = {
    //no contentMaxHeight default,
    defaultHighlight: true,
    font: "16px Arial",
    formatColHeading: function(text, count) { return [text, (count>0 ? "("+count+")" : "")] },
    formatRowHeading: function(text, count) { return [text, (count>0 ? "("+count+")" : "")] },
    gridLinesColor: "gray",
    linesHighlightedWidth: 3,
    linesNotHighlightedWidth: 1,
    minRectSize: 20,
    normalOpacity: 1,
    notHighlightedOpacity: 0.25,
    onClickHandler: function(e, rowIndex, colIndex) {},
    onMouseOutHandler: function(e) {},
    onMouseOverHandler: function(e, rowIndex, colIndex) {},
    textOffset: 5,
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

      contentMaxHeight,
      font,
      formatColHeading,
      formatRowHeading,
      gridLinesColor,
      linesHighlightedWidth,
      linesNotHighlightedWidth,
      minRectSize,
      normalOpacity,
      notHighlightedOpacity,
      onClickHandler,
      //onMouseOutHandler not used here
      //onMouseOverHandler not used here
      textOffset,
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
                data={d}
                defaultHighlight={this.props.defaultHighlight}
                font={font}
                formatColHeading={formatColHeading}
                index={i}
                normalOpacity={normalOpacity}
                notHighlightedOpacity={notHighlightedOpacity}
                rectWidth={rectWidth}
                textOffset={textOffset}
                transition={transition}
                verticalTextSize={verticalTextSize}
                xScale={x}

                mouseover={this.mouseover}
                mouseoverColIndex={this.state.mouseoverColIndex}
                mouseoverRowIndex={this.state.mouseoverRowIndex}
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

                  data={d}
                  chartWidth={effectiveWidth}
                  colorFunction={colorFunction}
                  columns={columns}
                  defaultHighlight={this.props.defaultHighlight}
                  font={font}
                  formatRowHeading={formatRowHeading}
                  gridLinesColor={gridLinesColor}
                  heading={rows[i]}
                  horizontalTextSize={horizontalTextSize}
                  index={i}
                  linesHighlightedWidth={linesHighlightedWidth}
                  linesNotHighlightedWidth={linesNotHighlightedWidth}
                  normalOpacity={normalOpacity}
                  notHighlightedOpacity={notHighlightedOpacity}
                  rectHeight={rectHeight}
                  rectWidth={rectWidth}
                  textOffset={textOffset}
                  transition={transition}
                  xScale={x}
                  yScale={y}


                  mouseover={this.mouseover}
                  mouseoverColIndex={this.state.mouseoverColIndex}
                  mouseoverRowIndex={this.state.mouseoverRowIndex}
                  onClickHandler={onClickHandler}
                />
              )}

              {this.props.columns.map((d, i) =>
                <ColGrid key={i}
                  chartHeight={height}
                  data={d}
                  index={i}
                  gridLinesColor={gridLinesColor}
                  linesHighlightedWidth={linesHighlightedWidth}
                  linesNotHighlightedWidth={linesNotHighlightedWidth}
                  rectWidth={rectWidth}
                  xScale={x}

                  mouseoverColIndex={this.state.mouseoverColIndex}
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
    const formattedHeading = this.props.formatRowHeading(this.props.heading.name, this.props.heading.count)
    const fullName = formattedHeading[0] + " " + formattedHeading[1]
    const rowIsFullOpacity = this.props.index===this.props.mouseoverRowIndex || (this.props.mouseoverRowIndex===-1&&this.props.mouseoverColIndex===-1&&this.props.defaultHighlight)
    const rowIsHightlighted = this.props.index===this.props.mouseoverRowIndex

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
              opacity:(rowIsFullOpacity || i===this.props.mouseoverColIndex) ? this.props.normalOpacity : this.props.notHighlightedOpacity,
              transition: this.props.transition,
              transitionProperty: "x",
            }}
          >
            <title>{this.props.heading.name + ", " + this.props.columns[i].name + ": " + d.z}</title>
          </rect>
        )}


        <line x2={this.props.chartWidth} stroke={this.props.gridLinesColor} strokeWidth={rowIsHightlighted ? this.props.linesHighlightedWidth : this.props.linesNotHighlightedWidth}></line>
        <line x2={this.props.chartWidth} y1={this.props.rectHeight} y2={this.props.rectHeight} stroke={this.props.gridLinesColor} strokeWidth={rowIsHightlighted ? this.props.linesHighlightedWidth : this.props.linesNotHighlightedWidth}></line>

        <g
          onMouseOver={e => this.props.mouseover(e, this.props.index, -1)}
          onClick={e => this.props.onClickHandler(e, this.props.index, -1)}
          opacity={rowIsFullOpacity ? this.props.normalOpacity : this.props.notHighlightedOpacity}
          transform={"translate(-"+(this.props.textOffset)+","+(this.props.rectHeight)+")"}
        >
          <text
            x={10 - this.props.horizontalTextSize}
            y={0}
            dy="-0.35em"
            textAnchor="start"
          >
            <title>{fullName}</title>
            {formattedHeading[0]}
          </text>

          <text
            x={0}
            y={0}
            dy="-0.35em"
            textAnchor="end"
          >
            <title>{fullName}</title>
            {formattedHeading[1]}
          </text>
        </g>
      </g>
    );
  }
}

class ColGrid extends Component {
  render() {
    const colIsHighlighted = this.props.index === this.props.mouseoverColIndex

    return (
      <g transform={"translate(" + this.props.xScale(this.props.index) + ") rotate(-90)"}>
        <line x1={-1*this.props.chartHeight} stroke={this.props.gridLinesColor} strokeWidth={colIsHighlighted ? this.props.linesHighlightedWidth : this.props.linesNotHighlightedWidth}></line>
        <line x1={-1*this.props.chartHeight} y1={this.props.rectWidth} y2={this.props.rectWidth} stroke={this.props.gridLinesColor} strokeWidth={colIsHighlighted ? this.props.linesHighlightedWidth : this.props.linesNotHighlightedWidth}></line>
      </g>
    );
  }
}

class ColHeading extends Component {
  render() {
    const formattedHeading = this.props.formatColHeading(this.props.data.name, this.props.data.count)
    const fullName = formattedHeading[0] + " " + formattedHeading[1]
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
          {formattedHeading[0]}
        </text>

        <text x={this.props.textOffset + this.props.verticalTextSize - 10} y={this.props.rectWidth/2} dy="0.32em" textAnchor="end">
          <title>{fullName}</title>
          {formattedHeading[1]}
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

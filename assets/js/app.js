// basic setup
var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg setup
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// chart group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// connecting to data (csv)  
d3.csv("data.csv").then(function(myData) {
    
    // converting data to numbers
    myData.forEach(function(xdata) {
        xdata.poverty = +xdata.poverty;
        xdata.healthcare = +xdata.healthcare;
    });

    // set x scale
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(myData, d=>d.poverty)*0.9, 
            d3.max(myData, d => d.poverty)*1.1])
        .range([0, width]);

    // set y scale
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(myData, d => d.healthcare)*1.1])
        .range([height, 0]);

    // axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x and y axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("font-size", "18px")
        .call(bottomAxis);
    chartGroup.append("g")
        .style("font-size", "18px")
        .call(leftAxis);
  
    // creating circles and text in circles (State Abbreviation)
    chartGroup.selectAll("circle")
        .data(myData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "blue")
        .attr("opacity", ".3");
    chartGroup.selectAll("text.text-circles")
        .data(myData)
        .enter()
        .append("text")
        .classed("text-circles",true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",5)
        .attr("text-anchor","middle")
        .attr("font-size","12px");

    // y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Lacking Healthcare (%)");

    // x axis
    chartGroup.append("text")
        .attr("y", height + margin.bottom/2 - 10)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Poverty Rate (%)");


});
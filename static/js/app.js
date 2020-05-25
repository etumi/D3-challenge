var svgHeight = 600;
var svgWidth = 900;


var margin = { 
    top: 10, 
    right: 50, 
    bottom: 50, 
    left: 30 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("body")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("static/data/data.csv").then(healthData => {
    console.log(healthData);

    var xScale = d3.scaleLinear()
                    .domain([0, d3.max(healthData, d => d.poverty)])
                    .range([0, width]);

    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(healthData, d => d.healthcareLow)])
                    .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);
});
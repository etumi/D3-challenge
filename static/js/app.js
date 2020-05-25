var svgHeight = 600;
var svgWidth = 900;


var margin = { 
    top: 10, 
    right: 50, 
    bottom: 50, 
    left: 30 
};

// Set width and height of chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("body")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Create group to append all chart tags
var chartGroup = svg.append("g")
                    .classed('plot', true)
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//load Data 
d3.csv("static/data/data.csv").then(healthData => {
    //console.log(healthData);
    // parse Data
    healthData.forEach(entry => {
        entry.healthcareLow = +entry.healthcareLow
        entry.poverty = +entry.poverty 
    });

    console.log(healthData);

    //generate axes
    var xScale = d3.scaleLinear()
                    .domain(d3.extent(healthData, d => d.poverty))
                    .range([0, width]);

    console.log(xScale(19.3))

    var yScale = d3.scaleLinear()
                    .domain(d3.extent(healthData, d => d.healthcareLow))
                    .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Load axis to page
    chartGroup.append("g")
        .classed('x-axis', true)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .classed('y-axis', true)
        .call(yAxis);

    // Create data points
    var circleGroup = chartGroup.append("g").classed("all-data-points", true)
            .selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .classed("data-point", true)
            .attr("cy", d => yScale(d.healthcareLow))
            .attr("cx", d => xScale(d.poverty))
            .attr("r", 10)
            .attr("fill", "skyblue")
            .attr("opacity", .75);

    // Put State abbrev in data points
    var circleLabels = chartGroup.append("g").classed("data-point-labels", true)
            .selectAll("text")
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcareLow)+2.5)
            //.attr("transform", d => `translate(${xScale(d.poverty)}, ${yScale(d.healthcareLow)})`)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("fill", "white")
            .text(d => `${d.abbr}`)  


                                
});


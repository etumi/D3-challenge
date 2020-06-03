var svgHeight = 600;
var svgWidth = 900;


var margin = { 
    top: 20, 
    right: 30, 
    bottom: 80, 
    left: 100 
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
        entry.age = +entry.age
        entry.income = +entry.income
        entry.obesity = +entry.obesity
        entry.smokes = +entry.smokes
    });

    console.log(healthData);

    //generate axes
    var xScale = d3.scaleLinear()
                    .domain(d3.extent(healthData, d => d.poverty))
                    .range([0, width]);

    console.log(xScale(0.5))

    var yScale = d3.scaleLinear()
                    .domain(d3.extent(healthData, d => d.healthcareLow))
                    .range([height, 0]);

    console.log(yScale(0.5))

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

    // Create Axis Labels
    var axisLabels = chartGroup.append("g")
        .classed("axis-labels", true)

    //x-axis label 
    axisLabels.append("text")
        .classed("x-axis-label", true)
        .classed("active", true)
        .attr("transform", `translate(${width /2 }, ${height + 35})`)
        .attr("text-anchor", "middle")
        .text("In Poverty (%)")

    axisLabels.append("text")
            .classed("x-axis-label", true)
            .attr("transform", `translate(${width /2 }, ${height + 55})`)
            .attr("text-anchor", "middle")
            .text("Age (Median)")

    axisLabels.append("text")
            .classed("x-axis-label", true)
            .attr("transform", `translate(${width /2 }, ${height + 75})`)
            .attr("text-anchor", "middle")
            .text("Household Income (Median)")

    // y-axis label
    axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("active", false)
            .attr("transform", `translate(-70 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Obese (%)")

    axisLabels.append("text")
            .classed("y-axis-label", true)
            .attr("transform", `translate(-50 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Smokes (%)")

    axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("active", true)
            .attr("transform", `translate(-30 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Lacks Healthcare (%)")

    var x_label = d3.select(".x-axis-label.active").text();
    console.log(x_label);
    var y_label = d3.select(".y-axis-label.active").text();
    console.log(y_label);

    //setDataPoints(x_label, y_label);

    // Create data points
    var circleGroup = chartGroup.append("g").classed("data-points", true)
            .selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .classed("data-point", true)
            .transition()
            .duration(200)
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

        d3.select(".x-axis-label").on("click", function(){
            var x_label = d3.select(".x-axis-label").text();
            console.log("hello");
        })


    d3.select(".x-axis-label").on("click", function(){

        // Set x and y values based on selection
        var x_label = d3.select(".x-axis-label").text();
        var y_label = d3.select(".y-axis-label").text();
        console.log("hello");

        switch(x_label) {
            case "Age (Median)":
                x_label = "age";
                break;
            case "Household Income":
                x_label = "income";
                break;
            default: 
                "In Poverty (%)";
        }

        switch(y_label) {
            case "Obese (%)":
                y_label = "obesity";
                break;
            case "Smokes (%)":
                y_label = "smokes";
                break;
            default: 
                "Lacks Healthcare (%)";
        }

        setAxis(x_label, y_label);

    })
                                
});




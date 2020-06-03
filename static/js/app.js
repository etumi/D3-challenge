var svgHeight = 600;
var svgWidth = 1200;


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

//-------------------------------- // FUNCTIONS // ------------------------------//
function xScale(data, axisName){
    var xScaleCalc = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[axisName]))
                    .range([0, width]);

    return xScaleCalc;
}

function yScale(data, axisName){
    var yScaleCalc = d3.scaleLinear()
                .domain(d3.extent(data, d => d[axisName]))
                .range([height, 0]);

    return yScaleCalc;

}

function renderAxis(xAxisScale, xAxis, yAxisScale, yAxis){

    var bottomAxis = d3.axisBottom(xAxisScale);
    var leftAxis = d3.axisLeft(yAxisScale);

    // Load axis to page
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    yAxis.transition()
    .duration(1000)
    .call(leftAxis);

    return [xAxis, yAxis];
    //return xAxis;
};

function matchNametoVariable(xAxisName, yAxisName){
    // This function uses switch to convert the axis name to counterpart variable name
    //in the dataset
    switch(xAxisName) {
        case "Age (Median)":
            xAxisName = "age";
            break;
        case "Household Income":
            xAxisName = "income";
            break;
        default: 
            xAxisName = "poverty";
    }

    switch(yAxisName) {
        case "Obese (%)":
            yAxisName = "obesity";
            break;
        case "Smokes (%)":
            yAxisName = "smokes";
            break;
        default: 
            yAxisName = "healthcare";
    }

    return [xAxisName, yAxisName];
}

function setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xScale, yScale) {

    //var names = matchNametoVariable(xAxisName, yAxisName);

    //console.log(names);
    //var newxAxisName = names[0];
    //var newyAxisName = names[1]; 

    // render data points
    circleGroup.transition()
            .duration(1000)
            .attr("cx", d => xScale(d[xAxisName]))
            .attr("cy", d => yScale(d[yAxisName]))


    // Put State abbrev in data points
    circleLabels.transition()
            .duration(1000)
            .attr("x", d => xScale(d[xAxisName]))
            .attr("y", d => yScale(d[yAxisName])+2.5)
            .text(d => `${d.abbr}`)  

    //return [circleGroup, circleLabels] ;

}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

// function setDataPoints(healthData, xAxisName, yAxisName, xScale, yScale) {

//     var names = matchNametoVariable(xAxisName, yAxisName);

//     var xAxisName = names[0];
//     var yAxisName = names[1]; 

//     d3.select(".data-points").remove()
//     d3.select(".data-point-labels").remove()
//     //console.log(xAxisName);
//     //console.log(yAxisName);
//     //console.log(xScale(0.5))
//     //console.log(yScale(0.5))

//     var circleGroup = chartGroup.append("g").classed("data-points", true)
//             .selectAll("circle")
//             .data(healthData)
//             .enter()
//             .append("circle")
//             .classed("data-point", true)
//             .transition()
//             .duration(200)
//             .attr("cy", d => yScale(d[yAxisName]))
//             .attr("cx", d => xScale(d[xAxisName]))
//             .attr("r", 10)
//             .attr("fill", "skyblue")
//             .attr("opacity", .75);


//     // Put State abbrev in data points
//     var circleLabels = chartGroup.append("g").classed("data-point-labels", true)
//             .selectAll("text")
//             .data(healthData)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d[xAxisName]))
//             .attr("y", d => yScale(d[yAxisName])+2.5)
//             .attr("text-anchor", "middle")
//             .attr("font-size", 10)
//             .attr("fill", "white")
//             .text(d => `${d.abbr}`)  

// }

//------------------------------------------------------------------------------//

//load Data 
d3.csv("static/data/data.csv").then(healthData => {
    //console.log(healthData);
    // parse Data
    healthData.forEach(entry => {
        entry.healthcare = +entry.healthcare
        entry.poverty = +entry.poverty 
        entry.age = +entry.age
        entry.income = +entry.income
        entry.obesity = +entry.obesity
        entry.smokes = +entry.smokes
    });

    console.log(healthData);

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
            .classed("inactive", true)
            .attr("transform", `translate(${width /2 }, ${height + 55})`)
            .attr("text-anchor", "middle")
            .text("Age (Median)")

    axisLabels.append("text")
            .classed("x-axis-label", true)
            .classed("inactive", true)
            .attr("transform", `translate(${width /2 }, ${height + 75})`)
            .attr("text-anchor", "middle")
            .text("Household Income (Median)")

    // y-axis label
    axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("inactive", true)
            .attr("transform", `translate(-70 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Obese (%)")

    axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("inactive", true)
            .attr("transform", `translate(-50 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Smokes (%)")

    axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("active", true)
            .attr("transform", `translate(-30 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Lacks Healthcare (%)")

    //generate axes
    var xAxisName = d3.select(".x-axis-label.active").text();
    var yAxisName = d3.select(".y-axis-label.active").text();

    var names = matchNametoVariable(xAxisName, yAxisName);

    var xAxisName = names[0];
    var yAxisName = names[1];

    var xLinearScale = xScale(healthData, xAxisName);
    var yLinearScale = yScale(healthData, yAxisName);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Load axis to page
    var xAxis = chartGroup.append("g")
        .classed('x-axis', true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed('y-axis', true)
        .call(leftAxis);

    //Set data points
    var circleGroup = chartGroup.append("g").classed("data-points", true)
            .selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .classed("data-point", true)
            .attr("cx", d => xLinearScale(d[xAxisName]))
            .attr("cy", d => yLinearScale(d[yAxisName]))
            .attr("r", 10)
            .attr("fill", "skyblue")
            .attr("opacity", .75);

    // Put State abbrev in data points
    var circleLabels = chartGroup.append("g").classed("data-point-labels", true)
            .selectAll("text")
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[xAxisName]))
            .attr("y", d => yLinearScale(d[yAxisName])+2.5)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("fill", "white")
            .text(d => `${d.abbr}`) 

//-----------------------------------------DEBUGGER---------------------------------//
var xScaleTest1 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d["poverty"]))
            .range([0, width]);

console.log(`poverty: ${xScaleTest1(19.3)}`);

var xScaleTest2 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d["age"]))
            .range([0, width]);

console.log(`age is ${xScaleTest2(38.6)}`);

var xScaleTest3 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d["income"]))
            .range([0, width]);
console.log(`income is ${xScaleTest3(42830)}`);

var yScaleTest2 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d["smokes"]))
            .range([height, 0]);

console.log(`smokes: ${yScaleTest2(21.1)}`);
//----------------------------------------------------------------------------------//

    // Event listener for x axis changes
    axisLabels.selectAll(".x-axis-label").on("click", function(){
        // Set x and y values based on selection
        var newxAxisName = d3.select(this).text();
        console.log("------------");

        switch(newxAxisName) {
            case "Age (Median)":
                xAxisName = "age";
                break;
            case "Household Income (Median)":
                xAxisName = "income";
                break;
            default: 
                xAxisName = "poverty";
        }

        console.log(`x axis ${xAxisName}`);
        //console.log(xAxisName);
        console.log(`y axis ${yAxisName}`);

        xLinearScale = xScale(healthData, xAxisName);
        //yLinearScale = yScale(healthData, yAxisName);

        console.log(`width is ${width}`);
        console.log(`x value: ${xLinearScale(healthData[0][xAxisName])}`);
        console.log(`y value: ${yLinearScale(healthData[0][yAxisName])}`);

        //xAxis = renderAxis(xLinearScale, xAxis, yLinearScale, yAxis)[0];
        renderAxis(xLinearScale, xAxis, yLinearScale, yAxis);
        //yAxis = renderAxis(xLinearScale, xAxis, yLinearScale, yAxis)[1];

        setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xLinearScale, yLinearScale);
        //circleLabels = setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xLinearScale, yLinearScale)[1];

   })

    // Event listener y axis changes    
   axisLabels.selectAll(".y-axis-label").on("click", function(){
    // Set x and y values based on selection
    var newyAxisName = d3.select(this).text();
    console.log("------------");

    switch(newyAxisName) {
        case "Obese (%)":
            yAxisName = "obesity";
            break;
        case "Smokes (%)":
            yAxisName = "smokes";
            break;
        default: 
            yAxisName = "healthcare";
    }

    console.log(`xaxis ${xAxisName}`);
    //console.log(xAxisName);
    console.log(`y axis ${yAxisName}`);

   // xLinearScale = xScale(healthData, xAxisName);
    yLinearScale = yScale(healthData, yAxisName);

    console.log(`height is ${height}`);
    console.log(`x value: ${xLinearScale(healthData[0][xAxisName])}`);
    console.log(`y value: ${yLinearScale(healthData[0][yAxisName])}`);

    // xAxis = renderAxis(xLinearScale, xAxis, yLinearScale, yAxis)[0];
    //yAxis = renderAxis(xLinearScale, xAxis, yLinearScale, yAxis)[1];
    renderAxis(xLinearScale, xAxis, yLinearScale, yAxis);

    setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xLinearScale, yLinearScale);
    // circleGroup = setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xLinearScale, yLinearScale)[0];
    //circleLabels = setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xLinearScale, yLinearScale)[1];

    })

                                
}).catch(function(error) {
    console.log(error);
});




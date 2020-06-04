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

    return [circleGroup, circleLabels] ;

}

function updateToolTip(circleGroup, xAxisLabel, xAxisName, yAxisLabel, yAxisName){
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([70, -80])
    .html(function(d) {
        return (`${d.state}<br>${xAxisLabel}: ${d[xAxisName]}<br>${yAxisLabel}: ${d[yAxisName]}`);
    });

  circleGroup.call(toolTip);

  circleGroup.on("mouseover", function(data) {
    toolTip.show(data);
    d3.select(this).classed("active-point", true)
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
      d3.select(this).classed("active-point", false)
    });

    return circleGroup;
}


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

    //--------------------------------Create Axis Labels---------------------------------------//
    var axisLabels = chartGroup.append("g")
        .classed("axis-labels", true)

    //x-axis label 
    var povertyLabel = axisLabels.append("text")
        .classed("x-axis-label", true)
        .classed("active", true)
        .attr("transform", `translate(${width /2 }, ${height + 35})`)
        .attr("text-anchor", "middle")
        .text("In Poverty (%)")

    var ageLabel = axisLabels.append("text")
            .classed("x-axis-label", true)
            .classed("inactive", true)
            .attr("transform", `translate(${width /2 }, ${height + 55})`)
            .attr("text-anchor", "middle")
            .text("Age (Median)")

    var incomeLabel = axisLabels.append("text")
            .classed("x-axis-label", true)
            .classed("inactive", true)
            .attr("transform", `translate(${width /2 }, ${height + 75})`)
            .attr("text-anchor", "middle")
            .text("Household Income (Median)")

    // y-axis label
    var obeseLabel = axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("inactive", true)
            .attr("transform", `translate(-70 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Obese (%)")

    var smokesLabel = axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("inactive", true)
            .attr("transform", `translate(-50 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Smokes (%)")

    var healthLabel = axisLabels.append("text")
            .classed("y-axis-label", true)
            .classed("active", true)
            .attr("transform", `translate(-30 , ${height/2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("Lacks Healthcare (%)")

    //--------------------------------Generate Axes---------------------------------------//
    var xAxisLabel = d3.select(".x-axis-label.active").text();
    var yAxisLabel = d3.select(".y-axis-label.active").text();

    var names = matchNametoVariable(xAxisLabel, yAxisLabel);

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

    //--------------------------------Creat Data Point Circles---------------------------------------//
    //Set data points
    var circleGroup = chartGroup.append("g").classed("data-points", true)
            .selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .classed("data-point", true)
            .attr("cx", d => xLinearScale(d[xAxisName]))
            .attr("cy", d => yLinearScale(d[yAxisName]))
            .attr("r", 12)
            .attr("fill", "dodgerblue")
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

    //--------------------------------Create ToolTips---------------------------------------//
    circleGroup = updateToolTip(circleGroup, xAxisLabel, xAxisName, yAxisLabel, yAxisName);

    //--------------------------------Event listeners-----------------------------------------------//
    //Event listener for x axis changes
    axisLabels.selectAll(".x-axis-label").on("click", function(){
        // Set x value based on selection
        xAxisLabel = d3.select(this).text();

        if (xAxisLabel === "In Poverty (%)") {
            povertyLabel.classed("active", true)
                        .classed("inactive", false);
            ageLabel.classed("active", false)
                    .classed("inactive", true);
            incomeLabel.classed("active", false)
                        .classed("inactive", true);
        }else if (xAxisLabel === "Age (Median)"){
            povertyLabel.classed("active", false)
                        .classed("inactive", true);
            ageLabel.classed("active", true)
                    .classed("inactive", false);
            incomeLabel.classed("active", false)
                        .classed("inactive", true);
        }else {
            povertyLabel.classed("active", false)
                        .classed("inactive", true);
            ageLabel.classed("active", false)
                    .classed("inactive", true);
            incomeLabel.classed("active", true)
                        .classed("inactive", false);
        }
        
        switch(xAxisLabel) {
            case "Age (Median)":
                xAxisName = "age";
                break;
            case "Household Income (Median)":
                xAxisName = "income";
                break;
            default: 
                xAxisName = "poverty";
        }

        xLinearScale = xScale(healthData, xAxisName);

        renderAxis(xLinearScale, xAxis, yLinearScale, yAxis);

        circleGroup = setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xLinearScale, yLinearScale)[0];

        updateToolTip(circleGroup, xAxisLabel, xAxisName, yAxisLabel, yAxisName);

   })

    //Event listener y axis changes   
   axisLabels.selectAll(".y-axis-label").on("click", function(){
        // Set y value based on selection
        yAxisLabel = d3.select(this).text();

        if (yAxisLabel === "Lacks Healthcare (%)") {
            healthLabel.classed("active", true)
                        .classed("inactive", false);
            obeseLabel.classed("active", false)
                    .classed("inactive", true);
            smokesLabel.classed("active", false)
                        .classed("inactive", true);
        }else if (yAxisLabel === "Obese (%)"){
            healthLabel.classed("active", false)
                        .classed("inactive", true);
            obeseLabel.classed("active", true)
                    .classed("inactive", false);
            smokesLabel.classed("active", false)
                        .classed("inactive", true);
        }else {
            healthLabel.classed("active", false)
                        .classed("inactive", true);
            obeseLabel.classed("active", false)
                    .classed("inactive", true);
            smokesLabel.classed("active", true)
                        .classed("inactive", false);
        }

        switch(yAxisLabel) {
            case "Obese (%)":
                yAxisName = "obesity";
                break;
            case "Smokes (%)":
                yAxisName = "smokes";
                break;
            default: 
                yAxisName = "healthcare";
    }

        yLinearScale = yScale(healthData, yAxisName);

        renderAxis(xLinearScale, xAxis, yLinearScale, yAxis);

        circleGroup = setDataPoints(circleGroup, circleLabels, xAxisName, yAxisName, xLinearScale, yLinearScale)[0];
       
        updateToolTip(circleGroup, xAxisLabel, xAxisName, yAxisLabel, yAxisName);

        })
    //----------------------------------------------------------------------------------------------//                               
}).catch(function(error) {
    console.log(error);
});




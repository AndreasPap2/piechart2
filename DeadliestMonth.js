// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 55, left: 40},
width = 1000 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// Get the Data
d3.csv("https://gist.githubusercontent.com/SanneKerck/1be492e70d95158bb0a0de5a1eb1d7e7/raw/3e3af900d597b34a9a2a7ba61d8a3e84adb0f4a2/DeadliestMonth.csv", function(data) { 
//d3.csv("DeadliestMonth.csv", function(data) {   

//Title
svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .attr("font-weight", "bold")
    .style("text-decoration", "underline")  
    .text("Month by year given the number of individuals killed with maximum trendline");    

// Add X axis
var x = d3.scaleLinear()
    .domain([1969.5, 2019.5])
    .range([ 0, width ]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(40))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .style("font-size", "11px");
    
// text label for the x axis
svg.append("text")             
    .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 45) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Year");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 12.5])
    .range([ height, 0]);
svg.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "11px");

// text label for the y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Month"); 

// Add a scale for bubble size
var z = d3.scaleLinear()
    .domain([0, 6000])
    .range([0, 40]);

// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "10px")
    .style("padding", "10px")

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
var mouseover = function(d) {
    tooltip
    .transition()
    .duration(200)
    tooltip
    .style("opacity", 1)
    .html("Country: " + d.country)
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
    //.style("opacity", 1)
}
var mousemove = function(d) {
    tooltip
    .html("In month " + d.Imonth + " of " + d.Iyear + " the number of killed individuals was " + d.Nkill)
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
}
// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = function(d) {
    tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}
// Add dots
svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.Iyear); } )
    .attr("cy", function (d) { return y(d.Imonth); } )
    .attr("r", function (d) { return z(d.Nkill); } )
    .style("fill", "#17becf")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
});

// Maximum Trendline
// Read the data for maximum trendline
d3.csv("https://gist.githubusercontent.com/SanneKerck/237e1cbb123521b210ccf29642bdcab6/raw/4ccb110dddfb985a4b7e22b8ff9f6e67bd7f46f9/maxtrend.csv", function(b) {
//d3.csv("maxtrend.csv", function(b) {

// Add X axis
var x = d3.scaleLinear()
    .domain([1969.5, 2019.5])
    .range([ 0, width ]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(40))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .style("font-size", "11px");
        
// text label for the x axis
svg.append("text")             
    .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 45) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Year");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 12.5])
    .range([ height, 0]);
svg.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "11px");

// text label for the y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Month"); 

 // Add the line
 svg.append("path")
    .datum(b)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.Iyear) })
        .y(function(d) { return y(d.Imonth) })
    )
})
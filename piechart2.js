var width = 1400;
    var height = 1000;
    var data = [
      {year: 1970 , category: 'a', value: 82},
      {year: 1970 , category: 'b', value: 3},
      {year: 1970 , category: 'c', value: 339},
      {year: "1970-1975" , category: 'a', value: 1.079},
      {year: "1970-1975", category: 'b', value: 16},
      {year: "1970-1975", category: 'c', value: "1.690"},
      {year: "1975-1980" , category: 'a', value: 3.056},
      {year: "1975-1980" , category: 'b', value: 21},
      {year: "1975-1980" , category: 'c', value: 21},
      {year: "1980-1985" , category: 'a', value: 5.303},
      {year: "1980-1985" , category: 'b', value: 7},
      {year: "1980-1985" , category: 'c', value: 6.576},
      {year: "1985-1990", category: 'a', value: 7.359},
      {year: "1985-1990" , category: 'b', value: 16},
      {year: "1985-1990" , category: 'c', value: 8.202},
      {year: "1990-1995" , category: 'a', value: 6.552},
      {year: "1990-1995" , category: 'b', value: 31},
      {year: "1990-1995" , category: 'c', value: 5.767},
      {year: "1995-2000" , category: 'a', value: 3.133},
      {year: "1995-2000" , category: 'b', value: 36},
      {year: "1995-2000", category: 'c', value: 4.477},
      {year: "2000-2005" , category: 'a', value: 2.664},
      {year: "2000-2005" , category: 'b', value: 40},
      {year: "2000-2005" , category: 'c', value: 3.999},
      {year: "2005-2010" , category: 'a', value: 6.025},
      {year: "2005-2010" , category: 'b', value: 35},
      {year: "2005-2010" , category: 'c', value: 11.538},
      {year: "2010-2015" , category: 'a', value: 16.848},
      {year: "2010-2015" , category: 'b', value: 71},
      {year: "2010-2015" , category: 'c', value: "33.380"},
      {year: "2015-2019" , category: 'a', value: "12.940"},
      {year: "2015-2019" , category: 'b', value: 81},
      {year: "2015-2019" , category: 'c', value: 20.925},
  

    ];

  

    // Radius of each donut
    var donut_radii = {
      'a': [0, 200], //20
      'b': [205, 305],//25,45
      'c': [310, 400] //50,70
    }    

    // The color scales to use in each donut red green blue
    var colorScales = {
      'a': d3.interpolateBlues,
      'b': d3.interpolateGreens,
      'c': d3.interpolateOranges
    };
    
    // Function that transforms our data to have angles that divides 
    // a circle into evenly sized segments
    var pie = d3.pie().value(1)
    
    // Append the SVG to the chart div, not just anywhere in the body.
    // Viewbox makes 0, 0 the centre of the SVG
    var svg = d3.select('#chart')
      .append('svg')
        .attr("width", width)
        .attr("height", height)
        .attr('viewBox', [-width/2, -height/2, width, height]);

    // define tooltip
       var tooltip = d3.select('#chart') // select element in the DOM with id 'chart'
         .append('div') // append a div element to the element we've selected                                    
        .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected
      tooltip.append('div') // add divs to the tooltip defined above                            
      .attr('class', 'year'); // add class 'label' on the selection                         

      tooltip.append('div') // add divs to the tooltip defined above                     
          .attr('class', 'value'); // add class 'value' on the selection                  

      tooltip.append('div') // add divs to the tooltip defined above  
          .attr('class', 'percent'); // add class 'percent' on the selection  
    



    // Draws a single donut
    function draw_donut(category) {
       // Computes the minimum and maximum value over the data
       
      var x=data.filter(d=>d.category == category)
      // Extract the rows for the given category
      var arcs = pie(x); //const
      var value_range = d3.extent(x.map(d => d.value));
      
      // See how the data has changed? Now we can use the start and end angles!
      console.log(arcs);

      // A function that creates circular paths when we give it the data.
      var arc = d3.arc()
        .innerRadius(donut_radii[category][0]) 
        .outerRadius(donut_radii[category][1]);
      
      // Maps the value of each segment in the slice to a color.
      var color = d3.scaleSequential(colorScales[category]).domain(value_range);

      // Append a group for each donut. Then join the arcs data we just created. 
      // Set the color using the color scale and set the path using the arc function

    var path = svg.append('g')          
        .selectAll('path')
        .data(arcs)
        .join('path')
         .attr("fill", d => color(d.data.value))
         .attr("d", arc)
          .on('mouseover', function(d) {
            tooltip
              .style('display', 'block')
              .style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
              .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mou
            tooltip
              .select('.year')
                .html(d.data.year);
                tooltip
              .select('.value')

                .html("No. of deaths "+d.data.value);    
          })
          

      
        


          .on('mouseout', function(d) {
            tooltip.style('display', 'none');
          });
        }





    // Actually draw the data :)
    
    draw_donut('a');
    draw_donut('b');
    draw_donut('c');


// legend 

var Legend = function(el, series) {
  this.el = d3.select(el);
  this.series = series;
};

Legend.prototype.update = function(series, animate) {
  this.series = series;
  
  var item = this.el
    .selectAll(".shart-legend-item")
      .data(series);
  
  var exit = item.exit();
  
  var enter = item.enter()
    .append("div")
      .classed("shart-legend-item", true);
  
  var swatch = enter.append("span")
    .classed("shart-swatch shart-legend-item-swatch", true)
    .style("background-color", function(d) { return d.color });

  var label = enter.append("span")
    .classed("shart-legend-item-label", true)
    .text(function(d) { return d.label });

  var value = enter.append("span")
    .classed("shart-legend-item-value", true)
    .text(function(d) { return d.value });
  
  if (animate) {
    exit
      .transition()
        .style('opacity', 0)
        .remove();
    
    enter
      .style('opacity', 0)
      .transition()
        .duration(1000)
        .style('opacity', 1);
    
  } else {
    exit
      .remove();
  }

};

Legend.prototype.draw = function() {
  this.el
    .classed("shart-legend", true);

  this.update(this.series);
}

var legend = new Legend('#my-legend', [
  {color: colorScales['a'](0.5), label: "Firearms", value: ""},
  {color:colorScales['b'](0.5), label: "Chemicals",  value: ""},
  {color: colorScales['c'](0.4), label: "Explosives",  value: ""}
]);

legend.draw();

setTimeout(function() {
legend.update([
  {color: colorScales['a'](0.75),    label: "Firearms", value: ""},
  {color: colorScales['b'](0.75),  label: "Chemicals",  value: ""},
  {color: colorScales['c'](0.75), label: "Explosives",  value: ""}
], true), 3000});


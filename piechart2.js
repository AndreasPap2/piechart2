      
    var width = 800;
    var height = 800;
    var data = [
      {year: 1970 , category: 'Firearms', value: 82},
      {year: 1970 , category: 'Chemicals', value: 3},
      {year: 1970 , category: 'Explosives', value: 339},
      {year: "1970-1975" , category: 'Firearms', value: 1.079},
      {year: "1970-1975", category: 'Chemicals', value: 16},
      {year: "1970-1975", category: 'Explosives', value: "1.690"},
      {year: "1975-1980" , category: 'Firearms', value: 3.056},
      {year: "1975-1980" , category: 'Chemicals', value: 21},
      {year: "1975-1980" , category: 'Explosives', value: 21},
      {year: "1980-1985" , category: 'Firearms', value: 5.303},
      {year: "1980-1985" , category: 'Chemicals', value: 7},
      {year: "1980-1985" , category: 'Explosives', value: 6.576},
      {year: "1985-1990", category: 'Firearms', value: 7.359},
      {year: "1985-1990" , category: 'Chemicals', value: 16},
      {year: "1985-1990" , category: 'Explosives', value: 8.202},
      {year: "1990-1995" , category: 'Firearms', value: 6.552},
      {year: "1990-1995" , category: 'Chemicals', value: 31},
      {year: "1990-1995" , category: 'Explosives', value: 5.767},
      {year: "1995-2000" , category: 'Firearms', value: 3.133},
      {year: "1995-2000" , category: 'Chemicals', value: 36},
      {year: "1995-2000", category: 'Explosives', value: 4.477},
      {year: "2000-2005" , category: 'Firearms', value: 2.664},
      {year: "2000-2005" , category: 'Chemicals', value: 40},
      {year: "2000-2005" , category: 'Explosives', value: 3.999},
      {year: "2005-2010" , category: 'Firearms', value: 6.025},
      {year: "2005-2010" , category: 'Chemicals', value: 35},
      {year: "2005-2010" , category: 'Explosives', value: 11.538},
      {year: "2010-2015" , category: 'Firearms', value: 16.848},
      {year: "2010-2015" , category: 'Chemicals', value: 71},
      {year: "2010-2015" , category: 'Explosives', value: "33.380"},
      {year: "2015-2019" , category: 'Firearms', value: "12.940"},
      {year: "2015-2019" , category: 'Chemicals', value: 81},
      {year: "2015-2019" , category: 'Explosives', value: 20.925},
  

    ];

  

    // Radius of each donut
    var donut_radii = {
      'Firearms': [0, 180], //20
      'Chemicals': [185, 285],//25,45
      'Explosives': [290, 390] //50,70
    }    

    // The color scales to use in each donut red green blue
    var colorScales = {
      'Firearms': d3.interpolateBlues,
      'Chemicals': d3.interpolateGreens,
      'Explosives': d3.interpolateOranges
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
    
    draw_donut('Firearms');
    draw_donut('Chemicals');
    draw_donut('Explosives');


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

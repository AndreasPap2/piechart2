// define data
var dataset = [
    {label: "1970", value: 3.484},
    {label: "1970-1975", value: 9.091},
    {label: "1975-1980", value: 14.408},
    {label: "1980-1990", value: 17.973},
    {label: "1990-1995", value: 16.291},
    {label: "1995-2000", value: 10.409},
    {label: "2000-2005", value: 7.701},
    {label: "2005-2010", value: 20.353},
    {label: "2010-2015", value: 57.734},
    {label: "2015-2019", value: 43.739},
  ];


// chart dimensions
var width = 1200;
var height = 800;

// a circle chart needs a radius
var radius = Math.min(width, height) / 2;

// legend dimensions
var legendRectSize = 25; 
var legendSpacing = 8; // 6 defines spacing between squares

// define color scale
var color = d3.scaleOrdinal(d3.schemeCategory20);
// more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

var svg = d3.select('#chart') 
  .append('svg') 
  .attr('width', width) 
  .attr('height', height) 
  .append('g') 
  .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

var arc = d3.arc()
  .innerRadius(0) 
  .outerRadius(radius); 

var pie = d3.pie() // start and end angles of the segments
  .value(function(d) { return d.value; }) 
  .sort(null); 

// define tooltip
var tooltip = d3.select('#chart') 
  .append('div')                                     
  .attr('class', 'tooltip'); 

tooltip.append('div')                          
  .attr('class', 'label');                        

tooltip.append('div')                      
  .attr('class', 'value');               

tooltip.append('div') 
  .attr('class', 'percent'); 



dataset.forEach(function(d) {
  d.value = +d.value; 
  d.enabled = true; 
});

// creating the chart
var path = svg.selectAll('path') 
  .data(pie(dataset)) 
  .enter() 
  .append('path') 
  .attr('d', arc) 
  .attr('fill', function(d) { return color(d.data.label); }) 
  .each(function(d) { this._current - d; }); 

// mouse event handlers are attached to path so they need to come after its definition
path.on('mouseover', function(d) {  // when mouse enters div      
 var total = d3.sum(dataset.map(function(d) {       
  return (d.enabled) ? d.value : 0;                                      
  }));                                                      
 var percent = Math.round(1000 * d.data.value / total) / 10; // calculate percent
 tooltip.select('.label').html(d.data.label); // set current label           
 tooltip.select('.value').html('Deaths:' + d.data.value); // set current count            
 tooltip.select('.percent').html('Percentage:' + percent + '%'); // set percent calculated above          
 tooltip.style('display', 'block'); // set display                     
});                                                           

path.on('mouseout', function() {                        
  tooltip.style('display', 'none'); 
 });

path.on('mousemove', function(d) { // when mouse moves                  
  tooltip.style('top', (d3.event.layerY + 10) + 'px') 
    .style('left', (d3.event.layerX + 10) + 'px'); 
  });

// define legend
var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
  .data(color.domain()) // refers to an array of labels from our dataset
  .enter() 
  .append('g') 
  .attr('class', 'legend') 
  .attr('transform', function(d, i) {                   
    var height = legendRectSize + legendSpacing;     
    var offset =  height * color.domain().length / 2; 
    var horz = 18 * legendRectSize; 
    var vert = i * height - offset;                
      return 'translate(' + horz + ',' + vert + ')'; 
   });

// adding colored squares to legend
legend.append('rect') // append rectangle squares to legend                                   
  .attr('width', legendRectSize)                         
  .attr('height', legendRectSize)                    
  .style('fill', color) // each fill is passed a color
  .style('stroke', color) 
  .on('click', function(label) {
    var rect = d3.select(this); 
    var enabled = true; 
    var totalEnabled = d3.sum(dataset.map(function(d) { // can't disable all options
      return (d.enabled) ? 1 : 0; 
    }));

    if (rect.attr('class') === 'disabled') { // if class is disabled
      rect.attr('class', ''); // remove class disabled
    } else { // else
      if (totalEnabled < 2) return; 
      rect.attr('class', 'disabled'); 
      enabled = false; // set enabled to false
    }

    pie.value(function(d) { 
      if (d.label === label) d.enabled = enabled; 
        return (d.enabled) ? d.value : 0; 
    });

    path = path.data(pie(dataset)); // update pie with new data

    path.transition() // transition of redrawn pie
      .duration(750) // 
      .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
        var interpolate = d3.interpolate(this._current, d); 
        this._current = interpolate(0); 
        return function(t) {
          return arc(interpolate(t));
        };
      });
  });

// adding text to legend
legend.append('text')                                    
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; }); // return label
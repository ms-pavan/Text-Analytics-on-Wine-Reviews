var marginScatter = { top: 50, right: 200, bottom: 50, left: 150 },
    outerWidth = 1000,
    outerHeight = 600,
    width = outerWidth - marginScatter.left - marginScatter.right,
    height = outerHeight - marginScatter.top - marginScatter.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

	
// force data to update when menu is changed    
var menu = d3.select("#menu select")
    .on("change", change); 	
	
$( "#ResetWheel" ).click(function() {
	d3.selectAll('#tooltip').remove();	  
	d3.selectAll('#aroma svg').remove();
	updateAromaWheel("all");
});
	
// force data to update when flavor is changed    
var flavor = d3.select("#flavor select")
    .on("change", change); 	


	$( function() {
		$( "#amount" ).val( "$" + "10" + " - $" + "1500" );
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 1500,
      values: [ 10, 1500 ],
	  slide: function( event, ui ) {
		  $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
	  },
      change: function( event, ui ) {
		  d3.selectAll('#tooltip').remove();	
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		console.log("val 0: "+ui.values[0]+" to "+"val 1: "+ui.values[1]);
		d3.selectAll('#scatter svg').remove();
	d3.transition()
      .duration(altKey ? 7500 : 1500)
      .each(redraw(ui.values[0],ui.values[1]));
	  redraw(ui.values[0],ui.values[1]);
      }
    });
  } );
	
	
//suck in the data, store it in a value called formatted, run the redraw function
d3.csv("static/wine_aroma.csv", function(formatted) {
	debugger;
									
									//updateAromaWheel(flavor);
									fulldata = formatted;
							        redraw(0,100000);
									updateAromaWheel("all");
    							  });	
								  
d3.select(window)
    .on("keydown", function() { altKey = d3.event.altKey; })
    .on("keyup", function() { altKey = false; });
var altKey;

  

// set terms of transition that will take place
// when a new country/flavor is chosen   
function change() {
	//alert('change');
	d3.selectAll('#tooltip').remove();	
	$('svg').remove();
	debugger;
	  var flav = flavor.property("value");
	  updateAromaWheel(flav);
	
  d3.transition()
      .duration(altKey ? 7500 : 1500)
      .each(redraw($( "#slider-range" ).slider("values")[0],$( "#slider-range" ).slider("values")[1]));
	  
}  

function redraw(a,b) {
	//updateAromaWheel(flavor);
	debugger;
	//$('svg').remove();
	//$('#scatter').remove();
	
	
	//alert('redraw');
	// get value from menu selection
    // the option values are set in HTML and correspond
    //to the [type] value we used to nest the data  
    var series = menu.property("value");
	//var flav = flavor.property("value");
	//alert(series);	
	var flav = flavor.property("value");


	var xCat = "points",
    yCat = "price",
    rCat = "points",
    colorCat = "aroma",
	//colorCat = "variety",
	title = "title";	
  data = fulldata.filter(function(row){
    if(flav == 'all'){
		return row['country'] == (series) && row['price']>=a && row['price']<=b ;
	}
	else{
		return row['country'] == (series) && row['aroma'] == (flav) && row['price']>=a && row['price']<=b ;
	}
    
  });

	debugger;
  data.forEach(function(d) {	
	d.points = +d.points;
    d.price = +d.price;
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.02,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      //xMin = xMin > 0 ? 78 : xMin,
	  xMin = xMin > 0 ? (xMin*0.9) : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.02,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      //yMin = yMin > 0 ? 0 : yMin;
	  yMin = yMin > 0 ? (yMin*0.9) : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {		  
		//debugger;
        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+ "<br>" + title + ": " + d[title]+ "<br>" + "Flavor" + ": " + d[colorCat];
      });
// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")
	.style("opacity", 0);

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")")
      .call(zoomBeh);

  //svg.call(tip);
  //svg.call(tip1);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", marginScatter.bottom - 5)
      .style("text-anchor", "end")
	  .style("font-weight","bold")
      .text(xCat);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", 70-marginScatter.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
	  .style("font-weight","bold")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
	  .attr("r", function (d) { return 3 * 1; })
	  //.attr("r", function (d) { return 3*(d[xCat] / d[yCat]); })
      //.attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
      .attr("transform", transform)
      .style("fill", function(d) { return color(d[colorCat]); })
      //.on("mouseover", tip.show)
	  //.on("mouseout", tip.hide);
	  .on('mouseover', function (d) {
		  str =xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+ "<br>" + title + ": " + d[title]+ "<br>" + "Flavor" + ": " + d[colorCat];
      //debugger;
		d3.select(this)
          .transition()
          .duration(500)
          .attr('r',12)
          .attr('stroke-width',3);
		  div.transition()		
                .duration(500)		
                .style("opacity", 1);		
            div.html(str)
			.style("left", (d3.event.pageX-160) + "px")		
            .style("top", (d3.event.pageY - 100) + "px");
						
      })
	  .on('mouseout', function () {		  
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',3)
          .attr('stroke-width',1);
		  div.transition()		
                .duration(500)		
                .style("opacity", 0);	
      })
	  //.on("click", zoomIn)
	   .on("click", function(d){
		  //alert('flavor '+d[colorCat]);
		  //zoomIn();
		  
		  //if(flavor.property("value")=="all")
		  //{
			d3.selectAll('#tooltip').remove();	  
			d3.selectAll('#aroma svg').remove();
			updateAromaWheel(d[colorCat]);	
		    updateTable(data,d[xCat],d[yCat]);
		  }) 
      /* .append('title') // Tooltip
      .attr("class", "d3-tip")
	  .html(function(d) {		  
		//debugger;
        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]+ "<br>" + title + ": " + d[title]+ "<br>" + "Flavor" + ": " + d[colorCat];
      }) */

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
      .attr("r", 3.5)
      .attr("cx", width + 20)
      .attr("fill", color);

  legend.append("text")
      .attr("x", width + 26)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  d3.select("input").on("click", change);
  FillTable(data);
  function change() {
    xCat = "Carbs";
    xMax = d3.max(data, function(d) { return d[xCat]; });
    xMin = d3.min(data, function(d) { return d[xCat]; });

    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
  
   
	 
  
}

function updateTable(tableData,points,price)
{
	debugger;
	newData = tableData.filter(function(row){
		return row['price']==price && row['points'] == points;    
  });
  console.log(newData);	
	FillTable(newData);
}

function FillTable(data)
{	  reviews_html1='';
	  var reviews_html ='<h2>Wines</h2>';
  reviews_html += '<table><tr><th>No.</th><th>Title</th><th>Points</th><th>Price</th><th>Flavor</th><th>Description</th></tr>';
		  i=0;
		$.each(data, function(key, value){
		//debugger;		
		i++;
		reviews_html1= '<tr><td>'+i+'</td><td>'+value.title+'</td><td>'+value.points+'</td><td>'
						+value.price+'</td><td>'+value.aroma+'</td><td>'+value.description+'</td></tr>';
		reviews_html+= reviews_html1;		      
				 });
		reviews_html +='</table>';
		$('#reviewContent').html(reviews_html);	

	
}


//aroma wheel

/*
MIT License

Copyright (c) 2018 Joshua Paul Barnard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


function updateAromaWheel(flavor)
{
	debugger;
	//file="static/data/davis-aroma-wheel_Original.json";
	file="";

switch(flavor) {
    case "fruit":
        file="static/data/davis-aroma-wheel_fruit.json";
        break;
    case "herbaceous":
        file="static/data/davis-aroma-wheel_herbaceous.json";
        break;
	case "earthy":
        file="static/data/davis-aroma-wheel_earthy.json";
        break;
    case "spice":
        file="static/data/davis-aroma-wheel_spice.json";
        break;
	case "wood":
        file="static/data/davis-aroma-wheel_wood.json";
        break;
    case "caramel":
        file="static/data/davis-aroma-wheel_caramel.json";
        break;
	case "chemical":
        file="static/data/davis-aroma-wheel_chemical.json";
        break;
    case "floral":
        file="static/data/davis-aroma-wheel_floral.json";
        break;
	case "microbiological":
        file="static/data/davis-aroma-wheel_microbiological.json";
        break;
    case "nutty":
        file="static/data/davis-aroma-wheel_nutty.json";
        break;
	case "pungent":
        file="static/data/davis-aroma-wheel_pungent.json";
        break;
    case "oxidized":
        file="static/data/davis-aroma-wheel_oxidized.json";
        break;
    default:
		file="static/data/davis-aroma-wheel_Original.json";
        break;
}


var margin = {top: 370, right: 370, bottom: 300, left: 370}, 
//var margin = {top: 450, right: 450, bottom: 450, left: 450}, //changed the size of the wheel
//var margin = {top: 650, right: 650, bottom: 650, left: 650}, // original measurements
radius = Math.max(margin.top, margin.right, margin.bottom, margin.left) - 160;
//radius = 400 - 120;
//var margin = {top: 350, right: 350, bottom: 350, left: 350},
    //radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 80;

function filter_min_arc_size_text(d, i) {
	//console.log(d);
	return (d.dx*d.depth*radius/1)>14};

var hue = d3.scale.category10();

var luminance = d3.scale.sqrt()
    .domain([0, 1e6])
    .clamp(true)
    .range([80, 20]);

//var svg = d3.select("body").append("svg")
var svg = d3.select("#aroma").append("svg")
    .attr("width", margin.left + margin.right)
    .attr("height", margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var partition = d3.layout.partition()
    .sort(function(a, b) { return d3.ascending(a.name, b.name); })
    .size([2 * Math.PI, radius]);

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })
    .innerRadius(function(d) { return (radius + 6) / 3 * d.depth; })
    .outerRadius(function(d) { return (radius + 6) / 3 * (d.depth + 1.) - 1; });

svg.append("image")
  .attr("xlink:href", "static/images/grapes.png")
  .attr("x", -650)
  .attr("y", -650);

//Tooltip description
var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", 0);

function format_number(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function format_description(d) {
  var description = d.description;
      return  '<b>' + d.name + '</b></br>'+ d.description + '<br> (' + format_number(d.value) + ')';
}

function computeTextRotation(d) {
    var rotation = (d.x + d.dx / 2) * 180 / Math.PI - 90;
    return {
        global: rotation,
        correction: rotation > 90 ? 180 : 0
    };
}

function isRotated(d) {
    var rotation = (d.x + d.dx / 2) * 180 / Math.PI - 90;
    return rotation > 90 ? true : false
}

function mouseOverArc(d) {
			 d3.select(this).attr("stroke","black")
          tooltip.html(format_description(d));
          return tooltip.transition()
            .duration(50)
            .style("opacity", 0.9);
        }

function mouseOutArc(){
	d3.select(this).attr("stroke","")
	return tooltip.style("opacity", 0);
}

function mouseMoveArc (d) {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left", (d3.event.pageX+10)+"px");
}

var root_ = null;


d3.json(file, function(error, root) {
  if (error) return console.warn(error);
  // Compute the initial layout on the entire tree to sum sizes.
  // Also compute the full name and fill color for each node,
  // and stash the children so they can be restored as we descend.

  partition
      .value(function(d) { return d.size; })
      .nodes(root)
      .forEach(function(d) {
        d._children = d.children;
        d.sum = d.value;
        d.key = key(d);
        d.fill = fill(d);
      });

  // Now redefine the value function to use the previously-computed sum.
  partition
      .children(function(d, depth) { return depth < 3 ? d._children : null; })
      .value(function(d) { return d.sum; });

  var center = svg.append("circle")
      .attr("r", radius / 3)
      .on("click", zoomOut);

  center.append("title")
      .text("Zoom Out");


  var partitioned_data = partition.nodes(root).slice(1)

  var path = svg.selectAll("path")
      .data(partitioned_data)
      .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { return d.fill; })
      .each(function(d) { this._current = updateArc(d); })
      .on("click", zoomIn)
		  .on("mouseover", mouseOverArc)
      .on("mousemove", mouseMoveArc)
      .on("mouseout", mouseOutArc);

  var texts = svg.selectAll("text")
      .data(partitioned_data)
      .enter().append("text")
		  .filter(filter_min_arc_size_text)
      .attr("transform", function(d)
        {
          var r = computeTextRotation(d);
          return "rotate(" + r.global + ")"
            + "translate(" + radius / 3. * d.depth + ")"
            + "rotate(" + -r.correction + ")";
        })
      .style("font-weight", "bold")
      .style("text-anchor", "middle")
	  .style("font-size", "7px")
	  //.attr("dx", function(d) {return isRotated(d) ? "-50" : "50"}) //margin // changed the margin from (-80 : 80 ) to (-55 : 55) to bring the text inside the circle
      .attr("dx", function(d) {return isRotated(d) ? "-30" : "30"}) 
	  .attr("dy", ".35em") // vertical-align
      .on("click", zoomIn)
		  .text(function(d,i) {return d.name})

  function zoomIn(p) {
    if (p.depth > 1) p = p.parent;
    if (!p.children) return;
    zoom(p, p);
  }

  function zoomOut(p) {
    if (!p.parent) return;
    zoom(p.parent, p);
  }

  // Zoom to the specified new root.
  function zoom(root, p) {
    if (document.documentElement.__transition__) return;

    // Rescale outside angles to match the new layout.
    var enterArc,
        exitArc,
        outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

    function insideArc(d) {
      return p.key > d.key
          ? {depth: d.depth - 1, x: 0, dx: 0} : p.key < d.key
          ? {depth: d.depth - 1, x: 2 * Math.PI, dx: 0}
          : {depth: 0, x: 0, dx: 2 * Math.PI};
    }

    function outsideArc(d) {
      return {depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)};
    }

    center.datum(root);

    // When zooming in, arcs enter from the outside and exit to the inside.
    // Entering outside arcs start from the old layout.
    if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

	 var new_data=partition.nodes(root).slice(1)

    path = path.data(new_data, function(d) { return d.key; });

	 // When zooming out, arcs enter from the inside and exit to the outside.
    // Exiting outside arcs transition to the new layout.
    if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);

    d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function() {
      path.exit().transition()
          .style("fill-opacity", function(d) { return d.depth === 1 + (root === p) ? 1 : 0; })
          .attrTween("d", function(d) { return arcTween.call(this, exitArc(d)); })
          .remove();

      path.enter().append("path")
        .style("fill-opacity", function(d) { return d.depth === 2 - (root === p) ? 1 : 0; })
        .style("fill", function(d) { return d.fill; })
        .on("click", zoomIn)
			  .on("mouseover", mouseOverArc)
        .on("mousemove", mouseMoveArc)
      	.on("mouseout", mouseOutArc)
        .each(function(d) { this._current = enterArc(d); });


      path.transition()
          .style("fill-opacity", 1)
          .attrTween("d", function(d) { return arcTween.call(this, updateArc(d)); });


    });


	 texts = texts.data(new_data, function(d) { return d.key; })

    texts.exit()
	    .remove()
    texts.enter()
      .append("text")

    texts.style("opacity", 0)
      .attr("transform", function(d) {
        var r = computeTextRotation(d);
        return "rotate(" + r.global + ")"
        + "translate(" + radius / 3 * d.depth + ",0)"
        + "rotate(" + -r.correction + ")";
      })
      .style("font-weight", "bold")
      .style("text-anchor", "middle")
	  .style("font-size", "7px")
		  //.attr("dx", function(d) {return isRotated(d) ? "-85" : "85"}) //margin
		  .attr("dx", function(d) {return isRotated(d) ? "-50" : "50"}) //margin
      .attr("dy", ".35em") // vertical-align
      .filter(filter_min_arc_size_text)
      .on("click", zoomIn)
      .text(function(d,i) {return d.name})
		  .transition().delay(750).style("opacity", 1)

  }
});

function key(d) {
  var k = [], p = d;
  while (p.depth) k.push(p.name), p = p.parent;
  return k.reverse().join(".");
}

function fill(d) {
  var p = d;
  while (p.depth > 1) p = p.parent;
  var c = d3.lab(hue(p.name));
  c.l = luminance(d.sum);
  return c;
}

function arcTween(b) {
  var i = d3.interpolate(this._current, b);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function updateArc(d) {
  return {depth: d.depth, x: d.x, dx: d.dx};
}

d3.select(self.frameElement).style("height", margin.top + margin.bottom + "px");


}
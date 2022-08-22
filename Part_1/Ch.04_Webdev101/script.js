function buildChart() {
  var padding = 20;
  var height = 150,
    width = 300;

  var chart = d3.select("#chart");

  chart.append("circle").attr("r", 15).attr("cx", 100).attr("cy", 50);

  chart
    .append("line")
    .attr("x1", padding)
    .attr("y1", padding)
    .attr("x2", padding)
    .attr("y2", height - padding);

  chart
    .append("line")
    .attr("x1", padding)
    .attr("y1", height - padding)
    .attr("x2", width - padding)
    .attr("y2", height - padding);

  chart
    .append("rect")
    .attr("x", 240)
    .attr("y", 5)
    .attr("width", 55)
    .attr("height", 30);

  chart.append("polygon").attr("points", "210,100, 230,100, 220,80");

  chart
    .append("text")
    .text("A Dummy Chart")
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", padding);

  chart
    .append("text")
    .text("y axis label")
    .attr("x", padding)
    .attr("y", padding)
    .attr("transform", "rotate(-90," + padding + "," + padding + ")")
    .attr("text-anchor", "end")
    .attr("dy", "0.71em");

  chart
    .append("path")
    .attr(
      "d",
      "M" + padding + "," + (height - padding) + "L60,70L110,100L160,45"
    );
  return;
}

var chartCircles = function (data) {
  var chart = d3.select("#chart");
  // Set the chart height and width from data
  chart.attr("height", data.height).attr("width", data.width);
  // Create some circles using the data
  chart
    .selectAll("circle")
    .data(data.circles)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", function (d) {
      return d.r;
    });
};

var data = {
  width: 300,
  height: 150,
  circles: [
    { x: 50, y: 30, r: 20 },
    { x: 70, y: 80, r: 10 },
    { x: 160, y: 60, r: 10 },
    { x: 200, y: 100, r: 5 },
  ],
};

chartCircles(data);

// buildChart();

// main javascript here:
// d3.select('#chart svg')
//     .append('g')
//     .classed('shapes', true)
//     .append('circle')
//     .attr('cx', 50).attr('cy', 50)
//     .attr('r', 10)
//     .style('fill', 'red');

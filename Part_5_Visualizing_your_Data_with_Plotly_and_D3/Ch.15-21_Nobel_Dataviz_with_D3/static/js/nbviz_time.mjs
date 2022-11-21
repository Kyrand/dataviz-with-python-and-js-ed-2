import nbviz from "./nbviz_core.mjs";

var chartHolder = d3.select("#nobel-time");

var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var boundingRect = chartHolder.node().getBoundingClientRect();
var width = boundingRect.width - margin.left - margin.right,
  height = boundingRect.height - margin.top - margin.bottom;

var svg = chartHolder
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("class", "chart")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// SCALES
var xScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0.1)
  .domain(d3.range(1901, 2015));

var yScale = d3.scaleBand().range([height, 0]).domain(d3.range(15));

// AXIS
var xAxis = d3
  .axisBottom()
  .scale(xScale)
  .tickValues(
    xScale.domain().filter(function (d, i) {
      return !(d % 10);
    })
  );

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", "rotate(-65)");

// LABELS
let catLabels = chartHolder
  .select("svg")
  .append("g")
  .attr("class", "labels")
  .attr("transform", "translate(10, 10)")
  .selectAll("label")
  .data(nbviz.CATEGORIES)
  .join("g")
  .attr("transform", function (d, i) {
    return "translate(0," + i * 10 + ")";
  });

catLabels
  .append("circle")
  .attr("fill", nbviz.categoryFill)
  .attr("r", xScale.bandwidth() / 2);

catLabels
  .append("text")
  .text((d) => d)
  .attr("dy", "0.4em")
  .attr("x", 10);

let updateTimeChart = function (data) {
  let years = svg.selectAll(".year").data(data, (d) => d.key);

  years
    .join("g")
    .classed("year", true)
    .attr("name", (d) => d.key)
    .attr("transform", function (year) {
      return "translate(" + xScale(+year.key) + ",0)";
    });

  let winners = svg
    .selectAll(".year")
    .selectAll("circle")
    .data(
      (d) => d.values,
      (d) => d.name
    );

  winners
    .join((enter) => {
      return enter.append("circle").attr("cy", height);
    })
    .attr("fill", function (d) {
      return nbviz.categoryFill(d.category);
    })
    .attr("cx", xScale.bandwidth() / 2)
    .attr("r", xScale.bandwidth() / 2)
    .transition()
    .duration(2000)
    .attr("cy", (d, i) => yScale(i));
};

nbviz.callbacks.push(() => {
  let data = nbviz.nestDataByYear(nbviz.countryDim.top(Infinity));
  updateTimeChart(data);
});

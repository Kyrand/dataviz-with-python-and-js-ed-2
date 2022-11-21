import nbviz from "./nbviz_core.mjs";

let chartHolder = d3.select("#nobel-bar");

let margin = { top: 20, right: 20, bottom: 35, left: 40 };
let boundingRect = chartHolder.node().getBoundingClientRect();
let width = boundingRect.width - margin.left - margin.right,
  height = boundingRect.height - margin.top - margin.bottom;
let xPaddingLeft = 20; //10;

// SCALES
let xScale = d3.scaleBand().range([xPaddingLeft, width]).padding(0.1);

let yScale = d3.scaleLinear().range([height, 0]);

// AXES
let xAxis = d3.axisBottom().scale(xScale);

let yAxis = d3
  .axisLeft()
  .scale(yScale)
  .ticks(10)
  .tickFormat(function (d) {
    if (nbviz.valuePerCapita) {
      return d.toExponential();
    }
    return d;
  });

let svg = chartHolder
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// ADD AXES
svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

svg
  .append("g")
  .attr("class", "y axis")
  .append("text")
  .text("Number of winners")
  .attr("id", "y-axis-label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end");

let updateBarChart = function (data) {
  // filter out any countries with zero prizes by value
  data = data.filter(function (d) {
    return d.value > 0;
  });
  // change the scale domains to reflect the newly filtered data
  xScale.domain(data.map((d) => d.code));
  yScale.domain([0, d3.max(data, (d) => d.value)]);

  // change the x and y axes smoothly with a transition
  svg
    .select(".x.axis")
    .transition()
    .duration(nbviz.TRANS_DURATION)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  svg.select(".y.axis").transition().duration(nbviz.TRANS_DURATION).call(yAxis);

  let bars = svg
    .selectAll(".bar")
    .data(data, (d) => d.code)
    .join(
      (enter) => {
        return enter
          .append("rect")
          .attr("class", "bar")
          .attr("x", xPaddingLeft);
      }
      // (update) => update,
      // (exit) => {
      //   return exit.remove()
      // }
    )
    .classed("active", function (d) {
      return d.key === nbviz.activeCountry;
    })
    .transition()
    .duration(nbviz.TRANS_DURATION)
    .attr("x", (d) => xScale(d.code))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value));
};

nbviz.callbacks.push(() => {
  let data = nbviz.getCountryData();
  updateBarChart(data);
});

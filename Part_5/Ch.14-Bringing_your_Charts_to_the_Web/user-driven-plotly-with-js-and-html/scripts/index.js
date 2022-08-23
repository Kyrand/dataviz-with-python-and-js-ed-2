window.d3 = d3;
let data;
d3.json("data/nobel_winners.json").then((_data) => {
  console.log(_data);
  data = _data;
  updateChart();
});

let selectedGroup = "gender";

function updateChart() {
  var traces = [
    {
      type: "violin",
      x: data.map((d) => d[selectedGroup]),
      y: data.map((d) => d.award_age),
      points: "none",
      box: {
        visible: true,
      },
      line: {
        color: "green",
      },
      meanline: {
        visible: true,
      },
    },
  ];

  var layout = {
    title: "Age distributions of the Nobel prize-winners",
    yaxis: {
      zeroline: false,
      title: "award age",
    },
    xaxis: {
      categoryorder: "category ascending",
    },
  };

  Plotly.react("violin-group", traces, layout);
}

let availableGroups = ["gender", "category"];
availableGroups.forEach((g) => {
  d3.select("#nobel-group")
    .append("option")
    .property("selected", g === selectedGroup)
    .attr("value", g)
    .text(g);
});

d3.select("#nobel-group").on("change", function (e) {
  selectedGroup = d3.select(this).property("value");
  updateChart(data);
});

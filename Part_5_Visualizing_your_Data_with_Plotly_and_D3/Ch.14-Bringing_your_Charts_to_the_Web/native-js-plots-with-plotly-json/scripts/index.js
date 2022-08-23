window.d3 = d3;
d3.json("data/nobel_winners.json").then((data) => {
  console.log(data);
  makeChart(data);
});

function makeChart(data) {
  let cat_groups = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.gender,
    (d) => d.category
  );
  let male = cat_groups.get("male");
  let female = cat_groups.get("female");
  let categories = [...male.keys()].sort();
  let traceM = {
    y: categories,
    x: categories.map((c) => male.get(c)),
    name: "male prize total",
    type: "bar",
    orientation: "h",
  };
  let traceF = {
    y: categories,
    x: categories.map((c) => female.get(c)),
    name: "female prize total",
    type: "bar",
    orientation: "h",
  };

  let traces = [traceM, traceF];
  let layout = { barmode: "group", margin: { l: 160 } };

  Plotly.newPlot("gender-category", traces, layout);
}

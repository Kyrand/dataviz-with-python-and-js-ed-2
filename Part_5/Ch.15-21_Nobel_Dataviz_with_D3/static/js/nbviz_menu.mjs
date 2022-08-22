import nbviz from "./nbviz_core.mjs";

let catList = [nbviz.ALL_CATS].concat(nbviz.CATEGORIES);

let catSelect = d3.select("#cat-select select");

catSelect
  .selectAll("option")
  .data(catList)
  .join("option")
  .attr("value", (d) => d)
  .html((d) => d);

catSelect.on("change", function (d) {
  let category = d3.select(this).property("value");
  nbviz.filterByCategory(category);
  nbviz.onDataChange();
});

d3.select("#gender-select select").on("change", function (d) {
  let gender = d3.select(this).property("value");
  if (gender === "All") {
    // Reset the filter to all genders
    nbviz.genderDim.filter();
  } else {
    nbviz.genderDim.filter(gender);
  }
  nbviz.onDataChange();
});

// Country selector

export let initMenu = function () {
  let ALL_WINNERS = "All Countries";
  let SINGLE_WINNERS = "Single Winning Countries";
  let DOUBLE_WINNERS = "Double Winning Countries";

  let nats = (nbviz.countrySelectGroups = nbviz.countryDim
    .group()
    .all()
    .sort(function (a, b) {
      return b.value - a.value; // descending
    }));

  let fewWinners = { 1: [], 2: [] };
  let selectData = [ALL_WINNERS];

  nats.forEach(function (o) {
    if (o.value > 2) {
      selectData.push(o.key);
    } else {
      fewWinners[o.value].push(o.key);
    }
  });

  selectData.push(DOUBLE_WINNERS, SINGLE_WINNERS);

  let countrySelect = d3.select("#country-select select");

  countrySelect
    .selectAll("option")
    .data(selectData)
    .join("option")
    .attr("value", (d) => d)
    .html((d) => d);

  countrySelect.on("change", function (d) {
    let countries;
    let country = d3.select(this).property("value");

    if (country === ALL_WINNERS) {
      countries = [];
    } else if (country === DOUBLE_WINNERS) {
      countries = fewWinners[2];
    } else if (country === SINGLE_WINNERS) {
      countries = fewWinners[1];
    } else {
      countries = [country];
    }
    nbviz.filterByCountries(countries);
    nbviz.onDataChange();
  });

  d3.selectAll("#metric-radio input").on("change", function () {
    let val = d3.select(this).property("value");
    nbviz.valuePerCapita = parseInt(val);
    nbviz.onDataChange();
  });
};

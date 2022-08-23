let nbviz = {};
nbviz.ALL_CATS = "All Categories";
nbviz.TRANS_DURATION = 2000;
nbviz.MAX_CENTROID_RADIUS = 30;
nbviz.MIN_CENTROID_RADIUS = 2;
nbviz.COLORS = { palegold: "#E6BE8A" };

nbviz.data = {};
nbviz.valuePerCapita = 0;
nbviz.activeCountry = null;
nbviz.activeCategory = nbviz.ALL_CATS;

nbviz.CATEGORIES = [
  "Chemistry",
  "Economics",
  "Literature",
  "Peace",
  "Physics",
  "Physiology or Medicine",
];

nbviz.categoryFill = function (category) {
  let i = nbviz.CATEGORIES.indexOf(category);
  return d3.schemeCategory10[i];
};

nbviz.nestDataByYear = function (entries) {
  let yearGroups = d3.group(entries, (d) => d.year);
  let keyValues = Array.from(yearGroups, ([key, values]) => {
    let year = key;
    let prizes = values;
    prizes = prizes.sort((p1, p2) => (p1.category > p2.category ? 1 : -1));
    return { key: year, values: prizes };
  });
  console.log(keyValues);
  return keyValues;
};

nbviz.makeFilterAndDimensions = function (winnersData) {
  // ADD OUR FILTER AND CREATE CATEGORY DIMENSIONS
  nbviz.filter = crossfilter(winnersData);
  nbviz.countryDim = nbviz.filter.dimension(function (o) {
    return o.country;
  });

  nbviz.categoryDim = nbviz.filter.dimension(function (o) {
    return o.category;
  });

  nbviz.genderDim = nbviz.filter.dimension(function (o) {
    return o.gender;
  });
};

nbviz.filterByCountries = function (countryNames) {
  if (!countryNames.length) {
    nbviz.countryDim.filter();
  } else {
    nbviz.countryDim.filter(function (name) {
      return countryNames.indexOf(name) > -1;
    });
  }

  if (countryNames.length === 1) {
    nbviz.activeCountry = countryNames[0];
  } else {
    nbviz.activeCountry = null;
  }
};

nbviz.filterByCategory = function (cat) {
  nbviz.activeCategory = cat;

  if (cat === nbviz.ALL_CATS) {
    nbviz.categoryDim.filter();
  } else {
    nbviz.categoryDim.filter(cat);
  }
};

nbviz.getCountryData = function () {
  let countryGroups = nbviz.countryDim.group().all();

  // make main data-ball
  let data = countryGroups
    .map(function (c) {
      let cData = nbviz.data.countryData[c.key];
      let value = c.value;
      // if per-capita value then divide by pop. size
      if (nbviz.valuePerCapita) {
        value /= cData.population;
      }
      return {
        key: c.key,
        value: value,
        code: cData.alpha3Code,
        // population: cData.population
      };
    })
    .sort(function (a, b) {
      return b.value - a.value; // descending
    });

  return data;
};

nbviz.callbacks = [];

nbviz.onDataChange = function () {
  nbviz.callbacks.forEach((cb) => cb());
};

export default nbviz;

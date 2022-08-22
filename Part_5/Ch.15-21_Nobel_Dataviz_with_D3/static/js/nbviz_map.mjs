import nbviz from "./nbviz_core.mjs";

let defaultMapWidth = 960,
  defaultMapHeight = 480;

// DIMENSIONS AND SVG
let mapContainer = d3.select("#nobel-map");
let boundingRect = mapContainer.node().getBoundingClientRect();
let width = boundingRect.width,
  height = boundingRect.height;

let svg = mapContainer.append("svg");

let MANUAL_CENTROIDS = {
  France: [2, 46],
  "United States": [-98, 35, 39.5],
};

// A FEW D3 PROJECTIONS
// default scale = 153
let projection_eq = d3
  .geoEquirectangular()
  .scale(193 * (height / 480))
  .center([15, 15])
  // .translate([0.9* width / 2, 1.2* height / 2])
  .translate([width / 2, height / 2])
  .precision(0.1);

let projection_cea = d3
  .geoConicEqualArea()
  .center([0, 26])
  .scale(128)
  .translate([width / 2, height / 2])
  .precision(0.1);

let projection_ceq = d3
  .geoConicEquidistant()
  .center([0, 22])
  .scale(128)
  .translate([width / 2, height / 2])
  .precision(0.1);

let projection_merc = d3
  .geoMercator()
  .scale((width + 1) / 2 / Math.PI)
  .translate([width / 2, height / 2])
  .precision(0.1);
// END PROJECTIONS
// We use the equirectangular projection for the Nobel-viz
let projection = projection_eq;

let path = d3.geoPath().projection(projection);

// ADD GRATICULE (MAP GRID)
let graticule = d3.geoGraticule().step([20, 20]);

svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);

let getCentroid = function (mapData) {
  let latlng = nbviz.data.countryData[mapData.name].latlng;
  return projection([latlng[1], latlng[0]]);
};

let radiusScale = d3
  .scaleSqrt()
  .range([nbviz.MIN_CENTROID_RADIUS, nbviz.MAX_CENTROID_RADIUS]);

let cnameToCountry = {};
// called when the Noble-viz is initialised with the Nobel dataset
export let initMap = function (world, names) {
  // geojson objects extracted from topojson features
  let land = topojson.feature(world, world.objects.land),
    countries = topojson.feature(world, world.objects.countries).features,
    borders = topojson.mesh(world, world.objects.countries, function (a, b) {
      return a !== b;
    });

  let idToCountry = {};
  countries.forEach(function (c) {
    idToCountry[c.id] = c;
  });

  cnameToCountry = {};
  names.forEach(function (n) {
    cnameToCountry[n.name] = idToCountry[n.id];
  });

  // MAIN WORLD MAP
  svg
    .insert("path", ".graticule")
    .datum(land)
    .attr("class", "land")
    .attr("d", path);

  // WINNING COUNTRIES
  svg.insert("g", ".graticule").attr("class", "countries");

  // COUNTRIES VALUE-INDICATORS
  svg.insert("g").attr("class", "centroids");

  // BOUNDRY MARKS
  svg
    .insert("path", ".graticule")
    // filter separates exterior from interior arcs...
    .datum(borders)
    .attr("class", "boundary")
    .attr("d", path);
};

let tooltip = d3.select("#map-tooltip");
let updateMap = function (countryData) {
  let mapData = (nbviz.mapData = countryData
    .filter((d) => d.value > 0)
    .map(function (d) {
      return {
        geo: cnameToCountry[d.key],
        name: d.key,
        number: d.value,
      };
    }));

  let maxWinners = d3.max(
    mapData.map(function (d) {
      return d.number;
    })
  );
  // DOMAIN OF VALUE-INDINCATOR SCALE
  radiusScale.domain([0, maxWinners]);

  let countries = svg
    .select(".countries")
    .selectAll(".country")
    .data(mapData, function (d) {
      return d.name;
    });

  countries
    .join(
      (enter) => {
        return enter
          .append("path")
          .attr("class", "country")
          .attr("name", function (d) {
            return d.name;
          })
          .on("mouseenter", function (event, d) {
            // console.log('Entered ' + d.name);
            let country = d3.select(this);
            if (!country.classed("visible")) {
              return;
            }

            let cData = country.datum();
            let prize_string =
              cData.number === 1 ? " prize in " : " prizes in ";
            tooltip.select("h2").text(cData.name);
            tooltip
              .select("p")
              .text(cData.number + prize_string + nbviz.activeCategory);
            let borderColor =
              nbviz.activeCategory === nbviz.ALL_CATS
                ? "goldenrod"
                : nbviz.categoryFill(nbviz.activeCategory);
            tooltip.style("border-color", borderColor);

            let w = parseInt(tooltip.style("width")),
              h = parseInt(tooltip.style("height"));

            let mouseCoords = d3.pointer(event);
            tooltip.style("top", mouseCoords[1] - h + "px");
            tooltip.style("left", mouseCoords[0] - w / 2 + "px");

            d3.select(this).classed("active", true);
          })
          .on("mouseout", function (d) {
            tooltip.style("left", "-9999px");
            d3.select(this).classed("active", false);
          });
      },
      (update) => update,
      (exit) => {
        return exit
          .classed("visible", false)
          .transition()
          .duration(nbviz.TRANS_DURATION)
          .style("opacity", 0);
      }
    )
    .classed("visible", true)
    .transition()
    .duration(nbviz.TRANS_DURATION)
    .style("opacity", 1)
    .attr("d", (d) => path(d.geo));

  let centroids = svg
    .select(".centroids")
    .selectAll(".centroid")
    .data(mapData, function (d) {
      return d.name;
    });

  centroids
    .join(
      (enter) => {
        return enter
          .append("circle")
          .attr("class", "centroid")
          .attr("name", (d) => d.name)
          .attr("cx", (d) => getCentroid(d)[0])
          .attr("cy", (d) => getCentroid(d)[1]);
      },
      (update) => update,
      (exit) => exit.style("opacity", 0)
    )
    .classed("active", (d) => d.name === nbviz.activeCountry)
    .transition()
    .duration(nbviz.TRANS_DURATION)
    .style("opacity", 1)
    .attr("r", (d) => radiusScale(+d.number));
};

nbviz.callbacks.push(() => {
  let data = nbviz.getCountryData();
  updateMap(data);
});

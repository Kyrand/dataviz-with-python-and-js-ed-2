d3.json("data/nobel_winners_cleaned.json").then((data) => {
  d3.select("h2#data-title").text("All the Nobel-winners");
  d3.select("div#data pre").html(JSON.stringify(data, null, 4));
});

import nbviz from './nbviz_core.mjs'
import { initMenu } from './nbviz_menu.mjs'
import { initMap } from './nbviz_map.mjs'
import './nbviz_bar.mjs'
import './nbviz_details.mjs'
import './nbviz_time.mjs'

Promise.all([
  d3.json('static/data/world-110m.json'),
  d3.csv('static/data/world-country-names-nobel.csv'),
  d3.json('static/data/winning_country_data.json'),
  d3.json('static/data/nobel_winners_biopic.json'),
]).then(ready)

function ready([worldMap, countryNames, countryData, winnersData]) {
  // STORE OUR COUNTRY-DATA DATASET
  nbviz.data.countryData = countryData
  nbviz.data.winnersData = winnersData
  // MAKE OUR FILTER AND ITS DIMENSIONS
  nbviz.makeFilterAndDimensions(winnersData)
  // INITIALIZE MENU AND MAP
  initMenu()
  initMap(worldMap, countryNames)
  // TRIGGER UPDATE WITH FULL WINNERS' DATASET
  nbviz.onDataChange()
}

# Visualizing the Nobel Prize

This dataviz uses the Nobel dataset scraped from Wikipedia (see Ch. 6) and D3. Chapters 15-21 show how it's done.

The code consists of an HTML entry-point, `index.html` and a `static` folder containing the CSS, JavaScript, data and assets (images) used by the dataviz.

The `static/js` folder has the JS modules for the components of the dataviz.

## Running the Visualization

You can use Python's built-in `http` module to run the dataviz. Just call it from the command-line and then visit the `localhost` address shown (8000 by default):

> python -m http.server
> Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...

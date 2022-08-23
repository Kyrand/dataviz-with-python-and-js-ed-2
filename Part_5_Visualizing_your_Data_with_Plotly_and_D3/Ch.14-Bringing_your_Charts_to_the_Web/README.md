# Bringing your charts to the web with Matplotlib and Plotly

In this chapter we'll see how to bring the fruits of your Pandas data cleaning and exploration to the web. Often a good static visualization is a great way to present data and we'll start by showing how you can use Matplotlib to do just that. Sometimes user interaction can really enrich a data visualization - we'll see how Python's Plotly library can be used to create interactive visualizations in a Jupyter notebook and transfer these, user interactions (UI) and all, to a web-page.

We'll also see how learning Plotly's Python library gives you competence with a native JavaScript library, which can really extend the possibilities of your web dataviz. We'll demonstrate this by creating some simple JS UI to update our native Plotly charts.

## The code

You'll find the code for this chapter broken down by section in separate folders as well as a Python notebook for the Python code used.

## Running the examples

Each folder contains an ++index.html++ file which can be run with a web-server.

You can use Python's built-in `http` module to run the examples. Just call it from the command-line and then visit the `localhost` address shown (8000 by default):

```bash
$ python -m http.server
  Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)
```

So to see the `native-js-plots-with-plotly` code just run the server from this root directory and navigate to:

> http://localhost:8000/native-js-plots-with-plotly

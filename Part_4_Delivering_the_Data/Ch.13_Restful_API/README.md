## RESTful Data with Flask

In the last chapter we saw how to build a very simple
data API with Flask and dataset. For many simple data visualizations this kind of
quick and dirty API is fine but as the data demands become more advanced it helps
to have an API that respects some conventions for retrieval and, sometimes, creation,
update and delete. In “Using Python to Consume Data from a Web API” we covered the types of web API and why RESTful
APIs are acquiring a well deserved prominence. In this chapter we’ll see how easy it is to combine a few Flask
libraries into a flexible RESTful API.

### The Basic RESTful API

Run the following from the command-line to see the basic API in action:

```bash
$ python api.py
 * Serving Flask app 'api' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 199-874-577
```

You can then test the API using curl from the command-line:

```bash
$ curl http://localhost:5000/winners/
[
  {
    "award_age": 57,
    "category": "Physiology or Medicine",
    "country": "Argentina",
    "date_of_birth": "1927-10-08",
    "date_of_death": "2002-03-24",
    "gender": "male",
    "link": "http://en.wikipedia.org/wiki/C%C3%A9sar_Milstein",
    "name": "C\u00e9sar Milstein",
    "place_of_birth": "Bah\u00eda Blanca ,  Argentina",
    "place_of_death": "Cambridge , England",
    "text": "C\u00e9sar Milstein , Physiology or Medicine, 1984",
    "year": 1984
  },
  {
    "award_age": 80,
    "category": "Peace",
    "country": "Belgium",
    "date_of_birth": "1829-07-26",
  ...}]
```

Or fetch an individual winner's details by ID (/winners/<ID>/)

```bash
$ curl http://localhost:5000/winners/10/
{
 "award_age": 60,
 "category": "Chemistry",
 "country": "Belgium",
 "date_of_birth": "1917-01-25",
 "date_of_death": "2003-05-28",
 "gender": "male",
 "link": "http://en.wikipedia.org/wiki/Ilya_Prigogine",
 "name": "Ilya Prigogine",
 "place_of_birth": "Moscow , Russia",
 "place_of_death": "Brussels , Belgium",
 "text": "Ilya Prigogine , born in Russia , Chemistry, 1977",
 "year": 1977
}
```

You can also post data to the API:

```bash
$ curl http://localhost:5000/winners/ \
 -X POST \
 -H "Content-Type: application/json" \
 -d '{"category":"Physics","year":2021,
 "name":"Syukuro Manabe","country":"Japan"}'
```

## Delivering the Data

In previous chapters we showed how to grab your data of interest from the Web with a web scraper.
We used Scrapy to fetch a dataset of Nobel Prize winners and then in Chapters 9 and
11 we cleaned and explored the Nobel Prize dataset using Pandas.

This chapter shows how to deliver data statically or dynamically from a
Python server to JavaScript on the client/browser, using our Nobel Prize dataset as an
example. This data is stored in the JSON format and consists of a list of Nobel Prize–
winner objects like this one:

```json
[
 {
 "category": "Physiology or Medicine",
 "country": "Argentina",
 "date_of_birth": "1927-10-08T00:00:00.000Z",
 "date_of_death": "2002-03-24T00:00:00.000Z",
 "gender": "male",
 "link": "http:\/\/en.wikipedia.org\/wiki\/C%C3%A9sar_Milstein",
 "name": "C\u00e9sar Milstein",
 "place_of_birth": "Bah\u00eda Blanca , Argentina",
 "place_of_death": "Cambridge , England",
 "text": "C\u00e9sar Milstein , Physiology or Medicine, 1984",
 "year": 1984,
 "award_age": 57
 }
 ...
]
```

### Running the servers

To run the Flask servers just run the server module from the command line. So this runs the Jinja examples:

```bash
$ python server_jinja.py
 * Serving Flask app 'server_jinja' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:8000 (Press CTRL+C to quit)
 ...
```

### The simple SQL API

To run this:

> $ python server_sql.py

You can then test using Curl from the command-line:

> $ curl -d category=Physics -d country=Japan --get http://localhost:8000/api/

This returns the required JSON data:

```
[{"index": 761, "category": "Physics", "country": "Japan",
"date_of_birth": "1907-01-23T00:00:00", "date_of_death": "1981-09-08T00:00:00",
"gender": "male", "link": "http://en.wikipedia.org/wiki/Hideki_Yukawa",
"name": "Hideki Yukawa", "place_of_birth": "Tokyo , Japan",
"place_of_death": "Kyoto , Japan", "text": "Hideki Yukawa , Physics, 1949",
"year": 1949, "award_age": 42}, {"index": 762, "category": "Physics",
"country": "Japan", "date_of_birth": "1906-03-31T00:00:00",
"date_of_death": "1979-07-08T00:00:00", "gender": "male", ... }]
```

You can also test the API from the browser. This URL: http://localhost:8000/api/winners?country=United%20Kingdom&category=Physics should return:

```
[{"index": 146, "category": "Physics", "country": "United Kingdom", "date_of_birth": "1902-08-08T00:00:00", "date_of_death": "1984-10-20T00:00:00", "gender": "male", "link": "http://en.wikipedia.org/wiki/Paul_Dirac", "name": "Paul Dirac", "place_of_birth": "Bristol , England", "place_of_death": "Tallahassee, Florida , US", "text": "Paul Dirac , Physics, 1933", "year": 1933, "award_age": 31}, {"index": 149, "category": "Physics", "country": "United Kingdom", "date_of_birth": "1891-10-20T00:00:00", "date_of_death": "1974-07-24T00:00:00", "gender": "male", "link": "http://en.wikipedia.org/wiki/James_Chadwick", "name": "James Chadwick", "place_of_birth": "Bollington, Cheshire, England", "place_of_death": "Cambridge, England", "text": "James Chadwick , Physics, 1935", "year": 1935, "award_age": 44}, ... ]
```

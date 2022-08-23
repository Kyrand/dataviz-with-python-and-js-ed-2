from flask import Flask, request, abort
import dataset
# json_util provides handy bson <-> json en(de)coders
#from bson.json_util import dumps, loads, default
# create basic server app, setting static path to root directory
import json
import datetime
app = Flask(__name__)
# our dataset connection1
db = dataset.connect('sqlite:///data/nobel_winners_cleaned.db') 
# our RESTful winners URI
@app.route('/api/winners')
def get_country_data():
    """This API end-point uses the request arguments to make an SQL query on our Nobel winners' database. So the URL http://localhost:8000/api/winners?country=United%20Kingdom&category=Physics will return all the UK Physics winners."""
    app.logger.info('Request args: ' + str(dict(request.args)))
    query_dict = {}
    for key in ['country', 'category', 'year']:
        arg = request.args.get(key)
        if arg:
            query_dict[key] = arg
            
    winners = list(db['winners'].find(**query_dict))
    if winners:
        return dumps(winners)
    abort(404) # resource not found


class JSONDateTimeEncoder(json.JSONEncoder): 
    def default(self, obj):
        if isinstance(obj, (datetime.date, datetime.datetime)): 
            return obj.isoformat()
        else:
            return json.JSONEncoder.default(self, obj)

def dumps(obj):
    return json.dumps(obj, cls=JSONDateTimeEncoder) 
    
# standard Python test for the main program, run from command-line 
if __name__=='__main__':
    app.run(port=8000, debug=True)

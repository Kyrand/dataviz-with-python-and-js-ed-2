# import Flask server class
from flask import Flask, render_template
# create basic server app, setting static path to root directory
app = Flask(__name__)
# / route and its view, index.html
@app.route('/')
def index():
    return 'Hello World!'
    # return render_template('index.html', message='Hello World!')
# standard Python test for the main program, run from command-line 
if __name__=='__main__':
    #app.run(port=8000, debug=True)
    app.run(port=8000)

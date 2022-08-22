# import Flask server class
from flask import Flask, render_template
# create basic server app, setting static path to root directory
app = Flask(__name__)
# Some nobel prize winners
winners = [
    {'name': 'Albert Einstein', 'category': 'Physics'},
    {'name': 'V.S. Naipaul', 'category': 'Literature'},
    {'name': 'Dorothy Hodgkin', 'category': 'Chemistry'}
]


@app.route('/')
def index():
    """Uses the index.html Jinja template (in template dir) to render a message."""
    return render_template('index.html', message='Hello World!')


@app.route('/winners')
def winners_list():
    """Uses the winner_list Jinja template to render a list of winners."""
    return render_template('winner_list.html',
                           heading="A little winners' list",
                           winners=winners
                           )


if __name__ == '__main__':
    app.run(port=8000, debug=True)

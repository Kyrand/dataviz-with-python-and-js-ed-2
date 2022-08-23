from re import A
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/nobel_winners_cleaned_api_test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)
# Init marshmallow
ma = Marshmallow(app)


class Winner(db.Model):
    __tablename__ = 'winners'
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String)
    country = db.Column(db.String)
    date_of_birth = db.Column(db.String)
    date_of_death = db.Column(db.String)
    gender = db.Column(db.String)
    link = db.Column(db.String)
    name = db.Column(db.String)
    place_of_birth = db.Column(db.String)
    place_of_death = db.Column(db.String)
    text = db.Column(db.Text)
    year = db.Column(db.Integer)
    award_age = db.Column(db.Integer)

    def __repr__(self):
        return "<Winner(name='%s', category='%s', year='%s')>"\
            % (self.name, self.category, self.year)


class WinnerSchema(ma.Schema):
    class Meta:
        model = Winner
        fields = ('category', 'country', 'date_of_birth', 'date_of_death',
                  'gender', 'link', 'name', 'place_of_birth', 'place_of_death', 'text', 'year', 'award_age')


winner_schema = WinnerSchema()
winners_schema = WinnerSchema(many=True)


@app.route('/winners/')
def winner_list():
    """This route fetches winners from the SQL database, using request arguments to form the SQL query. So '/winners/?country=Australia&category=Physics' fetches all winning Australian Physicists."""
    valid_filters = ('year', 'category', 'gender', 'country', 'name')
    filters = request.args.to_dict()
    args = {name: value for name, value in filters.items()
            if name in valid_filters}
    # This for loop does the same job as the dict comprehension above
    # for vf in valid_filters:
    #     if vf in filters:
    #         args[vf] = filters.get(vf)
    app.logger.info(f'Filtering with the fields: {args}')
    all_winners = Winner.query.filter_by(**args)
    result = winners_schema.jsonify(all_winners)
    return result


@app.route('/winners/', methods=['POST'])
def add_winner():
    valid_fields = winner_schema.fields
    winner_data = {name: value for name,
                   value in request.json.items() if name in valid_fields}
    app.logger.info(f"Creating a winner with these fields: {winner_data}")
    new_winner = Winner(**winner_data)
    db.session.add(new_winner)
    db.session.commit()
    return winner_schema.jsonify(new_winner)


@app.route('/winners/<id>/')
def winner_detail(id):
    winner = Winner.query.get_or_404(id)
    result = winner_schema.jsonify(winner)
    return result


@app.route('/winners/<id>/', methods=['PATCH'])
def update_winner(id):
    winner = Winner.query.get_or_404(id)
    valid_fields = winner_schema.fields
    winner_data = {name: value for name,
                   value in request.json.items() if name in valid_fields}
    app.logger.info(f"Updating a winner with these fields: {winner_data}")
    for k, v in winner_data.items():
        setattr(winner, k, v)
    db.session.commit()
    return winner_schema.jsonify(winner)


if __name__ == '__main__':
    app.run(debug=True)

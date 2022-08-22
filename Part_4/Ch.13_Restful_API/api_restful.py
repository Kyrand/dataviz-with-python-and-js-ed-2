from re import A
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
# from flask_restful import Api, Resource, reqparse
from flask.views import MethodView
import urllib.parse
# Init app
app = Flask(__name__)
# Database
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


def make_pagination_links(url, results):
    pag = results['pagination']
    #query_string = ''
    # for k, v in results['filters'].items():
    #     query_string += '&%s=%s' % (str(k), str(v))
    query_string = urllib.parse.urlencode(results['filters'])

    page = pag['page']
    if page > 1:
        prev_page = '?_page%d_per-page%s%d' % (page-1,
                                               pag['per_page'], query_string)
    else:
        prev_page = ''

    if page < pag['pages']:
        next_page = '?_page%d_per-page%d%s' % (page+1,
                                               pag['per_page'], query_string)
    else:
        next_page = ''

    pag['prev_page'] = prev_page
    pag['next_page'] = next_page


class WinnersListPaginatedView(MethodView):
    def get(self):
        valid_filters = ('year', 'category', 'gender', 'country', 'name')
        filters = request.args.to_dict()
        args = {name: value for name, value in filters.items()
                if name in valid_filters}
        app.logger.info(f'Filtering with the {args} fields')

        page = request.args.get("_page", 1, type=int)
        per_page = request.args.get("_per-page", 20, type=int)

        winners = Winner.query.filter_by(**args).paginate(page, per_page)
        winners_dumped = winners_schema.dump(winners.items)

        results = {
            "results": winners_dumped,
            "filters": args,
            "pagination":
            {
                "count": winners.total,
                "page": page,
                "per_page": per_page,
                "pages": winners.pages,
            },
        }

        make_pagination_links('winners', results)

        return jsonify(results)

    def post(self):
        valid_fields = winner_schema.fields
        # args = request.args.to_dict()
        winner_data = {name: value for name,
                       value in request.json.items() if name in valid_fields}
        app.logger.info(f"Creating a winner with these fields: {winner_data}")
        new_winner = Winner(**winner_data)
        db.session.add(new_winner)
        db.session.commit()
        return winner_schema.jsonify(new_winner)


class WinnersListView(MethodView):
    def get(self):
        valid_filters = ('year', 'category', 'gender', 'country', 'name')
        filters = request.args.to_dict()
        args = {name: value for name, value in filters.items()
                if name in valid_filters}
        app.logger.info(f'Filtering with the {args} fields')
        all_winners = Winner.query.filter_by(**args)
        result = winners_schema.jsonify(all_winners)
        return result

    def post(self):
        valid_fields = winner_schema.fields
        # args = request.args.to_dict()
        winner_data = {name: value for name,
                       value in request.json.items() if name in valid_fields}
        app.logger.info(f"Creating a winner with these fields: {winner_data}")
        new_winner = Winner(**winner_data)
        db.session.add(new_winner)
        db.session.commit()
        return winner_schema.jsonify(new_winner)


app.add_url_rule("/winners/",
                 view_func=WinnersListPaginatedView.as_view("winners_list_view"))


class WinnerView(MethodView):

    def get(self, winner_id):
        winner = Winner.query.get_or_404(winner_id)
        result = winner_schema.jsonify(winner)
        return result

    def patch(self, winner_id):
        winner = Winner.query.get_or_404(winner_id)
        valid_fields = winner_schema.fields
        winner_data = {name: value for name,
                       value in request.json.items() if name in valid_fields}
        app.logger.info(f"Updating a winner with these fields: {winner_data}")
        for k, v in winner_data.items():
            setattr(winner, k, v)
        db.session.commit()
        return winner_schema.jsonify(winner)

    def delete(self, winner_id):
        winner = Winner.query.get_or_404(winner_id)
        db.session.delete(winner)
        db.session.commit()
        return '', 204


app.add_url_rule("/winners/<winner_id>",
                 view_func=WinnerView.as_view("winner_view"))

if __name__ == '__main__':
    app.run(debug=True)

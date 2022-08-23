from re import A
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
# from flask_restful import Api, Resource, reqparse
from flask.views import MethodView
from flask_cors import CORS
# Init app
app = Flask(__name__)
CORS(app)
# Database
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
#     os.path.join(basedir, '/data/nobel_winners_cleaned.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/nobel_winners_cleaned_api_test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)
# Init marshmallow
ma = Marshmallow(app)
# Init flask-restful API
#api = Api(app)


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
    # sex = Column(Enum('male', 'female'))

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
    query_string = ''
    for k, v in results['filters'].items():
        query_string += '&%s=%s' % (str(k), str(v))

    page = pag['page']
    if page > 1:
        prev_page = url + '?_page=%d&_per-page=%d%s' % (page-1,
                                                        pag['per_page'], query_string)
    else:
        prev_page = ''

    if page < pag['pages']:
        next_page = url + '?_page=%d&_per-page=%d%s' % (page+1,
                                                        pag['per_page'], query_string)
    else:
        next_page = ''

    pag['prev_page'] = prev_page
    pag['next_page'] = next_page


class WinnersListPaginatedView(MethodView):
    def get(self):
        valid_filters = ('year', 'category', 'gender', 'country', 'name')
        filters = request.args.to_dict()
        args = {}
        for vf in valid_filters:
            if vf in filters:
                args[vf] = filters.get(vf)
        app.logger.info('Filtering with the %s fields' % (str(args)))

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

        make_pagination_links('winners/', results)

        return jsonify(results)

    def post(self):
        valid_fields = winner_schema.fields
        # args = request.args.to_dict()
        winner_data = {}
        for vf in valid_fields:
            if vf in request.json:
                winner_data[vf] = request.json.get(vf)
        app.logger.info("Creating a winner with these fields: %s" %
                        str(winner_data))
        new_winner = Winner(**winner_data)
        db.session.add(new_winner)
        db.session.commit()
        return winner_schema.jsonify(new_winner)


class WinnersListView(MethodView):
    def get(self):
        valid_filters = ('year', 'category', 'gender', 'country', 'name')
        filters = request.args.to_dict()
        args = {}
        for vf in valid_filters:
            if vf in filters:
                args[vf] = filters.get(vf)
        app.logger.info('Filtering with the %s fields' % (str(args)))
        all_winners = Winner.query.filter_by(**args)
        result = winners_schema.jsonify(all_winners)
        return result

    def post(self):
        valid_fields = winner_schema.fields
        # args = request.args.to_dict()
        winner_data = {}
        for vf in valid_fields:
            if vf in request.json:
                winner_data[vf] = request.json.get(vf)
        app.logger.info("Creating a winner with these fields: %s" %
                        str(winner_data))
        new_winner = Winner(**winner_data)
        db.session.add(new_winner)
        db.session.commit()
        return winner_schema.jsonify(new_winner)


#api.add_resource(WinnersListPaginatedResource, '/winners/')
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
        winner_data = {}
        for vf in valid_fields:
            if vf in request.json:
                winner_data[vf] = request.json.get(vf)
        app.logger.info("Updating a winner with these fields: %s" %
                        str(winner_data))
        # new_winner = Winner(**winner_data)
        # db.session.add(new_winner)
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

#api.add_resource(WinnerResource, '/winners/<int:winner_id>')


# @app.route('/winners/')
# def winner_list():
#     all_winners = Winner.query.all()
#     result = winners_schema.dump(all_winners)
#     return jsonify(result)

# @app.route('/winners/')
# def winner_list():
#     valid_filters = ('year', 'category', 'gender', 'country', 'name')
#     filters = request.args.to_dict()
#     args = {}
#     for vf in valid_filters:
#         if vf in filters:
#             args[vf] = filters.get(vf)
#     app.logger.info('Filtering with the %s fields' % (str(args)))
#     all_winners = Winner.query.filter_by(**args)
#     result = winners_schema.jsonify(all_winners)
#     return result


# @app.route('/winners/', methods=['POST'])
# def add_winner():
#     valid_fields = winner_schema.fields
#     #args = request.args.to_dict()
#     winner_data = {}
#     for vf in valid_fields:
#         if vf in request.json:
#             winner_data[vf] = request.json.get(vf)
#     app.logger.info("Creating a winner with these fields: %s" %
#                     str(winner_data))
#     new_winner = Winner(**winner_data)
#     db.session.add(new_winner)
#     db.session.commit()
#     return winner_schema.jsonify(new_winner)


# @app.route('/winners/<id>/')
# def winner_detail(id):
#     winner = Winner.query.get_or_404(id)
#     result = winner_schema.jsonify(winner)
#     return result


# @app.route('/winners/<id>/', methods=['PUT'])
# def update_winner(id):
#     winner = Winner.query.get_or_404(id)
#     valid_fields = winner_schema.fields
#     winner_data = {}
#     for vf in valid_fields:
#         if vf in request.json:
#             winner_data[vf] = request.json.get(vf)
#     app.logger.info("Updating a winner with these fields: %s" %
#                     str(winner_data))
#     #new_winner = Winner(**winner_data)
#     # db.session.add(new_winner)
#     for k, v in winner_data.items():
#         setattr(winner, k, v)
#     db.session.commit()
#     return winner_schema.jsonify(winner)
if __name__ == '__main__':
    app.run(debug=True)
# winner_schema = WinnerSchema()
# winners_schema = WinnerSchema(many=True)

# from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, BigInteger
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()


# class Winner(Base):
#     __tablename__ = 'winners'
#     id = Column(Integer, primary_key=True)
#     category = Column(Text)
#     country = Column(Text)
#     date_of_birth = Column(DateTime)
#     date_of_death = Column(DateTime)
#     gender = Column(Text)
#     link = Column(Text)
#     name = Column(Text)
#     place_of_birth = Column(Text)
#     place_of_death = Column(Text)
#     text = Column(Text)
#     year = Column(BigInteger)
#     award_age = Column(BigInteger)
#     #sex = Column(Enum('male', 'female'))

#     def __repr__(self):
#         return "<Winner(name='%s', category='%s', year='%s')>"\
#             % (self.name, self.category, self.year)


# CREATE TABLE winners ( "index" BIGINT,
# category TEXT,
# country TEXT,
# date_of_birth DATETIME,
# date_of_death DATETIME,
# gender TEXT,
# link TEXT,
# name TEXT,
# place_of_birth TEXT,
# place_of_death TEXT,
# text TEXT,
# year BIGINT,
# award_age BIGINT )

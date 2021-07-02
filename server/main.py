from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from resources.filtered_repositories import FilteredRepositories
from resources.repositories import Repositories

app = Flask(__name__)
CORS(app)
app.secret_key = 'any random string'
api = Api(app)

api.add_resource(Repositories, "/repositories")
api.add_resource(FilteredRepositories, "/repositories/filter")

if __name__ == "__main__":
    app.run(debug=True)

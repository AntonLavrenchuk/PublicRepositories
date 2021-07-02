from flask import Flask, jsonify
from flask_restful import Api, Resource
import requests
from flask_cors import CORS

from parameters_factory import ParametersFactory
from repository_factory import RepositoryFactory

app = Flask(__name__)
CORS(app)
app.secret_key = 'any random string'
api = Api(app)


def getQueriesRemaining():
    response = requests.get('https://api.github.com/rate_limit')

    return response.json()['resources']['core']['remaining']


def getResponse(received_repositories):
    repositories = []

    # to request just 2 repositories
    for i in range(2):
        factory = RepositoryFactory(received_repositories[i])

        try:
            repository = factory.create()
        except:
            return "We run out of requests", 500  # limit: 60

        repositories.append(repository)

    response = jsonify(repositories)

    response.headers['Access-Control-Allow-Origin'] = '*'

    return response


@api.resource('/repositories')
class Repositories(Resource):
    def get(self):
        data = requests.get('https://api.github.com/repositories')

        response = getResponse(data.json())

        return response


@api.resource('/repositories/filter')
class FilteredRepositories(Resource):
    def get(self):
        factory = ParametersFactory()

        parameters = factory.getFilterParameters()

        payload = {'q': parameters, 'per_page': 2}

        data = requests.get('https://api.github.com/search/repositories', params=payload)

        response = getResponse(data.json()['items'])

        return response


if __name__ == "__main__":
    app.run(debug=True)

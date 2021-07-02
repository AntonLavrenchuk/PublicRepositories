from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import requests
from flask_cors import CORS

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


def addParameter(parameter_value, parameter_name, parameters_wrapper):  # wrapper to pass value by reference
    if not parameter_value:
        return

    if parameters_wrapper[0] and parameter_value:
        parameters_wrapper[0] += '+'

    parameters_wrapper[0] += f'{parameter_name}:{parameter_value}'


def getFilterParameters():
    languages = request.args.get('languages')
    stars = request.args.get('stars')
    last_commit = request.args.get('last_commit')

    wrapper = ['']

    addParameter(languages, 'languages', wrapper)
    addParameter(stars, 'stars', wrapper)
    addParameter(last_commit, 'pushed_at', wrapper)

    request_params = wrapper[0]

    return request_params


@api.resource('/repositories/filter')
class FilteredRepositories(Resource):
    def get(self):
        parameters = getFilterParameters()

        payload = {'q': parameters, 'per_page': 2}

        data = requests.get('https://api.github.com/search/repositories', params=payload)

        response = getResponse(data.json()['items'])

        return response


if __name__ == "__main__":
    app.run(debug=True)

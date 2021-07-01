import datetime
from dataclasses import dataclass

from flask import Flask, jsonify, request
from flask_restful import Api, Resource
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = 'any random string'
api = Api(app)


@dataclass
class Repository:
    name: str
    owner: str
    description: str
    issues: int
    pulls: int
    languages: list
    stars: int
    created_at: datetime


class RepositoryFromDictionaryConverter:
    def __init__(self, dictionary):
        self.Dictionary = dictionary

    def Convert(self):
        repository = Repository(
            self.getName(),
            self.getOwner(),
            self.getDescription(),
            self.getIssues(),
            self.getPulls(),
            self.getLanguages(),
            self.getStarsCount(),
            self.getCreatedAt())

        return repository

    def getName(self):
        return self.Dictionary['name']

    def getDescription(self):
        return self.Dictionary['description']

    def getOwner(self):
        return self.Dictionary['owner']['login']

    def getIssues(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}/issues?per_page=1')

        for item in response.json():
            return item['number']

    def getPulls(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}/pulls?per_page=1')

        for item in response.json():
            return item['number']

    def getLanguages(self):
        languages_url = self.Dictionary['languages_url']

        languages = requests.get(languages_url).json().keys()

        return list(languages)

    def getStarsCount(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}')

        return response.json()['stargazers_count']

    def getCreatedAt(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}')

        return datetime.datetime.strptime(response.json()['created_at'], '%Y-%m-%dT%H:%M:%S%fZ')


def getQueriesRemaining():
    response = requests.get('https://api.github.com/rate_limit')

    return response.json()['resources']['core']['remaining']


@api.resource('/repositories')
class Repositories(Resource):
    def get(self):

        repositories = []

        data = requests.get('https://api.github.com/repositories')

        if data.status_code >= 400:
            return "We run out of requests", 400  # limit: 60

        i = 0  # to request just 2 repositories

        for item in data.json():

            if i >= 2:
                break

            converter = RepositoryFromDictionaryConverter(item)

            repository = converter.Convert()

            dictionary_repository = repository.__dict__

            repositories.append(dictionary_repository)

            i = i + 1

        response = jsonify(repositories)

        response.headers['Access-Control-Allow-Origin'] = '*'

        return response


@api.resource('/repositories/filter')
class FilteredRepositories(Resource):
    def get(self):

        languages = request.args.get('languages')
        stars = request.args.get('stars')
        print(stars)
        repositories = []

        payload = {'q': f'languages:{languages}+stars:{stars}', 'per_page': 2}

        data = requests.get('https://api.github.com/search/repositories', params=payload)

        if getQueriesRemaining() == 0:
            return "We run out of requests", 400  # limit: 60

        for item in data.json()['items']:

            converter = RepositoryFromDictionaryConverter(item)

            repository = converter.Convert()
            dictionary_repository = repository.__dict__

            repositories.append(dictionary_repository)

        response = jsonify(repositories)

        response.headers['Access-Control-Allow-Origin'] = '*'

        return response


if __name__ == "__main__":
    app.run(debug=True)

import datetime
from dataclasses import dataclass

from flask import Flask, jsonify
from flask_restful import Api, Resource
import requests

app = Flask(__name__)
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

    def getCreatedAt(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}')

        return datetime.datetime.strptime(response.json()['created_at'], '%Y-%m-%dT%H:%M:%S%fZ')


class RepositoryResource(Resource):
    def get(self):

        repositories = []

        response = requests.get('https://api.github.com/repositories')

        if(response.status_code >= 400):
            return "We run out of requests" # limit: 60

        i = 0 # to request just 2 repositories

        for item in response.json():

            if i >= 2:
                break

            converter = RepositoryFromDictionaryConverter(item)

            repository = converter.Convert()

            dictionary_repository = repository.__dict__

            repositories.append(dictionary_repository)

            i = i + 1

        return jsonify(repositories)


api.add_resource(RepositoryResource, "/get-repositories")

if __name__ == "__main__":
    app.run(debug=True)

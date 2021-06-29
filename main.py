import datetime
from dataclasses import dataclass

from flask import Flask, jsonify, session
from flask_restful import Api, Resource
import requests

app = Flask(__name__)
api = Api(app)


@dataclass
class Repository:
    Name: str
    Description: str
    Issues: int
    Pulls: int
    Languages: list
    DateTime: datetime


class RepositoryResource(Resource):
    def get(self):

       #if 'repositories' in session:
            #return session['repositories']

        repositories = []

        response = requests.get('https://api.github.com/repositories')

        i = 0

        for item in response.json():

            if i >= 2:
                break

            name = self.getName(item)
            description = self.getDescription(item)

            issues = self.getIssues(item)

            pulls = self.getPulls(item)
            languages = self.getLanguages(item)
            created_at = self.getCreatedAt(item)

            repository = Repository(name, description, issues, pulls, languages, created_at)

            dictionary_repository = repository.__dict__

            repositories.append(dictionary_repository)

            i = i + 1

        #session['repositories'] = jsonify(repositories)
        return jsonify(repositories)

    def getName(self, repository):
        return repository['name']

    def getDescription(self, repository):
        return repository['description']

    def getOwner(self, repository):
        return repository['owner']['login']

    def getIssues(self, repository):
        repo = self.getName(repository)
        owner = self.getOwner(repository)

        response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/issues?per_page=1')

        for item in response.json():
            return item['number']


    def getPulls(self, repository):
        repo = self.getName(repository)
        owner = self.getOwner(repository)

        response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/pulls?per_page=1')

        for item in response.json():
            return item['number']

    def getLanguages(self, repository):
        languages_url = repository['languages_url']

        languages = requests.get(languages_url).json().keys()

        return list(languages)

    def getCreatedAt(self, repository):
        repo = self.getName(repository)
        owner = self.getOwner(repository)

        response = requests.get(f'https://api.github.com/repos/{owner}/{repo}')

        return datetime.datetime.strptime(response.json()['created_at'], '%Y-%m-%dT%H:%M:%S%fZ')



api.add_resource(RepositoryResource, "/")

if __name__ == "__main__":
    app.run(debug=True)

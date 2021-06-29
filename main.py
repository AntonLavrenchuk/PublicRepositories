import datetime
from dataclasses import dataclass

from flask import Flask, jsonify
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
        response = requests.get('https://api.github.com/repositories')

        repositories = []

        for item in response.json():
            repository = Repository(item['name'], "", 0, 0, [], datetime.datetime(1956, 1, 31, 12, 0, tzinfo=datetime.timezone.utc))

            dictionary_repository = repository.__dict__

            repositories.append(dictionary_repository)

        return jsonify(repositories)


api.add_resource(RepositoryResource, "/")

if __name__ == "__main__":
    app.run(debug=True)

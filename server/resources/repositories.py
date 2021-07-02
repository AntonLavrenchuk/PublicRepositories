from flask_restful import Resource
import requests
from response_factory import ResponseFactory


class Repositories(Resource):
    def get(self):
        data = requests.get('https://api.github.com/repositories')

        factory = ResponseFactory()

        response = factory.getResponse(data.json())

        return response

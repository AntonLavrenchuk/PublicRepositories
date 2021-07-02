from flask_restful import Resource
import requests
from response_builder import ResponseBuilder


class Repositories(Resource):
    def get(self):
        data = requests.get('https://api.github.com/repositories')

        factory = ResponseBuilder()

        response = factory.getResponse(data.json())

        return response

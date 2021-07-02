from flask_restful import Resource
import requests

from parameters_factory import ParametersFactory
from response_factory import ResponseFactory


class FilteredRepositories(Resource):
    def get(self):
        factory = ParametersFactory()

        parameters = factory.getFilterParameters()

        payload = {'q': parameters, 'per_page': 2}

        data = requests.get('https://api.github.com/search/repositories', params=payload)

        factory = ResponseFactory()

        response = factory.getResponse(data.json()['items'])

        return response
from flask import jsonify

from repository_factory import RepositoryFactory


class ResponseFactory:
    def getResponse(self, received_repositories):
        repositories = []

        # to request only 2 repositories
        for i in range(2):
            try:
                repository_factory = RepositoryFactory(received_repositories[i])
                repository = repository_factory.create()
            except:
                return "We run out of requests", 500  # limit: 60

            repositories.append(repository)

        response = jsonify(repositories)

        response.headers['Access-Control-Allow-Origin'] = '*'

        return response

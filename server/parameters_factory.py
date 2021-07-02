from flask import request


class ParametersFactory:
    def __init__(self):
        self.parameters = ''

    def getFilterParameters(self):
        languages = request.args.get('languages')
        stars = request.args.get('stars')
        last_commit = request.args.get('last_commit')

        self.addParameter(languages, 'languages')
        self.addParameter(stars, 'stars')
        self.addParameter(last_commit, 'pushed_at')

        return self.parameters

    def addParameter(self, parameter_value, parameter_name):
        if not parameter_value:
            return

        if self.parameters and parameter_value:
            self.parameters += '+'

        self.parameters += f'{parameter_name}:{parameter_value}'

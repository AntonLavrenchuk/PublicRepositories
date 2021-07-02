import requests

import datetime


class RepositoryFactory:
    def __init__(self, received_dictionary):
        self.dictionary = received_dictionary

    def create(self):
        repository = {
            'name': self.getName(),
            'owner': self.getOwner(),
            'description': self.getDescription(),
            'issues': self.getIssues(),
            'pulls': self.getPulls(),
            'languages': self.getLanguages(),
            'stars': self.getStarsCount(),
            'created_at': self.getCreatedAt(),
            'last_commit': self.getLastCommit()}

        return repository

    def getName(self):
        return self.dictionary['name']

    def getDescription(self):
        return self.dictionary['description']

    def getOwner(self):
        return self.dictionary['owner']['login']

    def getIssues(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}/issues?per_page=1')

        for item in response.json():
            return item['number']

    def getPulls(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}/pulls?per_page=1')

        for item in response.json():
            return item['number']

    def getLanguages(self):
        languages_url = self.dictionary['languages_url']

        languages = requests.get(languages_url).json().keys()

        return list(languages)

    def getStarsCount(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}')

        return response.json()['stargazers_count']

    def getCreatedAt(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}')

        return datetime.datetime.strptime(response.json()['created_at'], '%Y-%m-%dT%H:%M:%S%fZ')

    def getLastCommit(self):
        response = requests.get(f'https://api.github.com/repos/{self.getOwner()}/{self.getName()}')

        return datetime.datetime.strptime(response.json()['pushed_at'], '%Y-%m-%dT%H:%M:%S%fZ')

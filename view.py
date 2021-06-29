import requests
from flask import Flask

app = Flask(__name__)

BASE = 'http://127.0.0.1:5000'


@app.route('/index')
def index():
    response = requests.get(BASE + '/get-repositories')
    repositories = response.json()

    result = ''

    result += '<ul>'

    for repository in repositories:
        for key in repository.keys():
            result += f'<li>{key}: {repository[key]}</li>'
        result += '<hr>'

    result += '</ul>'

    return f'<div>{result}<div>'


if __name__ == "__main__":
    app.run(debug=True, port=5001)
app.run(debug=True, port=5001)


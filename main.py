from flask import Flask, jsonify
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

class Repository(Resource):
    def get(self):
        return jsonify("My repository")

api.add_resource(Repository, "/")

if __name__ == "__main__":
    app.run(debug = True)
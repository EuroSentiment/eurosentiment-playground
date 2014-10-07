from flask import Flask, request, redirect, url_for
import requests
import json
import re

valid_regex = re.compile(r"(http://requestb.in.*|http://(portal.)?eurosentiment.eu.*|http://217.26.90.243:8080/EuroSentimentServices.*|http://54.201.101.125/sparql.*|http://54.187.254.3.*|http://demos.gsi.dit.upm.es/.*|http://portal.eurosentiment.eu.*|http://eurosentiment-endpoint.herokuapp.com.*)")
app = Flask(__name__)

RAW = "raw"
JSON = "application/json"

@app.route('/')
def index():
    return redirect(url_for('static', filename="index.html"))

@app.route('/proxy', methods=["POST"])
def hello_world():
    payload = request.json
    if payload:
        url =  payload["url"]
        if valid_regex.match(url):
            method =  payload.get("method", "GET")
            headers =  payload.get("headers")
            parameters =  payload.get("parameters", [])
            for param in parameters:
                parameters[param] = parameters[param].encode('utf-8')
            data = payload.get("data", None)
            if isinstance(data, basestring):
                data =  data.encode("utf-8")
            r = requests.request(method, url, data=data, params=parameters, headers=headers, verify=False)
            return r.text
        else:
            return "Invalid URL"
    else:
        return "Gimme POST"


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=9292)

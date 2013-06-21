from flask import Flask, url_for, render_template, request, json, abort
from api import apicall

app = Flask(__name__)

@app.route('/api/<subject>', methods=['GET', 'PUT'])
def onlysubject(subject):
    #assert verb is "list"
    if request.method == 'GET':
        return apicall("list", subject, None)
    #assert subject is "user"
    if request.method == 'PUT':
        return apicall("update", "user", request.json)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)

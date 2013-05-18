from flask import Flask, url_for, render_template, request, json
from api import apicall

app = Flask(__name__)

@app.route('/api/<subject>', methods=['GET'])
def list(subject):
    if request.method == 'GET':
        return apicall("list", subject, None)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)

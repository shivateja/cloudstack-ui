#Licensed to the Apache Software Foundation (ASF) under one
#or more contributor license agreements.  See the NOTICE file
#distributed with this work for additional information
#regarding copyright ownership.  The ASF licenses this file
#to you under the Apache License, Version 2.0 (the
#"License"); you may not use this file except in compliance
#with the License.  You may obtain a copy of the License at
#http://www.apache.org/licenses/LICENSE-2.0
#Unless required by applicable law or agreed to in writing,
#software distributed under the License is distributed on an
#"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#KIND, either express or implied.  See the License for the
#specific language governing permissions and limitations
#under the License.

from flask import Flask, url_for, render_template, request, json, abort, send_from_directory, make_response
import requests
app = Flask(__name__)

csurl = 'http://10.8.0.170:8080/'

def get_args(multidict):
    """Default type of request.args or request.json is multidict. Converts it to dict so that can be passed to make_request"""
    data = {}
    for key in multidict.keys():
        data[key] = multidict.get(key)
    return data

@app.route('/<path:path>', methods=['GET', 'POST'])
def api(path):
    """This method is cathes any URL that is not registered
    by any other methods. It sends the request to the ACS server with
    the same headers, cookies and arguments and sends the same response
    from ACS server to the browser. Basically, this is just mirroring the
    ACS server."""
    headers = dict(request.headers)
    if request.method == 'GET':
        args = get_args(request.args)
        #Not sure where these headers are coming from in GET requests
        #Probably flask is added them by default to all the requests
        #If these headers are not deleted, 
        #management server produces 400 Bad Request error
        #3 days of extensive debugging, sigh
        del headers['Content-Length']
        del headers['Content-Type']
        #Send the GET request to CS server with the
        #headers, cookies and arguments from the browser request
        cs_response = requests.get(csurl + path, params = args, cookies = request.cookies, headers = headers)
    elif request.method == 'POST':
        #Same as the above, but a post request
        data = get_args(request.form)
        cs_response = requests.post(csurl + path, data = data, cookies = request.cookies, headers = headers)
    #Generate the response to be sent
    our_response = make_response(cs_response.content, cs_response.status_code)
    #Add the headers from the server
    our_response.headers.extend(dict(cs_response.headers))
    return our_response

@app.route('/')
def index():
    return send_from_directory("templates", "index.html")

if __name__ == '__main__':
    app.run(debug=True)

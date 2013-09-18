// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
angular.module('services.requester', [])
angular.module('services.requester').factory('requester', ['$http', '$timeout', '$q', 'security', function($http, $timeout, $q, security){
    var baseURL = '/client/api'; //make a provider

    var makeParams = function(oldParams){
        var newParams = oldParams || {};

        // If the user is authenticated, add sessionkey to params
        if(security.isAuthenticated()){
            newParams.sessionkey = security.currentUser.sessionKey;
        }
        // We need json response, right?
        newParams.response = 'json';

        return newParams;
    };

    var requester = {};

    requester.get = function(command, params){
        //Parameters are optional while calling get
        params = makeParams(params);
        params.command = command;
        return $http.get(baseURL, {params: params});
    };

    requester.async = function(command, params){
        //The promise that'll be returned
        var deferred = $q.defer();

        params = makeParams(params, command);

        params.command = command;
        //Send the request
        $http.get(baseURL, {params : params}).then(function(response){
            var responseName = command.toLowerCase() + 'response';
            var jobId = response.data[responseName]['jobid'];
            var poll = function(){

                var jobParams = {jobId: jobId};
                jobParams = makeParams(jobParams);
                jobParams.command = 'queryAsyncJobResult';

                $timeout(function(){
                    $http.get(baseURL, {params : jobParams}).then(function(response){
                        //If the job is done i.e the response has some jobstatus
                        //Resolve the promise with the response
                        if(response.data.queryasyncjobresultresponse.jobstatus){
                            deferred.resolve(response.data.queryasyncjobresultresponse.jobresult);
                        }
                        //Keep polling till the job is done
                        else{
                            poll();
                        }
                    })
                }, 5000, false);
            };
            poll();
        })
        return deferred.promise;
    };

    requester.post = function(url, data){
        //Encode the data
        data = $.param(data);
        //Send the request and return the promise
        return $http({
            method: 'POST',
            url: url,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept' : 'application/json, text/javascript, */*; q=0.01'},
        });
    };
    return requester;
}]);

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

angular.module('security.retryQueue', [])

.factory('securityRetryQueue', ['$q', '$log', function($q, $log) {
    var retryQueue = [];
    var service = {
        // The security service puts its own handler in here!
        onItemAddedCallbacks: [],

        hasMore: function() {
            return retryQueue.length > 0;
        },
        push: function(retryItem) {
            retryQueue.push(retryItem);
            // Call all the onItemAdded callbacks
            angular.forEach(service.onItemAddedCallbacks, function(cb) {
                try {
                    cb(retryItem);
                } catch(e) {
                    $log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
                }
            });
        },
        pushRetryFn: function(reason, retryFn) {
            // The reason parameter is optional
            if ( arguments.length === 1) {
                retryFn = reason;
                reason = undefined;
            }


            // The deferred object that will be resolved or rejected by calling retry or cancel
            var deferred = $q.defer();
            var retryItem = {
                reason: reason,
                retry: function() {
                    // Wrap the result of the retryFn into a promise if it is not already
                    $q.when(retryFn()).then(function(value) {
                        // If it was successful then resolve our deferred
                        deferred.resolve(value);
                    }, function(value) {
                        // Othewise reject it
                        deferred.reject(value);
                    });
                },
                cancel: function() {
                    // Give up on retrying and reject our deferred
                    deferred.reject();
                }
            };
            service.push(retryItem);
            return deferred.promise;
        },
        retryReason: function() {
            return service.hasMore() && retryQueue[0].reason;
        },
        cancelAll: function() {
            while(service.hasMore()) {
                retryQueue.shift().cancel();
            }
        },
        retryAll: function() {
            while(service.hasMore()) {
                retryQueue.shift().retry();
            }
        }
    };
    return service;
}]);

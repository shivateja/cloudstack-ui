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

angular.module('services.helperfunctions', []);
angular.module('services.helperfunctions').factory('makeArray', function(){
    var makeArray = function(Type){
        return function(response){
            var collection = [];
            angular.forEach(response, function(data){
                collection.push(new Type(data));
            });
            return collection;
        }
    }
    return makeArray;
});

angular.module('services.helperfunctions').factory('makeInstance', function(){
    var makeInstance = function(Type){
        return function(response){
            return new Type(response);
        }
    }
    return makeInstance;
});

angular.module('services.helperfunctions').factory('setState', function(){
    var setState = function(state){
        //Just a simple function to get the state out of params given to most collections
        state = state || {};

        //Check if page is defined in parameters, if it is defined
        //Set the state of the object
        //These are just to make sure important states are not 'undefined'
        if(typeof state.page === 'undefined') state.page = null;
        if(typeof state.keyword === 'undefined') state.keyword = null;

        return state;
    }
    return setState;
});

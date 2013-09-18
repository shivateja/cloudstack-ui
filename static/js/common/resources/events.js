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

angular.module('resources.events', ['services.helperfunctions', 'services.requester']);
angular.module('resources.events').factory('Events', ['$http', 'Event', 'makeArray', 'requester', 'setState', function($http, Event, makeArray, requester, setState){
    var pagesize = 20;

    var Events = function(events, state){
        this.state = setState(state);
        this.collection = events;
    }

    //Class methods
    Events.prototype.list = function(){
        return this.collection;
    }

    Events.prototype.loadNextPage = function(){
        var self = this;
        var params = {
            page: this.state.page + 1,
            pagesize: pagesize,
        };
        if(this.state.keyword){
            //Keyword is defined
            //Add it to params
            params.keyword = this.state.keyword;
        }

        return requester.get('listEvents', params)
            .then(function(response){
                return response.data.listeventsresponse.event;
            }).then(makeArray(Event)).then(function(events){
                if(events.length){
                    self.state.page++;
                    self.collection = self.collection.concat(events);
                };
            });
    }

    //Static methods
    Events.getFirstPage = function(){
        return requester.get('listEvents', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listeventsresponse.event;
        }).then(makeArray(Event)).then(function(collection){
            return new Events(collection, {page: 1});
        });
    }

    Events.getAll = function(){
        return requester.get('listEvents').then(function(response){
            return response.data.listeventsresponse.event;
        }).then(makeArray(Event)).then(function(events){
            return new Events(events);
        });
    }

    return Events;
}]);

angular.module('resources.events').factory('Event', function(){
    var Event = function(attrs){
        angular.extend(this, attrs);
    }
    return Event;
});

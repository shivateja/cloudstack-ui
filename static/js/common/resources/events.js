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
angular.module('resources.events').factory('Events', ['$http', 'Event', 'makeArray', 'requester', function($http, Event, makeArray, requester){
    var pagesize = 20;

    var Events = function(events, options){
        this.options = options || {};
        this.collection = events;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    }

    //Class methods
    Events.prototype.list = function(){
        return this.collection;
    }

    Events.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listEvents', params)
            .then(function(response){
                return response.data.listeventsresponse.event;
            }).then(makeArray(Event)).then(function(events){
                if(events.length){
                    self.options.page++;
                    self.collection = self.collection.concat(events);
                };
            });
    }

    //Static methods
    Events.getFirstPage = function(){
        return Events.customFilters().page(1).pagesize(pagesize).get();
    }

    Events.getAll = function(){
        return Events.customFilters().get();
    }

    Events.customFilters = function(){
        var filters = {};
        var options = {};

        filters.account = function(account){
            options.account = account;
            return filters;
        }
        filters.domainid = function(domainid){
            options.domainid = domainid;
            return filters;
        }
        filters.duration = function(duration){
            options.duration = duration;
            return filters;
        }
        filters.enddate = function(enddate){
            options.enddate = enddate;
            return filters;
        }
        filters.entrytime = function(entrytime){
            options.entrytime = entrytime;
            return filters;
        }
        filters.id = function(id){
            options.id = id;
            return filters;
        }
        filters.isrecursive = function(isrecursive){
            options.isrecursive = isrecursive;
            return filters;
        }
        filters.keyword = function(keyword){
            options.keyword = keyword;
            return filters;
        }
        filters.level = function(level){
            options.level = level;
            return filters;
        }
        filters.listall = function(listall){
            options.listall = listall;
            return filters;
        }
        filters.page = function(page){
            options.page = page;
            return filters;
        }
        filters.pagesize = function(pagesize){
            options.pagesize = pagesize;
            return filters;
        }
        filters.projectid = function(projectid){
            options.projectid = projectid;
            return filters;
        }
        filters.startdate = function(startdate){
            options.startdate = startdate;
            return filters;
        }
        filters.type = function(type){
            options.type = type;
            return filters;
        }
        filters.get = function(){
            return requester.get('listEvents', options).then(function(response){
                return response.data.listeventsresponse.event;
            }).then(makeArray(Event)).then(function(collection){
                return new Events(collection, options);
            });
        }
        return filters;
    }

    return Events;
}]);

angular.module('resources.events').factory('Event', function(){
    var Event = function(attrs){
        angular.extend(this, attrs);
    }
    return Event;
});

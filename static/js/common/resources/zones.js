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

angular.module('resources.zones', ['services.helperfunctions', 'services.requester']);
angular.module('resources.zones').factory('Zones', ['Zone', 'makeArray', 'requester', function(Zone, makeArray, requester){
    var pagesize = 20;

    var Zones = function(zones, options){
        this.options = options || {};
        this.collection = zones;

        if(!(this.options.pagesize)) this.options.pagesize = pagesize;
    };

    //Class methods
    Zones.prototype.list = function(){
        return this.collection;
    };

    Zones.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listZones', params)
            .then(function(response){
                return response.data.listzonesresponse.zone;
            }).then(makeArray(Zone)).then(function(zones){
                if(zones.length){
                    self.options.page++;
                    self.collection = self.collection.concat(zones);
                };
            });
    };

    //Static methods
    Zones.getFirstPage = function(){
        return Zones.customFilters().page(1).pagesize(pagesize).get();
    }

    Zones.getAll = function(){
        return Zones.customFilters().get();
    };

    Zones.customFilters = function(){
        var filters = {};
        var options = {};

        filters.available = function(available){
            options.available = available;
            return filters;
        }
        filters.domainid = function(domainid){
            options.domainid = domainid;
            return filters;
        }
        filters.id = function(id){
            options.id = id;
            return filters;
        }
        filters.keyword = function(keyword){
            options.keyword = keyword;
            return filters;
        }
        filters.name = function(name){
            options.name = name;
            return filters;
        }
        filters.networktype = function(networktype){
            options.networktype = networktype;
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
        filters.showcapacities = function(showcapacities){
            options.showcapacities = showcapacities;
            return filters;
        }
        filters.get = function(){
            return requester.get('listZones', options).then(function(response){
                return response.data.listzonesresponse.zone;
            }).then(makeArray(Zone)).then(function(collection){
                return new Zones(collection, options);
            })
        }
        return filters;
    }
    return Zones;
}]);

angular.module('resources.zones').factory('Zone', function(){
    var Zone = function(attrs){
        angular.extend(this, attrs);
    };
    return Zone;
});

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
angular.module('resources.zones').factory('Zones', ['Zone', 'makeArray', 'requester', 'setState', function(Zone, makeArray, requester, setState){
    var pagesize = 20;

    var Zones = function(zones, state){
        this.state = setState(state);
        this.collection = zones;
    };

    //Class methods
    Zones.prototype.list = function(){
        return this.collection;
    };

    Zones.prototype.loadNextPage = function(){
        var self = this;
        var params = {
            page: this.state.page + 1,
            pagesize: pagesize
        };

        if(this.state.keyword){
            //keyword is defined
            //Add it to params
            params.keyword = this.state.keyword;
        };
        return requester.get('listZones', params)
            .then(function(response){
                return response.data.listzonesresponse.zone;
            }).then(makeArray(Zone)).then(function(zones){
                if(zones.length){
                    self.state.page++;
                    self.collection = self.collection.concat(zones);
                };
            });
    };

    //Static methods
    Zones.getFirstPage = function(){
        return requester.get('listZones', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listzonesresponse.zone;
        }).then(makeArray(Zone)).then(function(collection){
            return new Zones(collection, {page: 1});
        });
    }


    Zones.getAll = function(){
        return requester.get('listZones').then(function(response){
            return response.data.listzonesresponse.zone;
        }).then(makeArray(Zone)).then(function(collection){
            return new Zones(collection);
        });
    };

    return Zones;
}]);

angular.module('resources.zones').factory('Zone', function(){
    var Zone = function(attrs){
        angular.extend(this, attrs);
    };
    return Zone;
});

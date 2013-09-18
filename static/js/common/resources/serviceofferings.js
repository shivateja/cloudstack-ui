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

angular.module('resources.serviceofferings', ['services.helperfunctions', 'services.requester']);
angular.module('resources.serviceofferings').factory('ServiceOfferings', ['$http', 'ServiceOffering', 'makeArray', 'requester', 'setState', function($http, ServiceOffering, makeArray, requester, setState){
    var pagesize = 20;

    var ServiceOfferings = function(serviceofferings, state){
        this.state = setState(state);
        this.collection = serviceofferings;
    };

    //Class methods
    ServiceOfferings.prototype.list = function(){
        return this.collection;
    };

    ServiceOfferings.prototype.loadNextPage = function(){
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
        return requester.get('listServiceOfferings', params)
            .then(function(response){
                return response.data.listserviceofferingsresponse.serviceoffering;
            }).then(makeArray(ServiceOffering)).then(function(serviceofferings){
                if(serviceofferings.length){
                    self.state.page++;
                    self.collection = self.collection.concat(serviceofferings);
                };
            });
    };

    //Static methods
    ServiceOfferings.getFirstPage = function(){
        return requester.get('listServiceOfferings', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listserviceofferingsresponse.serviceoffering;
        }).then(makeArray(ServiceOffering)).then(function(collection){
            return new ServiceOfferings(collection, {page: 1});
        });
    }

    ServiceOfferings.getAll = function(){
        return requester.get('listServiceOfferings').then(function(response){
            return response.data.listserviceofferingsresponse.serviceoffering;
        }).then(makeArray(ServiceOffering)).then(function(collection){
            return new ServiceOfferings(collection);
        });
    };

    return ServiceOfferings;
}]);

angular.module('resources.serviceofferings').factory('ServiceOffering', function(){
    var ServiceOffering = function(attrs){
        angular.extend(this, attrs);
    }
    return ServiceOffering;
});

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
angular.module('resources.serviceofferings').factory('ServiceOfferings', ['ServiceOffering', 'makeArray', 'requester',
        function(ServiceOffering, makeArray, requester){
    var pagesize = 20;

    var ServiceOfferings = function(serviceofferings, options){
        this.options = options || {};
        this.collection = serviceofferings;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    ServiceOfferings.prototype.list = function(){
        return this.collection;
    };

    ServiceOfferings.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listServiceOfferings', params)
            .then(function(response){
                return response.data.listserviceofferingsresponse.serviceoffering;
            }).then(makeArray(ServiceOffering)).then(function(serviceofferings){
                if(serviceofferings.length){
                    self.options.page++;
                    self.collection = self.collection.concat(serviceofferings);
                };
            });
    };

    //Static methods
    ServiceOfferings.getFirstPage = function(){
        return ServiceOfferings.customFilters().page(1).pagesize(pagesize).get();
    }

    ServiceOfferings.getAll = function(){
        return ServiceOfferings.customFilters().get();
    };

    ServiceOfferings.customFilters = function(){
        var filters = {};
        var options = {};

        filters.domainid = function(domainid){
            options.domainid = domainid;
            return filters;
        }
        filters.id = function(domainid){
            options.id = id;
            return filters;
        }
        filters.issystem = function(issystem){
            options.issystem = issystem;
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
        filters.page = function(page){
            options.page = page;
            return filters;
        }
        filters.pagesize = function(pagesize){
            options.pagesize = pagesize;
            return filters;
        }
        filters.systemvmtype = function(systemvmtype){
            options.systemvmtype = systemvmtype;
            return filters;
        }
        filters.virtualmachineid = function(virtualmachineid){
            options.virtualmachineid = virtualmachineid;
            return filters;
        }
        filters.get = function(){
            return requester.get('listServiceOfferings', options).then(function(response){
                return response.data.listserviceofferingsresponse.serviceoffering;
            }).then(makeArray(ServiceOffering)).then(function(collection){
                return new ServiceOfferings(collection, options);
            })
        }
        return filters;
    }
    return ServiceOfferings;
}]);

angular.module('resources.serviceofferings').factory('ServiceOffering', function(){
    var ServiceOffering = function(attrs){
        angular.extend(this, attrs);
    }
    return ServiceOffering;
});

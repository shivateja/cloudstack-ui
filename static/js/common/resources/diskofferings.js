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

angular.module('resources.diskofferings', ['services.helperfunctions', 'services.requester']);
angular.module('resources.diskofferings').factory('DiskOfferings', ['DiskOffering', 'makeArray', 'requester',
        function(DiskOffering, makeArray, requester){
    var pagesize = 20;

    var DiskOfferings = function(discOfferings, options){
        this.options = options || {};
        this.collection = discOfferings;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    }

    //Class methods
    DiskOfferings.prototype.list = function(){
        return this.collection;
    }

    DiskOfferings.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listDiskOfferings', params)
            .then(function(response){
                return response.data.listdiskofferingsresponse.diskoffering;
            }).then(makeArray(DiskOffering)).then(function(diskofferings){
                if(diskofferings.length){
                    self.options.page++;
                    self.collection = self.collection.concat(diskofferings);
                };
            });
    }

    //Static Methods

    DiskOfferings.getFirstPage = function(){
        return DiskOfferings.customFilters().page(1).pagesize(pagesize).get();
    }

    DiskOfferings.getAll = function(){
        return DiskOfferings.customFilters().get();
    };

    DiskOfferings.customFilters = function(){
        var filters = {};
        var options = {};

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
        filters.page = function(page){
            options.page = page;
            return filters;
        }
        filters.pagesize = function(pagesize){
            options.pagesize = pagesize;
            return filters;
        }
        filters.get = function(){
            return requester.get('listDiskOfferings', options).then(function(response){
                return response.data.listdiskofferingsresponse.diskoffering;
            }).then(makeArray(DiskOffering)).then(function(collection){
                return new DiskOfferings(collection, options);
            })
        }
        return filters;
    }
    return DiskOfferings;
}]);

angular.module('resources.diskofferings').factory('DiskOffering', function(){
    var DiskOffering = function(attrs){
        angular.extend(this, attrs);
    };
    return DiskOffering;
});

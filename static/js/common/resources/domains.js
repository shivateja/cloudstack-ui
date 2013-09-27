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

angular.module('resources.domains', ['services.helperfunctions', 'services.requester']);
angular.module('resources.domains').factory('Domains', ['$http', 'Domain', 'makeArray', 'requester', function($http, Domain, makeArray, requester){
    var pagesize = 20;

    var Domains = function(domains, options){
        this.options = options || {};
        this.collection = domains;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    Domains.prototype.list = function(){
        return this.collection;
    };

    Domains.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listDomains', params)
            .then(function(response){
                return response.data.listdomainsresponse.domain;
            }).then(makeArray(Domain)).then(function(domains){
                if(domains.length){
                    self.options.page++;
                    self.collection = self.collection.concat(domains);
                };
            });
    };

    //Static methods
    Domains.getFirstPage = function(){
        return Domains.customFilters().page(1).pagesize(pagesize).get();
    }

    Domains.getAll = function(){
        return Domains.customFilters().get();
    };

    Domains.customFilters = function(){
        var filters = {};
        var options = {};

        filters.id = function(id){
            options.id = id;
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
            return requester.get('listDomains', options).then(function(response){
                return response.data.listdomainsresponse.domain;
            }).then(makeArray(Domain)).then(function(collection){
                return new Domains(collection, options);
            })
        }
        return filters;
    }

    return Domains;
}]);

angular.module('resources.domains').factory('Domain', function(){
    var Domain = function(attrs){
        angular.extend(this, attrs);
    }
    return Domain;
});

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
angular.module('resources.domains').factory('Domains', ['$http', 'Domain', 'makeArray', 'requester', 'setState', function($http, Domain, makeArray, requester, setState){
    var pagesize = 20;

    var Domains = function(domains, state){
        this.state = setState(state);
        this.collection = domains;
    };

    //Class methods
    Domains.prototype.list = function(){
        return this.collection;
    };

    Domains.prototype.loadNextPage = function(){
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
        return requester.get('listDomains', params)
            .then(function(response){
                return response.data.listdomainsresponse.domain;
            }).then(makeArray(Domain)).then(function(domains){
                if(domains.length){
                    self.state.page++;
                    self.collection = self.collection.concat(domains);
                };
            });
    };

    //Static methods
    Domains.getFirstPage = function(){
        return requester.get('listDomains', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listdomainsresponse.domain;
        }).then(makeArray(Domain)).then(function(collection){
            return new Domains(collection, {page: 1});
        });
    }

    Domains.getAll = function(){
        return requester.get('listDomains').then(function(response){
            return response.data.listdomainsresponse.domain;
        }).then(makeArray(Domain)).then(function(collection){
            return new Domains(collection);
        });
    };

    return Domains;
}]);

angular.module('resources.domains').factory('Domain', function(){
    var Domain = function(attrs){
        angular.extend(this, attrs);
    }
    return Domain;
});

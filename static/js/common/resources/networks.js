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

angular.module('resources.networks',['services.helperfunctions', 'services.requester']);
angular.module('resources.networks').factory('Networks', ['Network', 'makeArray', 'requester', function(Network, makeArray, requester){
    var pagesize = 20;

    var Networks = function(networks, options){
        this.options = options || {};
        this.collection = networks;

        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    Networks.prototype.list = function(){
        return this.collection;
    };

    Networks.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page && !!this.options.pagesize)) return;

        var params = angular.copy(this.options);

        params.page++;

        return requester.get('listNetworks', params)
            .then(function(response){
                return response.data.listnetworksresponse.network;
            }).then(makeArray(Network)).then(function(networks){
                if(networks.length){
                    self.options.page++;
                    self.collection = self.collection.concat(networks);
                };
            });
    };

    //Static methods
    Networks.getFirstPage = function(){
        return Networks.customFilter().page(1).pagesize(pagesize).get();
    }

    Networks.getAll = function(){
        return Networks.customFilter().get();
    };

    Networks.getById = function(id){
        return Networks.customFilter().id(id).get().then(function(networks){
            return networks.list()[0];
        });
    };

    Networks.customFilter = function(){
        // This is just an experiment
        // Not sure if this is required in the final implementation
        // each function in filters returns itself which allows chaining and modifies 'options'
        // except for the .get() function which fetches networks with these options and returns
        // the collection
        var filters = {}

        var options = {}

        filters.account = function(account){
            options.account = account;
            return filters;
        }

        filters.acltype = function(acltype){
            options.acltype = acltype;
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

        filters.isrecursive = function(isrecursive){
            options.isrecursive = isrecursive.toString();
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

        filters.listall = function(listall){
            if(listall === undefined) listall = true;
            options.listall = listall.toString();
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

        filters.physicalnetworkid = function(physicalnetworkid){
            options.physicalnetworkid = physicalnetworkid;
            return filters;
        }

        filters.projectid = function(projectid){
            options.projectid = projectid;
            return filters;
        }

        filters.restartrequired = function(restartrequired){
            options.restartrequired = restartrequired;
            return filters;
        }

        filters.specifyipranges = function(specifyipranges){
            options.specifyipranges = specifyipranges;
            return filters;
        }

        filters.supportedservices = function(supportedservices){
            options.supportedservices = supportedservices;
            return filters;
        }

        filters.traffictype = function(traffictype){
            options.traffictype = traffictype;
            return filters;
        }

        filters.type = function(type){
            options.type = type;
            return filters;
        }

        filters.zoneid = function(zoneid){
            option.zoneid = zoneid;
            return filters;
        }

        filters.get = function(){
            return requester.get('listNetworks', options).then(function(response){
                return response.data.listnetworksresponse.network;
            }).then(makeArray(Network)).then(function(collection){
                return new Networks(collection, options);
            })
        }

        return filters;
    }

    return Networks;
}]);

angular.module('resources.networks').factory('Network', ['requester', function(requester){
    var Network = function(attrs){
        angular.extend(this, attrs);
    };

    Network.prototype.restart = function(){
        return requester.async('restartNetwork', {id: this.id});
    }

    Network.prototype.delete = function(){
        return requester.async('deleteNetwork', {id: this.id});
    }
    return Network;
}]);

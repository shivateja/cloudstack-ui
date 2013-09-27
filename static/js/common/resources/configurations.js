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

angular.module('resources.configurations', ['services.helperfunctions', 'services.requester', 'services.notifications']);
angular.module('resources.configurations').factory('Configurations', ['$http', 'Configuration', 'makeArray', 'requester', function($http, Configuration, makeArray, requester){
    var pagesize = 20;

    // Factory object
    var Configurations = function(configurations, options){
        this.options = options;
        this.collection = configurations;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    }

    //Class methods
    Configurations.prototype.list = function(){
        return this.collection;
    }

    Configurations.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listConfigurations', params)
            .then(function(response){
                return response.data.listconfigurationsresponse.configuration;
            }).then(makeArray(Configuration)).then(function(configurations){
                if(configurations.length){
                    self.options.page++;
                    self.collection = self.collection.concat(configurations)
                }
            });
    }

    //Static methods
    Configurations.getFirstPage = function(){
        return Configurations.customFilters().page(1).pagesize(pagesize).get();
    }

    Configurations.getAll = function(){
        return Configurations.customFilters().get();
    }

    Configurations.customFilters = function(){
        var filters = {};
        var options = {};

        filters.accountid = function(accountid){
            options.accountid = accountid;
            return filters;
        }
        filters.category = function(category){
            options.category = category;
            return filters;
        }
        filters.clusterid = function(clusterid){
            options.clusterid = clusterid;
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
        filters.storageid = function(storageid){
            options.storageid = storageid;
            return filters;
        }
        filters.zoneid = function(zoneid){
            options.zoneid = zoneid;
            return filters;
        }
        filters.get = function(){
            return requester.get('listConfigurations', options).then(function(response){
                return response.data.listconfigurationsresponse.configuration;
            }).then(makeArray(Configuration)).then(function(collection){
                return new Configurations(collection, options);
            })
        }
        return filters;
    }

    return Configurations;
}]);

angular.module('resources.configurations').factory('Configuration', ['requester', 'Notifications', function(requester, Notifications){
    var Configuration = function(attrs){
        angular.extend(this, attrs);
    }

    Configuration.prototype.update = function(){
        return requester.get('updateConfiguration', {name: this.name, value: this.value}).then(function(response){
            return response.data.updateconfigurationresponse.configuration;
        }).then(function(response){
            // TODO: Remove notifications from here, move to it the controller that does this
            Notifications.push('success', 'Updated ' + response.name + '. Please restart management server(s) for new settings to take effect');
        });
    };
    return Configuration;
}]);

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
angular.module('resources.configurations').factory('Configurations', ['$http', 'Configuration', 'makeArray', 'requester', 'setState', function($http, Configuration, makeArray, requester, setState){
    var pagesize = 20;

    var Configurations = function(configurations, state){
        this.state = setState(state);
        this.collection = configurations;
    }

    //Class methods
    Configurations.prototype.list = function(){
        return this.collection;
    }

    Configurations.prototype.loadNextPage = function(){
        var self = this;
        var params = {
            page: this.state.page + 1,
            pagesize: pagesize
        }
        if(this.state.keyword){
            //Keyword is defined add it to params
            params.keyword = this.state.keyword;
        }
        return requester.get('listConfigurations', params)
            .then(function(response){
                return response.data.listconfigurationsresponse.configuration;
            }).then(makeArray(Configuration)).then(function(configurations){
                if(configurations.length){
                    self.state.page++;
                    self.collection = self.collection.concat(configurations)
                }
            });
    }

    //Static methods
    Configurations.getFirstPage = function(){
        return requester.get('listConfigurations', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listconfigurationsresponse.configuration;
        }).then(makeArray(Configuration)).then(function(collection){
            return new Configurations(collection, {page: 1});
        });
    }

    Configurations.getAll = function(){
        return requester.get('listConfigurations').then(function(response){
            return response.data.listconfigurationsresponse.configuration;
        }).then(makeArray(Configuration)).then(function(configurations){
            return new Configurations(configurations);
        });
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
            Notifications.push('success', 'Updated ' + response.name + '. Please restart management server(s) for new settings to take effect');
        });
    };
    return Configuration;
}]);

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

angular.module('resources.users', ['services.helperfunctions', 'services.requester']);
angular.module('resources.users').factory('Users', ['User', 'makeArray', 'requester', function(User, makeArray, requester){
    var pagesize = 20;

    var Users = function(users, options){
        this.options = options || {};
        this.collection = users;

        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    Users.prototype.list = function(){
        return this.collection;
    };

    Users.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page && !!this.options.pagesize)) return;

        var params = angular.copy(this.options);

        params.page++;

        return requester.get('listUsers', params)
            .then(function(response){
                return response.data.listusersresponse.user;
            }).then(makeArray(User)).then(function(users){
                if(users.length){
                    self.state.page++;
                    self.collection = self.collection.concat(users);
                };
            });
    };

    //Static methods
    Users.getFirstPage = function(){
        return Users.customFilters().page(1).pagesize(pagesize).get();
    }

    Users.getAll = function(){
        return Users.customFilters().listall(true).get();
    };

    Users.getByDomain = function(id){
        return Users.customFilters().domainid(id).get();
    };

    Users.getById = function(id){
        return Users.customFilters().id(id).get().then(function(users){
            return users.list()[0];
        })
    };

    Users.customFilters = function(){
        var options = {};
        var filters = {};

        filters.account = function(account){
            options.account = account;
            return filters;
        }
        filters.accounttype = function(accounttype){
            options.accounttype = accounttype;
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
            options.isrecursive = isrecursive;
            return filters;
        }
        filters.keyword = function(keyword){
            options.keyword = keyword;
            return filters;
        }
        filters.listall = function(listall){
            options.listall = listall;
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
        filters.state = function(state){
            options.state = state;
            return filters;
        }
        filters.username = function(username){
            options.username = username;
            return filters;
        }
        filters.get = function(){
            return requester.get('listUsers', options).then(function(response){
                return response.data.listusersresponse.user;
            }).then(makeArray(User)).then(function(collection){
                return new Users(collection, options);
            });
        }
        return filters;
    }

    return Users;
}]);

angular.module('resources.users').factory('User', ['requester', function(requester){
    var User = function(attrs){
        angular.extend(this, attrs);
    };

    User.prototype.generateKeys = function(){
        var self = this;
        return requester.get('registerUserKeys', {id: this.id}).then(function(response){
            return response.data.registeruserkeysresponse.userkeys;
        }).then(function(keys){
            self.apikey = keys.apikey;
            self.secretkey = keys.secretkey;
            return keys;
        });
    }

    User.prototype.disable = function(){
        return requester.async('disableUser', {id: this.id});
    }
    User.prototype.delete = function(){
        return requester.get('deleteUser', {id: this.id});
    }
    return User;
}]);

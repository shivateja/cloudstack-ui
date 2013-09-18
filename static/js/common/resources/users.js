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
angular.module('resources.users').factory('Users', ['User', 'makeArray', 'requester', 'setState', function(User, makeArray, requester, setState){
    var pagesize = 20;

    var Users = function(users, state){
        this.state = setState(state);
        this.collection = users;
    };

    //Class methods
    Users.prototype.list = function(){
        return this.collection;
    };

    Users.prototype.loadNextPage = function(){
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
        return requester.get('listUsers', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listusersresponse.user;
        }).then(makeArray(User)).then(function(collection){
            return new Users(collection, {page: 1});
        });
    }

    Users.getAll = function(){
        return requester.get('listUsers').then(function(response){
            return response.data.listusersresponse.user;
        }).then(makeArray(User)).then(function(collection){
            return new Users(collection);
        });
    };

    Users.getByDomain(id) = function(id){
        return requester.get('listUsers').then(function(response){
            return response.data.listusersresponse.user;
        }).then(makeArray(User)).then(function(collection){
            return new Users(collection, {domainid: id});
        });
    };

    return Users;
}]);

angular.module('resources.users').factory('User', function(){
    var User = function(attrs){
        angular.extend(this, attrs);
    };
    return User;
});

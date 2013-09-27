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

angular.module('resources.projects', ['services.helperfunctions', 'services.requester']);
angular.module('resources.projects').factory('Projects', ['Project', 'makeArray', 'requester', function(Project, makeArray, requester){
    var pagesize = 20;

    var Projects = function(projects, options){
        this.options = options || {};
        this.collection = projects;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    Projects.prototype.list = function(){
        return this.collection;
    };

    Projects.prototype.loadNextPage = function(){
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
        return requester.get('listProjects', params)
            .then(function(response){
                return response.data.listprojectsresponse.project;
            }).then(makeArray(Project)).then(function(projects){
                if(projects.length){
                    self.options.page++;
                    self.collection = self.collection.concat(projects);
                };
            });
    };

    //Static methods
    Projects.getFirstPage = function(){
        return Projects.customFilter().page(1).pagesize(pagesize).get();
    }

    Projects.getAll = function(){
        return Projects.customFilter().get();
    };

    Projects.customFilter = function(){
        var filters = {};
        var options = {};

        filters.account = function(account){
            options.account = account;
            return filters;
        }
        filters.displaytext = function(displaytext){
            options.displaytext = displaytext;
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
        filters.state = function(state){
            options.state = state;
            return filters;
        }
        filters.get = function(){
            return requester.get('listProjects', options).then(function(response){
                return response.data.listprojectsresponse.project;
            }).then(makeArray(Project)).then(function(collection){
                return new Projects(collection, options);
            })
        }
        return filters;
    }
    return Projects;
}]);

angular.module('resources.projects').factory('Project', function(){
    var Project = function(attrs){
        angular.extend(this, attrs);
    };
    return Project;
});

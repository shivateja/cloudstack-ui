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
angular.module('resources.projects').factory('Projects', ['Project', 'makeArray', 'requester', 'setState', function(Project, makeArray, requester, setState){
    var pagesize = 20;

    var Projects = function(projects, state){
        this.state = setState(state);
        this.collection = projects;
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
                    self.state.page++;
                    self.collection = self.collection.concat(projects);
                };
            });
    };

    //Static methods
    Projects.getFirstPage = function(){
        return requester.get('listProjects', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listprojectsresponse.project;
        }).then(makeArray(Project)).then(function(collection){
            return new Projects(collection, {page: 1});
        });
    }

    Projects.getAll = function(){
        return requester.get('listProjects').then(function(response){
            return response.data.listprojectsresponse.project;
        }).then(makeArray(Project)).then(function(collection){
            return new Projects(collection);
        });
    };

    return Projects;
}]);

angular.module('resources.projects').factory('Project', function(){
    var Project = function(attrs){
        angular.extend(this, attrs);
    };
    return Project;
});

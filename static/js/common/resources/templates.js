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

angular.module('resources.templates', ['services.helperfunctions', 'services.requester']);
angular.module('resources.templates').factory('Templates', ['Template', 'makeArray', 'requester', function(Template, makeArray, requester){
    var pagesize = 20;

    var Templates = function(templates, options){
        this.options = options || {};
        this.collection = templates;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    Templates.prototype.list = function(){
        return this.collection;
    };

    Templates.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listTemplates', params)
            .then(function(response){
                return response.data.listtemplatesresponse.template;
            }).then(makeArray(Template)).then(function(templates){
                if(templates.length){
                    self.options.page++;
                    self.collection = self.collection.concat(templates);
                };
            });
    };

    //Static methods
    Templates.getFirstPage = function(){
        return Templates.customFilter().templatefilter('all').page(1).pagesize(pagesize).get();
    }

    Templates.getAll = function(){
        return Templates.customFilter().templatefilter('all').get();
    };

    Templates.customFilter = function(){
        var filters = {};
        var options = {};

        filters.templatefilter = function(templatefilter){
            options.templatefilter = templatefilter;
            return filters;
        }
        filters.account = function(account){
            options.account = account;
            return filters;
        }
        filters.domainid = function(domainid){
            options.domainid = domainid;
            return filters;
        }
        filters.hypervisor = function(hypervisor){
            options.hypervisor = hypervisor;
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
        filters.projectid = function(projectid){
            options.projectid = projectid;
            return filters;
        }
        filters.zoneid = function(zoneid){
            options.zoneid = zoneid;
            return filters;
        }
        filters.get = function(){
            return requester.get('listTemplates', options).then(function(response){
                return response.data.listtemplatesresponse.template;
            }).then(makeArray(Template)).then(function(collection){
                return new Templates(collection, options);
            });
        }
        return filters;
    }
    return Templates;
}]);

angular.module('resources.templates').factory('Template', function(){
    var Template = function(attrs){
        angular.extend(this, attrs);
    };
    return Template;
});

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

angular.module('resources.snapshots', ['services.helperfunctions', 'services.requester']);
angular.module('resources.snapshots').factory('Snapshots', ['Snapshot', 'makeArray', 'requester', function(Snapshot, makeArray, requester){
    var pagesize = 20;

    var Snapshots = function(snapshots, options){
        this.options = options || {};
        this.collection = snapshots;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    Snapshots.prototype.list = function(){
        return this.collection;
    };

    Snapshots.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listSnapshots', params)
            .then(function(response){
                return response.data.listsnapshotsresponse.snapshot;
            }).then(makeArray(Snapshot)).then(function(snapshots){
                if(snapshots.length){
                    self.options.page++;
                    self.collection = self.collection.concat(snapshots);
                };
            });
    };

    //Static methods
    Snapshots.getFirstPage = function(){
        return Snapshots.customFilters().page(1).pagesize(pagesize).get();
    }

    Snapshots.getAll = function(){
        return Snapshots.customFilters().get();
    };

    Snapshots.getById = function(id){
        return Snapshots.customFilters().id(id).get().then(function(snapshots){
            return snapshots.list()[0];
        });
    };

    Snapshots.customFilters = function(){
        var options = {};
        var filters = {};

        filters.account = function(account){
            options.account = account;
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
        filters.intervaltype = function(intervaltype){
            options.intervaltype = intervaltype;
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
        filters.snapshottype = function(snapshottype){
            options.snapshottype = snapshottype;
            return filters;
        }
        filters.volumeid = function(volumeid){
            options.volumeid = volumeid;
            return filters;
        }
        filters.get = function(){
            return requester.get('listSnapshots', options).then(function(response){
                return response.data.listsnapshotsresponse.snapshot;
            }).then(makeArray(Snapshot)).then(function(collection){
                return new Snapshots(collection, options);
            })
        }
        return filters;
    }
    return Snapshots;
}]);

angular.module('resources.snapshots').factory('Snapshot', ['requester', function(requester){
    var Snapshot = function(attrs){
        angular.extend(this, attrs);
    };

    Snapshot.prototype.delete = function(){
        return requester.async('deleteSnapshot', {id: this.id});
    }
    return Snapshot;
}]);

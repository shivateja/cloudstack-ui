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

angular.module('resources.volumes', ['services.helperfunctions', 'services.requester']);
angular.module('resources.volumes').factory('Volumes', ['$http', 'Volume', 'makeArray', 'requester', function($http, Volume, makeArray, requester){
    var pagesize = 20;

    var Volumes = function(volumes, options){
        this.options = options || {};
        this.collection = volumes;

        if(!this.options.pagesize) this.options.pagesize = pagesize;
    };

    //Class methods
    Volumes.prototype.list = function(){
        return this.collection;
    };

    Volumes.prototype.loadNextPage = function(){
        var self = this;

        // Throw an error here?
        if(!(!!this.options.page && !!this.options.pagesize)) return;

        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listVolumes', params)
            .then(function(response){
                return response.data.listvolumesresponse.volume;
            }).then(makeArray(Volume)).then(function(volumes){
                if(volumes.length){
                    self.options.page++;
                    self.collection = self.collection.concat(volumes);
                };
            });
    };

    //Static methods
    Volumes.getFirstPage = function(){
        return requester.get('listVolumes', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listvolumesresponse.volume;
        }).then(makeArray(Volume)).then(function(collection){
            return new Volumes(collection, {page: 1});
        });
    }


    Volumes.getAll = function(){
        return requester.get('listVolumes').then(function(response){
            return response.data.listvolumesresponse.volume;
        }).then(makeArray(Volume)).then(function(collection){
            return new Volumes(collection);
        });
    };

    Volumes.getById = function(id){
        return Volumes.customFilter().id(id).get().then(function(volumes){
            return volumes.list()[0];
        });
    }

    Volumes.customFilter = function(){
        var filters = {};
        var options = {};

        filters.account = function(account){
            options.account = account;
            return filters;
        }
        filters.domainid = function(domainid){
            options.domainid = domainid;
            return filters;
        }
        filters.hostid = function(hostid){
            options.hostid = hostid;
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
        filters.podid = function(podid){
            options.podid = podid;
            return filters;
        }
        filters.projectid = function(projectid){
            options.projectid = projectid;
            return filters;
        }
        filters.type = function(type){
            options.type = type;
            return filters;
        }
        filters.virtualmachineid = function(virtualmachineid){
            options.virtualmachineid = virtualmachineid;
            return filters;
        }
        filters.zoneid = function(zoneid){
            options.zoneid = zoneid;
            return filters;
        }
        filters.get = function(){
            return requester.get('listVolumes', options).then(function(response){
                return response.data.listvolumesresponse.volume;
            }).then(makeArray(Volume)).then(function(collection){
                return new Volumes(collection, options);
            });
        }
        return filters;
    };

    Volumes.createNew = function(options){
        return requester.get('createVolume', options).then(function(response){
            return response.data.createvolumerespnose;
        })
    }

    Volumes.uploadNew = function(options){
        return requester.async('uploadVolume', options).then(function(response){
            return response.data.uploadvolumeresponse;
        })
    }

    return Volumes;
}]);

angular.module('resources.volumes').factory('Volume', ['requester', function(requester){
    var Volume = function(attrs){
        angular.extend(this, attrs);
    }
    Volume.prototype.takeSnapshot = function(){
        return requester.async('createSnapshot', {volumeid: this.id});
    }
    return Volume;
}]);

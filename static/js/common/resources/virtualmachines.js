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

angular.module('resources.virtualmachines',['services.helperfunctions', 'services.requester']);
angular.module('resources.virtualmachines').factory('VirtualMachines', ['$http', 'VirtualMachine', 'makeArray', 'makeInstance', 'requester',
        function($http, VirtualMachine, makeArray, makeInstance, requester){
    var pagesize = 20;

    var VirtualMachines = function(virtualmachines, options){
        this.options = options || {};
        this.collection = virtualmachines;

        if(!(this.options.pagesize)) this.options.pagesize = pagesize;
    };

    //Class methods
    VirtualMachines.prototype.list = function(){
        return this.collection;
    };

    VirtualMachines.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listVirtualMachines', params)
            .then(function(response){
                return response.data.listvirtualmachinesresponse.virtualmachine;
            }).then(makeArray(VirtualMachine)).then(function(virtualmachines){
                if(virtualmachines.length){
                    self.options.page++;
                    self.collection = self.collection.concat(virtualmachines);
                };
            });
    };

    //Static methods
    VirtualMachines.getFirstPage = function(){
        return VirtualMachines.customFilters().page(1).pagesize(pagesize).get();
    }


    VirtualMachines.getAll = function(){
        return VirtualMachines.customFilters().get();
    };

    VirtualMachines.getById = function(id){
        return VirtualMachines.customFilters().id(id).get().then(function(vms){
            return vms.list()[0];
        })
    };

    VirtualMachines.customFilters = function(){
        var filters = {};
        var options = {};

        filters.account = function(account){
            options.account = account;
            return filters;
        }
        filters.details = function(details){
            options.details = details;
            return filters;
        }
        filters.domainid = function(domainid){
            options.domainid = domainid;
            return filters;
        }
        filters.forvirtualnetwork = function(forvirtualnetwork){
            options.forvirtualnetwork = forvirtualnetwork;
            return filters;
        }
        filters.groupid = function(groupid){
            options.groupid = groupid;
            return filters;
        }
        filters.hostid = function(hostid){
            options.hostid = hostid;
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
        filters.networkid = function(networkid){
            options.networkid = networkid;
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
        filters.state = function(state){
            options.state = state;
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
            return requester.get('listVirtualMachines', options).then(function(response){
                return response.data.listvirtualmachinesresponse.virtualmachine;
            }).then(makeArray(VirtualMachine)).then(function(collection){
                return new VirtualMachines(collection, options);
            });
        }
        return filters;
    }
    return VirtualMachines;
}]);

angular.module('resources.virtualmachines').factory('VirtualMachine', ['requester', function (requester){
    var VirtualMachine = function(attrs){
        angular.extend(this, attrs);
    };
    VirtualMachine.prototype.start = function(){
        var self = this;
        self.state = 'Starting';
        return requester.async('startVirtualMachine', {id : self.id}).then(function(response){
            self.state = 'Running';
        });
    };
    VirtualMachine.prototype.stop = function(){
        var self = this;
        self.state = 'Stopping'
        return requester.async('stopVirtualMachine', {id : self.id}).then(function(response){
            self.state = 'Stopped';
        });
    };
    VirtualMachine.prototype.reboot = function(){
        var self = this;
        self.state = 'Rebooting';
        return requester.async('rebootVirtualMachine', {id: self.id}).then(function(response){
            self.state = 'Running';
        });
    };
    VirtualMachine.prototype.destroy = function(){
        var self = this;
        return requester.async('destroyVirtualMachine', {id: self.id}).then(function(response){
            self.state = 'Destroyed';
        });
    };
    VirtualMachine.prototype.restore = function(){
        var self = this;
        self.state = "Restoring";
        return requester.async('restoreVirtualMachine', {id: self.id}).then(function(response){
            self.state = "Stopped";
        });
    };

    VirtualMachine.prototype.isRunning = function(){
        return this.state === 'Running';
    };

    VirtualMachine.prototype.update = function(){
        return requester.get('updateVirtualMachine', {
            id: this.id,
            displayname: this.displayname,
            group: this.group,
            ostypeid: this.ostypeid,
        }).then(function(response){
            return response.data.updatevirtualmachineresponse.virtualmachine;
        }).then(function(response){
            this.id = response.id;
            this.displayname = response.displayname;
            this.group = response.group;
            this.ostypeid = response.ostypeid;
        });
    };
    return VirtualMachine;
}]);

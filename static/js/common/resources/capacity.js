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

angular.module('resources.capacity', ['services.helperfunctions', 'services.requester']);
angular.module('resources.capacity').factory('Capacities', ['requester', 'makeArray', 'Capacity',
        function(requester, makeArray, Capacity){
    var pagesize = 20;

    var Capacities = function(capacities, options){
        this.options = options || {};
        this.collection = capacities;

        if(!this.options.pagesize) this.options.pagesize = pagesize;
    };

    // Class methods
    Capacities.prototype.list = function(){
        return this.collection;
    }

    // Static methods
    Capacities.customFilter = function(){
        var filters = {};
        var options = {};

        filters.clusterid = function(clusterid){
            options.clusterid = clusterid;
            return filters;
        }
        filters.fetchlatest = function(fetchlatest){
            // Defaults to true when this is called
            if(fetchlatest === undefined) fetchlatest = true;
            options.fetchlatest = fetchlatest.toString();
            return filters;
        }
        filters.keyword = function(keyword){
            options.keyword = keyword;
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
        filters.sortby = function(sortby){
            options.sortby = sortby;
            return filters;
        }
        filters.type = function(type){
            options.type = type;
            return filters;
        }
        filters.zoneid = function(zoneid){
            options.zoneid = zoneid;
            return filters;
        }

        filters.get = function(){
            return requester.get('listCapacity', options).then(function(response){
                return response.data.listcapacityresponse.capacity;
            }).then(makeArray(Capacity)).then(function(collection){
                return new Capacities(collection, options);
            });
        }

        return filters;
    }
    return Capacities;
}]);

angular.module('resources.capacity').factory('Capacity', ['convertByType', function(convertByType){
    var Capacity = function(attrs){
        angular.extend(this, attrs);

        // If there's podname in the result, add it to zonename
        if(this.podname) this.zonename = this.zonename.concat(', '  + 'Pod: ' + this.podname);
        // Same thing here
        if(this.clustername) this.zonename = this.zonename.concat(', ' + 'Cluster: ' + this.clustername);

        this.percent = parseInt(this.percentused);

        this.used = convertByType(this.type, this.capacityused);
        this.total = convertByType(this.type, this.capacitytotal);

        // Backup for type's 'value'. 'type' will be replaced with its appropriate name
        this.typeValue = this.type;
        switch(this.type){
            case 0:
                this.type = 'Memory';
                break;
            case 1:
                this.type = 'CPU';
                break;
            case 2:
                this.type = 'Storage';
                break;
            case 3:
                this.type = 'Primary Storage';
                break;
            case 4:
                this.type = 'Public IP Addresses';
                break;
            case 5:
                this.type = 'Management IP Addresses';
                break;
            case 6:
                this.type = 'Secondary Storage';
                break;
            case 7:
                this.type = 'VLAN';
                break;
            case 8:
                this.type = 'Direct IP Addresses';
                break;
            case 9:
                this.type = 'Local Storage';
                break;
            case 10:
                this.type = 'Routing Host';
                break;
            case 11:
                this.type = "Storage";
                break;
            case 12:
                this.type = "Usage Server";
                break;
            case 13:
                this.type = "Management Server";
                break;
            case 14:
                this.type = "Domain Router";
                break;
            case 15:
                this.type = "Console Proxy";
                break;
            case 16:
                this.type = "User VM";
                break;
            case 17:
                this.type = "VLAN";
                break;
            case 18:
                this.type = "Secondary Storage VM";
                break;
        }
    }
    return Capacity;
}]);

angular.module('resources.capacity').factory('convertByType', function(){
    // Imported from the other UI
    convertBytes = function(bytes) {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + " KB";
        } else if (bytes < 1024 * 1024 * 1024) {
            return (bytes / 1024 / 1024).toFixed(2) + " MB";
        } else if (bytes < 1024 * 1024 * 1024 * 1024) {
            return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
        } else {
            return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
        }
    };

    convertHz = function(hz) {
        if (hz == null)
            return "";

        if (hz < 1000) {
            return hz + " MHz";
        } else {
            return (hz / 1000).toFixed(2) + " GHz";
        }
    };

    return function(type, value) {
        switch (type) {
            case 0:
                return convertBytes(value);
            case 1:
                return convertHz(value);
            case 2:
                return convertBytes(value);
            case 3:
                return convertBytes(value);
            case 6:
                return convertBytes(value);
            case 9:
                return convertBytes(value);
            case 11:
                return convertBytes(value);
        }
        return value;
    }
})

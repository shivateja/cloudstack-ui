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
angular.module('resources.snapshots').factory('Snapshots', ['Snapshot', 'makeArray', 'requester', 'setState', function(Snapshot, makeArray, requester, setState){
    var pagesize = 20;

    var Snapshots = function(snapshots, state){
        this.state = setState(state);
        this.collection = snapshots;
    };

    //Class methods
    Snapshots.prototype.list = function(){
        return this.collection;
    };

    Snapshots.prototype.loadNextPage = function(){
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
        return requester.get('listSnapshots', params)
            .then(function(response){
                return response.data.listsnapshotsresponse.snapshot;
            }).then(makeArray(Snapshot)).then(function(snapshots){
                if(snapshots.length){
                    self.state.page++;
                    self.collection = self.collection.concat(snapshots);
                };
            });
    };

    //Static methods
    Snapshots.getFirstPage = function(){
        return requester.get('listSnapshots', {
            page: 1,
            pagesize: pagesize
        }).then(function(response){
            return response.data.listsnapshotsresponse.snapshot;
        }).then(makeArray(Snapshot)).then(function(collection){
            return new Snapshots(collection, {page: 1});
        });
    }

    Snapshots.getAll = function(){
        return requester.get('listSnapshots').then(function(response){
            return response.data.listsnapshotsresponse.snapshot;
        }).then(makeArray(Snapshot)).then(function(collection){
            return new Snapshots(collection);
        });
    };

    return Snapshots;
}]);

angular.module('resources.snapshots').factory('Snapshot', function(){
    var Snapshot = function(attrs){
        angular.extend(this, attrs);
    };
    return Snapshot;
});

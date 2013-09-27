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

angular.module('storage', ['resources.volumes', 'resources.snapshots', 'resources.zones', 'resources.diskofferings', 'services.breadcrumbs', 'services.pluginsProvider']).
config(['pluginsProvider', function(pluginsProvider){
    pluginsProvider.register('Storage', '/storage/volumes', {
        controller: 'VolumesListCtrl',
        templateUrl: '/static/js/app/storage/volumes.tpl.html',
        resolve: {
            volumes: function(Volumes){
                return Volumes.getFirstPage();
            }
        }
    }).
    extend('/storage/snapshots', {
        controller: 'SnapshotsListCtrl',
        templateUrl: '/static/js/app/storage/snapshots.tpl.html',
        resolve:{
            snapshots: function(Snapshots){
                return Snapshots.getFirstPage();
            }
        }
    }).
    extend('/storage/volumes/:id', {
        controller: 'VolumeDetailCtrl',
        templateUrl: '/static/js/app/storage/volume-detail.tpl.html',
        resolve: {
            volume: function($route, Volumes){
                return Volumes.getById($route.current.params.id);
            }
        }
    }).
    extend('/storage/volumes/:id/snapshots', {
        controller: 'SnapshotsOfVolumeListCtrl',
        templateUrl: '/static/js/app/storage/snapshots.tpl.html',
        resolve:{
            volume: function($route, Volumes){
                return Volumes.getById($route.current.params.id);
            },
            snapshots: function(Snapshots, $route){
                return Snapshots.customFilters().page(1).pagesize(20).volumeid($route.current.params.id).get();
            }
        }
    }).
    extend('/storage/snapshots/:id', {
        controller: 'SnapshotDetailCtrl',
        templateUrl: '/static/js/app/storage/snapshot-detail.tpl.html',
        resolve: {
            snapshot: function(Snapshots, $route){
                return Snapshots.getById($route.current.params.id);
            }
        }
    })
}]);

angular.module('storage').controller('VolumesListCtrl',
        ['$scope', '$location', 'volumes', 'Breadcrumbs', 'Volumes', 'Zones', 'DiskOfferings', 'Notifications', '$route',
        function($scope, $location, volumes, Breadcrumbs, Volumes, Zones, DiskOfferings, Notifications, $route){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Volumes', '/#/storage/volumes');
    $scope.collection = volumes;
    $scope.view = 'volumes';
    $scope.toDisplay = ['name', 'type', 'hypervisor', 'vmdisplayname'];

    // This will be input for modal-form
    $scope.addVolumeForm = {
        title: 'Add Volume',
        onSubmit: function(data){
            Volumes.createNew(data).then(function(response){
                Notifications.push('success', 'Added Volume');
                $route.reload();
            }, function(error){
                Notifications.push('error', 'Adding volume failed with error : ' + error.data.createvolumeresponse.errortext);
            })
        },
        fields: [
            {
                model: 'name',
                type: 'input-text',
                label: 'name',
                required: true
            },
            {
                model: 'zoneid',
                type: 'select',
                label: 'availabilityZone',
                options: function(){
                    return Zones.getAll().then(function(zones){
                        return zones.list();
                    })
                },
                getValue: function(model){
                    return model.id;
                },
                getName: function(model){
                    return model.name;
                }
            },
            {
                model: 'diskofferingid',
                type: 'select',
                label: 'diskoffering',
                options: function(){
                    return DiskOfferings.getAll().then(function(diskofferings){
                        return diskofferings.list();
                    })
                },
                getValue: function(model){
                    return model.id;
                },
                getName: function(model){
                    return model.name;
                }
            }
        ]
    };

    $scope.uploadVolumeForm = {
        title: 'Upload Volume',
        onSubmit: function(data){
            Volumes.uploadNew(data).then(function(response){
                Notifications.push('success', 'Uploaded new volume');
                $route.reload();
            }, function(error){
                // :-(
                Notifications.push('error', 'Upload volume failed with error : ' + error.errortext);
            })
        },
        fields: [
            {
                model: 'name',
                type: 'input-text',
                label: 'name',
            },
            {
                model: 'zoneid',
                type: 'select',
                label: 'availabilityZone',
                options: function(){
                    return Zones.getAll().then(function(zones){
                        return zones.list();
                    });
                },
                getValue: function(model){
                    return model.id;
                },
                getName: function(model){
                    return model.name;
                }
            },
            {
                model: 'format',
                type: 'select',
                label: 'format',
                options: function(){
                    return ['RAW', 'VHD', 'OVA', 'QCOW2'];
                },
                getValue: function(model){
                    return model;
                },
                getName: function(model){
                    return model;
                }
            },
            {
                model: 'url',
                type: 'input-text',
                label: 'url'
            },
            {
                model: 'checksum',
                type: 'input-text',
                label: 'checksum'
            }
        ],
    }

   // Watch for 'select view' option change
   $scope.$watch('view', function(newVal, oldVal){
        if(newVal === oldVal) return;
        if(newVal === 'volumes') return;
        else $location.path('/storage/snapshots');
    });
}]);

angular.module('storage').controller('SnapshotsListCtrl', ['$scope', '$location', 'snapshots', 'Breadcrumbs', function($scope, $location, snapshots, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Snapshots', '/#/storage/snapshots');
    $scope.collection = snapshots;
    $scope.view = 'snapshots';
    $scope.toDisplay = ['volumename', 'intervaltype', 'created', 'state'];

    // Watch for 'select view' option change
    $scope.$watch('view', function(newVal, oldVal){
        if(newVal === oldVal) return;
        if(newVal === 'snapshots') return;
        else $location.path('/volumes');
    });
}]);

angular.module('storage').controller('VolumeDetailCtrl', ['$scope', 'volume', 'Breadcrumbs', 'Notifications', function($scope, volume, Breadcrumbs, Notifications){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Volumes', '/#/storage/volumes');
    Breadcrumbs.push(volume.name, '/#/storage/volumes/' + volume.id);

    $scope.volume = volume;

    $scope.takeSnapshot = function(){
        $scope.volume.takeSnapshot().then(function(result){
            Notifications.push('success', 'Created snapshot for volume : ' + result.snapshot.volumename);
        }, function(errorResult){
            Notifications.push('error', 'Failed to create snapshot. Error : ' + errorResult.errortext);
        });
    };
}]);

angular.module('storage').controller('SnapshotsOfVolumeListCtrl', ['$scope', 'Breadcrumbs', 'Notifications', 'snapshots', 'volume',
        function($scope, Breadcrumbs, Notifications, snapshots, volume){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Volumes', '/#/storage/volumes');
    Breadcrumbs.push(volume.name, '/#/storage/volumes/' + volume.id);
    Breadcrumbs.push('Snapshots', '/#/storage/volumes/' + volume.id + '/snapshots');

    $scope.collection = snapshots;
    $scope.volume = volume;
}]);

angular.module('storage').controller('SnapshotDetailCtrl', ['$scope', 'snapshot', 'Breadcrumbs', 'Notifications', '$location',
        function($scope, snapshot, Breadcrumbs, Notifications, $location){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Snapshots', '/#/storage/snapshots');
    Breadcrumbs.push(snapshot.volumename, '/#/storage/snapshots/'+ snapshot.id);

    $scope.snapshot = snapshot;

    $scope.delete = function(snapshot){
        snapshot.delete().then(function(response){
            Notifications.push('success', 'Deleted snapshot : ' + snapshot.volumename);
            $location.path('/storage/snapshots');
        }, function(error){
            Notifications.push('error', 'Delete snapshot failed with error : ' + error.errortext);
        })
    }
}]);

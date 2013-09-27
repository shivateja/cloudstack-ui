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

angular.module('instances', ['resources.virtualmachines', 'resources.volumes', 'services.breadcrumbs', 'services.notifications', 'services.pluginsProvider']).
config(['pluginsProvider', function(pluginsProvider){

    pluginsProvider.register('Instances', '/instances', {
        controller: 'VirtualMachinesListCtrl',
        templateUrl: '/static/js/app/instances/instances.tpl.html',
        resolve:{
            virtualmachines : function(VirtualMachines){
                return VirtualMachines.getFirstPage();
            }
        }
    }).
    extend('/instances/:id', {
        controller: 'VirtualMachineDetailCtrl',
        templateUrl: '/static/js/app/instances/instance-details.tpl.html',
        resolve: {
            virtualmachine: function($route, VirtualMachines){
                return VirtualMachines.getById($route.current.params.id);
            }
        }
    }).
    extend('/instances/:id/volumes', {
        controller: 'VolumesOfVmCtrl',
        templateUrl: '/static/js/app/storage/volumes.tpl.html',
        resolve: {
            virtualmachine: function($route, VirtualMachines){
                return VirtualMachines.getById($route.current.params.id);
            },
            volumes : function($route, Volumes){
                return Volumes.customFilter().virtualmachineid($route.current.params.id).get();
            }
        }
    });
}]);

angular.module('instances').controller('VirtualMachinesListCtrl',
        ['$scope', 'virtualmachines', 'Breadcrumbs', 'Notifications', function($scope, virtualmachines, Breadcrumbs, Notifications){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Instances', '/#/instances');
    $scope.collection = virtualmachines;
    $scope.toDisplay = ['displayname', 'instancename', 'zonename', 'state'];

    $scope.start = function(vm){
        if(vm.isRunning()){
            // If vm is already running, show error
            Notifications.push('error', 'VM ' + vm.displayname + ' is already running');
            return;
        }
        vm.start().then(function(response){
            Notifications.push('success', 'Started VirtualMachine : ' + vm.displayname);
        })
    }
    $scope.stop = function(vm){
        if(!vm.isRunning()){
            // If vm is not running, show error
            Notifications.push('error', 'VM ' + vm.displayname + ' is not running');
            return;
        }
        vm.stop().then(function(response){
            Notifications.push('success', 'Stopped VirtualMachine : ' + vm.displayname);
        })
    }
    $scope.reboot = function(vm){
        if(!vm.isRunning()){
            Notifications.push('error', 'VM ' + vm.displayname + ' is not running');
            return;
        }
        vm.reboot().then(function(response){
            Notifications.push('success', 'Rebooted VirtualMachine : ' + vm.displayname);
        })
    }
    $scope.destroy = function(vm){
        vm.destroy().then(function(destroy){
            Notifications.push('success', 'Destroyed VirtualMachine : ' + vm.displayname);
        })
    }
}]);

angular.module('instances').controller('VirtualMachineDetailCtrl', ['$scope', 'virtualmachine', 'Breadcrumbs', function($scope, virtualmachine, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Instances', '/#/instances');
    Breadcrumbs.push(virtualmachine.displayname, '/#/instances/'+ virtualmachine.id);
    $scope.virtualmachine = virtualmachine;
}]);

angular.module('instances').controller('VolumesOfVmCtrl', ['$scope', 'virtualmachine', 'volumes', 'Breadcrumbs',
        function($scope, virtualmachine, volumes, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Instances', '/#/instances');
    Breadcrumbs.push(virtualmachine.displayname, '/#/instances/'+ virtualmachine.id);
    Breadcrumbs.push('Volumes', '/#/instances/' + virtualmachine.id + '/volumes');

    $scope.collection = volumes;
    $scope.toDisplay = ['name', 'type', 'hypervisor', 'vmdisplayname'];
}]);

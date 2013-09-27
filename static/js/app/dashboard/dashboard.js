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

angular.module('dashboard', ['resources.virtualmachines', 'resources.capacity', 'services.pluginsProvider']).
config(['pluginsProvider', function(pluginsProvider){

    pluginsProvider.register('Dashboard', '/dashboard',{
        controller: 'DashboardCtrl',
        templateUrl: '/static/js/app/dashboard/dashboard.tpl.html'
    });
}]);

angular.module('dashboard').controller('DashboardCtrl', ['$scope', 'Breadcrumbs', 'VirtualMachines', 'Events', 'Networks', 'Capacities', function($scope, Breadcrumbs, VirtualMachines, Events, Networks, Capacities){
    Breadcrumbs.refresh();

    VirtualMachines.getAll().then(function(instances){
        // Number of running, stopped instances
        $scope.runningInstances = $.grep(instances.list(), function(instance){
            return instance.state === 'Running';
        }).length;

        $scope.stoppedInstances = $.grep(instances.list(), function(instance){
            return instance.state === 'Stopped';
        }).length;

        $scope.totalInstances = instances.list().length;
    });

    Networks.customFilter().listall().type('isolated').supportedservices('SourceNat').get().then(function(networks){
        $scope.networks = networks;
    });

    Capacities.customFilter().fetchlatest(false).sortby('usage').pagesize(8).page(0).get().then(function(capacities){
        $scope.capacities = capacities;
    });
}]);

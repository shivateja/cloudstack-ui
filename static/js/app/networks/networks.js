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

angular.module('networks', ['resources.networks', 'services.breadcrumbs', 'services.pluginsProvider']).
config(['pluginsProvider', function(pluginsProvider){
    pluginsProvider.register('Networks', '/networks',{
        controller: 'NetworksListCtrl',
        templateUrl: '/static/js/app/networks/networks.tpl.html',
        resolve: {
            networks: function(Networks){
                return Networks.getFirstPage();
            }
        }
    }).
    extend('/networks/:id', {
        controller: 'NetworkDetailCtrl',
        templateUrl: '/static/js/app/networks/network-details.tpl.html',
        resolve: {
            network: function($route, Networks){
                return Networks.getById($route.current.params.id);
            }
        }
    })
}]);

angular.module('networks').controller('NetworksListCtrl', ['$scope', 'networks', 'Breadcrumbs', function($scope, networks, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Networks', '/#/networks');
    $scope.collection = networks;
}]);

angular.module('networks').controller('NetworkDetailCtrl', ['$scope', 'network', 'Breadcrumbs', 'Notifications', function($scope, network, Breadcrumbs, Notifications){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Networks', '/#/networks');
    Breadcrumbs.push(network.name, '/#/networks/'+ network.id);

    $scope.network = network;

    $scope.restart = function(network){
        network.restart().then(function(response){
            Notifications.push('success', 'Restarted Network ' + network.name);
        }, function(errorResponse){
            Notifications.push('error', 'Failed to restart network with error : ' + errorResponse.errortext);
        });
    };

    $scope.delete = function(network){
        network.delete().then(function(response){
            Notifications.push('success', 'Deleted network : ' + network.name);
        }, function(errorResponse){
            Notifications.push('error', 'Failed to delete network with error : ' + errorResponse.errortext);
        });
    }
}]);

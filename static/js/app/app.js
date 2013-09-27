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

angular.module('cloudstack', [
        'dashboard',
        'instances',
        'storage',
        'networks',
        'templates',
        'events',
        'accounts',
        'domains',
        'projects',
        'globalsettings', 
        'serviceofferings',
        'services.breadcrumbs',
        'services.notifications',
        'services.pluginsProvider',
        'directives',
        'security',
        'md5',
        'ui.bootstrap',
        'infinite-scroll',
        'ngCookies'
        ]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/',{
        controller: 'DefaultCtrl',
        templateUrl: 'default.html'
    }).
    otherwise({
        redirectTo: '/'
    })
}]);

angular.module('cloudstack').controller('DefaultCtrl', ['$scope', 'Breadcrumbs', 'security', '$location', function($scope, Breadcrumbs, security, $location){
    Breadcrumbs.refresh();
    // If the user is authenticated, show the dashboard. If not, this will automatically show the login screen
    if(security.isAuthenticated()) $location.path('/dashboard');
}]);


angular.module('cloudstack').controller('AppCtrl', ['$scope', 'Breadcrumbs', 'Notifications', 'Dictionary', '$rootScope', 'security', 'plugins', 'requester',
        function($scope, Breadcrumbs, Notifications, Dictionary, $rootScope, security, plugins, requester){
    // Plugins, used to build the side nav bar
    $scope.plugins = plugins;
    $scope.breadcrumbs = Breadcrumbs;
    $scope.dictionary = Dictionary;
    $scope.notifications = Notifications;

    $scope.security = security;

    // Call this function to see if something is loading
    $scope.isLoading = requester.hasPendingRequests;
}]);

angular.module('cloudstack').controller('HeaderCtrl', ['$scope', function($scope){
    // Do we need this?
}]);

angular.module('cloudstack').controller('NavCtrl', ['$scope', '$location', function($scope, $location){
    $scope.isActive = function(page){
        // Calling isActive('dashboard') will split the path and see if the first thing
        // in the path is 'dashboard', returns 'active' if it is
        return $location.path().split('/')[1] === page.split('/')[1]? 'active': '';
    }
}]);


angular.module('cloudstack').run(['security', '$location', function(security, $location) {
    // Check for previous login
    // If the user is not logged in, security.isAuthenticated should return false
    // and login screen shows up
    security.wasLoggedIn()
}]);

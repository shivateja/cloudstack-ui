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
        'ui.bootstrap',
        'infinite-scroll',
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
        'directives.confirm',
        'directives.modalForm',
        'directives.label',
        'directives.editInPlace',
        'directives.chart',
        'directives.doughnutUsageChart',
        'security',
        'md5',
        'ngCookies'
        ]).
config(["$routeProvider", function($routeProvider){
    $routeProvider.
    when('/',{
        controller: "DefaultCtrl",
        templateUrl: "default.html"
    }).
    otherwise({
        redirectTo: '/'
    })
}]);

angular.module("cloudstack").controller("DefaultCtrl", ["$scope", "Breadcrumbs", "security", "$location", function($scope, Breadcrumbs, security, $location){
    Breadcrumbs.refresh();
    
    if(security.isAuthenticated()) $location.path('/dashboard');
}]);


angular.module("cloudstack").controller("AppCtrl", ["$scope", "Breadcrumbs", "Notifications", "Dictionary", "$rootScope", "security", "plugins",
        function($scope, Breadcrumbs, Notifications, Dictionary, $rootScope, security, plugins){
    $scope.plugins = plugins
    $scope.breadcrumbs = Breadcrumbs;
    $scope.dictionary = Dictionary;
    $scope.notifications = Notifications;

    $scope.security = security;

    $scope.loading = false;

    $rootScope.$on("$routeChangeStart", function(event, next, current){
        $scope.loading = true;
    });

    $rootScope.$on("$routeChangeError", function(event){
        $scope.loading = false;
    });

    $rootScope.$on("$routeChangeSuccess", function(event, current, previous){
        $scope.loading = false;
    });
}]);

angular.module("cloudstack").controller("HeaderCtrl", ["$scope", function($scope){
}]);

angular.module("cloudstack").controller("NavCtrl", ["$scope", "$location", function($scope, $location){
    $scope.isActive = function(page){
        if($location.path() === '/' && page === '/') return 'active'; //home page
        console.log(page.split('/'));
        return $location.path().split('/')[1] === page.split('/')[1]? 'active': '';
    }
}]);


angular.module('cloudstack').run(['security', '$location', function(security, $location) {
    // Check for previous login
    // If not logged, redirect to logged in page
    if(!security.wasLoggedIn()){
        $location.path('/login');
    }
}]);

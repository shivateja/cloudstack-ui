angular.module('cloudstack', [
        'instances',
        'storage',
        'networks',
        'events',
        'accounts',
        'domains',
        'projects',
        'globalsettings', 
        'serviceofferings',
        'services.breadcrumbs'
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

angular.module("cloudstack").controller("DefaultCtrl", ["$scope", "Breadcrumbs", function($scope, Breadcrumbs){
    Breadcrumbs.refresh();
}]);

angular.module("cloudstack").controller("AppCtrl", ["$scope", "Breadcrumbs", "Dictionary", "$rootScope", function($scope, Breadcrumbs, Dictionary, $rootScope){
    $scope.breadcrumbs = Breadcrumbs;
    $scope.dictionary = Dictionary;
    $scope.loading = false;

    $rootScope.$on("$routeChangeStart", function(event, next, current){
        $scope.loading = true;
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
        return $location.path().split('/')[1] === page? 'active': '';
    }
}]);

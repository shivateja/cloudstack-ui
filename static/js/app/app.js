angular.module("cloudstack",["virtualmachines", "storage", "networks", "events", "accounts", "domains"]).
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

angular.module("cloudstack").controller("DefaultCtrl", ["$scope", function($scope){
}]);

angular.module("cloudstack").controller("AppCtrl", ["$scope", function($scope){
}]);

angular.module("cloudstack").controller("NavCtrl", ["$scope", function($scope){
}]);

angular.module("cloudstack").controller("HeaderCtrl", ["$scope", function($scope){
}]);

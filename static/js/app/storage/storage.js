angular.module("storage", ["resources.volumes", "services.breadcrumbs"]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/storage',{
        controller: 'VolumesListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module("storage").controller("VolumesListCtrl", ["$scope", "Volumes", "Breadcrumbs", function($scope, Volumes, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('storage', '/#/storage');
    $scope.collection = Volumes.fetch();
    $scope.toDisplay = ['name', 'type', 'hypervisor', 'vmdisplayname'];
}]);

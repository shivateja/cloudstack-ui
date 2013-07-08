angular.module("storage", ["resources.volumes", "services.breadcrumbs"]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/storage',{
        controller: 'VolumesListCtrl',
        templateUrl: 'table.html',
        resolve: {
            volumes: function(Volumes){
                return Volumes.fetch();
            }
        }
    })
}]);

angular.module("storage").controller("VolumesListCtrl", ["$scope", "volumes", "Breadcrumbs", function($scope, volumes, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('storage', '/#/storage');
    $scope.collection = volumes;
    $scope.toDisplay = ['name', 'type', 'hypervisor', 'vmdisplayname'];
}]);

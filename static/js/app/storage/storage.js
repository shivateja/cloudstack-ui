angular.module("storage", ["resources.volumes", "services.breadcrumbs"]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/storage',{
        controller: 'VolumesListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module("storage").controller("VolumesListCtrl", ["$scope", "Volumes", "Dictionary", "Breadcrumbs", function($scope, Volumes, Dictionary, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('storage', '/#/storage');
    $scope.dictionary = Dictionary;
    $scope.collection = Volumes.fetch();
    $scope.toDisplay = ['name', 'type', 'hypervisor', 'vmdisplayname'];
}]);

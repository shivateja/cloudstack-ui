angular.module("storage", ["resources.volumes"]).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/storage',{
        controller: 'VolumesListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module("storage").controller("VolumesListCtrl", ["$scope", "Volumes", "Dictionary", function($scope, Volumes, Dictionary){
    $scope.dictionary = Dictionary;
    $scope.collection = Volumes.fetch();
    $scope.toDisplay = ['name', 'type', 'hypervisor', 'vmdisplayname'];
}]);

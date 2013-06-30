angular.module("virtualmachines", ['resources.virtualmachines']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/virtualmachines', {
        controller: 'VirtualMachinesListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module("virtualmachines").controller("VirtualMachinesListCtrl", ["$scope", "VirtualMachines", "Dictionary", function($scope, VirtualMachines, Dictionary){
    $scope.dictionary = Dictionary;
    $scope.collection = VirtualMachines.fetch();
    $scope.toDisplay = ["displayname", "instancename", "zonename", "state"];
}]);

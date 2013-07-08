angular.module("instances", ['resources.virtualmachines', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/instances', {
        controller: 'VirtualMachinesListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module("instances").controller("VirtualMachinesListCtrl", ["$scope", "VirtualMachines", "Breadcrumbs", function($scope, VirtualMachines, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('instances', '/#/instances');
    $scope.collection = VirtualMachines.fetch();
    $scope.toDisplay = ["displayname", "instancename", "zonename", "state"];
}]);

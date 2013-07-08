angular.module("instances", ['resources.virtualmachines', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/instances', {
        controller: 'VirtualMachinesListCtrl',
        templateUrl: 'table.html',
        resolve:{
            virtualmachines : function(VirtualMachines){
                return VirtualMachines.fetch();
            }
        }
    })
}]);

angular.module("instances").controller("VirtualMachinesListCtrl", 
        ["$scope", "virtualmachines", "Breadcrumbs", function($scope, virtualmachines, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('instances', '/#/instances');
    $scope.collection = virtualmachines;
    $scope.toDisplay = ["displayname", "instancename", "zonename", "state"];
}]);


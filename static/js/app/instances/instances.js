angular.module("instances", ['resources.virtualmachines', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/instances', {
        controller: 'VirtualMachinesListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module("instances").controller("VirtualMachinesListCtrl", ["$scope", "VirtualMachines", "Dictionary", "Breadcrumbs", 
        function($scope, VirtualMachines, Dictionary, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('instances', '/#/instances');
    VirtualMachines.fetch().then(function(collection){
        $scope.collection = collection;
    });
    $scope.toDisplay = ["displayname", "instancename", "zonename", "state"];
}]);

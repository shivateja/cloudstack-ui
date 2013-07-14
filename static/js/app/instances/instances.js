angular.module("instances", ['resources.virtualmachines', 'services.breadcrumbs', 'services.notifications']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/instances', {
        controller: 'VirtualMachinesListCtrl',
        templateUrl: '/static/js/app/instances/instances.tpl.html',
        resolve:{
            virtualmachines : function(VirtualMachines){
                return VirtualMachines.fetch();
            }
        }
    })
}]);

angular.module("instances").controller("VirtualMachinesListCtrl", 
        ["$scope", "virtualmachines", "Breadcrumbs", "Notifications", function($scope, virtualmachines, Breadcrumbs, Notifications){
    Breadcrumbs.refresh();
    Breadcrumbs.push('instances', '/#/instances');
    $scope.collection = virtualmachines;
    $scope.toDisplay = ["displayname", "instancename", "zonename", "state"];

    $scope.$watch('collection', function(newValue, oldValue){
        if(newValue === oldValue){
            return; //workaround to stop initial call
        }
        Notifications.push('success', 'Something happened to a vm');
    }, true);
}]);


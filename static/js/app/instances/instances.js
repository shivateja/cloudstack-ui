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
}]);

angular.module("instances").controller("VirtualMachineItemCtrl", ["$scope", "Notifications", function($scope, Notifications){
    //This is used to send appropriate notifications for virtualmachine model changes
    var finalStates = ['Running', 'Stopped', 'Destroyed']
    $scope.$watch('collection[$index]', function(newval, oldval, scope){
        if(newval === oldval) return;
        if(finalStates.indexOf(newval.state) > -1){
            //Notify only for final state changes
            Notifications.push('success', 'Virtual Machine ' + newval.displayname + ' is ' + newval.state);
        };
    }, true);
}]);

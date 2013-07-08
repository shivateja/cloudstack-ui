angular.module('networks', ['resources.networks', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/networks',{
        controller: 'NetworksListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('networks').controller('NetworksListCtrl', ['$scope', 'Networks', 'Breadcrumbs', function($scope, Networks, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('networks', '/#/networks');
    $scope.collection = Networks.fetch();
    $scope.toDisplay = ['name', 'type', 'zonename'];
}]);

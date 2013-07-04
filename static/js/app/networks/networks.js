angular.module('networks', ['resources.networks', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/networks',{
        controller: 'NetworksListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('networks').controller('NetworksListCtrl', ['$scope', 'Networks', 'Dictionary', 'Breadcrumbs', function($scope, Networks, Dictionary, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('networks', '/#/networks');
    $scope.dictionary = Dictionary;
    $scope.collection = Networks.fetch();
    $scope.toDisplay = ['name', 'type', 'zonename'];
}]);

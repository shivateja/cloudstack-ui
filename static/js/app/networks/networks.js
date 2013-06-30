angular.module('networks', ['resources.networks']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/networks',{
        controller: 'NetworksListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('networks').controller('NetworksListCtrl', ['$scope', 'Networks', 'Dictionary', function($scope, Networks, Dictionary){
    $scope.dictionary = Dictionary;
    $scope.collection = Networks.fetch();
    $scope.toDisplay = ['name', 'type', 'zonename'];
}]);

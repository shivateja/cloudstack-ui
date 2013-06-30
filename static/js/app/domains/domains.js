angular.module('domains', ['resources.domains']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/domains',{
        controller: 'DomainsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('domains').controller('DomainsListCtrl', ['$scope', 'Domains', 'Dictionary', function($scope, Domains, Dictionary){
    $scope.dictionary = Dictionary;
    $scope.collection = Domains.fetch();
    $scope.toDisplay = ['id', 'name'];
}]);

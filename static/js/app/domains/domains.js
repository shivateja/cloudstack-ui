angular.module('domains', ['resources.domains', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/domains',{
        controller: 'DomainsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('domains').controller('DomainsListCtrl', ['$scope', 'Domains', 'Dictionary', 'Breadcrumbs', function($scope, Domains, Dictionary, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('domains', '/#/domains');
    $scope.dictionary = Dictionary;
    $scope.collection = Domains.fetch();
    $scope.toDisplay = ['id', 'name'];
}]);

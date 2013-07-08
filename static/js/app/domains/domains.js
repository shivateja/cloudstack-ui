angular.module('domains', ['resources.domains', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/domains',{
        controller: 'DomainsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('domains').controller('DomainsListCtrl', ['$scope', 'Domains', 'Breadcrumbs', function($scope, Domains, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('domains', '/#/domains');
    $scope.collection = Domains.fetch();
    $scope.toDisplay = ['id', 'name'];
}]);

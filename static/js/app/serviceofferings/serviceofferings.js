angular.module('serviceofferings', ['resources.serviceofferings', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/serviceofferings', {
        controller: 'ServiceOfferingsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('serviceofferings').controller('ServiceOfferingsListCtrl', ['$scope', 'ServiceOfferings', 'Breadcrumbs', function($scope, ServiceOfferings, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('serviceofferings', '/#/serviceofferings');
    $scope.collection = ServiceOfferings.fetch();
    $scope.toDisplay = ['name', 'displaytext'];
}]);

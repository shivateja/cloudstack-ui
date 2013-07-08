angular.module('globalsettings', ['resources.configurations', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/configurations', {
        controller: 'ConfigurationsListCtrl',
        templateUrl: 'table.html',
        resolve: {
            configurations: function(Configurations){
                return Configurations.fetch();
            }
        }
    })
}]);

angular.module('globalsettings').controller('ConfigurationsListCtrl', ['$scope', 'configurations', 'Breadcrumbs', function($scope, configurations, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('configurations', '/#/configurations');
    $scope.collection = configurations
    $scope.toDisplay = ['name', 'description', 'value'];
}]);

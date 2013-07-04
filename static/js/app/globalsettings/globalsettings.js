angular.module('globalsettings', ['resources.configurations', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/configurations', {
        controller: 'ConfigurationsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('globalsettings').controller('ConfigurationsListCtrl', ['$scope', 'Configurations', 'Dictionary', 'Breadcrumbs',
        function($scope, Configurations, Dictionary, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('configurations', '/#/configurations');
    $scope.dictionary = Dictionary;
    $scope.collection = Configurations.fetch();
    $scope.toDisplay = ['name', 'description', 'value'];
}]);

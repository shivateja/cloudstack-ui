angular.module('projects', ['resources.projects', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/projects', {
        controller: 'ProjectsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('projects').controller('ProjectsListCtrl', ['$scope', 'Projects', 'Breadcrumbs', function($scope, Projects, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('projects', '/#/projects');
    $scope.collection = Projects.fetch();
    $scope.toDisplay = ['name', 'displaytext', 'domain', 'account', 'state']
}]);

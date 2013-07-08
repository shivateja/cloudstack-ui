angular.module('events', ['resources.events', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/events', {
        controller: 'EventsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('events').controller('EventsListCtrl', ['$scope', 'Events', 'Breadcrumbs', function($scope, Events, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('events', '/#/events');
    $scope.collection = Events.fetch();
    $scope.toDisplay = ['type', 'description', 'account', 'created'];
}]);

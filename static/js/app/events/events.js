angular.module('events', ['resources.events']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/events', {
        controller: 'EventsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('events').controller('EventsListCtrl', ['$scope', 'Events', 'Dictionary', function($scope, Events, Dictionary){
    $scope.dictionary = Dictionary;
    $scope.collection = Events.fetch();
    $scope.toDisplay = ['type', 'description', 'account', 'created'];
}]);

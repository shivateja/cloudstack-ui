angular.module('accounts', ['resources.accounts']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/accounts', {
        controller: 'AccountsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('accounts').controller('AccountsListCtrl', ['$scope', 'Accounts', 'Dictionary', function($scope, Accounts, Dictionary){
    $scope.dictionary = Dictionary;
    $scope.collection = Accounts.fetch();
    $scope.toDisplay = ['name', 'domain', 'state'];
}]);

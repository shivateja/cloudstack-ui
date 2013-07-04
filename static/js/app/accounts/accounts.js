angular.module('accounts', ['resources.accounts', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/accounts', {
        controller: 'AccountsListCtrl',
        templateUrl: 'table.html'
    })
}]);

angular.module('accounts').controller('AccountsListCtrl', ['$scope', 'Accounts', 'Dictionary', 'Breadcrumbs', function($scope, Accounts, Dictionary, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('accounts', '/#/accounts');
    $scope.dictionary = Dictionary;
    $scope.collection = Accounts.fetch();
    $scope.toDisplay = ['name', 'domain', 'state'];
}]);

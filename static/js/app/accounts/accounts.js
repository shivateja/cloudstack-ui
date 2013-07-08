angular.module('accounts', ['resources.accounts', 'services.breadcrumbs']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/accounts', {
        controller: 'AccountsListCtrl',
        templateUrl: 'table.html',
        resolve: {
            accounts: function(Accounts){
                return Accounts.fetch();
            }
        }
    })
}]);

angular.module('accounts').controller('AccountsListCtrl', ['$scope', 'accounts', 'Breadcrumbs', function($scope, accounts, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('accounts', '/#/accounts');
    $scope.collection = accounts;
    $scope.toDisplay = ['name', 'domain', 'state'];
}]);

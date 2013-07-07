angular.module('resources.accounts', ['services.helperfunctions']);
angular.module('resources.accounts').factory('Accounts', ['$http', 'Account', 'makeArray', function($http, Account, makeArray){
    this.fetch = function(){
        return $http.get('/api/accounts').then(function(response){
            return response.data.listaccountsresponse.account
        }).then(makeArray(Account));
    };
    return this;
}]);

angular.module('resources.accounts').factory('Account', function(){
    var Account = function(attrs){
        angular.extend(this,{
        });
        angular.extend(this, attrs);
    };
    return Account;
});

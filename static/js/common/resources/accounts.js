angular.module('resources.accounts', ['services.helperfunctions', 'services.requester']);
angular.module('resources.accounts').factory('Accounts', ['Account', 'makeArray', 'requester', function(Account, makeArray, requester){
    this.fetch = function(){
        return requester.get('listAccounts').then(function(response){
            return response.data.listaccountsresponse.account
        }).then(makeArray(Account));
    };
    return this;
}]);

angular.module('resources.accounts').factory('Account', function(){
    var Account = function(attrs){
        angular.extend(this, attrs);
    };
    return Account;
});

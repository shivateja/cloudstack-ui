angular.module('resources.accounts', []);
angular.module('resources.accounts').factory('Accounts', ['$http', 'Account', function($http, Account){
    this.fetch = function(){
        var collection = {};
        $http.get('/api/accounts').success(function(data){
            response = data.listaccountsresponse.account;
            for(var i = 0; i < response.length; i++){
                collection[response[i]['id']] = new Account(response[i]);
            }
            }).error(function(data){
                console.log("Error while fetching accounts list");
            });
        return collection;
    };
    return this;
}]);

angular.module('resources.accounts').factory('Account', function(){
    var Account = function(attrs){
        angular.extend(this,{
        })
        angular.extend(this, attrs);
    };
    return Account;
});

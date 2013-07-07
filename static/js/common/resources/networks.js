angular.module('resources.networks',['services.helperfunctions']);
angular.module('resources.networks').factory('Networks', ['$http', 'Network', 'makeArray', function($http, Network, makeArray){
    this.fetch = function(){
        return $http.get('/api/networks').then(function(response){
            return response.data.listnetworksresponse.network;
        }).then(makeArray(Network));
    };
    return this;
}]);

angular.module('resources.networks').factory('Network', function(){
    var Network = function(attrs){
        angular.extend(this, {
        });
        angular.extend(this, attrs);
    };
    return Network;
});

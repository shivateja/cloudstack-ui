angular.module('resources.networks',[]);
angular.module('resources.networks').factory('Networks', ['$http', 'Network', function($http, Network){
    this.fetch = function(){
        var collection = {};
        $http.get('/api/networks').success(function(data){
            response = data.listnetworksresponse.network;
            for(var i=0; i<response.length; i++){
                collection[response[i]['id']] = new Network(response[i]);
            }
        }).error(function(data){
            console.log('Error while fetching networks list');
        });
        return collection;
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

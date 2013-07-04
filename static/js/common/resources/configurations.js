angular.module('resources.configurations', []);
angular.module('resources.configurations').factory('Configurations', ['$http', 'Configuration', function($http, Configuration){
    this.fetch = function(){
        var collection = [];
        $http.get('/api/configurations').success(function(data){
            response = data.listconfigurationsresponse.configuration;
            for(var i=0; i<response.length; i++){
                collection.push(new Configuration(response[i]));
            }
        }).error(function(data){
                console.log('Error while fetching configurations list');
        });
        return collection;
    }
    return this;
}]);

angular.module('resources.configurations').factory('Configuration', function(){
    var Configuration = function(attrs){
        angular.extend(this,{
        })
        angular.extend(this, attrs);
    }
    return Configuration;
});

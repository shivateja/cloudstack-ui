angular.module('resources.configurations', ['services.helperfunctions']);
angular.module('resources.configurations').factory('Configurations', ['$http', 'Configuration', 'makeArray', function($http, Configuration, makeArray){
    this.fetch = function(){
        return $http.get('/api/configurations').then(function(response){
            return response.data.listconfigurationsresponse.configuration;
        }).then(makeArray(Configuration));
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

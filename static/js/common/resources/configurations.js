angular.module('resources.configurations', ['services.helperfunctions', 'services.requester']);
angular.module('resources.configurations').factory('Configurations', ['$http', 'Configuration', 'makeArray', 'requester', function($http, Configuration, makeArray, requester){
    this.fetch = function(){
        return requester.get('listConfigurations').then(function(response){
            return response.data.listconfigurationsresponse.configuration;
        }).then(makeArray(Configuration));
    }
    return this;
}]);

angular.module('resources.configurations').factory('Configuration', function(){
    var Configuration = function(attrs){
        angular.extend(this, attrs);
    }
    return Configuration;
});

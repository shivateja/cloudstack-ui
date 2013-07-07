angular.module('resources.serviceofferings', ['services.helperfunctions']);
angular.module('resources.serviceofferings').factory('ServiceOfferings', ['$http', 'ServiceOffering', 'makeArray', function($http, ServiceOffering, makeArray){
    this.fetch = function(){
        return $http.get('/api/serviceofferings').then(function(response){
            return response.data.listserviceofferingsresponse.serviceoffering;
        }).then(makeArray(ServiceOffering));
    };
    return this;
}]);

angular.module('resources.serviceofferings').factory('ServiceOffering', function(){
    var ServiceOffering = function(attrs){
        angular.extend(this, {});
        angular.extend(this, attrs);
    }
    return ServiceOffering;
});

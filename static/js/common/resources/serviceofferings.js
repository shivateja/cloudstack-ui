angular.module('resources.serviceofferings', []);
angular.module('resources.serviceofferings').factory('ServiceOfferings', ['$http', 'ServiceOffering', function($http, ServiceOffering){
    this.fetch = function(){
        var collection = [];
        $http.get('/api/serviceofferings').success(function(data){
            var response = data.listserviceofferingsresponse.serviceoffering;
            angular.forEach(response, function(value){
                collection.push(new ServiceOffering(value));
            });
        }).error(function(data){
            console.log('Error while fetching service offerings');
        });
        return collection;
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

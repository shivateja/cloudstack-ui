angular.module('resources.domains', []);
angular.module('resources.domains').factory('Domains', ['$http', 'Domain', function($http, Domain){
    this.fetch = function(){
        var collection = {};
        $http.get('/api/domains').success(function(data){
            response = data.listdomainsresponse.domain;
            for(var i=0; i< response.length; i++){
                collection[response[i]['id']] = new Domain(response[i]);
            }
        }).error(function(data){
            console.log('Error while fetching domains list');
        });
        return collection;
    };
    return this;
}]);

angular.module('resources.domains').factory('Domain', function(){
    var Domain = function(attrs){
        angular.extend(this, {
            //helper functions
        })
        angular.extend(this, attrs);
    }
    return Domain;
});

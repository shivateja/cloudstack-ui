angular.module('resources.domains', ['services.helperfunctions']);
angular.module('resources.domains').factory('Domains', ['$http', 'Domain', 'makeArray', function($http, Domain, makeArray){
    this.fetch = function(){
        return $http.get('/api/domains').then(function(response){
            return response.data.listdomainsresponse.domain;
        }).then(makeArray(Domain));
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

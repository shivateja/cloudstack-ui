angular.module('resources.volumes', ['services.helperfunctions']);
angular.module('resources.volumes').factory('Volumes', ['$http', 'Volume', 'makeArray', function($http, Volume, makeArray){
    this.fetch = function(){
        return $http.get('/api/volumes').then(function(response){
            return response.data.listvolumesresponse.volume;
        }).then(makeArray(Volume));
    };
    return this;
}]);

angular.module('resources.volumes').factory('Volume', function(){
    var Volume = function(attrs){
        angular.extend(this, {
        });
        angular.extend(this, attrs);
    }
    return Volume;
});

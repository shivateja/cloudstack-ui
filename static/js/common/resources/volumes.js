angular.module('resources.volumes', []);
angular.module('resources.volumes').factory('Volumes', ['$http', 'Volume', function($http, Volume){
    this.fetch = function(){
        var collection = {};
        $http.get('/api/volumes').success(function(data){
            response = data.listvolumesresponse.volume;
            for(var i = 0; i < response.length; i++){
                collection[response[i]['id']] = new Volume(response[i]);
            }
        }).
        error(function(data){
            console.log('Error while fetching volumes list');
        });
        return collection;
    }
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

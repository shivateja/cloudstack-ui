angular.module('resources.events', []);
angular.module('resources.events').factory('Events', ['$http', 'Event', function($http, Event){
    this.fetch = function(){
        var collection = {};
        $http.get('/api/events').success(function(data){
            response = data.listeventsresponse.event;
            for(var i=0; i<response.length; i++){
                collection[response[i]['id']] = new Event(response[i]);
            }
        }).error(function(data){
            console.log('Error while fetching events list');
        });
        return collection;
    }
    return this;
}]);

angular.module('resources.events').factory('Event', function(){
    var Event = function(attrs){
        angular.extend(this,{
        })
        angular.extend(this, attrs);
    }
    return Event;
});

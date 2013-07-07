angular.module('resources.events', ['services.helperfunctions']);
angular.module('resources.events').factory('Events', ['$http', 'Event', 'makeArray', function($http, Event, makeArray){
    this.fetch = function(){
        return $http.get('/api/events').then(function(response){
            return response.data.listeventsresponse.event;
        }).then(makeArray(Event));
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

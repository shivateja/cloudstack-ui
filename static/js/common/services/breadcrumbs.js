angular.module('services.breadcrumbs', []);
angular.module('services.breadcrumbs').factory('Breadcrumbs', ['$rootScope', '$location', function($rootScope, $location){
    var breadcrumbs = [{id:'home', url:'/#/'}];
    var Breadcrumbs = {};
    Breadcrumbs.refresh = function(){
        breadcrumbs = [{id:'home', url:'/#/'}];
    };
    Breadcrumbs.push = function(id, url){
        breadcrumbs.push({id: id, url: url})
    };
    Breadcrumbs.getAll = function(){
        return breadcrumbs;
    };
    return Breadcrumbs;
}]);

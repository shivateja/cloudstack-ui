angular.module('services.pluginsProvider', []);
angular.module('services.pluginsProvider').provider('plugins', ['$routeProvider', function($routeProvider){
    var plugins = [];

    // Ugly, but will do it for now
    // The order in which app bootstraps affects the way plugins are appended into
    // the above array
    // Thus, it affects the way order in which they appear in the side-nav
    // this is used to set the default order
    var defaultOrder = [
        '/dashboard',
        '/instances',
        '/storage/volumes',
        '/networks',
        '/templates',
        '/events',
        '/accounts',
        '/domains',
        '/infrastructure',
        '/projects',
        '/configurations',
        '/serviceofferings'
    ]

    this.$get = function(){
        // Remove empty elements from plugins array
        plugins = $.grep(plugins, function(n){return(n)});
        return {
            listAll: function(){
                return plugins;
            }
        }
    };

    this.register = function(name, url, params){
        // Validity checks
        // Check if the plugin URL begins with a '/'
        if(url[0] !== '/'){
            throw new Error('In plugin ' + name + ' URL for plugin must start with /');
            return;
        }
        // Check if plugin is already registered
        if(plugins[url]){
            throw new Error('Plugin ' + name + ' already registered');
            return;
        }
        // Everything is valid
        // Add it to the dictionary and add the route
        if($.inArray(defaultOrder, url)){
            plugins[defaultOrder.indexOf(url)] = {url: url, name: name};
        }
        else{
            // Even this might cause problems?
            plugins.push({url: url, name: name});
        }
        
        if(!!params){
            // Add route only if params are given
            $routeProvider.when(url, params);
        }

        // Method to add more routes for plugin
        // but all the child routes from this plugin will start with the url for plugin
        return {
            extend : function(url, params){
                // TODO: Do we need some url checking here?
                $routeProvider.when(url, params);
                // This is to allow chaining of this call
                return this;
            }
        };
    };
}]);

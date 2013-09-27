// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

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

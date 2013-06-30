angular.module('resources.virtualmachines',[]);
angular.module("resources.virtualmachines").factory("VirtualMachines",["$http", "VirtualMachine", function($http, VirtualMachine){
    this.fetch = function(){
        var collection = {};
        $http.get('/api/virtualmachines').success(function(data){
                response = data.listvirtualmachinesresponse.virtualmachine;
                for(var i = 0; i < response.length; i++){
                    collection[response[i]['id']] = new VirtualMachine(response[i]);
                }
            }).error(function(data){
                console.log("Error while fetching virtual machines list");
            });
        return collection;
    };
    return this;
}]);

angular.module('resources.virtualmachines').factory('VirtualMachine',function (){
    var VirtualMachine = function(attrs){
        angular.extend(this, {
            start : function(){
                console.log('Start vm with id '+ this.id);
                this.state = "Started";
            },
            stop : function(){
                console.log('Stop vm with id ' + this.id);
                this.state = "Stopped";
            },
            destroy : function(){
                this.state = "Destroyed";
            }
        });
        angular.extend(this, attrs);
    };
    return VirtualMachine;
});

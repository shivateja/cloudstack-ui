angular.module('resources.virtualmachines',['services.helperfunctions']);
angular.module('resources.virtualmachines').factory('VirtualMachines',['$http', 'VirtualMachine', 'makeArray', function($http, VirtualMachine, makeArray){
    this.fetch = function(){
        return $http.get('/api/virtualmachines').then(function(response){
            //modify response
            return response.data.listvirtualmachinesresponse.virtualmachine;
        }).then(makeArray(VirtualMachine));
    };
    return this;
}]);

angular.module('resources.virtualmachines').factory('VirtualMachine', ['$http', function ($http){
    var VirtualMachine = function(attrs){
        angular.extend(this, {
            start : function(){
                console.log('Start vm with id' + this.id);
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
}]);

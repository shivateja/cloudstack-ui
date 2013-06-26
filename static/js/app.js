angular.module("cloudstack",["ngResource"]).
config(["$routeProvider", function($routeProvider){
    $routeProvider.
    when('/',{
        controller: "DefaultCtrl",
        templateUrl: "default.html"
    }).
    when("/users", {
        controller: "UsersListCtrl",
        templateUrl: "table.html"
    }).
    when("/virtualmachines",{
        controller: "VirtualMachinesListCtrl",
        templateUrl: "table.html"
    }).
    when("/events", {
        controller: "EventsListCtrl",
        templateUrl: "table.html"
    }).
    when("/configurations", {
        controller: "ConfigurationsListCtrl",
        templateUrl: "table.html"
    }).
    when("/networks", {
        controller: "NetworksListCtrl",
        templateUrl: "table.html"
    }).
    when("/serviceofferings",{
        controller: "ServiceOfferingsListCtrl",
        templateUrl: "table.html"
    }).
    when("/zones", {
        controller: "ZonesListCtrl",
        templateUrl: "table.html"
    }).
    otherwise({
        redirectTo: '/'
    });
}]);

angular.module("cloudstack").controller("DefaultCtrl", ["$scope", function($scope){
}]);

angular.module("cloudstack").controller("NavCtrl", ["$scope", function($scope){
    $scope.menuItems = {
        users : "Users",
        virtualmachines: "Virtual Machines",
    }
}]);

angular.module("cloudstack").controller("UsersListCtrl", ["$scope", "Users", "Dictionary" , function($scope, Users, Dictionary){
    //Move these to seperate configuration file
    $scope.dictionary = Dictionary;
    Users.get(
        {},
        function(data){
            //success
            $scope.collection = data.listusersresponse.user;
        },
        function(data){
            console.log("Error while fetching user list");
        });
    $scope.toDisplay = ["username", "account", "domain", "state"];
}]);

angular.module("cloudstack").factory("Users",["$resource", function($resource){
    return $resource("/api/users");
}]);

angular.module("cloudstack").controller("VirtualMachinesListCtrl", ["$scope", "VirtualMachines", "Dictionary", function($scope, VirtualMachines, Dictionary){
    $scope.dictionary = Dictionary;
    VirtualMachines.get(
        {},
        function(data){
            //success
            $scope.collection = data.listvirtualmachinesresponse.virtualmachine;
        },
        function(data){
            console.log("Error while fetching virtual machines list");
        });
    $scope.toDisplay = ["displayname", "instancename", "zonename", "state"];
}]);

angular.module("cloudstack").factory("VirtualMachines",["$resource", function($resource){
    return $resource("/api/virtualmachines");
}]);

angular.module("cloudstack").controller("EventsListCtrl", ["$scope", "Events", "Dictionary", function($scope, Events, Dictionary){
    $scope.dictionary = Dictionary;
    Events.get(
        {},
        function(data){
            //success
            $scope.collection = data.listeventsresponse.event;
        },
        function(data){
            console.log("Error while fetching events list");
        });
    $scope.toDisplay = ["type", "description", "account", "created"];
}]);

angular.module("cloudstack").factory("Events",["$resource", function($resource){
    return $resource("/api/events");
}]);

angular.module("cloudstack").controller("ConfigurationsListCtrl", ["$scope", "Configurations", "Dictionary", function($scope, Configurations, Dictionary){
    $scope.dictionary = Dictionary;
    Configurations.get(
        {},
        function(data){
            //success
            $scope.collection = data.listconfigurationsresponse.configuration;
        },
        function(data){
            console.log("Error while fetching configurations list");
        });
    $scope.toDisplay = ["name", "description", "value"];
}]);

angular.module("cloudstack").factory("Configurations",["$resource", function($resource){
    return $resource("/api/configurations");
}]);

angular.module("cloudstack").controller("NetworksListCtrl", ["$scope", "Networks", "Dictionary", function($scope, Networks, Dictionary){
    $scope.dictionary = Dictionary;
    Networks.get(
        {},
        function(data){
            //success
            $scope.collection = data.listnetworksresponse.network;
        },
        function(data){
            console.log("Error while fetching networks list");
        });
    $scope.toDisplay = ["name", "type", "zonename"];
}]);

angular.module("cloudstack").factory("Networks",["$resource", function($resource){
    return $resource("/api/networks");
}]);

angular.module("cloudstack").controller("ServiceOfferingsListCtrl", ["$scope", "ServiceOfferings", "Dictionary", function($scope, ServiceOfferings, Dictionary){
    $scope.dictionary = Dictionary;
    ServiceOfferings.get(
        {},
        function(data){
            //success
            $scope.collection = data.listserviceofferingsresponse.serviceoffering;
        },
        function(data){
            console.log("Error while fetching service offerings list");
        });
    $scope.toDisplay = ["name", "displaytext"];
}]);

angular.module("cloudstack").factory("ServiceOfferings",["$resource", function($resource){
    return $resource("/api/serviceofferings");
}]);

angular.module("cloudstack").controller("ZonesListCtrl", ["$scope", "Zones", "Dictionary", function($scope, Zones, Dictionary){
    $scope.dictionary = Dictionary;
    Zones.get(
        {},
        function(data){
            //success
            $scope.collection = data.listzonesresponse.zone;
        },
        function(data){
            console.log("Error while fetching zones list");
        });
    $scope.toDisplay = ["id", "name", "networktype", "allocationstate"];
}]);

angular.module("cloudstack").factory("Zones",["$resource", function($resource){
    return $resource("/api/zones");
}]);

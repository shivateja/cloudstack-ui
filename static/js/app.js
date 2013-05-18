(function($){
    var VirtualMachine = Backbone.Model.extend();
    var VirtualMachines = Backbone.Collection.extend({
        model : VirtualMachine,
        url : "/api/virtualmachines",
        parse : function(response){
            response = response.listvirtualmachinesresponse.virtualmachine;
            return response;
        },
        initialize: function(){
            this.tablemap = {
                "Display name" : "id",
                "Internal name" : "instancename",
                "Zone name": "zonename",
                "State" : "state"
            }
            this.deferred = this.fetch();
        }
    });
    var Configuration = Backbone.Model.extend();
    var Configurations = Backbone.Collection.extend({
        model : VirtualMachine,
        url : "/api/configurations",
        parse : function(response){
            response = response.listconfigurationsresponse.configuration;
            return response;
        },
        initialize: function(){
            this.tablemap = {
                "Name" : "name",
                "Description" : "description",
                "Value": "value"
            }
            this.deferred = this.fetch();
        }
    });
    var Account = Backbone.Model.extend();
    var Accounts = Backbone.Collection.extend({
        model : Account,
        url : "/api/accounts",
        parse : function(response){
            response = response.listaccountsresponse.account;
            return response;
        },
        initialize: function(){
            _.bindAll(this, "parse")
            this.tablemap = {
                "Name" : "name",
                "Role" : "account",
                "Domain": "domain",
                "State" : "state"
            }
            this.deferred = this.fetch();
        }
    });
    var Event = Backbone.Model.extend();
    var Events = Backbone.Collection.extend({
        model : Event,
        url : "/api/events",
        parse : function(response){
            response = response.listeventsresponse.event;
            return response;
        },
        initialize: function(){
            _.bindAll(this, "parse")
            this.tablemap = {
                "Type" : "type",
                "Description" : "description",
                "Initiated By": "account",
                "Date" : "created"
            }
            this.deferred = this.fetch();
        }
    });
    var ServiceOffering = Backbone.Model.extend();
    var ServiceOfferings = Backbone.Collection.extend({
        model : ServiceOffering,
        url : "/api/serviceofferings",
        parse : function(response){
            response = response.listserviceofferingsresponse.serviceoffering;
            return response;
        },
        initialize: function(){
            _.bindAll(this, "parse")
            this.tablemap = {
                "Name" : "name",
                "Description" : "displaytext",
            }
            this.deferred = this.fetch();
        }
    });
    var Network = Backbone.Model.extend();
    var Networks = Backbone.Collection.extend({
        model : Network,
        url : "/api/networks",
        parse : function(response){
            response = response.listnetworksresponse.network;
            return response;
        },
        initialize: function(){
            _.bindAll(this, "parse")
            this.tablemap = {
                "Name" : "name",
                "Type": "type",
                "Zone Name": "zonename"
            }
            this.deferred = this.fetch();
        }
    });
    var Zone = Backbone.Model.extend();
    var Zones = Backbone.Collection.extend({
        model : Zone,
        url : "/api/zones",
        parse : function(response){
            response = response.listzonesresponse.zone;
            return response;
        },
        initialize: function(){
            _.bindAll(this, "parse")
            this.tablemap = {
                "id": "id",
                "Zone" : "name",
                "Network Type": "networktype",
                "Allocation State": "allocationstate"
            }
            this.deferred = this.fetch();
        }
    });
    var TableView = Backbone.View.extend({
        el: $('#main'),
        initialize: function(){
            _.bindAll(this, "render", "get_thead", "get_tbody");
            this.render();
        },
        get_thead: function(){
            response = "<thead><tr>"
            for(var key in this.collection.tablemap){
                response += "<th>" + key + "</th>";
            }
            return response;
        },
        get_tbody: function(){
            response = "<tbody>"
            this.collection.each(function(item){
                /* Anything like "".join([]) in JavaScript ?*/
                response += "<tr>";
                for(var key in this.collection.tablemap){
                    response += "<td>" + item.get(this.collection.tablemap[key]) + "</td>";
                }
                response += "</tr>";
            }, this);
            response += "</tbody>";
            return response;
        },
        render: function(){
            var tbody;
            var _this = this;
            /*TODO: Better to move it to templates*/
            $(this.el).html('<table class="table table-striped table-bordered"></table>');
            var thead = this.get_thead();
            $("table", this.el).append(thead);
            this.collection.deferred.done(function(){
               var tbody = _this.get_tbody();
               $("table", _this.el).append(tbody);
            })
        }
    });
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "index",
            "accounts": "accounts",
            "virtualmachines": "virtualmachines",
            "events": "events",
            "configurations": "configurations",
            "serviceofferings": "serviceofferings",
            "networks": "networks",
            "zones": "zones",
            "*actions": "defaultRoute",
        }
    });
    var app_router = new AppRouter;

    app_router.on('route:defaultRoute', function(actions) {
        alert("No Handler found for " + actions);
    });

    app_router.on('route:index', function(){
        $('#main').html(_.template( $('#home').html(), {}));
    });

    app_router.on('route:accounts', function(){
        var accounts = new Accounts();
        var tableview = new TableView({collection: accounts});
    });
    app_router.on('route:events', function(){
        var events = new Events();
        var tableview = new TableView({collection: events});
    });
    app_router.on('route:virtualmachines', function(){
        var virtualmachines = new VirtualMachines();
        var tableview = new TableView({collection: virtualmachines})
    });
    app_router.on('route:configurations', function(){
        var configurations = new Configurations();
        var tableview = new TableView({collection: configurations});
    });
    app_router.on('route:serviceofferings', function(){
        var serviceofferings = new ServiceOfferings();
        var tableview = new TableView({collection: serviceofferings});
    });
    app_router.on('route:networks', function(){
        var networks = new Networks();
        var tableview = new TableView({collection: networks});
    });
    app_router.on('route:zones', function(){
        var zones = new Zones();
        var tableview = new TableView({collection: zones});
    });

    /*Add Later, toggle "active" class
     * app_router.bind("all", function(){
        $(".active").removeClass("active");
        var id = "#" + Backbone.history.fragment;
        $(id).addClass="active";
        alert(id);
    });*/
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
})(jQuery)

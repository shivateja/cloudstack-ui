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
    var User = Backbone.Model.extend({
        url : "/api/users",
        initialize: function(){
            this.responsemap = {
                Name : "username",
                ID : "id",
                State: "state",
                ApiKey: "apikey",
                SecretKey: "secretkey",
                AccountName: "account",
                Role: "accounttype", /*Map these later*/
                Domain: "domain",
                Email: "email",
                FirstName: "firstname",
                LastName: "lastname",
                TimeZone: "timezone"
            };
            this.editable = [
                "username",
                "email",
                "firstname",
                "lastname",
                "timezone"
            ]
        }
    });
    var Users = Backbone.Collection.extend({
        model : User,
        url : "/api/users",
        parse : function(response){
            response = response.listusersresponse.user;
            return response;
        },
        initialize: function(){
            _.bindAll(this, "parse")
            this.editable = true
            this.tablemap = {
                "Name" : "username",
                "Role" : "account",
                "Domain": "domain",
                "State" : "state"
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
            this.editable = true
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
                "ID": "id",
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
            if(this.collection.editable) {response += '<th>Actions</th>'};
            response += "</tr></thead>"
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
                if(this.collection.editable){ response += '<td><a class="btn" href="#edit/' + item.get("id") + '">Edit</a></td>';};
                response += "</tr>";
            }, this);
            response += "</tbody>";
            return response;
        },
        render: function(){
            var variables = {
                collection : this.collection
            }
            /*var tbody;*/
            var _this = this;
            /*$(this.el).html('<table class="table table-striped table-bordered"></table>');
            var thead = this.get_thead();
            $("table", this.el).append(thead);*/
            this.collection.deferred.done(function(){
                $(_this.el).empty();
                $(_this.el).html((_.template($('#table').html(), variables)));
               /*var tbody = _this.get_tbody();
               $("table", _this.el).append(tbody);*/
            });
        }
    });

    var EditView = Backbone.View.extend({
        el: $('#main'),
        events:{
            "click button#submit": "submit"
        },

        initialize: function(){
            var _this = this;
            _.bindAll(this, "render", "submit");
            this.collection = new this.collection;
            this.collection.deferred.done(function(){
                _this.render();
            });
        },
        render: function(){
            this.user = this.collection.get(this.id);
            console.log(this.user)
            var variables = {
                model : this.user
            };
            $(this.el).empty();
            $(this.el).html(_.template($('#form').html(), variables));
        },
        submit : function(){
            var serialized = $("#updateform", this.el).serializeArray();
            var output = {};
            var data;
            for(var i = 0; i < serialized.length; i++){
                data = serialized[i]
                console.log(data);
                output[data["name"]] = data["value"];
            }
            this.user.save(output,{
                success: function(model, response){
                    alert("Saved succesfully");
                    app_router.navigate('users', true);
                },
                error: function(){
                    alert("Error");
                }
            });
            return;
        },
    });
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "index",
            "users": "users",
            "virtualmachines": "virtualmachines",
            "events": "events",
            "configurations": "configurations",
            "serviceofferings": "serviceofferings",
            "networks": "networks",
            "zones": "zones",
            "edit/:id": "edit",
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

    app_router.on('route:users', function(){
        var users = new Users();
        var tableview = new TableView({collection: users});
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
    app_router.on('route:edit', function(id){
        var editview = new EditView({
            id : id,
            collection: Users,
            router: this
        });
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

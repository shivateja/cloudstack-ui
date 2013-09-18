// Based on security module from angular-app - https://github.com/angular-app/angular-app
angular.module('security.service', [
        'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
        'security.login',         // Contains the login form template and controller
        'ui.bootstrap.dialog',    // Used to display the login form as a modal dialog.
        'md5',                    //For hashing the password
        'services.requester'
        ])

.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$dialog', 'md5', '$injector', '$cookies', function($http, $q, $location, queue, $dialog, md5, $injector, $cookies) {


    // Redirect to the given url (defaults to '/')
    function redirect(url) {
        url = url || '/';
        $location.path(url);
    }

    // Login form dialog stuff
    var loginDialog = null;
    function openLoginDialog() {
        if ( loginDialog ) {
            throw new Error('Trying to open a dialog that is already open!');
        }
        loginDialog = $dialog.dialog();
        loginDialog.open('/static/js/common/security/login/form.tpl.html', 'LoginFormController').then(onLoginDialogClose);
    }
    function closeLoginDialog(success) {
        if (loginDialog) {
            loginDialog.close(success);
        }
    }
    function onLoginDialogClose(success) {
        loginDialog = null;
        if ( success ) {
            queue.retryAll();
        } else {
            queue.cancelAll();
            redirect();
        }
    }

    // Register a handler for when an item is added to the retry queue
    queue.onItemAddedCallbacks.push(function(retryItem) {
        if ( queue.hasMore() ) {
            service.showLogin();
        }
    });

    // The public API of the service
    var service = {

        // Get the first reason for needing a login
        getLoginReason: function() {
            return queue.retryReason();
        },

        // Show the modal login dialog
        showLogin: function() {
            openLoginDialog();
        },

        // Attempt to authenticate a user by the given email and password and domain
        login: function(username, password, domain) {

            // Using $injector to remove circular dependency
            // circular dependency comes up even if we move it outside the service
            var requester = $injector.get('requester');

            // If domain is not given, assume it is root
            domain = domain || '/';

            //TODO: Hashing the password for default, make it optional
            password = md5(password);

            data = {
                command: 'login',
                username: username,
                password: password,
                domain: domain,
                response: 'json'
            }



            return requester.post('/client/api', data).then(function(response) {
                //Chop the response
                response = response.data.loginresponse
                //service.currentUser = response.data.loginresponse; should be sufficient?
                //but following the old UI
                //setting each value
                service.currentUser = {
                    mySession : $cookies.JSESSIONID,
                    sessionKey : response.sessionkey,
                    role : response.type,
                    username : response.username,
                    userid : response.userid,
                    account : response.account,
                    domainid : response.domainid,
                    timezone : response.timezone,
                    timezoneoffset : response.timezoneoffset,
                    userfullname : response.firstname + ' ' + response.lastname
                };

                requester.get('listCapabilities').then(function(response){
                    return response.data.listcapabilitiesresponse.capability;
                }).then(function(capabilities){
                    service.currentUser.capabilities = capabilities;
                    //Set the cookies
                    //Note that these are session cookies
                    //TODO: fix the inconsistent camel case pattern
                    $cookies.sessionKey = service.currentUser.sessionKey;
                    $cookies.username = service.currentUser.username;
                    $cookies.account = service.currentUser.account;
                    $cookies.domainid = service.currentUser.domainid;
                    $cookies.role = service.currentUser.role;
                    $cookies.timezoneoffset = service.currentUser.timezoneoffset;
                    $cookies.timezone = service.currentUser.timezone;
                    $cookies.userfullname = service.currentUser.userfullname;
                    $cookies.userid = service.currentUser.userid;
                    $cookies.supportELB = service.currentUser.capabilities.supportELB.toString();
                    $cookies.KVMsnapshotenabled = service.currentUser.capabilities.KVMsnapshotenabled;
                    $cookies.regionsecondaryenabled = service.currentUser.capabilities.regionsecondaryenabled;
                    $cookies.userpublictemplateenabled = service.currentUser.capabilities.userpublictemplateenabled.toString();
                    $cookies.userprojectsenabled = service.currentUser.capabilities.userprojectsenabled;
                    $cookies.cloudstackversion = service.currentUser.capabilities.cloudstackversion;
                });

                if ( service.isAuthenticated() ) {
                    closeLoginDialog(true);
                }
            });
        },

        // Give up trying to login and clear the retry queue
        cancelLogin: function() {
            closeLoginDialog(false);
            redirect();
        },

        // Logout the current user and redirect
        logout: function(redirectTo) {
            var requester = $injector.get('requester');
            requester.get('logout').then(function(response){
                if(response.data.logoutresponse.description === 'success'){
                    // Setting this to null automatically shows login screen
                    service.currentUser = null;
                    for(var cookie in $cookies) delete $cookies[cookie];
                    redirect();
                }
            });
        },

        // Check for previous login
        // Just checks if the cookies are available
        // If they are, sets the values for service.currentUser and returns true
        // Else, returns false
        wasLoggedIn: function(){
            // Already logged in?
            if( service.isAuthenticated()){
                return true;
            }
            else{
                if($cookies.sessionKey){
                    service.currentUser = {
                        mySession : $cookies.JSESSIONID,
                        sessionKey : $cookies.sessionKey,
                        role : $cookies.role,
                        username : $cookies.username,
                        userid : $cookies.userid,
                        account : $cookies.account,
                        domainid : $cookies.domainid,
                        userfullname : $cookies.userfullname,
                        timezone : $cookies.timezone,
                        timezoneoffset : isNaN($cookies.timezoneoffset) ? null : parseFloat($cookies.timezoneoffset)
                    }

                    // Not using $http because if the server returns 401
                    // The interceptor will catch it and show the modal
                    // There is no way to escape it, so using $.ajax instead
                    $.ajax({
                        url: '/client/api?command=listCapabilities&sessionkey=' + encodeURIComponent(service.currentUser.sessionKey),
                        dataType: "json",
                        async: false,
                        success: function(json) {
                            service.currentUser.capabilities.supportELB = json.listcapabilitiesresponse.capability.supportELB.toString();
                            service.currentUser.capabilities.KVMsnapshotenabled = json.listcapabilitiesresponse.capability.KVMsnapshotenabled;
                            service.currentUser.capabilities.regionsecondaryenabled = json.listcapabilitiesresponse.capability.regionsecondaryenabled;
                            if (json.listcapabilitiesresponse.capability.userpublictemplateenabled != null) {
                                service.currentUser.capabilities.userPublicTemplateEnabled = json.listcapabilitiesresponse.capability.userpublictemplateenabled.toString();
                            }

                            service.currentUser.capabilities.userProjectsEnabled = json.listcapabilitiesresponse.capability.allowusercreateprojects;
                            service.currentUser.capabilities.cloudstackversion = json.listcapabilitiesresponse.capability.cloudstackversion;
                            userValid = true;
                        },
                        error: function(xmlHTTP) {
                            userValid = false;
                        },
                        beforeSend: function(XMLHttpResponse) {
                            return true;
                        }
                    });
                    return userValid;
                }
                else{
                    return false;
                }
            }
        },

        // Information about the current user
        currentUser: null,

        // Is the current user authenticated?
        isAuthenticated: function(){
            return !!service.currentUser;
        },

        // Is the current user an adminstrator?
        isAdmin: function() {
            return !!(service.currentUser && service.currentUser.type === 1);
        },

        isDomainAdmin: function(){
            return !!(service.currentUser && service.currentUser.type === 2);
        },

        isUser: function(){
            return !!(service.currentUser && service.currentUser.type === 0);
        }
    };

    return service;
}]);

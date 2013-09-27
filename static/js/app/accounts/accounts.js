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

angular.module('accounts', ['resources.accounts', 'resources.domains', 'resources.users', 'services.breadcrumbs', 'services.pluginsProvider']).
config(['pluginsProvider', function(pluginsProvider){
    pluginsProvider.register('Accounts', '/accounts', {
        controller: 'AccountsListCtrl',
        templateUrl: '/static/js/app/accounts/accounts.tpl.html',
        resolve: {
            accounts: function(Accounts){
                return Accounts.getFirstPage();
            }
        }
    }).
    extend('/accounts/:id', {
        controller: 'AccountDetailCtrl',
        templateUrl: '/static/js/app/accounts/account-details.tpl.html',
        resolve:{
            account: function($route, Accounts){
                return Accounts.getById($route.current.params.id);
            }
        }
    }).
    extend('/accounts/:id/users', {
        controller: 'UsersListCtrl',
        templateUrl: '/static/js/app/accounts/users.tpl.html',
        resolve:{
            account: function($route, Accounts){
                // Fetch the account
                // fetching user later, in the controller
                // as we'll need account details to fetch the user
                return Accounts.getById($route.current.params.id);
            }
        }
    }).
    extend('/accounts/:accountid/users/:userid',{
        controller: 'UserDetailCtrl',
        templateUrl: '/static/js/app/accounts/user-details.tpl.html',
        resolve: {
            account: function($route, Accounts){
                return Accounts.getById($route.current.params.accountid);
            },
            user: function($route, Users){
                return Users.getById($route.current.params.userid);
            }
        }
    })
}]);

angular.module('accounts').controller('AccountsListCtrl', ['$scope', '$route', 'accounts', 'Breadcrumbs', 'Accounts', 'Domains', 'Notifications',
        function($scope, $route, accounts, Breadcrumbs, Accounts, Domains, Notifications){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Accounts', '/#/accounts');

    $scope.collection = accounts;
    $scope.toDisplay = ['name', 'role', 'domain', 'state'];

    // This will be used along with modal-form directive.
    // Refer to the directive for syntax to be used here
    $scope.addAccountForm = {
        title: 'Add Account',
        // modal-form submits form data to this function
        onSubmit: function(data){
            // Create the account, notify, reload the page
            Accounts.createNew(data).then(function(account){
                Notifications.push('success', 'Created Account : ' + account.name);
                $route.reload();
            }, function(error){
                Notifications.push('error', 'Create Account Failed With Error : ' + error.data.createaccountresponse.errortext);
            })
        },
        fields: [
            {
                model: 'username',
                type: 'input-text',
                label: 'username'
            },
            {
                model: 'password',
                type: 'input-password',
                label: 'password'
            },
            {
                model: 'email',
                type: 'input-text',
                label: 'email'
            },
            {
                model: 'firstname',
                type: 'input-text',
                label: 'firstname'
            },
            {
                model: 'lastname',
                type: 'input-text',
                label: 'lastname'
            },
            {
                model: 'domainid',
                type: 'select',
                label: 'domain',
                options: function(){
                    return Domains.getAll().then(function(domains){
                        return domains.list();
                    });
                },
                // Get name from the options
                getName: function(model){
                    return model.name;
                },
                // Get value from the options
                getValue: function(model){
                    return model.id;
                }
            },
            {
                model: 'account',
                type: 'input-text',
                label: 'account'
            },
            {
                model: 'accounttype',
                type: 'select',
                label: 'type',
                options: function(){
                    return ['User', 'Admin']
                },
                getName: function(model){
                    return model;
                },
                getValue: function(model){
                    //return 0 if User, 1 if Admin
                    return model === 'User'?0:1;
                }
            }
        ]
    }
}]);

angular.module('accounts').controller('AccountDetailCtrl', ['$scope', 'account', 'Breadcrumbs', 'Notifications', '$location', function($scope, account, Breadcrumbs, Notifications, $location){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Accounts', '/#/accounts');
    Breadcrumbs.push(account.name, '/#/accounts/' + account.id);

    $scope.account = account;
    // Load the resource limit of this account. We'll need these in the template
    $scope.account.loadResourceLimits();

    $scope.disable = function(account){
        // Disable account, then notify result
        account.disable().then(function(account){
            Notifications.push('success', 'Disabled Account : ' + account.name);
        }, function(error){
            Notifications.push('error', 'Failed to disable account : ' + error.errortext);
        });
    }

    $scope.lock = function(account){
        // Lock account, then notify result
        account.lock().then(function(account){
            Notifications.push('success', 'Locked Account : ' + account.name);
        }, function(error){
            Notifications.push('error', 'Failed to lock account : ' + error.errortext);
        });
    }

    $scope.delete = function(account){
        // Delete account, then notify result
        account.delete().then(function(success){
            Notifications.push('success', 'Deleted account : ' + account.name);
            $location.path('/accounts');
        }, function(error){
            Notifications.push('error', 'Failed to delete account : ' + error.errortext);
        });
    }
}]);

angular.module('accounts').controller('UsersListCtrl', ['$scope', 'account', 'Users', 'Breadcrumbs', function($scope, account, Users, Breadcrumbs){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Accounts', '/#/accounts');
    Breadcrumbs.push(account.name, '/#/accounts/' + account.id);
    Breadcrumbs.push('Users', '/#/accounts/' + account.id + '/users');

    $scope.account = account;
    // Fetch the users of this account
    Users.customFilters().domainid(account.domainid).account(account.name).get().then(function(users){
        $scope.collection = users;
    });

    $scope.toDisplay = ['username', 'firstname', 'lastname'];
}]);

angular.module('accounts').controller('UserDetailCtrl', ['$scope', 'user', 'account', 'Breadcrumbs', 'Notifications', '$route', '$location', function($scope, user, account, Breadcrumbs, Notifications, $route, $location){
    Breadcrumbs.refresh();
    Breadcrumbs.push('Accounts', '/#/accounts');
    Breadcrumbs.push(account.name, '/#/accounts/' + account.id);
    Breadcrumbs.push('Users', '/#/accounts/' + account.id + '/users');
    Breadcrumbs.push(user.firstname, '/#/accounts/' + account.id + '/users/' + user.id);

    $scope.user = user;

    $scope.generateKeys = function(user){
        // Generate keys, then notify
        user.generateKeys().then(function(keys){
            Notifications.push('success', 'Generated key for user ' + user.firstname);
        });
    }

    $scope.disable = function(user){
        // Disable user, then notify
        user.disable().then(function(response){
            Notifications.push('success', 'User ' + user.firstname + ' successfully disabled');
        })
    }

    $scope.delete = function(user){
        // Delete the user, go back to the users page of the account
        user.delete().then(function(response){
            Notifications.push('success', 'Deleted user ' + user.firstname);
            $location.path('/accounts/'+ account.id + '/users');
        })
    }
}]);

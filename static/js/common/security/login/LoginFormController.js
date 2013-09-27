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

angular.module('security.login.form', [])

// TODO: add messages from dictionary
// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
.controller('LoginFormController', ['$scope', 'security', function($scope, security) {
    // The model for this form
    $scope.user = {};

    // Any error message from failing to login
    $scope.authError = null;

    // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
    // We could do something diffent for each reason here but to keep it simple...
    $scope.authReason = null;
    /*if ( security.getLoginReason() ) {
        $scope.authReason = ( security.isAuthenticated() ) ?
    localizedMessages.get('login.reason.notAuthorized') :
    localizedMessages.get('login.reason.notAuthenticated');
    }*/

    // Attempt to authenticate the user specified in the form's model
    $scope.login = function() {
        // Clear any previous security errors
        $scope.authError = null;

        // Try to login
        security.login($scope.user.username, $scope.user.password).then(function(loggedIn) {
            if ( !loggedIn ) {
                // If we get here then the login failed due to bad credentials
                $scope.authError = 'auth error' //localizedMessages.get('login.error.invalidCredentials');
            }
        }, function(x) {
            // If we get here then there was a problem with the login request to the server
            $scope.authError = 'auth error' //localizedMessages.get('login.error.serverError', { exception: x });
        });
    };

    $scope.clearForm = function() {
        $scope.user = {};
    };

    $scope.cancelLogin = function() {
        security.cancelLogin();
    };
}]);

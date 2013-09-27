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

angular.module('resources.accounts', ['services.helperfunctions', 'services.requester']);
angular.module('resources.accounts').factory('Accounts', ['Account', 'requester', 'makeArray', 'makeInstance',
        function(Account, requester, makeArray, makeInstance){
    var pagesize = 20;

    // The factory object
    var Accounts = function(accounts, options){
        this.options = options || {};
        this.collection = accounts;

        // Set default pagesize
        if(!options.pagesize) options.pagesize = pagesize;
    };

    //Class methods
    Accounts.prototype.list = function(){
        return this.collection;
    };

    Accounts.prototype.loadNextPage = function(){
        var self = this;

        if(!(!!this.options.page)) return;

        // Make a copy of options
        var params = angular.copy(this.options);
        params.page++;

        return requester.get('listAccounts', params)
            .then(function(response){
                return response.data.listaccountsresponse.account;
            }).then(makeArray(Account)).then(function(accounts){
                // If there are account in the response
                if(accounts.length){
                    // Increment pages by one and add the collection to the existing
                    self.options.page++;
                    self.collection = self.collection.concat(accounts);
                };
            });
    };

    //Static methods
    Accounts.getFirstPage = function(){
        return Accounts.customFilter().page(1).pagesize(pagesize).listall(true).get();
    }

    Accounts.getAll = function(){
        // No options given
        return Accounts.customFilter().get();
    };

    // Fetches an account by given ID and returns Account object
    Accounts.getById = function(id){
        return Accounts.customFilter().id(id).get().then(function(accounts){
            // Return just the Account object, not the collection
            return accounts.list()[0];
        })
    }

    // Creates a new account with given details
    Accounts.createNew = function(details){
        return requester.get('createAccount', details).then(function(response){
            return response.data.createaccountresponse.account;
        }).then(makeInstance(Account));
    }


    // Custom filters/options to fetch Accounts
    // These functions support chaining
    // Call .get() at the end to fetch Accounts with the given options
    // Usage: Accounts.customFilter().page(1).pagesize(10).domainid(xxx)....get()
    Accounts.customFilter = function(){
        var options = {};
        var filters = {};

        filters.accounttype = function(accounttype){
            options.accounttype = accounttype;
            return filters;
        }
        filters.domainid = function(domainid){
            options.domainid = domainid;
            return filters;
        }
        filters.id = function(id){
            options.id = id;
            return filters;
        }
        filters.iscleanuprequired = function(iscleanuprequired){
            options.iscleanuprequired = iscleanuprequired;
            return filters;
        }
        filters.isrecursive = function(isrecursive){
            options.isrecursive = isrecursive;
            return filters;
        }
        filters.keyword = function(keyword){
            options.keyword = keyword;
            return filters;
        }
        filters.listall = function(listall){
            options.listall = listall;
            return filters;
        }
        filters.name = function(name){
            options.name = name;
            return filters;
        }
        filters.page = function(page){
            options.page = page;
            return filters;
        }
        filters.pagesize = function(pagesize){
            options.pagesize = pagesize;
            return filters;
        }
        filters.state = function(state){
            options.state = state;
            return filters;
        }
        filters.get = function(){
            return requester.get('listAccounts', options).then(function(response){
                return response.data.listaccountsresponse.account;
            }).then(makeArray(Account)).then(function(collection){
                return new Accounts(collection, options);
            });
        }
        return filters;
    }

    return Accounts;
}]);


// Factory for Account object
angular.module('resources.accounts').factory('Account', ['requester', function(requester){
    var Account = function(attrs){
        angular.extend(this, attrs);
        // TODO : Add the rest
        if(this.accounttype === 1) this.role = 'Admin';
    };

    // Resource limits are not loaded by default
    // Call this function when resource limits are needed
    // Fetches resource limits and adds them to the Account object
    Account.prototype.loadResourceLimits = function(){
        var self = this;
        return requester.get('listResourceLimits', {accountid: this.id, domainid: this.domainid}).then(function(response){
            return response.data.listresourcelimitsresponse.resourcelimit;
        }).then(function(limits){
            for (var i = 0; i < limits.length; i++) {
                var limit = limits[i];
                switch (limit.resourcetype) {
                    case "0":
                        self.vmLimit = limit.max;
                        break;
                    case "1":
                        self.ipLimit = limit.max;
                        break;
                    case "2":
                        self.volumeLimit = limit.max;
                        break;
                    case "3":
                        self.snapshotLimit = limit.max;
                        break;
                    case "4":
                        self.templateLimit = limit.max;
                        break;
                    case "7":
                        self.vpcLimit = limit.max;
                        break;
                    case "8":
                        self.cpuLimit = limit.max;
                        break;
                    case "9":
                        self.memoryLimit = limit.max;
                        break;
                    case "10":
                        self.primaryStorageLimit = limit.max;
                        break;
                    case "11":
                        self.secondaryStorageLimit = limit.max;
                        break;
                }
            };
        })
    }

    // Disable the account
    Account.prototype.disable = function(){
        return requester.async('disableAccount', {lock: false, account: this.name, domainid: this.domainid});
    }

    // Lock the account
    Account.prototype.lock = function(){
        return requester.async('disableAccount', {lock: true, account: this.name, domainid: this.domainid});
    }

    // Delete the account
    Account.prototype.delete = function(){
        return requester.async('deleteAccount', {id: this.id});
    }

    return Account;
}]);

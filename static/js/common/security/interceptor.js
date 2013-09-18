angular.module('security.interceptor', ['security.retryQueue'])

// This http interceptor listens for authentication failures
.factory('securityInterceptor', ['$injector', 'securityRetryQueue', function($injector, queue) {
  return function(promise) {
    // Intercept failed requests
    return promise.then(null, function(originalResponse) {
      if(originalResponse.status === 401) {
        // The request bounced because it was not authorized - add a new request to the retry queue
        promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
          var command = originalResponse.config.params.command;

          //Delete the command from params
          delete(originalResponse.config.params.command);

          //Copy the rest of the params
          var params = originalResponse.config.params;

          // We must use $injector to get the $http service to prevent circular dependency
          // Calling it using requester instead of $http as we need to add session key
          // into the params
          return $injector.get('requester').get(command, params);
        });
      }
      return promise;
    });
  };
}])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('securityInterceptor');
}]);

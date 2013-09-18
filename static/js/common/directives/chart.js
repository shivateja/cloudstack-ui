angular.module('directives.chart', []);
angular.module('directives.chart').directive('chart', function(){
    return {
        restrict: 'A',
        scope: {
            type: '@',
            data: '=',
            options: '='
        },
        link: function(scope, element, attrs){
            var ctx = element[0].getContext('2d');
            var chart = new Chart(ctx);
            scope.$watch('data', function(newVal, oldVal){
                chart[scope.type](scope.data, scope.options);
            }, true);
        }
    }
});

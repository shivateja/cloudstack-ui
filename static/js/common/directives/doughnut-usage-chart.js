angular.module('directives.doughnutUsageChart', []);
angular.module('directives.doughnutUsageChart').directive('doughnutUsageChart', function(){
    return {
        restrict: 'A',
        scope: {
            percentUsed: '='
        },
        link: function(scope, element, attrs){
            var makeColors = function(percentUsed){
                data = [];
                if(percentUsed > 85){
                    // Red
                    data.push({value: percentUsed, color: '#DD514c'});
                }
                else if(percentUsed > 75){
                    data.push({value: percentUsed, color: '#FF4000'});
                }
                else{
                    data.push({value: percentUsed, color: '#FFBF00'});
                }
                // the unused part
                data.push({value: 100-percentUsed, color: '#A4A4A4'});
                return data;
            }
            var ctx = element[0].getContext('2d');
            var chart = new Chart(ctx);

            scope.$watch('percentUsed', function(newVal, oldVal){
                chart.Doughnut(makeColors(scope.percentUsed));
            }, true);
        }
    }
});

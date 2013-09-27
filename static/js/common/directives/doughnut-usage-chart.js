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

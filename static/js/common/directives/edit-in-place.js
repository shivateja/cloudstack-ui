angular.module('directives.editInPlace', []);
angular.module('directives.editInPlace').directive('editInPlace', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: '=',
            toEdit: '@',
            onSave: '@'
        },
        templateUrl: '/static/js/common/directives/edit-in-place.tpl.html',
        compile: function(tElem){
            /*var showElement = angular.element('<span ng-hide="editing">{{model[toEdit]}}</span>');
            var editButton = angular.element('<button class="btn pull-right"><i class="icon-edit"></i>Edit</button>');
            var editElement = angular.element('<span ng-show="editing"><input type="text" ng-model="model[toEdit]"></span>');
            var okButton = angular.element('<button class="btn btn-success"><i class="icon-ok"></i></button>')
            var cancelButton = angular.element('<button class="btn"><i class="icon-ban-circle"></i></button>');
            showElement.append(editButton);
            editElement.append(okButton);
            editElement.append(cancelButton);
            tElem.append(showElement);
            tElem.append(editElement);*/
            return function(scope, element, attrs){
                var modelBackup;
                scope.editing = false;
                //Edit button. Terrible way of doing this. Debug the above comments later
                element.children(0).children(1).bind('click', function(){
                    scope.editing = true;
                    scope.$apply();
                    modelBackup = angular.copy(scope.model);
                });

                element.children(1).children(0).bind('click', function(){
                    scope.$eval(attrs.onSave);
                    console.log('works');
                });

                /*element.children(1).children(1).bind('click', function(){
                    scope.model = modelBackup;
                    scope.editing = false;
                    scope.$apply();
                });*/
            }
        }
    }
});

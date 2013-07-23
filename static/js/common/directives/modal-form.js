angular.module('directives.modalForm', ['ui.bootstrap.dialog']);
angular.module('directives.modalForm').directive('modalForm', ['$dialog', function($dialog){
  var modalTemplate = '<div class="modal-header">'+
          '<h3>{{title}}</h3>'+
          '</div>'+
          '<div class="modal-body">'+
          '<div ng-include="template"></div>'+
          '</div>'+
          '<div class="modal-footer">'+
          '<button ng-click="close()" class="btn">{{cancelText || "Cancel"}}</button>'+
          '<button ng-click="submit()" class="btn btn-primary">{{okButtonText || "Submit"}}</button>'+
          '</div>';
    return {
        restrict: 'EA',
        transclude: true,
        template: '<span ng-transclude></span>',
        scope: {
            title: '@',
            onSubmit: '&',
            template: '@',
        },
        link: function(scope, element, attrs){
            var opts = {
                backdrop: true,
                backdropClick: true,
                backdropFade: true,
                template: modalTemplate,
                resolve: {
                    template: function(){
                        return scope.template;
                    },
                    title: function(){
                        return scope.title;
                    }
                },
                controller: 'TestCtrl',
            }
            element.bind('click', function(){
                var formDialog = $dialog.dialog(opts);
                var dialogPromise;
                scope.$apply(function(){
                    dialogPromise = formDialog.open()
                });
                dialogPromise.then(function(result){
                    if(result){
                        alert('dialog closed with result: ' + result);
                    }
                });
            });
        }
    }
}]);

angular.module('directives.modalForm').controller('TestCtrl', ['$scope', 'dialog', 'template', 'title',
        function TestDialogController($scope, dialog, template, title){
    $scope.formObject = {};
    $scope.template = template;
    $scope.title = title;
    console.log(template);
    $scope.close = function(result){
        dialog.close(result);
    };
}]);

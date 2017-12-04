var ainiApp = angular.module('ainiApp', ['ui.router']);

ainiApp.run( ['$rootScope', '$state', '$stateParams',
   	function ($rootScope, $state, $stateParams) {
   		$rootScope.$state = $state;
   		$rootScope.$stateParams = $stateParams;
   	} 
]);
ainiApp.config(function ($stateProvider) {
    $stateProvider
        .state('check', {
            url: '/check',
            templateUrl: 'views/check.html',
            controller : 'checkController as checkCtrl'
        })
        .state('checkStatus', {
            url: '/checkStatus',
            templateUrl: 'views/checkStatus.html',
            controller : 'checkStatusController as checkStatusCtrl'
        })
         .state('report', {
             url: '/report',
             templateUrl: 'views/report.html',
             controller : 'reportController as reportCtrl'
         })
         .state('initial', {
             url: '/initial',
             templateUrl: 'views/initial.html',
             controller : 'initialController as initialCtrl'
         })
         .state('reportView', {
             url: '/reportView',
             templateUrl: 'views/reportView.html',
             controller : 'reportViewController as reportViewCtrl'
         })
         .state('reportViewMain', {
             url: '/reportViewMain',
             templateUrl: 'views/reportViewMain.html',
             controller : 'reportViewMainController as reportViewMainCtrl'
         })
         .state('class', {
             url: '/class',
             templateUrl: 'views/class.html',
             controller : 'classController as classCtrl'
         });
    
    
});

ainiApp.directive('creationComplete', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.creationComplete);
                });
            }
        }
    };
});
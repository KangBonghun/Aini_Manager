function classController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
    vm.classes = [];
    
    vm.selectedActive = '';
    
    /**
     * 초기화
     */
    vm.init = function() {
        $.preLoadImages('/manage/assets/sp_alert.png');
        
        $scope.loadClasses();
    };
    
    /**
     * 강의 로드
     */
    $scope.loadClasses = function() {
    	
    	if(!vm.selectedActive) {
    		return;
    	}
    	
    	var param = {
        		active : vm.selectedActive == 'ALL' ? null : vm.selectedActive,
        	};
    	
    	visibleLoader(true);
    	
    	RemoteHttp.controller('/manage').url('/get-clsas-info-detail-list').param(param).methods('post').request().then(function(data){
    		if(data) {
    			var tmpData = [];
    			
    			data.forEach(function(item){
    				tmpData.push(angular.extend(item, {
        				startDateLabel : $scope.getDateToLabel(item.startDate, 'yyyy-MM-dd'),
        				endDateLabel : $scope.getDateToLabel(item.endDate, 'yyyy-MM-dd'),
        				classDateLabel : $scope.getClassDateLabel(item) + ' ' + $scope.getClassTimeLabel(item.startTime) + ' - ' + $scope.getClassTimeLabel(item.endTime)
        			}));
    			});
    			
    			vm.classes = tmpData;
    		}
    		
    		visibleLoader(false);
    	});
    };
    
    /**
     * 수강 상태 조회 조건 변경
     */
    vm.onChangeActive = function() {
    	$scope.loadClasses();
    };
    
	vm.init();
}
ainiApp.controller( 'classController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    '$stateParams',
    '$timeout',
    'RemoteHttp',
    classController] );
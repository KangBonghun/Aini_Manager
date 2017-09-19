function reportViewController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
    vm.classes = [];
    vm.classMonths = [];
    vm.students = [];

    vm.selectedClassId;
    vm.selectedClassMonth;
    
    vm.stepChart;
    vm.stepScoreChart;
    vm.monthlyStepChart;
    vm.pronunciationChart;
    vm.vocabularyChart;
    vm.grammarChart;
    vm.intelligibilityChart;
    vm.monthlyScoreChart;
    vm.attendanceRateChart;
    
    vm.reportData;
    
    /**
     * 초기화
     */
    vm.init = function() {
        $.preLoadImages('/manage/assets/sp_alert.png');
        
        vm.loadClasses();
    };
    
    /**
     * 강의 로드
     */
    vm.loadClasses = function() {
    	var param = {
    		active : 'Y'
    	};
    	RemoteHttp.controller('/manage').url('/get-class-list').param(param).methods('post').request().then(function(data){
    		if(data) {
    			vm.classes = data;
    		}
    	});
    };
    
    /**
     * 수강월 로드
     */
    vm.loadClassMonth = function() {
    	var cls = $.grep(vm.classes, function(item){
    		return vm.selectedClassId == item.classId;
    	})[0];
    	
    	var startDate = $scope.classDateToNewDate(cls.startDate);
    	var endDate = $scope.classDateToNewDate(cls.endDate);
    	
    	var tmpClassMonths = [];
    	
    	if(startDate && endDate) {
    		while(endDate > startDate) {
    			tmpClassMonths.push({
    				year : startDate.getFullYear(),
    				month : pad(startDate.getMonth()+1, 2),
    				label : startDate.getFullYear() + '-' + pad(startDate.getMonth()+1, 2),
    			});
    			
    			startDate.setMonth(startDate.getMonth()+1);
    		}
    	}
    	
    	vm.classMonths = tmpClassMonths;
	};
    
	/**
     * 강의 변경
     */
	vm.onChangeClass = function() {
		$scope.initReport();
		
		vm.loadClassMonth();
    };
    
	/**
     * 날짜 변경
     */
	vm.onChangeDate = function() {
		if(vm.selectedClassMonth) {
			$scope.loadReport($rootScope.userInfo.userId, vm.selectedClassId, vm.selectedClassMonth.year, vm.selectedClassMonth.month);
		}
	};
	
	vm.init();
}
ainiApp.controller( 'reportViewController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    '$stateParams',
    '$timeout',
    'RemoteHttp',
    reportViewController] );
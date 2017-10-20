function reportViewMainController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
    vm.classes = [];
    vm.classMonths = [];
    vm.students = [];

    vm.selectedClassId;
    vm.selectedClassMonth;
    
    vm.selectedStudent;
    
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
		vm.students = [];
		
		vm.loadClassMonth();
    };
    
	/**
     * 날짜 변경
     */
	vm.onChangeDate = function() {
		if(vm.selectedClassMonth) {
			vm.loadStudents();
		}
	};
	
	/**
	 * 수강생 로드
	 */
	vm.loadStudents = function() {
    	if(!vm.selectedClassMonth) {
    		vm.students = [];
    		return;
    	}
    	
    	var param = {
    			classId : vm.selectedClassId,
    			year : vm.selectedClassMonth.year,
    			month : vm.selectedClassMonth.month,
		};
    	
    	visibleLoader(true);
    	
    	RemoteHttp.controller('/manage').url('/get-report-student-list').methods('post').param(param).request().then(function(data){
    		if(data) {
    			vm.students = data;
    		}
    		
    		visibleLoader(false);
    	});
    };
	
	vm.init();
}
ainiApp.controller( 'reportViewMainController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    '$stateParams',
    '$timeout',
    'RemoteHttp',
    reportViewMainController] );
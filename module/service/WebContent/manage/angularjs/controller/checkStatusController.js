function checkStatusController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
	vm.classes = [];
    vm.classMonths = [];

    vm.selectedClassId;
    vm.selectedClassMonth;
    
    /**
     * 초기화
     */
    vm.init = function() {
        $.preLoadImages('/manage/assets/sp_alert.png');
        
        vm.selectedDate = new Date();
        
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
		vm.selectedClassDate = null;
		
		vm.loadClassMonth();
    };
    
    /**
     * 날짜 변경
     */
	vm.onChangeDate = function(date) {
	};
	
	vm.init();
}
ainiApp.controller( 'checkStatusController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    '$stateParams',
    '$timeout',
    'RemoteHttp',
    checkStatusController] );
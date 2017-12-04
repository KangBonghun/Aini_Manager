function reportViewController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
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
     * 강의 변경
     */
	vm.onChangeClass = function() {
		vm.loadStudents();
    };
    
	
	/**
	 * 수강생 로드
	 */
	vm.loadStudents = function() {
		vm.students = [];
		
    	var param = {
    			classId : vm.selectedClassId,
		};
    	
    	visibleLoader(true);
    	
    	RemoteHttp.controller('/manage').url('/get-all-report-student').methods('post').param(param).request().then(function(data){
    		if(data) {
    			vm.students = data;
    		}
    		
    		visibleLoader(false);
    	});
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
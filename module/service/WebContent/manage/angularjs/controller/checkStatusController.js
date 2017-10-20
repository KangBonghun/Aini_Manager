function checkStatusController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
	vm.classes = [];
    vm.classMonths = [];

    vm.classInfo = {};
    vm.checkDates = [];
    vm.checkStatusList = [];

    vm.selectedClassId;
    vm.selectedClassMonth;
    
    /**
     * 초기화
     */
    vm.init = function() {
        $.preLoadImages('/manage/assets/sp_alert.png');
        
        vm.selectedDate = new Date();
        
        vm.loadClasses();
        
        $($($element).find('.table-responsive')[0]).resize(function(){
        	if($($element).find('.table-responsive').width() < $($element).find('.check-status-table').width()) {
    			$($element).find('.check-status-drag-ps').show();
    		} else {
    			$($element).find('.check-status-drag-ps').hide();
    		}
        });
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
		vm.loadClassInfoDetail();
    };
    
    /**
     * 날짜 변경
     */
	vm.onChangeDate = function(date) {
		vm.loadCheckStatus();
	};
	
	/**
	 * 수강 현황 데이터 로드
	 */
	vm.loadCheckStatus = function() {
		if(!vm.selectedClassMonth) {
    		vm.checkDates = [];
    		vm.checkStatusList = [];
    		return;
    	}
		
		var param = {
    			classId : vm.selectedClassId,
    			year : vm.selectedClassMonth.year,
    			month : vm.selectedClassMonth.month,
    			userType: $rootScope.userInfo.userType,
    			userId : $rootScope.userInfo.userId,
		};
    	
		visibleLoader(true);
    	RemoteHttp.controller('/manage').url('/get-check-status').param(param).methods('post').request().then(function(data){
    		if(data) {
    			vm.checkDates = data['checkDates'] || [];
    			vm.checkStatusList = data['checkStatusList'] || [];
    		}
    		
    		visibleLoader(false);
    	});
	};
	
	/**
     * 강의 상세 정보 로드
     */
    vm.loadClassInfoDetail = function() {
    	var param = {
    			classId : vm.selectedClassId,
		};
    	
    	RemoteHttp.controller('/manage').url('/get-clsas-info-detail').methods('post').param(param).request().then(function(data){
    		if(data) {
    			
    			vm.classInfo = angular.extend(data, {
    				startDate : $scope.getDateToLabel(data.startDate, 'yyyy-MM-dd'),
    				endDate : $scope.getDateToLabel(data.endDate, 'yyyy-MM-dd'),
    				classDate : $scope.getClassDateLabel(data) + ' ' + $scope.getClassTimeLabel(data.startTime) + ' - ' + $scope.getClassTimeLabel(data.endTime)
    			});
			}
    	});
    };
	
    /**
     * 특정 일의 출석 상태를 반환한다. 
     */
	vm.getCheck = function(classDate, checkStatus) {
		return checkStatus[classDate] || '-';
	};
	
	/**
	 * 해당 월의 특정 출석 상태의 수를 반환한다.
	 */
	vm.getCheckStatucCount = function(checkStatus, type) {
		var count = 0;
		
		vm.checkDates.forEach(function(checkDate){
			var classDate = checkDate.classDate;
			
			if(checkStatus[classDate] == type) {
				count++;
			}
		});
		
		return count;
	};

	/**
	 * 출석률을 반환한다.
	 */
	vm.getAttendanceRate = function(checkStatus) {
		var rate = 0.0;
		
		var count = 0;
		
		var Attendances = 'OLVEW';
		
		vm.checkDates.forEach(function(checkDate){
			var classDate = checkDate.classDate;
			
			if(Attendances.indexOf(checkStatus[classDate]) > -1) {
				count++;
			}
		});
		
		rate = (count * 100) / vm.checkDates.length; 
		
		return rate.toFixed(2);
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
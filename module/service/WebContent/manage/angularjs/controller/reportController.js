function reportController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
    vm.classes = [];
    vm.classMonths = [];
    vm.students = [];

    vm.selectedClassId;
    vm.selectedClassMonth;
    
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
    				month : startDate.getMonth()+1,
    				label : startDate.getFullYear() + '-' + pad(startDate.getMonth()+1, 2),
    			});
    			
    			startDate.setMonth(startDate.getMonth()+1);
    		}
    	}
    	
    	vm.classMonths = tmpClassMonths;
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
	
	/**
     * 강의 변경
     */
	vm.onChangeClass = function() {
		vm.loadClassMonth();
    };
    
	/**
     * 날짜 변경
     */
	vm.onChangeDate = function(date) {
	    vm.loadStudents();
	};
	
	/**
	 * 수정 버튼 클릭
	 */
	vm.onEdit = function(evt) {
		vm.toggleEditSaveBtn($(evt.currentTarget), 'edit');
	};
	
	/**
	 * 취소 버튼 클릭
	 */
	vm.onCancel = function(evt) {
		vm.toggleEditSaveBtn($(evt.currentTarget), '');
	};
	
	/**
	 * 수정, 취소에 따른 DOM 제어
	 */
	vm.toggleEditSaveBtn = function(target, state) {
		if(state=='edit') {
			target.parents('.btn_group').find('.edit-btn').hide();
			target.parents('.btn_group').find('.save-btn, .cancel-btn').show();
			
			target.parents('.rpt-box').find('.rpt-score .score:not(.total)').hide();
			target.parents('.rpt-box').find('.rpt-score .input-score').show();
			
			target.parents('.rpt-box').find('.rpt-content .txt').hide();
			target.parents('.rpt-box').find('.rpt-content .txt-area').show();
			
			target.parents('.rpt-box').find('.refer').show();
		} else {
			target.parents('.btn_group').find('.edit-btn').show();
			target.parents('.btn_group').find('.save-btn, .cancel-btn').hide();
			
			target.parents('.rpt-box').find('.rpt-score .score').show();
			target.parents('.rpt-box').find('.rpt-score .input-score').hide();
			
			target.parents('.rpt-box').find('.rpt-content .txt').show();
			target.parents('.rpt-box').find('.rpt-content .txt-area').hide();
			
			target.parents('.rpt-box').find('.refer').hide();
		}
	};
	
	/**
     * 저장
     */
	vm.onSave = function(evt, student) {
		var param = {
				student : student,
		};
		
		RemoteHttp.controller('/manage').url('/update-report-student').methods('post').param(param).request().then(function(data){
			if(data) {
				var idx = vm.students.findIndex(function(e){
					return e.userId == data.userId;
				});
				
				if(idx != void 0) {
					if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
						vm.students[idx] = data;
					} else {
						$scope.$apply(function(){
							vm.students[idx] = data;
						});
					}
				}
			}
			
			showCompleteAlert();
		});
		
		vm.toggleEditSaveBtn($(evt.currentTarget), 'save');
	};
	
	/**
	 * 입력 점수 최대값 체크
	 */
	vm.onBlurScore = function(evt) {
		var value = parseInt($(event.target).val());
		
		if(value > 25) {
			$(event.target).val(25).trigger('change');
		}
	};
	
	vm.init();
}
ainiApp.controller( 'reportController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    '$stateParams',
    '$timeout',
    'RemoteHttp',
    reportController] );
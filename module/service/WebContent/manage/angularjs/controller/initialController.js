function initialController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
    vm.classes = [];
    vm.classMonths = [];
    vm.students = [];
    
    vm.stepScores = [];

    vm.selectedClassId;
    
    /**
     * 초기화
     */
    vm.init = function() {
        $.preLoadImages('/manage/assets/sp_alert.png');
        
        vm.initStepScore();
        
        vm.loadClasses();
    };
    
    vm.initStepScore = function() {
    	var tmp = [];
    	
    	for(var i = 0; i<=120; i++) {
    		tmp.push(i);
    	}
    	
    	vm.stepScores = tmp;
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
	 * 수강생 로드
	 */
    vm.loadStudents = function() {
    	var param = {
    			classId : vm.selectedClassId,
    			userType : 'STUDENT',
		};
    	
    	visibleLoader(true);
    	
    	RemoteHttp.controller('/manage').url('/get-initial-student-list').methods('post').param(param).request().then(function(data){
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
			
			target.parents('.rpt-box').find('.rpt-content .no-edit').hide();
			target.parents('.rpt-box').find('.rpt-content .edit').show();
		} else {
			target.parents('.btn_group').find('.edit-btn').show();
			target.parents('.btn_group').find('.save-btn, .cancel-btn').hide();
			
			target.parents('.rpt-box').find('.rpt-content .no-edit').show();
			target.parents('.rpt-box').find('.rpt-content .edit').hide();
		}
	};
	
	/**
     * 저장
     */
	vm.onSave = function(evt, student) {
		var param = {
				student : student,
		};
		
		RemoteHttp.controller('/manage').url('/update-initial-student').methods('post').param(param).request().then(function(data){
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
	
	vm.onBlurScore = function(evt) {
		var value = parseInt($(event.target).val());
		
		if(value > 120) {
			$(event.target).val(120).trigger('change');
		}
	};
	
	vm.init();
}
ainiApp.controller( 'initialController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    '$stateParams',
    '$timeout',
    'RemoteHttp',
    initialController] );
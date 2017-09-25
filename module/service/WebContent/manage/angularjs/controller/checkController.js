function checkController( $rootScope, $scope, $element, $state, $stateParams, $timeout, RemoteHttp) {
	var vm = this;
	
    vm.classes = [];
    vm.classDates = [];
    vm.students = [];
    vm.classInfo = {};

    vm.selectedDate;
    
    vm.selectedClassId;
    vm.selectedClassDate;
    
    vm.changeClassDate;
    
    vm.unbindHandler;
    
    /**
     * 초기화
     */
    vm.init = function() {
        $.preLoadImages('/manage/assets/sp_alert.png');
        
        vm.selectedDate = new Date();
        
        vm.loadClasses();
        
        $(function(){
			var opt = {
			display:"bottom",
			lang:"kr",
			mode:"scroller",
			preset:"date",
			dateFormat: 'yyyy-mm-dd',
			dateOrder: 'yyyymmdd',
			theme:"android-ics light",
			readonly: false,
			onSelect: function(valueText,inst){
		         $(this).trigger('blur');
		         
		         $scope.$apply(function(){
		        	 vm.changeClassDate = valueText;
		         });
		     }
		    };	
			
			$('.class-date-scroll').scroller('destroy').scroller(opt);
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
     * 강의 수강일 로드
     */
    vm.loadClassDate = function(callback) {
		var param = {
				classId : vm.selectedClassId,
		};
		
		RemoteHttp.controller('/manage').url('/get-class-date-list').methods('post').param(param).request().then(function(data){
			vm.classDates = data;
			
			callback && callback();
		});
		
	};
	
	/**
	 * 수강생 로드
	 */
    vm.loadStudents = function() {
    	if(!vm.selectedDate) {
    		vm.students = [];
    		return;
    	}
    	var param = {
    			classId : vm.selectedClassId,
    			classDate : vm.selectedDate.format('yyyyMMdd'),
		};
    	
    	visibleLoader(true);
    	RemoteHttp.controller('/manage').url('/get-check-student-list').methods('post').param(param).request().then(function(data){
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
		vm.selectedClassDate = null;
		vm.students = [];
		
		vm.loadClassDate();
		vm.loadClassInfoDetail();
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
     * 날짜 변경
     */
	vm.onChangeDate = function(date) {
	    vm.selectedDate = angular.copy($scope.classDateToNewDate(date));
	    
	    vm.loadStudents();
	};
	
	/**
	 * 메모 버튼 토글
	 */
	vm.onToggleMemo = function(evt, val) {
	    var target = $(evt.currentTarget).find('i');
	    var parent = $(evt.currentTarget).parent().parent();
	    
	    if(target.hasClass('write')) {
	        target.removeClass('write');
	        target.removeClass('fa-sign-out');
	        
	        if(val) {
	            target.addClass('fa-commenting');    
	        } else {
	            target.addClass('fa-commenting-o');
	        }

	       // target.find('span').text('메모');
	        
	        parent.find('.nav_u').show();
	        parent.find('.memo-input').hide();
	    } else {
	       // target.find('span').text('닫기');
	        target.addClass('write');
	        target.addClass('fa-sign-out');
	        target.removeClass('fa-commenting');
	        target.removeClass('fa-commenting-o');
	        
	        parent.find('.nav_u').hide();
	        parent.find('.memo-input').show();
	    }
	};
	
	/**
	 * 수강일 변경 확인
	 */
	vm.onClickChangeClassDate = function() {
		var param = {
				newDate : $('#change_date').val() ? $('#change_date').val().replace(/-/gi,'') : null,
				oldDate : vm.selectedClassDate,
				classId : vm.selectedClassId,
		};
		
		RemoteHttp.controller('/manage').url('/update-class-date').methods('post').param(param).request().then(function(data){
			showCompleteAlert();
			vm.closePopup('MOVE_DATE');
			
			//자동으로 수강일을 변경일로 세팅한다.
			vm.unbindHandler = $scope.$on('onCreationCompleteClassDate',function(){
				vm.unbindHandler && vm.unbindHandler();
				
				vm.selectedClassDate = param.newDate;
				
				vm.onChangeDate(vm.selectedClassDate);
			});
			
			vm.loadClassDate();
		});
	};
	
	/**
	 * 팝업 닫기
	 */
	vm.closePopup = function(type) {
		if(type=='MOVE_DATE') {
			$('#move_date_back').removeClass('active');
			$('#change_date').val('');
			vm.changeClassDate = ''; 
		} else {
			$('#class_info_back').removeClass('active');
		}
	};
	
	/**
     * 저장
     */
	vm.onSave = function() {
		var param = {
				students : vm.students
		};
		
		RemoteHttp.controller('/manage').url('/update-check-student').methods('post').param(param).request().then(function(data){
			// 저장완료 알림
			showCompleteAlert();
		});
	};
	
	/**
	 * 강의 정보 열고 닫기
	 */
	vm.onToggleClassInfo = function() {
		if($('.class-info-box-toggle-btn').hasClass('no-more')) {
			$('.class-info-box-toggle-btn').removeClass('no-more');
			$('.class-info-box-toggle-btn').addClass('more');
			$('.class-info-box').addClass('more');
		} else {
			$('.class-info-box-toggle-btn').removeClass('more');
			$('.class-info-box-toggle-btn').addClass('no-more');
			$('.class-info-box').removeClass('more');
		}
	};
	
	vm.init();
}
ainiApp.controller( 'checkController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    '$stateParams',
    '$timeout',
    'RemoteHttp',
    checkController] );
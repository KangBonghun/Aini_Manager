ainiApp.directive('reportInfoDirective', function() {
	return {
		replace : true,
		templateUrl : 'angularjs/template/classInfo.html',
		controllerAs : 'vm',
		controller : function($rootScope, $scope, $element, $attrs, $timeout, RemoteHttp) {
			var vm = this;
			
			vm.isNew = true;
			vm.classInfo = {};
			
			vm.init = function() {
				$(function(){
					var opt = {
					display:"bottom",
					lang:"kr",
					mode:"scroller",
					preset:"time",
					theme:"android-ics light",
					readonly: false,
					onSelect: function(valueText,inst){
				         $(this).trigger('blur');
				     }
				    };	
					
					$('.class-time-scroll').scroller('destroy').scroller(opt);
				});
				
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
				     }
				    };	
					
					$('.class-date-scroll').scroller('destroy').scroller(opt);
				});
			};

			/**
		     * 강의 팝업
		     */
		    $scope.onPopupClassInfo = function(visible, classInfo) {
		    	if(visible) {
		    		visibleLoader(true);
		    		
		    		if(classInfo) {
		    			vm.isNew = false;
		    			
		    			vm.classInfo = angular.copy(classInfo);
		    			
		    			// 날짜는 이렇게 초기값을 설정해야한다. 그냥 dom의 value 속성에 설정하면 적용안됨.
		    			try {
		    				var datetime = new Date(parseInt(classInfo.startDate.substring(0,4)),parseInt(classInfo.startDate.substring(4,6))-1,parseInt(classInfo.startDate.substring(6,8)));
		    				
		    				$("#start_date").mobiscroll('setDate', datetime, true);
						} catch (e) {
							// TODO: handle exception
						}
						
						try {
							var datetime = new Date(parseInt(classInfo.endDate.substring(0,4)),parseInt(classInfo.endDate.substring(4,6))-1,parseInt(classInfo.endDate.substring(6,8)));
							
							$("#end_date").mobiscroll('setDate', datetime, true);
						} catch (e) {
							// TODO: handle exception
						}
						
						try {
		    				var datetime = new Date(parseInt(classInfo.startDate.substring(0,4)),parseInt(classInfo.startDate.substring(4,6))-1,parseInt(classInfo.startDate.substring(6,8)), parseInt(classInfo.startTime.substring(0,2)), parseInt(classInfo.startTime.substring(2,4)));
		    				
		    				$("#start_time").mobiscroll('setDate', datetime, true);
						} catch (e) {
							// TODO: handle exception
						}
						
						try {
							var datetime = new Date(parseInt(classInfo.endDate.substring(0,4)),parseInt(classInfo.endDate.substring(4,6))-1,parseInt(classInfo.endDate.substring(6,8)), parseInt(classInfo.endTime.substring(0,2)), parseInt(classInfo.endTime.substring(2,4)));
							
							$("#end_time").mobiscroll('setDate', datetime, true);
						} catch (e) {
							// TODO: handle exception
						}
						
						$('#class_name').val(classInfo.className);
						$('#language').val(classInfo.language);
						$('#manager_id').val(classInfo.managerId);
						$('#teacher_id').val(classInfo.teacherId);
						
						$('#active').prop("checked", classInfo.active=='Y' ? true : false);
						vm.setActiveLabel();
		    		}
		    		
		    		$('#class_info_detail_box').animate({top:0}, 300, function(){
		    			visibleLoader(false);
		    		});
		    		
//		    		$("body").css({overflow:'hidden'}).bind('touchmove', function(e){e.preventDefault();});
		    		
		    		$('html, body').css({'overflow': 'hidden', 'height': '100%'});
		    		
		    		$(window).not('#class_info_detail_box').on('scroll touchmove mousewheel', function(event) {
		    			event.preventDefault();     event.stopPropagation();     return false;
		    		});
		    	} else {
		    		vm.isNew = true;
		    		
		    		vm.classInfo = {};
		    		
		    		$('#class_name').val('');
		    		$('#language').val('');
		    		$('#start_date').val('');
	    			$('#end_date').val('');
	    			$('#start_time').val('');
	    			$('#end_time').val('');
					$('#manager_id').val('');
					$('#teacher_id').val('');
					$('#active').prop('checked', false);
					
					vm.onClickTab('CLASS');
		    		
		    		$('#class_info_detail_box').animate({top:'100%'}, 300);
		    		
//		    		$("body").css({overflow:'auto'}).unbind('touchmove');
		    		
		    		$('html, body').css({'overflow': 'auto', 'height': 'auto'});
		    		$(window).not('#class_info_detail_box').off('scroll touchmove mousewheel');
		    	}
		    };
		    
		    $scope.$on('$destroy', function() {
			});
		    
		    /**
		     * 강의 정보 저장
		     */
		    vm.onSaveClassInfo = function() {
		    	var param = angular.extend(vm.classInfo, {
		    		classId : vm.classInfo.classId || null,
		    		className : $('#class_name').val() || null,
		    		startTime : $('#start_time').val() ? $('#start_time').val().replace(/:/gi,'') : null,
		    		endTime : $('#end_time').val() ? $('#end_time').val().replace(/:/gi,'') : null,
		    		startDate : $('#start_date').val() ? $('#start_date').val().replace(/-/gi,'') : null,
		    		endDate : $('#end_date').val() ? $('#end_date').val().replace(/-/gi,'') : null,
		    		managerId : $('#manager_id').val(),
		    		teacherId : $('#teacher_id').val(),
		    		active : $('#active').prop('checked') ? 'Y' : 'N',
		    	});
		    	
		    	RemoteHttp.controller('/manage').url('/update-class-info').param(param).methods('post').request().then(function(data){
			    	showCompleteAlert(function(){
			    		$scope.onPopupClassInfo(false);
			    		$scope.loadClasses();
			    	}, 300);
		    	});
		    };
		    
		    vm.onClickTab = function(type) {
		    	if(type == 'CLASS') {
		    		$('#tab_student').removeClass('on');
		    		$('#class_info_detail_box > .contents').removeClass('student');
		    		
		    		$('#tab_class').addClass('on');
		    		$('#class_info_detail_box > .contents').addClass('class');
		    	} else {
		    		$('#tab_class').removeClass('on');
		    		$('#class_info_detail_box > .contents').removeClass('class');
		    		
		    		$('#tab_student').addClass('on');
		    		$('#class_info_detail_box > .contents').addClass('student');
		    	}
		    };
		    
		    vm.setActiveLabel = function() {
		    	$('#active').prop('checked') ? $('#activeLabel').text('수강중') : $('#activeLabel').text('수강종료');
		    };
		    
		    vm.getStudentName = function(userId) {
		    	return; //기능 막음
		    	RemoteHttp.controller('/manage').url('/get-user-info2').param({userId:userId}).methods('post').request().then(function(data){
		    		var userName = '';
		    		
		    		if(data) {
		    			userName = data.userName;
		    		} else {
		    			userName = '회원없음';
		    		}
		    		
		    		vm.classInfo.studentList.forEach(function(item){
	    				if(item.userId == userId) {
	    					item.userName = userName;
	    					
	    					return false;
	    				}
	    			});
		    	});
		    };
		    
		    /**
		     * 수강생 삭제
		     */
		    vm.onClickDeleteStudent = function(index) {
		    	vm.classInfo.studentList.splice(index,1);
		    };
		    
		    vm.onClickAddStudent = function() {
		    	if(!vm.classInfo) {
		    		vm.classInfo = {};
		    	}
		    	
		    	if(!vm.classInfo.studentList) {
		    		vm.classInfo.studentList = [];
		    	}
		    	
		    	vm.classInfo.studentList.push({
		    		userId : '',
		    		userName : '이름',
		    	});
		    };
			
			vm.init();
		}
	};
});

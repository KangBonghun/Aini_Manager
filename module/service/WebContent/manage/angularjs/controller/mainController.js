function mainController( $rootScope, $scope, $element, $state, RemoteHttp) {
	$scope.userInfo;
	
    /**
     * 초기화
     */
    $scope.init = function() {
    	RemoteHttp.controller('/manage').url('/get-user-info').methods('get').request().then(function(data){
    		$rootScope.userInfo = $scope.userInfo = data;
    	});
    };
    
    $scope.getTypeLabel = function(type) {
		var label = '';
		
		switch (type) {
		case 'ADMIN':
			label = '관리자';
			break;
		case 'TEACHER':
			label = '강사';
			break;
		case 'STUDENT':
			label = '수강생';
			break;
		case 'MANAGER':
			label = '매니저';
			break;
		default:
			break;
		}
		
		label += '님';
		
		return label;
	};
	
	$scope.getMenuLabel = function(state) {
		var label = '';
		
		$('.sidebar-menu  a').each(function(index, item){
			if(item.hash.indexOf(state) > -1) {
				label = $(item).find('span').text();
				return false;
			}
		});
		
		return label;
	};
	
	/**
	 * 날짜 -> 라벨
	 */
	$scope.getDateToLabel = function(date, format) {
		var newDate = $scope.classDateToNewDate(date);
		
		return newDate != null ? newDate.format(format || 'yyyy-MM-dd') : '';
	};
	
	$scope.getDatetimeToLabel = function(datetime, format) {
		var newDate = $scope.datetimeToNewDate(datetime);
		
		return newDate != null ? newDate.format(format || 'yyyy-MM-dd HH:mm:ss') : '';
	};
	
	$scope.classDateToNewDate = function(classDate) {
		if(classDate) {
			return new Date(classDate.substring(0,4), classDate.substring(4,6)-1, classDate.substring(6,8));
		} else {
			return null;
		}
	};
	
	$scope.datetimeToNewDate = function(datetime) {
		if(datetime) {
			return new Date(parseInt(datetime));
		} else {
			return null;
		}
	};
	
	$scope.getClassDateLabel = function(cls) {
		var label = '';
		
		if('Y' == cls.monday) {
			label += '월';
		}
		if('Y' == cls.tuesday) {
			label += '화';
		}
		if('Y' == cls.wednesday) {
			label += '수';
		}
		if('Y' == cls.thursday) {
			label += '목';
		}
		if('Y' == cls.friday) {
			label += '금';
		}
		if('Y' == cls.saturday) {
			label += '토';
		}
		if('Y' == cls.sunday) {
			label += '일';
		}
		
		return label;
	};
	
	$scope.getClassTimeLabel = function(time) {
		var label = '';
		
		try {
			var hour = time.substring(0, 2);
			var minute = time.substring(2, 4);
			
			label += hour + ':' + minute;
		} catch (e) {
//			console.log(e);
		}
		
		return label;
	};
	
	$scope.language = [{
		code : 'ZH',
		label : '중국어',
	},{
		code : 'EN',
		label : '영어',
	},{
		code : 'JA',
		label : '일본어',
	},{
		code : 'HI',
		label : '힌디어',
	},{
		code : 'FR',
		label : '프랑스어',
	},{
		code : 'ES',
		label : '스페인어',
	},{
		code : 'RU',
		label : '러시아어',
	},{
		code : 'AR',
		label : '아랍어',
	},{
		code : 'PT',
		label : '포르투갈어',
	},{
		code : 'DE',
		label : '독일어',
	}];
	
	$scope.getLanguageLabel = function(language) {
		var label='';
		
		$scope.language.forEach(function(item){
			if(language == item.code) {
				label = item.label;
				return false;
			}
		});
		
		return label;
	};
	
    
	$scope.init();
}
ainiApp.controller( 'mainController', [
    '$rootScope',
    '$scope',
    '$element',
    '$state',
    'RemoteHttp',
    mainController] );
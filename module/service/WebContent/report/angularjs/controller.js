var app = angular.module('aini');

app.controller('MainCtrl', function($scope, $http) {
	
	/**
	 * 수강생 목록
	 */
	$scope.students = [];
	
	/**
	 * 전송 여부
	 */
	$scope.isSend = false;
	
	/**
	 * 초기화
	 */
	$scope.initialize = function()
	{
//		$scope.students = [
//			{name:'a',phoneNumber:'010-0000-0000',emailAddress:'test@test1.com',smsFlag:true,emailFlag:false,status:''},
//			{name:'a',phoneNumber:'010-0000-0000',emailAddress:'test@test2.com',smsFlag:true,emailFlag:false,status:''},
//			{name:'a',phoneNumber:'010-0000-0000',emailAddress:'test@test3.com',smsFlag:true,emailFlag:false,status:''},
//			{name:'a',phoneNumber:'010-0000-0000',emailAddress:'test@test4.com',smsFlag:true,emailFlag:false,status:''},
//			{name:'a',phoneNumber:'010-0000-0000',emailAddress:'test@test5.com',smsFlag:true,emailFlag:false,status:''},
//           ];
		
		$scope.students = [];
		
		$scope.setAbleSendButton(true);
		
		$scope.isSend = false;
		
		if ($scope.$$phase != "$apply" && $scope.$$phase != "$digest" ) {
			$scope.$apply();
		}
	};
	
	/**
	 * 수강생 목록 추가
	 */
	$scope.setStudent = function(students) {
		$scope.isSend = false;
		$scope.students = $scope.students.concat(students);
		
		$scope.$apply();
	};
	
	/**
	 * 전송
	 */
	$scope.send = function() {

		$scope.isSend = true;
		$scope.setAbleSendButton(false);
//		$scope.showLoading(true);
		
		angular.forEach($scope.students, function(value, key){
			value.status = "P";
			
			$http({
				method : "POST",
				url : "/report/send",
				data: value,
			}).then(function mySucces(response) {
				response.config.data.status = response.data.status;
				
				$scope.checkSendComplete();
				
				console.log("success");
			}, function myError(response) {
				response.config.data.status = "F";
				
				$scope.checkSendComplete();
				console.log("error");
			});
		});
	};
	
	
	/**
	 * 로딩바 활성화
	 */
	$scope.showLoading = function(show) {
		if(show === true) {
			show = "flex";
		}
		else {
			show = "block";
		}
		
		$("#preloadModal").css("display",show);
	};
	
	
	/**
	 * 파일 선택 활성화
	 */
	$scope.setAbleSendButton = function(able) {
		if(able === true) {
			able = "enable";
		}
		else {
			able = "disable";
		}
		
		$('#input-ficons-1').fileinput(able);
	};
	
	/**
	 * 전송 완료 여부 확인 
	 */
	$scope.checkSendComplete = function() {
		var cnt = 0;
		
		angular.forEach($scope.students, function(value, key){
			if(value.status === 'S' || value.status === 'F') {
				cnt++;
			};
		});
		
		if($scope.students.length === cnt) {
			$scope.sendComplete();
		}
	};
	
	/**
	 * 전송 완료 되었을 경우 알림창 
	 */
	$scope.sendComplete = function() {
		swal({
			title: "전송 완료하였습니다.",
			text: "처음으로 돌아가시겠습니까?",
			type: "success",
			showCancelButton: true,
			confirmButtonColor: "#a6db8a",
			confirmButtonText: "예",
			cancelButtonText: "아니오",
			closeOnConfirm: true,
			closeOnCancel: true
		},
		function(isConfirm){
			if (isConfirm) {
				$('#input-ficons-1').fileinput('clear');
			} else {

			}
		});
	};
	
	/**
	 * 개인보고서 화면 팝업창
	 */
	$scope.iniReportView = function(phoneNumber) {
		swal({
			title: "Aini 개인보고서",
			text: "인증번호를 입력하세요.",
			type: "input",
			showCancelButton: false,
			closeOnConfirm: false,
			confirmButtonText: "확인",
			inputPlaceholder: "xxxx"
		}, function (authNumber) {
			if (authNumber === false) {
				return false;
			}
			if (authNumber === "") {
				swal.showInputError("인증번호를 입력하세요.");
			    return false;
			}
			
			if(authNumber.length == 4) {
				var regExp = /\d{4}/;
				if ( !regExp.test( authNumber ) ) {
					swal.showInputError("4자리 숫자를 입력해주세요.");
					return false;
				}
			} else {
				swal.showInputError("4자리 숫자를 입력해주세요.");
				return false;
			}
			
			$scope.reportConfirm(phoneNumber, authNumber);
		});
	};
	
	/**
	 * 보고서 조회 
	 */
	$scope.reportConfirm = function(phoneNumber, authNumber) {
		$http({
			method : "GET",
			url : "/report/check/" + phoneNumber + "/" + authNumber,
		}).then(function mySucces(response) {
			if(response.data === "") {
				swal.showInputError("인증번호가 틀렸습니다.");
			    return false;
			} else {
				swal("확인되었습니다.", "", "success");
				
				var viewerUrl = "http://docs.google.com/viewer?embedded=true&url=";
				var fileUrl = window.location.origin + "/report/upload/pdf/" + response.data;
				var paramUrl = "param=" + phoneNumber + "." + authNumber;
				
				$("#mainFrame").attr("src", viewerUrl + fileUrl + "?" + paramUrl);
			}
		}, function myError(response) {
			swal.showInputError("인증번호가 틀렸습니다.");
		    return false;
		});
	};
});
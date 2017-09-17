<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css" rel="stylesheet" />
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet" />
		<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
		
		<link href="css/fileinput.css" media="all" rel="stylesheet" type="text/css" />
		<link href="css/theme.css" media="all" rel="stylesheet" type="text/css" />
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		<link href="css/angular-bootstrap-toggle.css" rel="stylesheet" type="text/css" />
		<link href="css/animation.css" rel="stylesheet" type="text/css" />
		<link href="css/modal.css" rel="stylesheet" type="text/css" />
		<link href="css/preload2.css" rel="stylesheet" type="text/css" />
		<link href="css/sweetalert.css" rel="stylesheet" type="text/css" />
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js" type="text/javascript"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js" type="text/javascript"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.js" type="text/javascript"></script>
		<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js" type="text/javascript"></script>
		<script src="https://code.angularjs.org/1.6.1/angular-animate.js" type="text/javascript"></script>
		
		<script src="js/sortable.js" type="text/javascript"></script>
		<script src="js/fileinput.js" type="text/javascript"></script>
		<script src="js/theme.js" type="text/javascript"></script>
		<script src="js/purify.min.js" type="text/javascript"></script>
		<script src="js/kr.js" type="text/javascript"></script>
		<script src="js/angular-bootstrap-toggle.js" type="text/javascript"></script>
		<script src="js/sweetalert.min.js" type="text/javascript"></script>
		
		<script src="angularjs/app.js" type="text/javascript"></script>
		<script src="angularjs/controller.js" type="text/javascript"></script>
		<script src="angularjs/directive.js" type="text/javascript"></script>
		
	</head>
	
	<body id="mainBody" ng-app="aini" ng-controller="MainCtrl" ng-init="$('#input-ficons-1').fileinput('clear');">
		<!-- 로딩 모달 -->
		<div id="preloadModal" class="modal">
			<div class="modal-content">
				<h1 style="color: #fff;font-size: 22px;margin-bottom: 24px;">전송 중입니다.</h1>
				<div class="spinner">
				  <div class="bounce1"></div>
				  <div class="bounce2"></div>
				  <div class="bounce3"></div>
				</div>
			</div>
		</div>

		<!-- 첨부파일 -->
		<div style="text-align:center"> 
			<img src="assets/clip.png">
			<div style="height:25px"></div>
			<p style="color:#ABABAB">파일 첨부</p>
			<hr width="125" style="border:0;height:1px;background:#ccc">
		</div>
		<div class="container kv-main">
			<form enctype="multipart/form-data" method="post">
				<div class="form-group">
					<input id="input-ficons-1" name="inputficons1[]" multiple type="file" class="file-loading" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
				</div>
			</form>
		</div>
		
		<!-- 수강생 목록 -->
		<div class="container kv-main sample-show-hide" ng-show="students.length != 0">
			<hr>
			<div class="panel panel-primary" style="border-radius: 0px">
				<div class="panel-heading" style="border-radius: 0px">
					<h3 class="panel-title">수강생 목록</h3>
				</div>
				<div class="panel-body">
					<table class="table table-bordered table-sm" style="text-align:center">
						<thead>
							<tr>
								<th>#</th>
								<th>이름</th>
								<th>전화번호</th>
								<th>메일주소</th>
								<th>전송여부</th>
								<th width="80">전송결과</th>
							</tr>
						</thead>
						<tbody>
							<tr ng-repeat="item in students">
								<td> {{ $index+1 }} </td>
								<td> {{ item.name }} </td>
								<td> {{ item.phoneNumber }} </td>
								<td> {{ item.emailAddress }} </td>
								<td width="120">
									<toggle ng-model="item.smsFlag" size="btn-xs" style="android" onstyle="btn-info" data-on="<i class='fa fa fa-mobile fa-lg'></i>" data-off="<i class='fa fa fa-mobile fa-lg'></i>"></toggle>
									<toggle ng-model="item.emailFlag" size="btn-xs" style="android" onstyle="btn-info" data-on="<i class='fa fa-envelope-o'></i>" data-off="<i class='fa fa-envelope-o'></i>"></toggle>
								</td>
								<td>
									<div class="spinner" ng-show="item.status == 'P'">
									  <div class="rect1"></div>
									  <div class="rect2"></div>
									  <div class="rect3"></div>
									  <div class="rect4"></div>
									  <div class="rect5"></div>
									</div>
									<img src="assets/success.png" ng-show="item.status == 'S'"/>
									<img src="assets/warning.png" ng-show="item.status == 'PF'"/>
									<img src="assets/error.png" ng-show="item.status == 'F'"/>
								 </td>
							</tr>
						</tbody>
					</table>
					<a class="btn btn-info btn-block btn-lg" style="border-radius: 0px" ng-click="send()" ng-disabled="isSend">전송</a>
				</div>
			</div>
		</div>
		
		<script>
		$("#input-ficons-1").fileinput({
			language: "kr",
		    uploadUrl: "/report/upload",
		    uploadAsync: false,
		    allowedFileExtensions: ["xlsx"],
		    previewFileIcon: '<i class="fa fa-file"></i>',
		    allowedPreviewTypes: false, // set to empty, null or false to disable preview for all types
		    previewFileIconSettings: {
		      'docx': '<i class="fa fa-file-word-o text-primary"></i>',
		      'xlsx': '<i class="fa fa-file-excel-o text-success"></i>',
		      'pptx': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
		      'jpg': '<i class="fa fa-file-photo-o text-warning"></i>',
		      'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
		      'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
		    },
		    browseClass: "btn btn-success",
		    browseLabel: "파일선택",
		    browseIcon: "<i class=\"fa fa-file-excel-o\"></i> ",
		    removeClass: "btn btn-danger",
		    removeLabel: "전체삭제",
		    removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
		    uploadClass: "btn btn-info",
		    uploadLabel: "업로드",
		    uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> ",
		  });
		  
		$('#input-ficons-1').on('filebatchuploadsuccess', function(event, data, previewId, index) {
		    var form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader;
		    
		    var scope = angular.element($("#mainBody")).scope();
			scope.setStudent(data.response);		    
		});
		
		$('#input-ficons-1').on('fileuploaded', function(event, data, previewId, index) {
		    var form = data.form, files = data.files, extra = data.extra, response = data.response, reader = data.reader;
		    
			var scope = angular.element($("#mainBody")).scope();
			scope.setStudent(data.response);
		});
		
		$('#input-ficons-1').on('filecleared', function(event) {
			var scope = angular.element($("#mainBody")).scope();
		    
		    scope.initialize();
		});
		</script>
	</body>
</html>
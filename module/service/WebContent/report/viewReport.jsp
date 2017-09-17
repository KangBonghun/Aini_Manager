<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<title>개인보고서</title>
		
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
	
	<body id="mainBody" ng-app="aini" ng-controller="MainCtrl" ng-init="iniReportView('<%=request.getAttribute("phoneNumber")%>')">
		<iframe id="mainFrame" style="width:100%;height:100%;" frameborder="0")></iframe>
	</body>
</html>
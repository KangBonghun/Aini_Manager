<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html ng-app="ainiApp">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Ainiedu</title>
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/AdminLTE.min.css">
  <link rel="stylesheet" href="css/swiper.min.css">
  <link rel="stylesheet" href="css/skin-red-light.min.css">
  <link rel="stylesheet" href="css/mobiscroll.custom-2.6.2.min.css">
  <link rel="stylesheet" href="css/c3.min.css">
  <link rel="stylesheet" href="css/css-loader.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/switch.css">
  
  <script src="js/jquery-2.2.3.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/AdminLTE.min.js"></script>
  <script src="js/angular.min.js"></script>
  <script src="js/angular-ui-router.min.js"></script>
  <script src="js/swiper.min.js"></script>
  <script src="js/mobiscroll.custom-2.6.2.min.js"></script>
  <script src="js/iscroll.min.js"></script>
  <script src="js/d3.min.js"></script>
  <script src="js/c3.min.js"></script>
  
  <script src="js/common.js"></script>
  
  <script src="angularjs/app.js"></script>
  <script src="angularjs/controller/mainController.js"></script>
  <script src="angularjs/controller/checkController.js"></script>
  <script src="angularjs/controller/checkStatusController.js"></script>
  <script src="angularjs/controller/reportController.js"></script>
  <script src="angularjs/controller/initialController.js"></script>
  <script src="angularjs/controller/reportViewController.js"></script>
  <script src="angularjs/controller/reportViewMainController.js"></script>
  <script src="angularjs/controller/classController.js"></script>
  <script src="angularjs/service/remoteHttpService.js"></script>
  <script src="angularjs/directive/reportViewDirective.js"></script>
  <script src="angularjs/directive/classInfoDirective.js"></script>
  
  
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
</head>
<body class="hold-transition skin-red-light sidebar-mini layout-boxed" ng-controller="mainController">
	<form id="logoutForm" action="/logout" method="post">
    	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
	</form>
	
  <div class="wrapper">
    <header class="main-header">
      <a href="#" class="logo">
        <span class="logo-mini"><b>Aini</b></span>
        <span class="logo-lg"><b>아이니에듀</b></span>
      </a>
      <nav class="navbar navbar-static-top" role="navigation">
        <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button" style="padding: 10px 15px;font-size:20px;" onclick="onClickSidebarToggle()">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <li class="dropdown user user-menu">
              <a class="dropdown-toggle">
              <span>{{ userInfo.userName }}</span>
<!--               <span style="font-size:11px;">{{ getTypeLabel(userInfo.userType) }}</span> -->
              </a>
            </li>
          </ul>
        </div>
        <div class="menu">{{getMenuLabel($state.current.name)}}</div>
      </nav>
    </header>
	<aside class="main-sidebar" style="background:#354052;">
		<section class="sidebar">
			<ul class="sidebar-menu">
				<li class="header">Menu</li>
				<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER' || userInfo.userType=='MANAGER'">
					<a href="#">
						<i class="fa fa-calendar-check-o"></i>
						<span>출석부</span>
						<span class="pull-right-container">
							<i class="fa fa-angle-left pull-right"></i>
						</span>
					</a>
					<ul class="treeview-menu">
						<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER'"><a class="menu-item" href="#/check"><i class="fa fa-circle-o"></i> <span>출석체크</span></a></li>
						<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER' || userInfo.userType=='MANAGER'"><a class="menu-item" href="#/checkStatus"><i class="fa fa-circle-o"></i> <span>월간출석</span></a></li>
					</ul>
				</li>
				
				<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER'">
					<a href="#">
						<i class="fa fa-pencil"></i>
						<span>평가</span>
						<span class="pull-right-container">
							<i class="fa fa-angle-left pull-right"></i>
						</span>
					</a>
					<ul class="treeview-menu">
						<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER'"><a class="menu-item" href="#/initial"><i class="fa fa-circle-o"></i> <span>최초평가</span></a></li>
						<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER'"><a class="menu-item" href="#/report"><i class="fa fa-circle-o"></i> <span>월간평가</span></a></li>
						<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER'"><a class="menu-item" href="#/initial"><i class="fa fa-circle-o"></i> <span>최종평가</span></a></li>
					</ul>
				</li>
				
				<li>
					<a href="#">
						<i class="fa fa-file-text-o"></i>
						<span>보고서</span>
						<span class="pull-right-container">
							<i class="fa fa-angle-left pull-right"></i>
						</span>
					</a>
					<ul class="treeview-menu">
						<li ng-if="userInfo.userType=='ADMIN' || userInfo.userType=='TEACHER' || userInfo.userType=='MANAGER'"><a class="menu-item" href="#/reportViewMain"><i class="fa fa-circle-o"></i> <span>월간보고서</span></a></li>
						<li ng-if="userInfo.userType=='STUDENT'"><a href="#/reportView"><i class="fa fa-circle-o"></i> <span>월간보고서</span></a></li>
					</ul>
				</li>
				<li ng-if="userInfo.userType=='ADMIN'"><a class="menu-item" href="#/class"><i class="fa fa-university"></i> <span>강의관리</span></a></li>
				<li><a class="menu-item" href="#" onclick="confirmLogout()"><i class="fa fa-share"></i> <span>로그아웃</span></a></li>
	        </ul>
		</section>
	</aside>
    <div class="content-wrapper">
      <div ui-view></div>
    </div>
  </div>
  <div id="loader" class="loader loader-default"></div>
  <div id="saveCompleteAlert" class="ly_work_complete">
      <p class="lwc_t">저장완료</p>
  </div>
</body>
</html>

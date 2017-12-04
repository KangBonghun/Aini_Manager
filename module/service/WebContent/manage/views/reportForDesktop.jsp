<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="/manage/css/c3.min.css">
<link rel="stylesheet" href="/manage/css/ng-c3-export.css">
<link rel="stylesheet" href="/manage/css/style.css">
<link rel="stylesheet" href="/manage/css/report.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome-animation/0.1.0/font-awesome-animation.css">


<script src="/manage/js/jquery-2.2.3.min.js"></script>
<script src="/manage/js/angular.min.js"></script>
<script src="/manage/js/d3.min.js"></script>
<script src="/manage/js/c3.min.js"></script>
<script src="/manage/js/html2canvas.min.js"></script>
<script src="/manage/js/saveHtmlToPdf.js"></script>
<script src="/manage/js/jspdf.debug.js"></script>
<script src="/manage/js/common.js"></script>
<script src="/manage/js/reportCommon.js"></script>

<script>
var reportApp = angular.module('reportApp' , ['htmlToPdfSave']) ;
reportApp.controller('MainController' , function($scope) {
	
	$scope.reportData;
	$scope.downloading = false;
	
	$scope.reportName = function() {
		var name = '교육향상분석.pdf';
		
		try {
			name = '교육향상분석' + '_' + $scope.reportData.reportInfo.userName + '_' + $scope.reportData.reportInfo.year + '년' + $scope.reportData.reportInfo.month + '월' + '.pdf';
		} catch(e) {
			console.log(e);
		}
		
		return name;
	};
	
	$scope.onClickDownload = function() {
		$('html').animate({scrollTop: 0 }, 'fast');
		$scope.downloading = true;
	}
	
	$scope.init = function() {
		var reportData = '${reportData}';
		$scope.reportData = JSON.parse(reportData.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t"));
		
		bindReportData($scope.reportData);
	};
	
	$scope.init();
});
</script>
</head>
<div ng-style="{'cursor':downloading?'not-allowed':'pointer'}" class="download-btn">
	<div pdf-save-button="reportDownload" pdf-name="{{ reportName() }}" ng-click="onClickDownload()" title="보고서 다운로드" ng-class="{downloading:downloading}">
		<i class="fa fa-cloud icon-cloud"></i>
		<i ng-show="!downloading" class="fa fa-arrow-down icon-arrow"></i>
		<i ng-show="downloading" class="fa fa-spinner faa-spin animated icon-spin"></i>
	</div>
</div>
<body class="report-viewer" ng-app="reportApp" ng-controller="MainController">
	<div id="reportView" class="wrapper rpt-wrapper" pdf-save-content="reportDownload">
		<div class="topper">
			<label style="float: left;">사내출장교육,특강,상주강사파견,면접대행,통번역,화상전화국어</label>
			<label style="float: right;">www.ainiedu.com 02.722.2627</label>
		</div>
		<div class="main-title">
			<div>
				<img src="/manage/assets/logo.png">
				<div></div>
				<label>교육 향상 분석</label>
				<label id="bind-reportYear" style="margin-left:10px;">-</label>
				<label>년</label>
				<label id="bind-reportMonth">-</label>
				<label>월</label>
			</div>
			<div>
				<label id="bind-name">-</label>
				<ul>
					<li id="bind-tel">-</li>
					<li id="bind-email">-</li>
				</ul>
			</div>
		</div>
		<div class="contents">
			<ul>
				<li class="rpt-box">
					<p class="title">
						Summary<label>종합평가</label>
					</p>
					<div class="content-box">
						<ul>
							<li class="summary-box" style="background: #3E91F9;">
								<div>
									<img src="/manage/assets/chart_01.png">
									<div>
										<p class="summary-title">평가 점수</p>
										<p class="summary-value">
											<span id="bind-score" class="main-value">-</span> <span class="sub-value">/100</span>
										</p>
									</div>
								</div>
							</li>
							<li class="summary-dummy-box">dummy</li>
							<li class="summary-box" style="background: #1FC345;">
								<div>
									<img src="/manage/assets/chart_02.png">
									<div>
										<p class="summary-title">상위 백분율</p>
										<p class="summary-value">
											<span class="sub-value" style="margin-right: -5px;">상위</span> <span class="main-value" style="margin-right: -5px;"><span id="bind-rank">-</span>%</span>
										</p>
									</div>
								</div>
							</li>
							<li class="summary-dummy-box">dummy</li>
							<li class="summary-box" style="background: #FFB20A;">
								<div>
									<img src="/manage/assets/chart_03.png">
									<div>
										<p class="summary-title">아이니 랭귀지 스텝</p>
										<p class="summary-value">
											<span class="main-value">STEP <span id="bind-step">-</span></span>
										</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</li>
				<li class="rpt-box class-info">
					<p class="title">
						Class<label>클래스정보</label>
					</p>
					<div class="content-box">
						<table class="class-tbl">
							<tbody>
								<tr>
									<td class="lst-box">
										<ul class="lst">
											<li><span>클래스</span><span id="bind-className" class="ng-binding">-</span>
											</li>
											<li><span>수업시간</span><span id="bind-classDate" class="ng-binding">-</span></li>
											<li><span>교육기간</span><span class="ng-binding"><span id="bind-startDate">-</span> ~ <span id="bind-endDate">-</span></span></span></li>
											<li><span>총수업일</span><span class="ng-binding"><span id="bind-dateCount">-</span>일</span>
											</li>
										</ul>
									</td>
									<td class="lst-dummy-box">
										<div class="vrule"></div>
									</td>
									<td class="lst-box">
										<ul class="lst">
											<li><span>담당매니저</span><span id="bind-managerName" class="ng-binding">-</span>
											</li>
											<li><span>담당강사</span><span id="bind-teacherName" class="ng-binding">-</span></li>
											<li><span>E-Mail</span><span id="bind-teacherEmail" class="ng-binding">-</span></li>
											<li style="opacity: 0;">dummy</li>
										</ul>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</li>
				<li class="rpt-box">
					<p class="title">
						Learning Goal <label>학습목표</label><label class="goal-desc">나만의 학습목표를 세워보세요!</label>
					</p>
					<div class="content-box">
						<p id="bind-goal">-</p>
					</div>
				</li>
				<li class="rpt-box">
					<p class="title">
						Aini Language Steps<label>아이니에듀 랭귀지 스텝</label>
					</p>
					<div class="content-box">
						<ul>
							<li style="float: left; width: 47.5%;">
								<div>
									<p class="step-div-title">스텝</p>
									<p>
										<label class="step-div-value">STEP <span id="bind-chartStep">-</span></label>
									</p>
									<div class="chart-div">
										<p class="chart-desc">아이니 스텝 그래프</p>
										<div id="stepChart"></div>
									</div>
								</div>
							</li>
							<li style="float: right; width: 47.5%;">
								<div>
									<p class="step-div-title">스텝점수</p>
									<p>
										<label id="bind-chartStepScore" class="step-div-value">-</label><label
											class="step-div-sub-value">/120</label>
									</p>
									<div class="chart-div">
										<p class="chart-desc">아이니 전체 회원 분포도</p>
										<div id="stepScoreChart"></div>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="content-sub-box">
						<div class="first-test-title">
							<div>
								<span>최초평가</span>
							</div>
							<div>
								<span>평가일 </span><span id="bind-firstDate" style="font-weight:normal;">2017-01-01</span>
							</div>
						</div>
						<hr>
						<div class="first-test">
							<div>
								<p>STEP <span id="bind-firstStep">-</span></p>
								<p><span id="bind-firstStepScore">-</span><span>/120</span></p>
							</div>
							<p id="bind-firstComment">-</p>
						</div>
						<div class="content-monthly-box">
							<div class="content-monthly-box-title">
								<p>월간 스텝점수</p>
							</div>
							<div id="monthlyStepChart"></div>
							<div class="step-score-desc">
								<ul>
									<li>
										<p style="color:#999;">매월 발음,어휘,문법,이해도 총 4개의 영역으로 각 25점 총 100점 만점<br>기준으로 평가가
											됩니다. 총점의 기준에 따라서 스텝의 점수가 변동됩니다.</p>
										<p style="color: #EB4545;">80점 이하는 스텝 점수에 반영되지 않습니다.</p>
									</li>
									<li>
										<table class="step-score-desc">
											<tbody>
												<tr>
													<td>스텝</td>
													<td>100-95</td>
													<td>94-90</td>
													<td>89-85</td>
													<td>84-80</td>
												</tr>
												<tr>
													<td>스텝반영점수</td>
													<td>2</td>
													<td>1.5</td>
													<td>1</td>
													<td>0.5</td>
												</tr>
											</tbody>
										</table>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</li>
				<li class="rpt-box">
					<p class="title">
						Test Score<label>평가 점수</label>
					</p>
					<div class="content-box" style="text-align: center;">
						<ul class="test-score">
							<li style="color: #FF7F67;">
								<div class="test-score-value">
									<label id="bind-pronunciation">-</label> <label>/25</label>
								</div>
								<div id="pronunciationChart"></div>
								<div class="chart-label">
									<p>Pronunciation</p>
								</div>
							</li>
							<li>
								<p class="plus">+</p>
							</li>
							<li style="color: #9ACE62;">
								<div class="test-score-value">
									<label id="bind-vocabulary">-</label> <label>/25</label>
								</div>
								<div id="vocabularyChart"></div>
								<div class="chart-label">
									<p>Vocabulary</p>
								</div>
							</li>
							<li>
								<p class="plus">+</p>
							</li>
							<li style="color: #33C8E9;">
								<div class="test-score-value">
									<label id="bind-grammar">-</label> <label>/25</label>
								</div>
								<div id="grammarChart"></div>
								<div class="chart-label">
									<p>Grammar</p>
								</div>
							</li>
							<li>
								<p class="plus">+</p>
							</li>
							<li style="color: #AB93EB;">
								<div class="test-score-value">
									<label id="bind-intelligibility">-</label> <label>/25</label>
								</div>
								<div id="intelligibilityChart"></div>
								<div class="chart-label">
									<p>Intelligibility</p>
								</div>
							</li>
						</ul>
					</div> <img class="brace-img" src="/manage/assets/brace.png">
					<div class="test-score-plus-value">
						<div id="bind-totalScore">-</div>
						<div>
							<span>Total Score</span><br> <span>/100</span>
						</div>
					</div>
					<div class="content-sub-box">
						<div class="content-monthly-box">
							<div class="content-monthly-box-title">
								<p>월간 평가점수</p>
							</div>
							<div id="monthlyScoreChart"></div>
							<div class="test-score-desc">
								<ul>
									<li>
										<p style="color: #FF7F67;">Pronunciation</p>
										<p>자음,모음,강세,억양 등을<br>종합평가한 점수입니다.</p>
									</li>
									<li>
										<p style="color: #9ACE62;">Vocabulary</p>
										<p>정확성,다양성,응용성,적합성,<br>관용어 표현 등을 종합평가한<br>점수입니다.</p>
									</li>
									<li>
										<p style="color: #33C8E9;">Grammar</p>
										<p>어순,문장의 구성 능력 등을<br>종합평가한 점수입니다.</p>
									</li>
									<li>
										<p style="color: #AB93EB;">Intelligibility</p>
										<p>이해정도,묘사능력,단/장문 표현 능력 등을 평가한 점수입니다.</p>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</li>
				<li class="rpt-box">
					<p class="title">
						Strength &amp; Weakness<label>강점 및 보완점</label>
					</p>
					<div class="content-box">
						<table class="class-tbl">
							<tbody>
								<tr>
									<td>
										<p>강점</p>
										<p id="bind-strength">강점</p>
									</td>
									<td><biv class="vrule"></biv></td>
									<td>
										<p>보완점</p>
										<p id="bind-weakness">보완점</p>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</li>
				<li class="rpt-box">
					<p class="title">
						Attendance rate<label>월간 출석율</label>
					</p>
					<div>
						<div id="attendanceRateChart"></div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</body>
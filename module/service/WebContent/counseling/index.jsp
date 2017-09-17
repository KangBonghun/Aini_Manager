<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">	
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
		<!--<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=yes, target-densitydpi=device-dpi">-->
		<meta name="format-detection" content="telephone=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>중국어 교육 상담 신청</title>
		
		
		<link rel="stylesheet" href="css/bootstrap.css">
		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/checkbox.css">
		<!--<link rel="stylesheet" href="css/font-awesome.min.css">-->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="css/mobiscroll.custom-2.6.2.min.css"/>
		
		<script src="js/tether.min.js"></script>
		<script src="js/jquery-1.9.1.min.js" type="text/javascript"></script>
		<!--<script src="https://npmcdn.com/bootstrap@4.0.0-alpha.5/dist/js/bootstrap.min.js"></script>-->
		<script src="js/bootstrap.js" type="text/javascript"></script>
		<script src="js/jquery.validate.min.js" type="text/javascript"></script>
		<script src="js/mobiscroll.custom-2.6.2.min.js" type="text/javascript"></script>
		<script src="js/common.js" type="text/javascript"></script>
	    <script type="text/javascript">
		    $(document).ready(function() {
		    	var msg ='${msg}';
		    	if(msg) {
		    		if(msg=='success') {
		    			alert('상담 신청이 완료되었습니다.');
		    		} else {
		    			alert('신청 신청이 실패하였습니다.\n문의 010-4908-2626 / 02-722-2627');
		    		}
		    	}
		    });
	    </script>		
	</head>
	<body>
		<form method="post" id="frmRequest" action="/counseling/request" style="height:100%;">
			<div id="viewport">
				<header class="title">
					<p>중국어 교육 상담 신청</p>
					<div class="closer">
						<a id="btn_close" href="#" class="btn_close"></a>
					</div>
				</header>
				<section class="content">
					<div class="comment">
						<h1>다시 없을 특별한 중국어 수업!</h1>
						<h1>절대 놓치지 마세요</h1>
						<br>
						<h4>아래의 정보를 입력하여 상담신청을 해주시면</h4>
						<h4>바로 상담 연락드리겠습니다!</h4>
					</div>
					<hr/>
					<div class="form-group row">
						<input name="fi_name" type="text" class="form-control form-control-lg2" placeholder="이름">
					</div>
					<div class="form-group row">
						<input name="fi_tel" type="text" class="form-control form-control-lg2" placeholder="전화번호">
					</div>
					<div class="form-group row">
						<select name="fi_age" class="form-control form-control-lg2">
						  <option value="" disabled selected hidden>강의 대상 연령</option>
						  <option>초등학생</option>
						  <option>중학생</option>
						  <option>고등학생</option>
						  <option>성인</option>
						</select>
					</div>
					<div class="form-group row">
						<select name="fi_level" class="form-control form-control-lg2">
							<option value="" disabled selected hidden>강의과정</option>
							<option>중학교 내신</option>
							<option>고등학교 내신</option>
							<option>국제학교 내신</option>
							<option>일반 중국어 회화</option>
							<option>SAT2 chiness</option>
							<option>HSK 시험대비</option>
						</select>
					</div>
					<div class="form-group row">
						<input id="fi_date" name="fi_date" class="form-control form-control-lg2" placeholder="희망 강의 시작일" onfocus="this.blur();">
					</div>
					<div class="checkbox checkbox-info" style="margin-top:-10px" onclick="$('#chk_agree').trigger('click');">
						<input id="chk_agree" name="fi_agree" type="checkbox"><label></label>
						<div class="lb_agree"><font color="#389bff">개인정보 수집 및 이용</font><font>에 동의합니다.</font></div>
					</div>
					<div>
						<a href="#" id="btnSubmit" class="btn_submit" onclick="$('#frmRequest').submit()">상담신청</a>
					</div>
					<hr>
				</section>
				
				<footer class="footer">
					<div>
						<span>상담문의 010-4908-2626 / 02-722-2627</span>
					</div>
				</footer>
			</div>
		</form>
	</body>
</html>
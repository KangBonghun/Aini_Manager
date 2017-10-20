<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">	
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
		<meta name="format-detection" content="telephone=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>교육 상담 신청</title>
		
		<link rel="stylesheet" href="css/bootstrap.css">
		<link rel="stylesheet" href="css/magic-check.css">
		<link rel="stylesheet" type="text/css" href="css/material.datepicker.css">
		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css">
		
		<script src="js/tether.min.js"></script>
		<script src="js/jquery-1.9.1.min.js" type="text/javascript"></script>
		<script src="js/bootstrap.js" type="text/javascript"></script>
		<script src="js/moment.min.js"></script>
		<script src="js/knockout-3.2.0.js"></script>
		<script src="js/material.datepicker.js"></script>
		<script src="js/jquery.validate.min.js" type="text/javascript"></script>
		<script src="js/common.js" type="text/javascript"></script>
	</head>
	<body>
		<form method="post" style="height:100%;" action="/counseling/request" onsubmit="return confirmSignUpSubmit();">
			<div id="viewport">
				<header>
					<p class="inquery">INQUIRY</p>
					<div class="inquery-bar"></div>
					<p class="inquery-desc">적합한 프로그램,강사진,기간 및 형태 등에 대한 맞춤 컨설팅이 가능합니다.<br/>아래 정보를 기입해 주시면 최대한 빠른 시간 내에 연락 드리겠습니다.</p>
				</header>
				<section class="content">
					<p class="essential">*는 필수 기재 정보입니다.</p>
					<div class="form">
						<table class="form-tbl">
							<tbody>
								<tr>
									<td>회사명<span>*</span></td>
									<td>
										<div>
											<input name="fi_company_name" type="text" style="width:450px;"></input>
										</div>
									</td>
								</tr>
								<tr>
									<td>회사주소<span>*</span></td>
									<td>
										<div>
											<input name="fi_company_addr" type="text" style="width:450px;"></input>
										</div>
									</td>
								</tr>
								<tr>
									<td>담당자명<span>*</span></td>
									<td>
										<div>
											<input name="fi_manager_name" type="text" style="width:140px;"></input>
										</div>
									</td>
								</tr>
								<tr>
									<td>E-mail<span>*</span></td>
									<td>
										<div>
											<input name="fi_email_addr" type="text" style="width:140px;"></input>
											<span class="split email">@</span>
											<input name="fi_email_domain" type="text" placeholder="직접입력" style="width:140px;"></input>
											<select id="selEmailDomain" style="width: 140px;margin-left: 8px;">
											  <option value="">직접입력</option>
											  <option value="naver.com">naver.com</option>
											  <option value="hotmail.com">hotmail.com</option>
											  <option value="hanafos.com">hanafos.com</option>
											  <option value="paran.com">paran.com</option>
											  <option value="empal.com">empal.com</option>
											  <option value="nate.com">nate.com</option>
											  <option value="yahoo.co.kr">yahoo.co.kr</option>
											  <option value="dreamwiz.com">dreamwiz.com</option>
											  <option value="freechal.com">freechal.com</option>
											  <option value="korea.com">korea.com</option>
											  <option value="chollian.net">chollian.net</option>
											  <option value="hanmail.net">hanmail.net</option>
											  <option value="daum.net">daum.net</option>
											</select>
										</div>
									</td>
								</tr>
								<tr>
									<td>연락처<span>*</span></td>
									<td>
										<div>
											<input class="tel-input" style="width:90px;" type="number" pattern="[0-9]*" inputmode="numeric" min="0" name="fi_tel1">
											<span class="split tel">-</span>
											<input class="tel-input" style="width:90px;" type="number" pattern="[0-9]*" inputmode="numeric" min="0" name="fi_tel2">
											<span class="split tel">-</span>
											<input class="tel-input" style="width:90px;" type="number" pattern="[0-9]*" inputmode="numeric" min="0" name="fi_tel3">
										</div>
									</td>
								</tr>
								<tr>
									<td style="vertical-align: top;padding-top: 7px;">강의과정<span>*</span></td>
									<td>
										<div>
											<div>
												<input class="magic-radio" type="radio" id="program-special" value="특화프로그램" name="fi_program_type" checked>
											    <label for="program-special">특화프로그램</label>
											
											    <input class="magic-radio" type="radio" id="program-general" value="일반프로그램" name="fi_program_type">
											    <label for="program-general" style="margin-left: 30px;">일반프로그램</label>
  											</div>
										</div>
										<div>
											<select style="width: 320px;" name="fi_program_s">
												<option value="전문분야과정">전문분야과정</option>
												<option value="실무통·번역과정">실무통·번역과정</option>
												<option value="234프로젝트(1+1)">234프로젝트(1+1)</option>
												<option value="기업 외국어 CS교육">기업 외국어 CS교육</option>
												<option value="SPA General Test">SPA General Test</option>
												<option value="아이니 IN 월드">아이니 IN 월드</option>
												<option value="1+2 전문가과정">1+2 전문가과정</option>
											</select>
											<select style="width: 320px;display: none;" name="fi_program_g">
												<option value="기본회화과정">기본회화과정</option>
												<option value="비즈니스과정">비즈니스과정</option>
												<option value="공인시험대비과정">공인시험대비과정</option>
												<option value="사내상주과정">사내상주과정</option>
<!-- 												<option value="Intensive Course과정">Intensive Course과정</option> -->
<!-- 												<option value="특강">특강</option> -->
												<option value="일대일과정">일대일과정</option>
												<option value="주말집중과정">주말집중과정</option>
												<option value="주재원과정">주재원과정</option>
											</select>
										</div>
									</td>
								</tr>
								<tr>
									<td>강의과목<span>*</span></td>
									<td>
										<div>
											<div>
												<input class="magic-radio" type="radio" id="language-english" value="영어" name="fi_language" checked>
											    <label for="language-english">영어</label>
											
											    <input class="magic-radio" type="radio" id="language-chinese" value="중국어" name="fi_language">
											    <label for="language-chinese" style="margin-left: 25px;">중국어</label>
											    
											    <input class="magic-radio" type="radio" id="language-japanese" value="일본어" name="fi_language">
											    <label for="language-japanese" style="margin-left: 25px;">일본어</label>
											    
											    <input class="magic-radio" type="radio" id="language-korean" value="한국어" name="fi_language">
											    <label for="language-korean" style="margin-left: 25px;">한국어</label>
											    
											    <input class="magic-radio" type="radio" id="language-etc" value="기타외국어" name="fi_language">
											    <label for="language-etc" style="margin-left: 25px;">기타외국어</label>
  											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>희망강사<span>*</span></td>
									<td>
										<div>
											<div>
												<input class="magic-radio" type="radio" id="teacher-native-m" value="원어민(남)" name="fi_teacher" checked>
											    <label for="teacher-native-m">원어민(남)</label>
											
											    <input class="magic-radio" type="radio" id="teacher-native-f" value="원어민(여)" name="fi_teacher">
											    <label for="teacher-native-f" style="margin-left: 25px;">원어민(여)</label>
											    
											    <input class="magic-radio" type="radio" id="teacher-local-m" value="내국인(남)" name="fi_teacher">
											    <label for="teacher-local-m" style="margin-left: 25px;">내국인(남)</label>
											    
											    <input class="magic-radio" type="radio" id="teacher-local-f" value="내국인(여)" name="fi_teacher">
											    <label for="teacher-local-f" style="margin-left: 25px;">내국인(여)</label>
  											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>교육 시작 희망일</td>
									<td>
										<div>
											  <input id="field1" name="fi_hope_date" class="calendar" type="text" style="width:320px;" placeholder="교육 시작 희망일" readonly>
										</div>
									</td>
								</tr>
								<tr>
									<td>예상 교육 기간</td>
									<td>
										<div>
											<input id="field2" name="fi_start_date" class="calendar" type="text" style="width:150px;" placeholder="예상 시작일" readonly>
											<span class="split period">~</span>
											<input id="field3" name="fi_end_date" class="calendar" type="text" style="width:150px;" placeholder="예상 종료일" readonly>
										</div>
									</td>
								</tr>
								<tr>
									<td style="vertical-align: top;padding-top: 7px;">예상 교육 스케줄<span>*</span></td>
									<td>
										<div>
											<div>
												<input class="magic-checkbox" type="checkbox" name="fi_days" id="schedule-mon" value="월">
												<label class="pull-left" for="schedule-mon"></label>
												<label class="pull-left text" for="schedule-mon" style="margin-right:20px;">월</label>
												
												<input class="magic-checkbox" type="checkbox" name="fi_days" id="schedule-tue" value="화">
												<label class="pull-left" for="schedule-tue"></label>
												<label class="pull-left text" for="schedule-tue" style="margin-right:20px;">화</label>
												
												<input class="magic-checkbox" type="checkbox" name="fi_days" id="schedule-wed" value="수">
												<label class="pull-left" for="schedule-wed"></label>
												<label class="pull-left text" for="schedule-wed" style="margin-right:20px;">수</label>
												
												<input class="magic-checkbox" type="checkbox" name="fi_days" id="schedule-thu" value="목">
												<label class="pull-left" for="schedule-thu"></label>
												<label class="pull-left text" for="schedule-thu" style="margin-right:20px;">목</label>
												
												<input class="magic-checkbox" type="checkbox" name="fi_days" id="schedule-fri" value="금">
												<label class="pull-left" for="schedule-fri"></label>
												<label class="pull-left text" for="schedule-fri" style="margin-right:20px;">금</label>
												
												<input class="magic-checkbox" type="checkbox" name="fi_days" id="schedule-sat" value="토">
												<label class="pull-left" for="schedule-sat"></label>
												<label class="pull-left text" for="schedule-sat" style="margin-right:20px;">토</label>
												
												<input class="magic-checkbox" type="checkbox" name="fi_days" id="schedule-sun" value="일">
												<label class="pull-left" for="schedule-sun"></label>
												<label class="pull-left text" for="schedule-sun">일</label>
											</div>
										</div>
										<div style="clear:both;">
											<select name="fi_start_meridiem" style="width: 70px;margin-right: 5px;">
												<option value="오전">오전</option>
												<option value="오후">오후</option>
											</select>
											<select name="fi_start_hour" style="width: 70px;margin-right: 5px;">
												<option value="00">00</option>
												<option value="01">01</option>
												<option value="02">02</option>
												<option value="03">03</option>
												<option value="04">04</option>
												<option value="05">05</option>
												<option value="06">06</option>
												<option value="07">07</option>
												<option value="08">08</option>
												<option value="09">09</option>
												<option value="10">10</option>
												<option value="11">11</option>
												<option value="12">12</option>
											</select>
											<span class="split schedule">~</span>
											<select name="fi_end_meridiem" style="width: 70px;margin-right: 5px;">
												<option value="오전">오전</option>
												<option value="오후">오후</option>
											</select>
											<select name="fi_end_hour" style="width: 70px;margin-right: 5px;">
												<option value="00">00</option>
												<option value="01">01</option>
												<option value="02">02</option>
												<option value="03">03</option>
												<option value="04">04</option>
												<option value="05">05</option>
												<option value="06">06</option>
												<option value="07">07</option>
												<option value="08">08</option>
												<option value="09">09</option>
												<option value="10">10</option>
												<option value="11">11</option>
												<option value="12">12</option>
											</select>
										</div>
									</td>
								</tr>
								<tr>
									<td style="vertical-align: top;padding-top: 7px;">상세 문의 내용</td>
									<td>
										<div>
											<textarea name="fi_detail" style="width:100%;height:115px;resize: none;padding:10px;"></textarea>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				
				<footer class="footer">
					<div class="agree-wrapper">
						<input id="agree" class="magic-checkbox" type="checkbox">
						<label class="pull-left" for="agree" style="top:8px;"></label>
						<label class="pull-left text" for="agree" style="margin-right:20px;"><span>개인정보 수집 및 이용<span style="color: #999;">에 동의합니다.</span></span></label>
					</div>
					<div class="submit-wrapper">
						<input type="submit" class="submit-btn" title="상담신청하기" alt="상담신청하기" value="상담신청하기">
					</div>
				</footer>
			</div>
		</form>
	</body>
</html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    <!DOCTYPE html>
    <html lang="ko">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <title>로그인</title>
        <link rel="stylesheet" type="text/css" href="/manage/css/sign-up.css">
        <link rel="stylesheet" type="text/css" href="/manage/css/css-loader.css">
        <script src="/manage/js/jquery-2.2.3.min.js"></script>
        <script src="js/common.js"></script>
    </head>

    <body class="">
        <div id="wrap">
            <div id="header">
                <a href="/manage/main" class="sp h_logo" tabindex="1">아이니에듀</a>
            </div>
            <div id="ct" role="main" style="padding-bottom: 50px;">
                <div id="content">
                    <div class="join_content">
                        <div class="join_form">
                            <form id="join_form" method="post" action="/manage/sign/sign-up" onsubmit="return confirmSignUpSubmit();">
                                <fieldset class="join_from">
                                    <legend class="blind">회원가입</legend>
                                    <div class="row_group">
                                        <div id="idDiv" class="join_row">
                                            <span class="ps_box int_id">
												<input type="text" id="id" name="id" value="" maxlength="50" autocomplete="off" onblur="checkSignValidation('id');" placeholder="아이디(이메일)" class="int"> 
											</span>
                                            <div id="idMsg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                        <div id="pswd1Div" class="join_row">
                                            <span id="pswd1Img" class="ps_box int_pass">
												<input type="password" id="pswd1" name="pswd1" maxlength="20" onblur="checkSignValidation('pw1');" placeholder="비밀번호" class="int"> 
											</span>
                                            <div id="pswd1Msg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                        <div id="pswd2Div" class="join_row">
                                            <span id="pswd2Img" class="ps_box int_pass_check">
												<input type="password" id="pswd2" name="pswd2" maxlength="20" onblur="checkSignValidation('pw2');" placeholder="비밀번호 재확인" class="int"> 
											</span>
                                            <div id="pswd2Msg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                    </div>
                                    <div class="row_group">
                                        <div id="nmDiv" class="join_row">
                                            <span class="ps_box">
												<input type="text" id="nm" name="nm" maxlength="40" value="" onblur="checkSignValidation('nm');" placeholder="이름" class="int"> 
											</span>
                                            <div id="nmMsg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                        <div class="join_row row_gender" style="display:none;">
                                            <span class="title blind"> 성별 </span>
                                            <div class="tab_button">
                                                <span class="tab">
                                                	<input type="radio" id="man" name="sex" value="0">
                                                		<label id="manLb" for="man">남자 </label>
												</span>
												<span class="tab">
													<input type="radio" id="woman" name="sex" value="1">
													<label id="womanLb" for="woman">여자 </label>
												</span>
                                            </div>
                                            <span id="sexMsg" class="error" style="display:none">필수 정보입니다.</span>
                                        </div>
                                        <div id="birthdayDiv" class="join_row join_birthday" style="display:none;">
                                            <div class="join_birth">
                                                <div class="bir_title">
                                                	<span>생일</span>
                                                </div>
                                                <div class="bir_yy">
                                                    <span class="ps_box">
														<input type="tel" id="yy" maxlength="4" value="" onblur="checkSignValidation('bir_year');" placeholder="년(4자)" class="int"> 
														<label id="yyLb" for="yy" class="lbl">년(4자)</label>
													</span>
                                                </div>
                                                <span class="cell">|</span>
                                                <div class="bir_mm">
                                                    <span class="ps_box">
														<select id="mm" title="월" class="sel" onchange="checkSignValidation('bir_month');">
															<option value="">월</option>
											  	 			<option value="1">1</option>
											  	 			<option value="2">2</option>
											  	 			<option value="3">3</option>
											  	 			<option value="4">4</option>
											  	 			<option value="5">5</option>
											  	 			<option value="6">6</option>
											  	 			<option value="7">7</option>
											  	 			<option value="8">8</option>
											  	 			<option value="9">9</option>
											  	 			<option value="10">10</option>
											  	 			<option value="11">11</option>
											  	 			<option value="12">12</option>
														</select>
													</span>
                                                </div>
                                                <span class="cell">|</span>
                                                <div class=" bir_dd">
                                                    <span class="ps_box">
														<input type="tel" id="dd" maxlength="2" value="" onblur="checkSignValidation('bir_day');" placeholder="일" class="int"> 
														<label id="ddLb" for="dd" class="lbl">일</label>
													</span>
                                                </div>
                                            </div>
                                            <span id="birthdayMsg" class="error" style="display:none">필수 정보입니다.</span>
                                        </div>
<!--                                         <div id="emailDiv" class="join_row join_email"> -->
<!--                                             <span class="ps_box int_email"> -->
<!-- 												<input type="text" id="email" name="email" maxlength="100" value="" onblur="checkSignValidation('email');" placeholder="이메일" class="int"> -->
<!-- 												<label id="emailLb" for="email" class="lbl">이메일</label> -->
<!-- 											</span> -->
<!--                                             <div id="emailMsg" class="error" style="display:none">필수 정보입니다.</div> -->
<!--                                         </div> -->
                                        <div id="phoneDiv" class="join_row join_email">
                                            <span class="ps_box int_email">
												<input type="number" pattern="[0-9]*" inputmode="numeric" min="0" id="phone" name="phone" value="" onblur="checkSignValidation('phone');" onkeypress="checkNumber(event)" placeholder="휴대폰" class="int">
												<label id="phoneLb" for="phone" class="lbl">휴대폰</label>
											</span>
                                            <div id="phoneMsg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                        <div class="join_row row_gender">
                                            <span class="title blind"> 회원 유형 </span>
                                            <div class="tab_button">
												<span class="tab">
													<input type="radio" id="teacher" name="userType" value="TEACHER" checked>
													<label id="teacherLb" for="teacher">강사 </label>
												</span>
                                                <span class="tab">
                                                	<input type="radio" id="manager" name="userType" value="MANAGER">
                                                		<label id="managerLb" for="manager">매니저 </label>
												</span>
												<span class="tab">
													<input type="radio" id="student" name="userType" value="STUDENT">
													<label id="studentLb" for="student"> 수강생 </label>
												</span>
                                            </div>
                                            <span id="sexMsg" class="error" style="display:none">필수 정보입니다.</span>
                                        </div>
                                    </div>
                                </fieldset>
                                <div class="error_ch">
                                	<span id="joinMsg" class="error" style="display:none;">가입정보를 확인해주세요.</span>
                                </div>
                                <span class="btn_join">
                                	<input type="submit" title="회원가입" alt="회원가입" value="가입하기" class="int_join">
                                </span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="loader" class="loader loader-default"></div>
    </body>
    </html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    <!DOCTYPE html>
    <html lang="ko">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <title>비밀번호 찾기</title>
        <link rel="stylesheet" type="text/css" href="/manage/css/sign-up.css">
        <link rel="stylesheet" type="text/css" href="/manage/css/css-loader.css">
        <script src="/manage/js/jquery-2.2.3.min.js"></script>
        <script src="js/common.js"></script>
        <script type="text/javascript">
	    	$(document).ready(function() {
	    		var msg ="${msg}";
				if(msg) {
					alert(msg);
				}
	    	});
		</script>
    </head>

    <body class="">
        <div id="wrap">
            <div id="header">
                <a href="/manage/main" class="sp h_logo" tabindex="1">아이니에듀</a>
            </div>
            <div id="ct" role="main">
                <div id="content">
                    <div class="join_content">
                        <div class="join_form">
                            <form id="join_form" method="post" action="/manage/sign/find-pw" onsubmit="return confirmFindPwSubmit();">
                                <fieldset class="join_from">
                                    <legend class="blind">회원가입</legend>
                                    <div class="row_group">
                                        <div id="idDiv" class="join_row">
                                            <span class="ps_box int_id">
												<input type="text" id="id" name="id" value="" maxlength="50" autocomplete="off" onblur="checkSignValidation('pw_id');" placeholder="아이디(이메일)" class="int"> 
											</span>
                                            <div id="idMsg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                        <div id="nmDiv" class="join_row">
                                            <span class="ps_box">
												<input type="text" id="nm" name="nm" maxlength="40" value="" onblur="checkSignValidation('nm');" placeholder="이름" class="int"> 
											</span>
                                            <div id="nmMsg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                        <div id="phoneDiv" class="join_row join_email">
                                            <span class="ps_box int_email">
												<input type="number" pattern="[0-9]*" inputmode="numeric" min="0" id="phone" name="phone" value="" onblur="checkSignValidation('phone');" onkeypress="checkNumber(event)" placeholder="휴대폰" class="int">
												<label id="phoneLb" for="phone" class="lbl">휴대폰</label>
											</span>
                                            <div id="phoneMsg" class="error" style="display:none">필수 정보입니다.</div>
                                        </div>
                                    </div>
                                </fieldset>
                                <span class="btn_join">
                                	<input type="submit" title="비밀번호 찾기" alt="비밀번호 찾기" value="비밀번호 찾기">
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
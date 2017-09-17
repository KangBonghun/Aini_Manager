<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <title>로그인</title>
    <link rel="stylesheet" type="text/css" href="/manage/css/sign-in.css">
    <script src="/manage/js/jquery-2.2.3.min.js"></script>
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
            <h1>
                <a href="#" class="sp h_logo" tabindex="1">아이니에듀</a>
            </h1>
        </div>
        <div id="container">
            <div id="content">
                <div class="title">
                    <p></p>
                </div>
                <form id="frmNIDLogin" name="frmNIDLogin" target="_top" autocomplete="off" action="/login" method="post" onsubmit="return confirmSubmit();">
                    <fieldset class="login_form">
                        <legend class="blind">
                            로그인
                        </legend>
                        <div class="input_row" id="id_area">
                            <span class="input_box">
                                    <label for="id" id="label_id_area" class="lbl">아이디</label>
                                    <input
                                        type="text"
                                        id="id"
                                        name="userid"
                                        tabindex="7"
                                        accesskey="L"
                                        placeholder="아이디"
                                        class="int"
                                        maxlength="50"
                                        value="${userid}">
                                </span>
                            <button type="button" disabled="" title="delete" id="id_clear" class="wrg" style="display: none;">
								<span class="blind">삭제</span>
                            </button>
                        </div>
                        <div id="err_empty_id" class="error" style="display:none;">아이디를 입력해주세요.</div>
                        <div class="input_row" id="pw_area">
                            <span class="input_box">
                                    <label for="pw" id="label_pw_area" class="lbl">비밀번호</label>
                                    <input
                                        type="password"
                                        id="pw"
                                        name="password"
                                        tabindex="8"
                                        placeholder="비밀번호"
                                        class="int"
                                        maxlength="16">
                                </span>
                            <button type="button" disabled="" title="delete" id="pw_clear" class="wrg" style="display: none;">
								<span class="blind">삭제</span>
							</button>
                        </div>
                        <div class="error" id="err_empty_pw" style="display:none;">비밀번호를 입력해주세요.</div>
						<c:if test="${not empty error}">
							<div class="error" id="err_fail_login">${error}</div>
						</c:if>
						                 
                        <input type="submit" title="로그인" alt="로그인" tabindex="12" value="로그인" class="btn_global" ></input>
                    </fieldset>
                </form>
				<div class="find_info" style="display: table;width: 100%;">
					<div style="display: table-cell;width: 50%;text-align: right;">
						<a target="_blank" href="/manage/find-pw" onclick="">비밀번호 찾기</a>
					</div>
					<span class="bar">|</span>
					<div style="display: table-cell;width: 50%;text-align: left;">
						<a target="_blank" href="/manage/sign-up" onclick="">회원가입</a>
					</div>
				</div>
            </div>	
        </div>
    </div>
    <script>
        var confirmSubmit = function () {
        	$('#err_fail_login').hide();
        	
            if(!$('#id').val()) {
                $('#id').focus();
                $('#err_empty_id').show();
                return false;
            } else {
                $('#err_empty_id').hide();
                
                if(!$('#pw').val()) {
                    $('#pw').focus();
                    $('#err_empty_pw').show();
                    return false;
                } else {
                    $('#err_empty_pw').hide();
                }
            }    
            
            return true;
        }
    </script>
</body>
</html>
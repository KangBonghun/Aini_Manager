/******************************************** 회원가입 ********************************************/
/**
 * 전화번호 자동 하이픈
 */
function autoHypenPhone(evt){
	var str = evt.target.value;
	str = str.replace(/[^0-9]/g, '');
	var tmp = '';
	if( str.length < 4){
		tmp = str;
	}else if(str.length < 7){
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3);
	}else if(str.length < 11){
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 3);
		tmp += '-';
		tmp += str.substr(6);
	}else{				
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 4);
		tmp += '-';
		tmp += str.substr(7);
	}
	evt.target.value=tmp;
}

/**
 * 사용자 존재 여부 확인
 * @param callback
 */
function checkUserExist(callback) {
	$.get("/manage/check-user-exist",{id: $('#id').val()}, function(isExist) {
		callback(isExist);
	});
}

/**
 * 회원가입 로그인 컨펌
 * @returns
 */
function confirmSignUpSubmit() {
	checkSignValidation('default_singup');
	
	if($('.error').is(":visible")) {
		return false;
	} else {
		$('#loader').addClass('is-active');
		return true;
	}
}

/**
 * 비밀번호 찾기 컨펌
 * @returns
 */
function confirmFindPwSubmit() {
	checkSignValidation('default_pw');
	
	if($('.error').is(":visible")) {
		return false;
	} else {
		$('#loader').addClass('is-active');
		return true;
	}
}

/**
 * 전화번호 형식 검사
 * @returns {Boolean}
 */
function checkNumber() {
   if (event.keyCode >=48 && event.keyCode <= 57 ) {
	   if(event.target.value.length > 10) {
		   event.returnValue = false; 
	   } else {
           return true;
	   }
   } else {
       event.returnValue = false;
   }
}

/**
 * 이메일 형식 검사
 * @param data
 * @returns
 */
function checkEmailForm(data) {
	var regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	return regex.test(data);
}

/**
 * 회원가입 정보 유효성 검사
 * @param type
 */
function checkSignValidation(type) {
	switch (type) {
		case 'id':
		case 'pw_id':
			if($('#id').val()=='') {
				$('#idMsg').text('필수 정보입니다.');
    			$('#idMsg').show();
    		} else {
    			if(checkEmailForm($('#id').val())) {
    				$('#idMsg').hide();
    				
    				if(type=='id') {
    					checkUserExist(function(isExist){
    						if(isExist) {
    							$('#idMsg').text('이미 사용중인 아이디입니다.');
    							$('#idMsg').show();
    						} else {
    							$('#idMsg').hide();	
    						}
    					});
    				}
    			} else {
    				$('#idMsg').text('이메일 형식이 올바르지 않습니다.');
    				$('#idMsg').show();	
    			}
    		}
			break;
		case 'pw1':
			if($('#pswd1').val()=='') {
    			$('#pswd1Msg').show();
    		} else {
    			$('#pswd1Msg').hide();
    		}
			break;
		case 'pw2':
			if($('#pswd2').val()=='') {
				$('#pswd2Msg').text('필수 정보입니다.');
    			$('#pswd2Msg').show();
    		} else {
    			if($('#pswd1').val() != $('#pswd2').val()) {
    				$('#pswd2Msg').text('비밀번호가 일치하지 않습니다.');
        			$('#pswd2Msg').show();
        			
        			if($('#pswd1').val()=='') {
        				$('#pswd2').val('');
        			}
    			} else {
        			$('#pswd2Msg').hide();
    			}
    		}
			break;
		case 'nm':
			if($('#nm').val()=='') {
    			$('#nmMsg').show();
    		} else {
    			$('#nmMsg').hide();
    		}
			break;
		case 'bir_year':
		case 'bir_month':
		case 'bir_day':
			if($('#yy').val()=='' || $('#yy').val().length < 4) {
				$('#birthdayMsg').text('태어난 년도 4자리를 입력하세요.');
    			$('#birthdayMsg').show();
    			break;
    		} else {
    			$('#birthdayMsg').hide();
    		}
			
			if($("#mm option:selected").val()=='') {
				$('#birthdayMsg').text('태어난 월을 선택하세요.');
    			$('#birthdayMsg').show();
    			break;
    		} else {
    			$('#birthdayMsg').hide();
    		}
			
			if($('#dd').val()=='') {
				$('#birthdayMsg').text('태어난 일(날짜) 2자리를 입력하세요.');
    			$('#birthdayMsg').show();
    			break;
    		} else {
    			$('#birthdayMsg').hide();
    		}
			break;	
		case 'email':
			if($('#email').val()=='') {
    			$('#emailMsg').show();
    		} else {
    			if(checkEmailForm($('#email').val())) {
    				$('#emailMsg').hide();
    			} else {
    				$('#emailMsg').text('이메일 형식이 올바르지 않습니다.');
    				$('#emailMsg').show();	
    			}
    		}
			break;
		case 'phone':
			if($('#phone').val()=='') {
    			$('#phoneMsg').show();
    		} else {
    			$('#phoneMsg').hide();
    		}
			break;
		case 'default_singup':
			['id', 'pw1', 'pw2', 'nm', 'email', 'phone'].forEach(function(item){
				checkSignValidation(item);	
			});
			break;
		case 'default_pw':
			['pw_id', 'nm', 'phone'].forEach(function(item){
				checkSignValidation(item);	
			});
			break;			
			
	}
}

/******************************************** 회원가입 끝 ********************************************/





/******************************************** 로그아웃 ********************************************/
function confirmLogout() {
	var check = confirm("로그아웃 하시겠습니까?");
	
  if(check) {
	  document.getElementById('logoutForm').submit();
  } else {
	  
  }
}
/******************************************** 로그아웃 끝 ********************************************/





/******************************************** 메인화면 ********************************************/
function onClickSidebarToggle() {
	$('.menu-item').unbind('click');
	$('.menu-item').on('click',function(){
      $('.content-wrapper').click();
    });	
}
/******************************************** 메인화면 끝 ********************************************/


(function($) {
  var cache = [];
  // Arguments are image paths relative to the current page.
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img'); // 이건 pure javascript DOM 구조
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  };
})(jQuery);

$(window).scroll(function() {
    if ($(window).scrollTop() >= $(document).height() - $(window).height()-100 || $(window).scrollTop() <= 100) {
        $('.scroll-top').fadeOut(300);
    } else {
        $('.scroll-top').fadeIn(300);
    }
});

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekShortName = ["일", "월", "화", "수", "목", "금", "토"];
    
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "e": return weekShortName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function visibleLoader(visible) {
	if(visible) {
		$('#loader').addClass('is-active');
	} else {
		$('#loader').removeClass('is-active');	
	}
}

function showCompleteAlert(callback, duration) {
	$('#saveCompleteAlert').fadeIn(10,function() {
		setTimeout(function() {
            $('#saveCompleteAlert').fadeOut(duration || 1000, function(){
            	callback && callback();
            });    
        }, 500);
    });
}
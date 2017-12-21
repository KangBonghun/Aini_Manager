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

/**
 * 로딩화면을 띄운다.
 * 
 * @param visible
 */
function visibleLoader(visible) {
	if(visible) {
		$('#loader').addClass('is-active');
	} else {
		$('#loader').removeClass('is-active');	
	}
}

/**
 * 저장완료 Alert를 띄운다.
 * 
 * @param callback
 * @param duration
 */
function showCompleteAlert(callback, duration) {
	$('#saveCompleteAlert').fadeIn(10,function() {
		setTimeout(function() {
            $('#saveCompleteAlert').fadeOut(duration || 1000, function(){
            	callback && callback();
            });    
        }, 500);
    });
}

/**
 * 언어에 따른 분포도를 반환한다.
 * 
 * @param type
 * @returns {Array}
 */
function distribution(type) {
	if(['EN','JA'].indexOf(type) > -1) {
		return [0, 0, 0, 0, 0, 0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12.5, 12, 11, 10, 9, 8, 7, 6, 6.5, 7, 7.5, 8, 9, 10, 11, 12, 13, 14, 15.5, 17, 18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32, 33.5, 35, 36.5, 38, 39.5, 41, 42.5, 44, 45.5, 47, 48.5, 50, 51.5, 53, 54.5, 56, 57.5, 59, 60.5, 62, 63.5, 65, 66.5, 68, 69.5, 71, 73, 75, 77, 79, 81, 83, 85, 87, 87.5, 88, 88.5, 89, 89.5, 90, 90, 89.5, 89, 88.5, 88, 87.5, 87, 86.5, 86, 85.5, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 73.5, 72, 70.5, 69, 67.5, 66, 64.5, 63, 61.5, 60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 29.5, 29, 28.5, 28, 27.5, 27, 26.5, 26, 25.5, 25, 23.5, 22, 20.5, 19, 17.5, 16, 14.5, 13, 12.5, 12, 11.5, 11, 10.5, 10, 10, 10, 10, 9.5, 9.5, 9, 9, 9, 9.5, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 4, 4, 3.5, 3.5, 3.5, 3, 3, 2.5, 2, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 12, 11, 10, 9, 8, 7, 6, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	} else {
		return [0, 0, 0.5, 1, 2, 3, 4, 5.5, 7, 8.5, 10, 12, 14, 16.5, 19, 22, 25, 29, 33, 38, 43, 49, 55, 62, 69, 75, 80, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 93.5, 93.5, 93.5, 93.5, 93.5, 93.5, 93, 93.5, 93, 92.5, 92, 91.5, 91, 90.5, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 69.5, 68, 66.5, 65, 63.5, 62, 60.5, 59, 57.5, 56, 54.5, 52.5, 50.5, 48.5, 46.5, 44.5, 42.5, 40.5, 38.5, 37, 35.5, 34, 32.5, 31.5, 30.5, 29.5, 28.5, 28, 27.5, 27, 26.5, 26, 25.5, 25, 24.5, 24, 23, 22, 21, 20, 18.5, 17, 15.5, 14, 13, 12, 11.5, 11, 10.5, 10, 10, 10, 9.5, 9.5, 9.5, 9, 9, 9, 8.5, 8.5, 8.5, 8.5, 8, 8, 8, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7, 7, 7, 6.5, 6.5, 6, 6, 5.5, 5.5, 5, 5, 4.5, 4.5, 4.5, 4, 4, 4, 4, 3.5, 3.5, 3.5, 3, 3, 3, 3, 2.5, 2.5, 2.5, 2, 2, 2, 2, 1.5, 1.5, 1.5, 1.5, 1, 1, 1, 1, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}
	
}

/**
 * 모바일인지 확인한다.
 * 
 * @returns {Boolean}
 */
function checkMobile() {
	var filter = "win16|win32|win64|mac|macintel";
	
	if ( navigator.platform ) {
		if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
			return true;
		} else {
			return false;
		}
	}
}

/**
 * 문자열을 날짜로 변환한다.
 * 
 * @param strDate
 * @returns {Date}
 */
function stringToDate(strDate) {
	var date = null;
	
	try {
		date = new Date(strDate.substring(0,4), strDate.substring(4,6)-1, strDate.substring(6,8));
	} catch (e) {
		// TODO: handle exception
	}
	
	return date;
}

/**
 * 전화번호 형식을 변환한다.
 * 
 * 01012345678 -> 010-1234-5678
 * 
 * @param num
 * @returns {String}
 */
function phoneFormat(num){
	var phone = '-';
	
	try {
		phone = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
	} catch (e) {
		// TODO: handle exception
	}
    
	return phone;
} 

/**
 * 수업일을 구한다.
 * 
 * @param cls
 * @returns {String}
 */
function getClassDateLabel(cls) {
	var label = '';
	
	if('Y' == cls.monday) {
		label += '월';
	}
	if('Y' == cls.tuesday) {
		label += '화';
	}
	if('Y' == cls.wednesday) {
		label += '수';
	}
	if('Y' == cls.thursday) {
		label += '목';
	}
	if('Y' == cls.friday) {
		label += '금';
	}
	if('Y' == cls.saturday) {
		label += '토';
	}
	if('Y' == cls.sunday) {
		label += '일';
	}
	
	return label;
}

/**
 * 시간 형식을 변환한다.
 * 
 * 1155 -> 11:55
 * 
 * @param time
 * @returns {String}
 */
function getClassTimeLabel(time) {
	var label = '-';
	
	try {
		var hour = time.substring(0, 2);
		var minute = time.substring(2, 4);
		
		label = hour + ':' + minute;
	} catch (e) {
//		console.log(e);
	}
	
	return label;
};

/**
 * 상위 백분율을 구한다.
 * 
 * @param stepScore
 * @param type
 * @returns
 */
function calcRankPercentage(stepScore, type) {
	if(stepScore && type) {
		try {
			var total = distribution(type).reduce(function(a,b){return a+b});
			
			var rank = distribution(type).slice((stepScore*2)+1).reduce(function(a,b){return a+b});
			
			return ((rank * 100) / total).toFixed(2);
		} catch (e) {
			return '-';
		}
	} else {
		return '-';
	}
};

/**
 * 스텝에 따른 구간 점수를 구한다.
 * 
 * @param stepScore
 * @returns 
 */
function calcScoreRangeForStep(stepScore) {
	var range = [ 0, 119 ];

	if (stepScore < 16) {
		range = [ 0, 15 ];
	} else if (stepScore < 31) {
		range = [ 15, 30 ];
	} else if (stepScore < 46) {
		range = [ 30, 45 ];
	} else if (stepScore < 61) {
		range = [ 45, 60 ];
	} else if (stepScore < 76) {
		range = [ 60, 75 ];
	} else if (stepScore < 91) {
		range = [ 75, 90 ];
	} else if (stepScore < 106) {
		range = [ 90, 105 ];
	} else if (stepScore < 121) {
		range = [ 105, 119 ];
	}

	return range;
};

/**
 * 
 * @param arr
 * @param year
 * @param month
 */
function getChartCategories(size, year, month) {
	var categories = [];
	
	try {
		var date = new Date(year, month);

		for (var i = 1; i<=size; i++) {
			date.setMonth(date.getMonth() - 1);

			categories.push(date.getMonth() + 1 + '월');
		}
		
		categories.reverse();
	} catch (e) {
		console.log(e);
	}

	return categories;
}
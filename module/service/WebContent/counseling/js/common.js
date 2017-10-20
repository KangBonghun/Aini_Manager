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


/**
 * 달력 생성
 */
$(function(){
	var options = {
			format: 'YYYY년 MM월 DD일'
	};
	
	$('#field1').datepicker(options);
	$('#field2').datepicker(options);
	$('#field3').datepicker(options);
});

/**
 * 이벤트 초기화
 */
$(function(){
	// 이메일 도메인
	$('#selEmailDomain').change(function(){
		$('input[name=fi_email_domain]').val(this.value);
	});
	
	// 프로그램
	$('input[type=radio][name=fi_program_type]').change(function() {
		if($('#program-special').is(':checked')) {
			$('select[name=fi_program_s]').show();
			$('select[name=fi_program_g]').hide();
		} else {
			$('select[name=fi_program_s]').hide();
			$('select[name=fi_program_g]').show();
		};
    });
});



function confirmSignUpSubmit() {
	
	var companyNameEl = $('input[name=fi_company_name]');
	if(!companyNameEl.val()) {
		alert('회사명을 입력해주세요.');
		companyNameEl.focus();
		
		return false;
	}
	
	var companyAddrEl = $('input[name=fi_company_addr]');
	if(!companyAddrEl.val()) {
		alert('회사주소를 입력해주세요.');
		companyAddrEl.focus();
		
		return false;
	}
	
	var managerNameEl = $('input[name=fi_manager_name]');
	if(!managerNameEl.val()) {
		alert('담당자명을 입력해주세요.');
		managerNameEl.focus();
		
		return false;
	}
	
	var emailAddrEl = $('input[name=fi_email_addr]');
	if(!emailAddrEl.val()) {
		alert('E-mail을 입력해주세요.');
		emailAddrEl.focus();
		
		return false;
	}
	
	var emailDomainEl = $('input[name=fi_email_domain]');
	if(!emailDomainEl.val()) {
		alert('E-mail을 입력해주세요.');
		emailDomainEl.focus();
		
		return false;
	}
	
	var tel1El = $('input[name=fi_tel1]');
	if(!tel1El.val()) {
		alert('연락처를 입력해주세요.');
		tel1El.focus();
		
		return false;
	}
	
	var tel2El = $('input[name=fi_tel2]');
	if(!tel2El.val()) {
		alert('연락처를 입력해주세요.');
		tel2El.focus();
		
		return false;
	}
	
	var tel3El = $('input[name=fi_tel3]');
	if(!tel3El.val()) {
		alert('연락처를 입력해주세요.');
		tel3El.focus();
		
		return false;
	}
	
	if($('input[name=fi_days]:checked').length == 0) {
		alert('예상 교육 스케줄을 선택해주세요.');
		
		return false;
	}
	
	if(!$('#agree').is(':checked')) {
		alert('개인정보 수집 및 이용에 동의해주세요.');
		
		return false;
	}
	
	return true;
};
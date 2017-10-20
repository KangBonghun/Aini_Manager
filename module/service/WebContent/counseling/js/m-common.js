/**
 * 희망 강의일 날짜 생성
 */
$(function(){
	if($('#fi_date').length > 0) {
		var opt = {
				display:"bottom",
				lang:"kr",
				mode:"scroller",
				preset:"date",
				theme:"android-ics light",
				readonly: false,
				onSelect: function(valueText,inst){
			         $(this).trigger('blur');
			     }
			    };
				
				$('#fi_date').val('').scroller('destroy').scroller(opt);
	}
});

/**
 * 유효성 검사
 */
$(function(){
	if($('#frmRequest').length > 0) {
		$('#frmRequest').validate({
			// onfocusout:true,
			// onkeyup:false,
			focusInvalid: false,
			rules: {
			    fi_name: { required: true, },
			    fi_tel: { required: true },
			    fi_age: { required: true },
			    fi_class: { required: true },
			    fi_date: { required: true },
			},
			messages: {
			    fi_name: {
			        required: "이름을 입력해주세요.",
			    },
			    fi_tel: {
			        required: "전화번호를 입력해주세요.",
			    },
			    fi_age: {
			        required: "연령을 선택해주세요.",
			    },
			    fi_class: {
			        required: "강의과정을 선택해주세요.",
			    },
			    fi_date: {
			        required: "희망 강의 시작일을 입력해주세요.",
			    },
			},
			errorPlacement : function(error, element) {
			    if($(element).prop("name") !== "fi_agree") {
			        error.insertAfter(element);
			    }
			},
			submitHandler: function (frm) {
				var agree = $('#chk_agree').is(":checked");
				
				if(!agree) {
					alert('개인정보 수집 및 이용에 동의해주세요.');
					$('html, body').animate({
						scrollTop: $(document).height()
					}, 500);
				} else {
				    frm.submit();
				}
			},
			success: function (e) { 
			//
			},
			invalidHandler: function(form, validator) {
	             var errors = validator.numberOfInvalids();
	             if (errors) {
					$(function(){     
						//$(validator.errorList[0].element).focus();
						$('html, body').animate({
							scrollTop: $(validator.errorList[0].element).offset().top - 50
						}, 500);
					});
					// 
				//	$(validator.errorList[0].element).scrollTop(1000);
	             }
	        }
		});
	}
});
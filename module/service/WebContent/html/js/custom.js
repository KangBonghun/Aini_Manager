$(document).ready(function(){

        // web, 모바일 판독
     var filter = "win16|win32|win64|mac|macintel";
        
        // 모바일 테스트용
   //     var filter = "win16|win32|win64|mac";

        if ( navigator.platform  ) {
            if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
                var href = window.location.href;
                
                var folder = 'm_html';
                var pageFile = href.substring(href.lastIndexOf('/')+1);
                
                location.href = folder + '/' + pageFile; //모바일 페이지 경로
            } 
        }
        
    
  $('.bxslider').bxSlider({
  	mode: 'fade',
    auto: true,
  });


  $('.client').bxSlider({
  minSlides: 4,
  maxSlides: 4,
  slideWidth: 300,
  slideMargin: 10,
  ticker: true,
  speed: 10000
  });

	//tab
	
	$(".tab_content").hide(); // 클래스 "tab_content"의 내용을 감춘다.
	$(".tab_content:first").show(); // 첫번째 tab_content를 보여준다.
    $("#subMenu ul li").click(function () {
        $("#subMenu ul li").removeClass("active");
        //$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
        $(this).addClass("active");
        $(".tab_content").hide()
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn()
    });	

	//tab 끝
	
});
    
//    $("a").css ({"color":"inherit"})
//
//    $('#header ul li').on('click', function(event) {
//    $(this).parent().find('li').removeClass('on');
//    $(this).addClass('on');
//    });
//
//    $(window).on('scroll', function() {
//    $('.section').each(function() {
//        if($(window).scrollTop() >= $(this).offset().top) {
//            var id = $(this).attr('id');
//            $('#header ul li').removeClass('on');
//            $('#header ul a[href=#'+ id +']').parent().addClass('on');
//        }
//    });
//    });
//    
   
    
//    
//    var scroll = new SmoothScroll('a[href*="#"]');    

    


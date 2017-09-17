$(document).ready(function(){
    
    $("a").css({"color":"inherit"});
    



    // left 메뉴
    $(".over").hide();
    $("#leftMenu").hide();
    $( "#menu" ).click(function() {       
        $( "#leftMenu" ).toggle( "slide",1000);
         $( ".over" ).toggle();
    });
    $( "#close" ).click(function() {
        $( "#leftMenu" ).toggle( "slide",1000);         
    });   
	
    $( "#leftMenu li" ).click(function() {
        $( "#leftMenu" ).toggle( "slide",1000);         
    });  	

      $('.client').bxSlider({
      minSlides: 2,
      maxSlides: 4,
      slideWidth: 400,
      slideMargin: 20,
      ticker: true,
      speed: 10000
      });	    
//    //스와이프
//    var swiper_1 = new Swiper('.swiper-container', {
//        pagination: '.swiper-pagination',
//        slidesPerView: 2,
//        paginationClickable: true,
//        spaceBetween: 10,
//        freeMode: false,
//		pagination: false
//    });

 	var gallery = $('.gallery a').simpleLightbox();

		gallery.on('show.simplelightbox', function(){
			console.log('Requested for showing');
		})
		.on('shown.simplelightbox', function(){
			console.log('Shown');
		})
		.on('close.simplelightbox', function(){
			console.log('Requested for closing');
		})
		.on('closed.simplelightbox', function(){
			console.log('Closed');
		})
		.on('change.simplelightbox', function(){
			console.log('Requested for change');
		})
		.on('next.simplelightbox', function(){
			console.log('Requested for next');
		})
		.on('prev.simplelightbox', function(){
			console.log('Requested for prev');
		})
		.on('nextImageLoaded.simplelightbox', function(){
			console.log('Next image loaded');
		})
		.on('prevImageLoaded.simplelightbox', function(){
			console.log('Prev image loaded');
		})
		.on('changed.simplelightbox', function(){
			console.log('Image changed');
		})
		.on('nextDone.simplelightbox', function(){
			console.log('Image changed to next');
		})
		.on('prevDone.simplelightbox', function(){
			console.log('Image changed to prev');
		})
		.on('error.simplelightbox', function(e){
			console.log('No image found, go to the next/prev');
			console.log(e);
		});
    

	var tabLen = $('.tabs > li').length;

	/* 2016-05-13 수정 */
//	var swiper_2 = new Swiper('.swiper-container-2', {
//		autoHeight: true,
//        slidesPerView: 1,
//        spaceBetween: 0,
//		pagination: false,
//		loop: true,
//		onInit: function(swiper){
//			
//		},
//		onSlideChangeStart: function(swiper){
//			var idx = swiper.activeIndex-1;
//			if( idx < 0 ) { 
//				idx = tabLen - 1;
//			} else if( idx == tabLen ){
//				idx = 0;
//			}
//			$('.tabs > li').removeClass('active').eq(idx).addClass('active');
//			if( idx < tabLen ) {
//				swiper_1.slideTo(idx-1, 300);
//			}
//		}
//    });  
//
//    
//    
    
    
    
    
  });
    



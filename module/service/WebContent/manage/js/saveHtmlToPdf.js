
angular.module('htmlToPdfSave' , []) ;





angular.module('htmlToPdfSave')
.directive('pdfSaveButton' , ['$rootScope' , '$pdfStorage' , function($rootScope , $pdfStorage) {

	return {
		restrict: 'A',
		link : function(scope , element , attrs ) {
			$pdfStorage.pdfSaveButtons.push(element) ;

			scope.buttonText = "Button";
			element.on('click' , function() {
				$('html').animate({scrollTop: 0 }, 'fast', function(){
					var activePdfSaveId = attrs.pdfSaveButton ;
					var activePdfSaveName = attrs.pdfName;
					$rootScope.$broadcast('savePdfEvent' , {activePdfSaveId : activePdfSaveId, activePdfSaveName: activePdfSaveName}) ;
				});
			})
		}
	}

}]) ;


angular.module('htmlToPdfSave')
.directive('pdfSaveContent' ,  [ '$rootScope' , '$pdfStorage' , function ($rootScope , $pdfStorage) {


			return {
				link : function(scope , element , attrs ) {

					$pdfStorage.pdfSaveContents.push(element) ;

					var myListener = scope.$on('savePdfEvent' , function(event , args) {

					var currentElement = element ;
						var currentElementId = currentElement[0].getAttribute('pdf-save-content') ;

					// save a call of query selector because angular loads the element on load by default
					//	var elem = document.querySelectorAll('[pdf-save]') ;
						var elem = $pdfStorage.pdfSaveContents ;
						var broadcastedId = args.activePdfSaveId ;
						var broadcastedName = args.activePdfSaveName || 'default.pdf';



					//iterate through the element array to match the id
					for(var i = 0;i < elem.length ; i++) {

						// handle the case of elem getting length
					//	if(i == 'length' || i == 'item')
					//		continue ;

						// if the event is received by other element than for whom it what propogated for continue


						if(!matchTheIds(broadcastedId , currentElementId))
							continue ;

						var single = elem[i] ;
						var singleElement = single[0];
						//var parent = single[0] ;
						var pdfId = singleElement.getAttribute('pdf-save-content') ;

						if(matchTheIds(pdfId , broadcastedId)) {
							console.log('Id is same');
							convertToPdf(elem , pdfId);
							break ; // exit the loop once pdf gets printed
						}

					}

					function matchTheIds(elemId , broadcastedId) {
						return elemId == broadcastedId ;
					}

					function convertToPdf(theElement , id) {
						//theElement = [theElement];
						convert(theElement , id ) ;

					}


					function convert(theElement , id) {
						var quotes = $('div[pdf-save-content='+id+']')[0];
						
						var widthPx = 990;
						var heightPx = 2700;
						var widthPt = widthPx * 0.655;
						var heightPt = heightPx * 0.655;
						
				        html2canvas(quotes, {
				            onrendered: function(canvas) {
				            var pdf = new jsPDF('p', 'pt', [widthPt, heightPt], true);
				            
			                var srcImg  = canvas;
			                var sX      = 0;
			                var sY      = 0; // start 980 pixels down for every new page
			                var sWidth  = widthPx;
			                var sHeight = heightPx;
			                var dX      = 0;
			                var dY      = 0;
			                var dWidth  = widthPx;
			                var dHeight = heightPx;

			                window.onePageCanvas = document.createElement("canvas");
			                onePageCanvas.setAttribute('width', widthPx);
			                onePageCanvas.setAttribute('height', heightPx);
			                var ctx = onePageCanvas.getContext('2d');
			                // details on this usage of this function: 
			                // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
			                ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

			                // document.body.appendChild(canvas);
			                var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

			                var width         = onePageCanvas.width;
			                var height        = onePageCanvas.clientHeight;

			                //! If we're on anything other than the first page,
			                // add another page
//			                if (i > 0) {
//			                    pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
//			                }
			                //! now we declare that we're working on that page
			                pdf.setPage(i+1);
			                //! now we add content to that page!
			                pdf.addImage(canvasDataURL, 'PNG', 0, 0, (width*0.655), (height*0.655), '', 'FAST');

				            //! after the for loop is finished running, we save the pdf.
				            pdf.save(broadcastedName, function(){
				            	setTimeout(function(){
				            		if (scope.$$phase == '$apply' || scope.$$phase == '$digest') {
					            		scope.downloading = false;
									} else {
										scope.$apply(function(){
											scope.downloading = false;
										});
									}
				            	}, 1000);
				            });
				        }
				      });
						/*var element = $('[pdf-save-content='+id+']') ,
						cache_width = element.width(),
						 a4  =[ 595.28,  841.89];  // for a4 size paper width and height


						 $('body').scrollTop(0);
						 createPDF();

						//create pdf
						function createPDF(){
							getCanvas().then(function(canvas){
								console.log('resolved get canvas');
								var img = canvas.toDataURL("image/png"),
								doc = new jsPDF({
									unit:'px',
									format:'a4'
								});
								doc.addImage(img, 'JPEG', 20, 20);
								doc.save(broadcastedName);
								element.width(cache_width);

							})
						}

						// create canvas object
						function getCanvas(){
							element.width((a4[0]*1.33333) -80).css('max-width','none');
							return html2canvas(element,{
								imageTimeout:2000,
								removeContainer:true
							});
						}*/


					}



			}) ;
			// handle the memory leak
			// unbind the event
			scope.$on('$destroy', myListener);

}

}

}]) ;


angular.module('htmlToPdfSave') 
.service('$pdfStorage' , function() {
	this.pdfSaveButtons = [] ;
	this.pdfSaveContents = [] ;
})
.service('pdfSaveConfig' , function() {
	this.pdfName = "default.pdf";
})


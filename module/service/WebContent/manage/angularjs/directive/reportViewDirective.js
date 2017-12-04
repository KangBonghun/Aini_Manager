ainiApp.directive('reportViewDirective', function() {
    return {
        replace: true,
        templateUrl: 'angularjs/template/reportView.html',
        controllerAs: 'vm',
        controller: function($rootScope, $scope, $element, $attrs, $timeout, RemoteHttp) {
        	
        	var vm = this;
        	
        	vm.reportData = {};
        	
        	$scope.initReport = function() {
        		vm.reportData = null;
        	};
        	
        	/**
        	 * 팝업
        	 */
        	$scope.onPopupReportView = function(visible, student) {
        		if(checkMobile()) {
        			if(visible) {
//		    		visibleLoader(true);
        				
        				if(student) {
        					$scope.loadReport(student.userId, student.classId, student.year, student.month);
        				}
        				
        				$('#report_view_box').animate({top:0}, 300, function(){
//		    			visibleLoader(false);
        				});
        				
        				$('html, body').css({'overflow': 'hidden', 'height': '100%'});
        				
        				$(window).not('#report_view_box').on('scroll touchmove mousewheel', function(event) {
        					event.preventDefault();     event.stopPropagation();     return false;
        				});
        			} else {
        				vm.classInfo = {};
        				
        				$('#report_view_box').animate({top:'100%'}, 300, function(){
        					$('#report_detail_box').scrollTop(0);
        					
        					vm.reportData = null;
        				});
        				
        				$('html, body').css({'overflow': 'auto', 'height': 'auto'});
        				$(window).not('#report_view_box').off('scroll touchmove mousewheel');
        			}
        		} else {
        			var param = '';
        			param += 'u=' +  student.userId;
        			param += '&c=' +  student.classId;
        			param += '&d=' +  student.year + student.month;
        			
        			window.open('/manage/report?' + param, '_blank');
        		}
		    };
        	
        	
        	/**
        	 * 보고서 조회
        	 */
        	$scope.loadReport = function(userId, classId, year, month) {
        		visibleLoader(true);
        		
        		var param = {
        			userId : userId,
//        			userId : 's1@aini.com',
        			classId : classId,
        			year : year,
        			month : month,
        		};
        		
        		RemoteHttp.controller('/manage').url('/get-report-detail-info').param(param).methods('post').request().then(function(data){
        			if(data) {
        				
        				$('#report_detail_box').find('.rpt-wrapper').show();
        				
        				data.classInfo = angular.extend(data.classInfo, {
            				startDate : $scope.getDateToLabel(data.classInfo.startDate, 'yyyy-MM-dd'),
            				endDate : $scope.getDateToLabel(data.classInfo.endDate, 'yyyy-MM-dd'),
            				classDate : $scope.getClassDateLabel(data.classInfo) + ' ' + $scope.getClassTimeLabel(data.classInfo.startTime) + ' - ' + $scope.getClassTimeLabel(data.classInfo.endTime)
            			});
        				
        				vm.reportData = data;
        				
        				vm.makeCharts();
        			} else {
        				vm.reportData = null;
        				
        				$('#report_detail_box').find('.rpt-wrapper').hide();
        			}
        			
        			visibleLoader(false);
        		});
        		
//        		var timeoutPromise = $timeout(function(){
//        			vm.reportData.summary = {};
//        			vm.reportData.summary.score = 88;
//        			vm.reportData.summary.rank = 10.25;
//        			vm.reportData.summary.step = 5;
//        			
//        			vm.reportData.class = {};
//        			vm.reportData.class.name = '중국어초급반';
//        			vm.reportData.class.time = '월수금 7:40 - 8:40';
//        			vm.reportData.class.startDate = '2017-05-12';
//        			vm.reportData.class.endDate = '2017-07-20';
//        			vm.reportData.class.day = '11';
//        			vm.reportData.class.manager = '가나다';
//        			vm.reportData.class.teacher = '라마바';
//        			vm.reportData.class.email = 'aini@aini.co.kr';
//        			
//        			vm.reportData.goal = {};
//        			vm.reportData.goal.goal = '동해물과백두산이마르고닳도록하느님이보우하사우리나라만세';
//        			
//        			vm.reportData.step = {};
//        			vm.reportData.step.step = 8;
//        			vm.reportData.step.score = 20;
//        			vm.reportData.step.monthly = [2, 2, 3, 3, 4, 8];
//        			
//        			vm.reportData.score = {};
//        			vm.reportData.score.totalScore = 88;
//        			vm.reportData.score.pronunciation = 8;
//        			vm.reportData.score.vocabulary = 15;
//        			vm.reportData.score.grammar = 20;
//        			vm.reportData.score.intelligibility = 25;
//        			vm.reportData.score.monthly = {
//        					pronunciation: [10, 10, 10, 10, 10, 10],
//        					vocabulary: [10, 10, 10, 10, 10, 10],
//        					grammar: [25, 10, 10, 10, 10, 10],
//        					intelligibility: [10, 10, 10, 10, 10, 10],
//        			};
//        			
//        			vm.reportData.comment = {};
//        			vm.reportData.comment.strength = '이기상과이맘으로충성을다하여괴로우나즐거우나나라사랑하세';
//        			vm.reportData.comment.weakness = '남산위에저소나무철갑을두른듯바람서리불변함은우리기상일세';
//        			
//        			
//        			vm.reportData.attendance = {};
//        			vm.reportData.attendance.monthly = [2, 2, 3, 3, 4, 100];
//        			
//        			
//        			
//        			
//        			
//        			
//        			vm.makeStepChart(vm.reportData.step.step);
//        			vm.makeStepScoreChart(5);
//        			vm.makeMonthlyStepChart(vm.reportData.step.monthly);
//        			vm.makeScoreChart(vm.reportData.score);
//        			vm.makeMonthlyScoreChart(vm.reportData.score.monthly);
//        			vm.makeAttendanceRateChart(vm.reportData.attendance.monthly);
//        		}, 300);
        		
//        		timeoutPromise.then(function(){
//        			visibleLoader(false);      
//        			$timeout.cancel(timeoutPromise);
//        		});
        	};
        	
        	vm.makeCharts = function() {
        		vm.makeStepChart(vm.reportData.reportInfo.step);
    			vm.makeStepScoreChart(vm.reportData.reportInfo.stepScore, vm.reportData.classInfo.language);
    			vm.makeMonthlyStepChart(vm.reportData.monthlyStep, vm.reportData.reportInfo.year, vm.reportData.reportInfo.month);
    			vm.makeScoreChart(vm.reportData.reportInfo);
    			vm.makeMonthlyScoreChart(vm.reportData.monthlyScore, vm.reportData.reportInfo.year, vm.reportData.reportInfo.month);
    			vm.makeAttendanceRateChart(vm.reportData.monthlyAttendance, vm.reportData.reportInfo.year, vm.reportData.reportInfo.month);
        	};
        	
        	/**
        	 * 스텝 차트 생성
        	 */
        	vm.makeStepChart = function(step) {
        		if (!vm.stepChart) {
        			vm.stepChart = c3.generate({
        				bindto : '#stepChart',
        				size : {
        					height : 150,
        				},
        				padding : {
        					top : 10,
        					right : 0,
        					bottom : 0,
        					left : 30,
        				},
        				grid : {
        					x : {
        						show : true
        					},
        					y : {
        						show : true
        					}
        				},
        				axis : {
        					y : {
        						max : 120,
        						padding : {
        							top : 0,
        							bottom : 0
        						},
        						tick : {
        							count : 9,
        						},
        					},
        					x : {
        						padding : {
        							left : 0.6,
        							right : 0.6
        						},
        						tick : {
        							format : function(x) {
        								return x > 7 ? '' : 'S' + (x + 1);
        							}
        						}
        					}
        				},
        				tooltip : {
        					show : false
        				},
        				legend : {
        					show : false
        				},
        				data : {
        					json : {
        						STEP : [ 0, 15, 30, 45, 60, 75, 90, 105, 120 ],
        					},
        					colors : {
        						STEP : '#E3E3E3',
        					},
        				},
        				onrendered : function() {
        					rendererFunc();
        				}
        			});
        		}

        		rendererFunc();

        		function rendererFunc() {
        			// 라벨
        			$('#stepChart .tick text').css({
        				'font-size': '10px',
        				'font-weight': 'bold',
        				'fill': '#aaa'
        			});
        			
        			// 축
        			$('#stepChart .c3-axis path').css('fill','none');
        			
        			// 격자
        			$('#stepChart .c3-grid line').css({
        				'opacity': '0.5',
        				'stroke': '#e3e3e3',
        				'stroke-dasharray': 'none',
        			});
        			
        			// 포인터
        			$('#stepChart .c3-circle').removeAttr('style').css({
        				'r': 4,
        				'fill': 'rgb(227, 227, 227)',
        				'opacity': 1
        				});
        			
        			$('#stepChart .region').remove();
        			$('#stepChart .region-line').remove();
        			$('.stepChartTooltip').remove();
        			
        			if (step) {
        				// 포인터 생성
        				var lPoint = d3.select('#stepChart .c3-circle-' + (step - 1) + '');
        				var lpX = parseFloat(lPoint.attr('cx'));
        				var lpY = parseFloat(lPoint.attr('cy'));
        				var lpH = parseFloat(lPoint.attr('height'));
        				var lpW = parseFloat(lPoint.attr('width'));

        				var rPoint = d3.select('#stepChart .c3-circle-' + step + '');
        				var rpX = parseFloat(rPoint.attr('cx'));
        				var rpY = parseFloat(rPoint.attr('cy'));
        				var rpH = parseFloat(rPoint.attr('height'));
        				var rpW = parseFloat(rPoint.attr('width'));
        		
        				var pointerStyle = {
        						'opacity': 1,
        					    'stroke-width': '3px',
        					    'stroke': '#FF635C',
        					    'r': 5,
        					    'fill': '#fff',
        					};
        				lPoint.attr('class', lPoint.attr('class') + ' pointer').style(pointerStyle);
        				rPoint.attr('class', rPoint.attr('class') + ' pointer').style(pointerStyle);
        				
        				// 사각형 영역 생성
        				var rect = d3.select('#stepChart .c3-event-rect-' + (step - 1) + '');
        				var rectX = parseFloat(rect.attr('x'));
        				var rectY = parseFloat(rect.attr('y'));
        				var rectH = parseFloat(rect.attr('height'));
        				var rectW = parseFloat(rect.attr('width'));
        				d3.select('#stepChart .c3-chart .c3-event-rects.c3-event-rects-single').append('rect')
        					.attr('x', rectX + (rectW / 2)).attr('y',rectY)
        					.attr('height', rectH)
        					.attr('width', rectW)
        					.attr('class', 'region')
        					.style({
        						'fill': '#33C8E9',
        					    'stroke': '#33C8E9',
        					    'stroke-width': '1px',
        					    'fill-opacity': '0.2',
        					});
        				
        				
        				// 선 생성
        				d3.select('#stepChart .c3-shapes.c3-shapes-STEP.c3-lines.c3-lines-STEP').append('path')
        					.attr('d','M' + lpX + ',' + lpY + 'L' + rpX + ',' + rpY)
        					.attr('class','region-line')
        					.style('stroke', '#FF635C');

        				
        				// 툴팁 생성
        				var tooltipX = (step > 6 ? (lpX - 50) : (rpX + 50));
        				var tooltipY = (step > 6 ? (lpY) : (rpY));
        				$('#stepChart').append('<div class="stepChartTooltip chart-tooltip" style="position: absolute;pointer-events: none;left: '+ tooltipX+ 'px;'+ 'top:'+ tooltipY+ 'px;'+ 'background-color: #FF635C;border-radius: 15px;padding: 5px 10px;color: white;font-size: 13px;text-align: center;"><span>나의스텝</span></div>');
        			}

        			$('#stepChart .c3-chart-line.c3-target.c3-target-STEP').parents('.c3-chart').attr('clip-path', null);
        		}
        	};
        	
        	
        	/**
        	 * 스텝 점수 차트 생성
        	 */
        	vm.makeStepScoreChart = function(data, language) {
        		if (!vm.stepScoreChart) {
        			vm.stepScoreChart = c3
        					.generate({
        						bindto : '#stepScoreChart',
        						size : {
        							height : 150,
        						},
        						padding : {
        							top : 10,
        							right : 10,
        							bottom : 0,
        							left : 10,
        						},
        						axis : {
        							y : {
        								max : 100,
        								show : false,
        								padding : {
        									top : 0,
        									bottom : 0
        								},
        								tick : {
        									count : 8,
        								},
        							},
        							x : {
        								show : true,
        								padding : {
        									left : 0,
        									right : 0
        								},
        								tick : {
        									count : 9,
        									format : function(x) {
        										return (x / 2).toFixed(0);
        									}
        								},
        							}
        						},
        						point : {
        							show : false
        						},
        						grid : {
        							x : {
        								show : false
        							},
        							y : {
        								show : true
        							}
        						},
        						legend : {
        							show : false
        						},
        						tooltip : {
        							show : false
        						},
        						data : {
        							json : {
        								STEP : [ 0, 0, 0, 0, 0, 0 ],
        							},
        							types : {
        								STEP : 'line',
        							},
        							colors : {
        								STEP : '#33C8E9',
        							},
        						},
        						data : {
        							json : {
        								data1 : distribution(''),
        								data2 : distribution(''),
        							},
        							types : {
        								data1 : 'area-spline',
        								data2 : 'area-spline',
        							},
        							colors : {
        								data1 : '#E3E3E3',
        								data2 : '#33C8E9',
        							},
        						},
        						oninit : function() {
        							$('#stepScoreChart .c3-chart-lines').after($('#stepScoreChart .c3-event-rects'));

        							d3.select('#stepScoreChart defs').append('clipPath').attr('id', 'region').append('rect');
        							d3.select('#stepScoreChart .c3-chart-line.c3-target.c3-target-data2').attr('clip-path', 'url(#region)');
        						},
        						onrendered : function() {
        							rendererFunc();
        						}
        					});
        		}

        		rendererFunc();

        		function rendererFunc() {
        			// 라벨
        			$('#stepScoreChart .tick text').css({
        				'font-size': '10px',
        				'font-weight': 'bold',
        				'fill': '#aaa'
        			});
        			
        			// 축
        			$('#stepScoreChart .c3-axis path').css('fill','none');
        			
        			// 격자
        			$('#stepScoreChart .c3-grid line').css({
        				'opacity': '0.5',
        				'stroke': '#e3e3e3',
        				'stroke-dasharray': 'none',
        			});
        			
        			// 포커스 영역 삭제
        			$('#stepScoreChart .score-region').remove();
        			$('#stepScoreChart .score-line').remove();
        			
        			$('.stepScoreChartTooltip').remove();
        			
        			if (data) {
        				// 점수에 해당하는 영역
        				var targetRect = d3.select('#stepScoreChart .c3-event-rect-' + data * 2);
        				var targetH = parseFloat(targetRect.attr('height'));
        				var targetW = parseFloat(targetRect.attr('width'));
        				var targetX = parseFloat(targetRect.attr('x'));
        				var targetY = parseFloat(targetRect.attr('y'));

        				// 레벨 범위에 해당하는 영역
        				var range = calcScoreRangeForStep(data);

        				var lsRect = d3.select('#stepScoreChart .c3-event-rect-' + range[0] * 2);
        				var lsH = parseFloat(lsRect.attr('height'));
        				var lsW = parseFloat(lsRect.attr('width'));
        				var lsX = parseFloat(lsRect.attr('x'));
        				var lsY = parseFloat(lsRect.attr('y'));

        				var leRect = d3.select('#stepScoreChart .c3-event-rect-' + range[1] * 2);
        				var leH = parseFloat(leRect.attr('height'));
        				var leW = parseFloat(leRect.attr('width'));
        				var leX = parseFloat(leRect.attr('x'));
        				var leY = parseFloat(leRect.attr('y'));

        				var lineX = targetX + (targetW / 2);
        				var rectX = lsX + (lsW / 2);
        				var rectY = lsY;
        				var rectW = (leX + (leW / 2)) - (lsX + (lsW / 2));
        				var rectH = lsH;

        				// 사각형 테두리 생성
        				d3.select('#stepScoreChart .c3-chart .c3-event-rects.c3-event-rects-single').append('rect')
        					.attr('x', rectX)
        					.attr('y', rectY)
        					.attr('height', rectH)
        					.attr('width', rectW)
        					.attr('class','score-region')
        					.style({
        						'stroke': '#33C8E9',
        					    'stroke-width': 1,
        					    'fill-opacity':0,
        					});
        				
        				// 라인 생성
        				d3.select('#stepScoreChart g.c3-chart-texts').append('line')
        					.attr('x1', lineX)
        					.attr('x2', lineX)
        					.attr('y1', 0)
        					.attr('y2',targetH)
        					.attr('class', 'score-line')
        					.style({
        						'visibility': 'visible',
        						'stroke': '#FF635C',
        					});

        				// 활성화 영역 위치 이동
        				d3.select('#region rect')
        				.attr('x', rectX)
        				.attr('y', rectY)
        				.attr('width', rectW)
        				.attr('height', rectH);

        				// 툴팁 생성
        				var tooltipOffset = 20;
        				var tooltipWidth = 90;
        				var tooltipX = ($('#stepScoreChart').width() < lineX+ tooltipOffset + tooltipWidth ? lineX - tooltipWidth: lineX + tooltipOffset).toFixed(2);
        				var rankPercent = calcRankPercentage(data, language);
        				$('#stepScoreChart').append('<div class="stepScoreChartTooltip chart-tooltip" style="position: absolute;pointer-events: none;top: 20%;left: '+ tooltipX+ 'px;background-color: #FF635C;border-radius: 15px;padding: 5px 10px;color: white;font-size: 13px;text-align: center;"><span>상위 '+ rankPercent + '%</span></div>');
        			}
        		}
        	};	
        	
        	/**
        	 * 월간 스텝 차트 생성
        	 */
        	vm.makeMonthlyStepChart = function(data, year, month) {
        		if (!vm.monthlyStepChart) {
        			vm.monthlyStepChart = c3.generate({
        				bindto : '#monthlyStepChart',
        				size : {
        					height : 150,
        				},
        				padding : {
        					top : 20,
        					right : 0,
        					bottom : 0,
        					left : 30,
        				},
        				axis : {
        					y : {
        						padding : {
        							top : 0,
        							bottom : 0
        						},
        						tick : {
        							count : 5,
        							format : function(x) {
        								return x.toFixed(0);
        							}
        						},
        					},
        					x : {
        						padding : {
        							left : 0,
        							right : 0
        						},
        						type : 'category',
        						categories : (function() {
        							return getChartCategories(data && data.length, year, month);
        						})(),
        					}
        				},
        				point : {
        					r : 4
        				},
        				grid : {
        					x : {
        						show : false
        					},
        					y : {
        						show : true
        					}
        				},
        				legend : {
        					show : false
        				},
        				data : {
        					json : {
        						스텝점수 : [ 0, 0, 0, 0, 0, 0 ],
        					},
        					types : {
        						스텝점수 : 'line',
        					},
        					colors : {
        						스텝점수 : '#33C8E9',
        					},
        					labels : {
        						format : function(v) {
        							return v + '점';
        						}
        					},
        				},
        				onrendered : function() {
        					// 라벨
        					$('#monthlyStepChart .tick text').css({
        						'font-size': '10px',
        						'font-weight': 'bold',
        						'fill': '#aaa'
        					});
        					
        					// 축
        					$('#monthlyStepChart .c3-axis path').css('fill','none');
        					
        					// 격자
        					$('#monthlyStepChart .c3-grid line').css({
        						'opacity': '0.5',
        						'stroke': '#e3e3e3',
        						'stroke-dasharray': 'none',
        					});
        					
        					// 라인
        					$('#monthlyStepChart .c3-chart-line').css('fill', 'none');
        					
        					// 포인트 라벨 크기
        					$('#monthlyStepChart .c3-chart-texts').css({
        						'font-size': '10px',
        						'transform': 'translateY(-5px)'
        						});
        					
        					
        					d3.select('#monthlyStepChart .c3-circle-5').style({
        						'opacity': 1,
        					    'stroke-width': '3px',
        					    'stroke': '#33C8E9',
        					    'r': 6,
        					    'fill': '#fff',
        						});

        					$('#monthlyStepChart .c3-chart-line').parents('.c3-chart').attr('clip-path', null);
        				}
        			});
        		}

        		if (data) {
        			vm.monthlyStepChart.load({
        				json : {
        					스텝점수 : data,
        				},
        			});
        		}
        	};
        	
        	/**
        	 * 이번달 점수 차트 생성
        	 */
        	vm.makeScoreChart = function(data) {
        		var scoreTypes = [ 'pronunciation', 'vocabulary', 'grammar','intelligibility' ];

        		scoreTypes.forEach(function(type) {
        			var chart;
        			var chartBindTo;
        			var title;
        			var color;

        			switch (type) {
        			case 'pronunciation':
        				chart = vm.pronunciationChart;
        				chartBindTo = '#pronunciationChart';
        				title = '발음';
        				color = '#FF7F67';
        				break;
        			case 'vocabulary':
        				chart = vm.vocabularyChart;
        				chartBindTo = '#vocabularyChart';
        				title = '어휘';
        				color = '#9ACE62';
        				break;
        			case 'grammar':
        				chart = vm.grammarChart;
        				chartBindTo = '#grammarChart';
        				title = '문법';
        				color = '#33C8E9';
        				break;
        			case 'intelligibility':
        				chart = vm.intelligibilityChart;
        				chartBindTo = '#intelligibilityChart';
        				title = '이해도';
        				color = '#AB93EB';
        				break;
        			}

        			if (!chart) {
        				chart = c3.generate({
        					bindto : chartBindTo,
        					size : {
        						height : 140,
        						width : 140,
        					},
        					padding : {
        						top : 0,
        						right : 0,
        						bottom : 0,
        						left : 0,
        					},
        					data : {
        						json : {
        							data1 : [],
        							data2 : [],
        						},
        						type : 'donut',
        						colors : {
        							data1 : '#eeeeee',
        							data2 : color,
        						},
        					},
        					donut : {
        						// title: '발음',
        						width : 13,
        						label : {
        							show : false,
        						}
        					},
        					legend : {
        						show : false
        					},
        					tooltip : {
        						show : false
        					},
        					oninit : function() {
        					},
        				});
        			}

        			if (data) {
        				chart.load({
        					json : {
        						data1 : [25-data[type]],
        	                    data2 : [data[type]],
        					},
        				});
        			}
        		});
        	};
        	
        	/**
        	 * 월간 점수 차트 생성
        	 */
        	vm.makeMonthlyScoreChart = function(data, year, month) {
        		if (!vm.monthlyScoreChart) {
        			vm.monthlyScoreChart = c3.generate({
        				bindto : '#monthlyScoreChart',
        				size : {
        					height : 150,
        				},
        				axis : {
        					y : {
        						max : 100,
        						min : 0,
        						padding : {
        							top : 0,
        							bottom : 0
        						},
        						tick : {
        							count : 6,
        						},
        					},
        					x : {
        						padding : {
        							left : 0,
        							right : 0
        						},
        						type : 'category',
        						categories : (function() {
        							var size = 0;
        							
        							for(key in data) {
        								var length = data[key].length;
        								if(length > size) {
        									size = length;
        								}
        							}
        							
        							return getChartCategories(size, year, month);
        						})(),
        					}
        				},
        				bar : {
        					width : {
        						ratio : 0.6
        					}
        				},
        				padding : {
        					top : 10,
        					right : 0,
        					bottom : 0,
        					left : 30,
        				},
        				grid : {
        					x : {
        						show : false
        					},
        					y : {
        						show : true
        					}
        				},
        				legend : {
        					show : false
        				},
        				data : {
        					json : {},
        					type : 'bar',
        					groups: [
					            ['발음', '어휘', '문법', '이해도']
					        ],
        					colors : {
        						발음 : '#FF7F67',
        						어휘 : '#9ACE62',
        						문법 : '#33C8E9',
        						이해도 : '#AB93EB',
        					},
//        					labels : {
//        						format : function(v) {
//        							return v;
//        						}
//        					},
        					labels : false,
        				},
        				onrendered : function() {
        					// 라벨
        					$('#monthlyScoreChart .tick text').css({
        						'font-size': '10px',
        						'font-weight': 'bold',
        						'fill': '#aaa'
        					});
        					
        					// 축
        					$('#monthlyScoreChart .c3-axis path').css('fill','none');
        					
        					// 격자
        					$('#monthlyScoreChart .c3-grid line').css({
        						'opacity': '0.5',
        						'stroke': '#e3e3e3',
        						'stroke-dasharray': 'none',
        					});
        					
        					// 포인트 라벨 크기
        					$('#monthlyScoreChart .c3-chart-texts').css({
        						'font-size': '10px',
        						'transform': 'translateY(-5px)'
        						});
        					
        					$('#monthlyScoreChart .c3-chart-line').parents('.c3-chart').attr('clip-path', null);
        				}
        			});
        		}

        		if (data) {
        			vm.monthlyScoreChart.load({
        				json : {
        					발음 : data['pronunciation'],
        					어휘 : data['vocabulary'],
        					문법 : data['grammar'],
        					이해도 : data['intelligibility'],
        				},
        			});
        		}
        	};
        	
        	/**
        	 * 월간 출석율 차트 생성
        	 */
        	vm.makeAttendanceRateChart = function(data, year, month) {
        		if (!vm.attendanceRateChart) {
        			vm.attendanceRateChart = c3
        					.generate({
        						bindto : '#attendanceRateChart',
        						size : {
        							height : 150,
        						},
        						padding : {
        							top : 20,
        							right : 0,
        							bottom : 0,
        							left : 30,
        						},
        						axis : {
        							y : {
        								max : 100,
        								min : 0,
        								padding : {
        									top : 0,
        									bottom : 0
        								},
        								tick : {
        									count : 5,
        									format : function(d) {
        										return d.toFixed(0);
        									}
        								},
        							},
        							x : {
        								padding : {
        									left : 0,
        									right : 0
        								},
        								type : 'category',
        								categories : (function() {
        									return getChartCategories(data && data.length, year, month);
        								})(),
        							}
        						},
        						point : {
        							r : 4
        						},
        						grid : {
        							x : {
        								show : false
        							},
        							y : {
        								show : true
        							}
        						},
        						legend : {
        							show : false
        						},
        						data : {
        							json : {},
        							types : {
        								출석율 : 'line',
        							},
        							colors : {
        								출석율 : '#FF6B6B',
        							},
        							labels : {
        								format : function(v) {
        									return v + '%';
        								}
        							},
        						},
        						tooltip : {
        							format : {
        								value : function(value, ratio, id) {
        									return value + ' %';
        								}
        							}
        						},
        						onrendered : function() {
        							// 라벨
        							$('#attendanceRateChart .tick text').css({
        								'font-size': '10px',
        								'font-weight': 'bold',
        								'fill': '#aaa'
        							});
        							
        							// 축
        							$('#attendanceRateChart .c3-axis path').css('fill','none');
        							
        							// 격자
        							$('#attendanceRateChart .c3-grid line').css({
        								'opacity': '0.5',
        								'stroke': '#e3e3e3',
        								'stroke-dasharray': 'none',
        							});
        							
        							// 라인
        							$('#attendanceRateChart .c3-chart-line').css('fill', 'none');
        							
        							// 포인트 라벨 크기
        							$('#attendanceRateChart .c3-chart-texts').css({
        								'font-size': '10px',
        								'transform': 'translateY(-5px)'
        								});
        							
        							d3.select('#attendanceRateChart .c3-circle-5').style({
        								'opacity': 1,
        							    'stroke-width': '3px',
        							    'stroke': '#FF6B6B',
        							    'r': 6,
        							    'fill': '#fff',
        								});
        							
        							$('#attendanceRateChart .c3-chart-line.c3-target.c3-target-출석율').parents('.c3-chart').attr('clip-path', null);
        						}
        					});
        		}

        		if (data) {
        			vm.attendanceRateChart.load({
        				json : {
        					출석율 : data,
        				},
        			});
        		}
        	};
        	
        	$scope.$on('$destroy', function() {
        		vm.stepChart && vm.stepChart.destroy && vm.stepChart.destroy();
        		vm.stepScoreChart && vm.stepScoreChart.destroy && vm.stepScoreChart.destroy();
        		vm.monthlyStepChart && vm.monthlyStepChart.destroy && vm.monthlyStepChart.destroy();
//        		vm.pronunciationChart.destroy ? vm.pronunciationChart.destroy() : vm.pronunciationChart = null;
//        		vm.vocabularyChart.destroy ? vm.vocabularyChart.destroy() : vm.vocabularyChart = null;
//        		vm.grammarChart.destroy ? vm.grammarChart.destroy() : vm.grammarChart = null;
//        		vm.intelligibilityChart.destroy ? vm.intelligibilityChart.destroy() : vm.intelligibilityChart = null;
        		vm.monthlyScoreChart && vm.monthlyScoreChart.destroy && vm.monthlyScoreChart.destroy();
        		vm.attendanceRateChart &&  vm.attendanceRateChart.destroy && vm.attendanceRateChart.destroy();
    		});
        }
    };
});

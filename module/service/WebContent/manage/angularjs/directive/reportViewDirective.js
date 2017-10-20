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
		    		});
		    		
		    		$('html, body').css({'overflow': 'auto', 'height': 'auto'});
		    		$(window).not('#report_view_box').off('scroll touchmove mousewheel');
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
    			vm.makeStepScoreChart(vm.reportData.reportInfo.stepScore);
    			vm.makeMonthlyStepChart(vm.reportData.monthlyStep);
    			vm.makeScoreChart(vm.reportData.reportInfo);
    			vm.makeMonthlyScoreChart(vm.reportData.monthlyScore);
    			vm.makeAttendanceRateChart(vm.reportData.monthlyAttendance);
        	};
        	
        	/**
        	 * 스텝 차트 생성
        	 */
        	vm.makeStepChart = function(step) {
        		if(!vm.stepChart) {
        			vm.stepChart = c3.generate({
        	            bindto: '#stepChart',
        	            size: {
        	                height: 150,
        	            },
        	            padding: {
        	                top: 10,
        	                right: 0,
        	                bottom: 0,
        	                left: 30,
        	            },
        				grid: {
        			        x: {
        			            show: true
        			        },
        			        y: {
        			            show: true
        			        }
        			    },
        			    axis: {
        			    	y: {
        			    		max: 120,
        			    		padding: {top:0, bottom:0},
        			    		tick: {
        			    			count:9,
        			    		},
        			    	},
        			    	x: {
        			    		show:false,
        			    		padding: {left:0.6, right:0.6},
        			    	}
        			    },
        			    tooltip: {
        			        show: false
        			    },
        			    legend: {
        			        show: false
        			    },
        			    data: {
        					json: {
        						STEP: [0, 15, 30, 45, 60, 75, 90, 105, 120],
        					},
        			    	colors: {
        			    		STEP: '#aaaaaa',
        			    	},
        	            },
        			    onrendered: function () {
        			    	rendererFunc();
        			    }
        	        });
        		}
        		
        		rendererFunc();
        		
        		function rendererFunc() {
        			var step = vm.reportData.reportInfo.step;
        			
        			if(step) {
        				$('#stepChart .pointer').removeClass('pointer');
        				$('#stepChart .c3-event-rect.region').remove();
        				
				        $('#stepChart .c3-circle-'+step+'').addClass('pointer');
				        $('#stepChart .c3-circle-'+(step-1)+'').addClass('pointer');
				        
				        var clone = $('#stepChart .c3-event-rect-'+(step-1)+'').clone();
				        clone.addClass('region');
				        clone.appendTo('#stepChart .c3-event-rects.c3-event-rects-single');
				        
				        var rect = d3.select('#stepChart .c3-event-rect.region');
				        
				        var height = parseFloat(rect.attr('height'));
				        var width = parseFloat(rect.attr('width'));
				        var x = parseFloat(rect.attr('x'));
				        
				        rect.attr('y', 1).attr('height', height-2).attr('x', parseInt(x + (width/2)));
			    	}
        			
        			$('#stepChart .c3-chart-line.c3-target.c3-target-STEP').parents('.c3-chart').attr('clip-path',null);
        		}
        	};
        	
        	
        	/**
        	 * 스텝 점수 차트 생성
        	 */
        	vm.makeStepScoreChart = function(data) {
        		if(!vm.stepScoreChart) {
        			vm.stepScoreChart = c3.generate({
        				bindto: '#stepScoreChart',
        				size: {
        					height: 150,
        				},
        				padding: {
        					top: 10,
        					right: 0,
        					bottom: 0,
        					left: 0,
        				},
        				axis: {
        					y: {
        						max:100,
        						show:false,
        						padding: {top:0, bottom:0},
        						tick: {
        							count:8,
        						},
        					},
        					x: {
        						show:false,
        						padding: {left:0, right:0},
        					}
        				},
        				point: {
        					show: false
        				},
        				grid: {
        					x: {
        						show: false
        					},
        					y: {
        						show: true
        					}
        				},
        				legend: {
        					show: false
        				},
        				tooltip: {
        					show: false
        				},
        				data: {
        					json: {
        						STEP: [0, 0, 0, 0, 0, 0],
        					},
        					types: {
        						STEP: 'line',
        					},
        					colors: {
        						STEP: '#B855FC',
        					},
        				},
        				data: {
        					json: {
        						data1 : distribution(vm.reportData.classInfo.language),
        			          	data2 : distribution(vm.reportData.classInfo.language),
        					},
        					types: {
					        	  data1: 'area-spline',
					        	  data2: 'area-spline',
					          },
					          colors: {
					        	  data1: '#DFDFE3',
					        	  data2: '#3D8BF7',
					          },
//        					columns: [
//        					          ['data1', 0, 10, 5, 10, 25, 40, 60, 70, 50, 30, 25, 10, 5, 1, 6, 3, 0, 0, 0],
//        					          ['data2', 0, 10, 5, 10, 25, 40, 60, 70, 50, 30, 25, 10, 5, 1, 6, 3, 0, 0, 0],
//        					          ],
//        					          types: {
//        					        	  data1: 'area-spline',
//        					        	  data2: 'area-spline',
//        					          },
//        					          colors: {
//        					        	  data1: '#DFDFE3',
//        					        	  data2: '#5ea4ff',
//        					          },
        				},
        				oninit: function() {
        					$('#stepScoreChart .c3-chart-lines').after($('#stepScoreChart .c3-event-rects'));
        					
        					d3.select('#stepScoreChart defs').append('clipPath').attr('id', 'region').append('rect');
        					d3.select('#stepScoreChart .c3-chart-line.c3-target.c3-target-data2').attr('clip-path','url(#region)');
        				},
        				onrendered: function () {
        					rendererFunc();
        				}
        			});	
        		}
        		
        		rendererFunc();
        		
        		function rendererFunc() {
        			var data = vm.reportData.reportInfo.stepScore;
        			
        			if(data) {
        				$('#stepScoreChart .score-region').remove();
        				
        				var rectClone = $('#stepScoreChart .c3-event-rect-' + data*2 + '').clone();
        				rectClone.addClass('score-region');
        				rectClone.appendTo('#stepScoreChart .c3-chart .c3-event-rects.c3-event-rects-single');
        				
        				var rect = d3.select('#stepScoreChart .c3-event-rect.score-region');
        				
        				var height = parseFloat(rect.attr('height'));
        				var width = parseFloat(rect.attr('width'));
        				var x = parseFloat(rect.attr('x'));
        				var y = parseFloat(rect.attr('y'));
        				
        				width = 50;
        				x = x - 25;
        				
        				d3.select('#region rect').attr('x',x).attr('y',y).attr('width',width).attr('height',height);
        				rect.attr('width', width).attr('x', x);
        				
        				
        				$('#stepScoreChart .c3-xgrid-focus-clone').remove();
        				
        				var clone = $('#stepScoreChart line.c3-xgrid-focus').clone();
        				clone.removeClass('c3-xgrid-focus').addClass('c3-xgrid-focus-clone');
        				clone.appendTo('g.c3-chart-texts');
        				
        				d3.select('#stepScoreChart line.c3-xgrid-focus-clone').attr('x1',x+25).attr('x2',x+25).style('visibility','visible').style('stroke','rgba(255, 84, 98, 1)');
        				
        				
        				
        				
        				var tooltipX = ($('#stepScoreChart').width() < x+25+10+90 ? x+25-10-90 : x+25+10).toFixed(2); 
        				var rankPercent = $scope.calcRankPercentage(vm.reportData.reportInfo.stepScore, vm.reportData.classInfo.language);
        				
        				$('.stepScoreChartTooltip').remove();
        				$('#stepScoreChart').append('<div class="stepScoreChartTooltip" style="position: absolute;pointer-events: none;top: 20%;left: ' + tooltipX + 'px;background-color: #FF3646;border-radius: 15px;padding: 5px 10px;color: white;font-size: 13px;text-align: center;"><span>상위 ' + rankPercent + '%</span></div>');
        			}
        		}
        	};	
        	
        	/**
        	 * 월간 스텝 차트 생성
        	 */
        	vm.makeMonthlyStepChart = function(data) {
        		if(!vm.monthlyStepChart) {
        			vm.monthlyStepChart = c3.generate({
        				bindto: '#monthlyStepChart',
        				size: {
        					height: 150,
        				},
        				padding: {
        					top: 10,
        					right: 0,
        					bottom: 0,
        					left: 20,
        				},
        				axis: {
        					y: {
        						max:8,
        						min:0,
        						padding: {top:0, bottom:0},
        						tick: {
        							count:5,
        						},
        					},
        					x: {
        						padding: {left:0, right:0},
        						type: 'category',
        						categories: (function(){
        							var categories = [];
        							
        							for(var i=5; i>=0; i--) {
        								var date = new Date();
        								date.setMonth(date.getMonth() - i);
        								
        								categories.push(date.getMonth()+1 + '월');
        							}
        							
        							return categories;
        						})(),
        					}
        				},
        				point: {
        					r: 3
        				},
        				grid: {
        					x: {
        						show: false
        					},
        					y: {
        						show: true
        					}
        				},
        				legend: {
        					show: false
        				},
        				data: {
        					json: {
        						STEP: [0, 0, 0, 0, 0, 0],
        					},
        					types: {
        						STEP: 'line',
        					},
        					colors: {
        						STEP: '#B855FC',
        					},
        				},
        				onrendered: function () {
        					$('#monthlyStepChart .c3-circle-5').addClass('pointer');
        					
        					$('#monthlyStepChart .c3-chart-line.c3-target.c3-target-STEP').parents('.c3-chart').attr('clip-path',null);
        				}
        			});
        		}
        		
        		if(data) {
        			vm.monthlyStepChart.load({
        				json: {
        					STEP: data,
        				},
        			});
        		}
        	};
        	
        	/**
        	 * 이번달 점수 차트 생성
        	 */
        	vm.makeScoreChart = function(data) {
        		var scoreTypes = ['pronunciation','vocabulary','grammar','intelligibility'];
        		
        		scoreTypes.forEach(function(type) {
        			var chart;
        			var chartBindTo;
        			var title;
        			var color;
        			
        			switch(type) {
        				case 'pronunciation':
        					chart = vm.pronunciationChart;
        					chartBindTo = '#pronunciationChart';
        					title = '발음';
        					color = '#FFA800';
        					break;
        				case 'vocabulary':
        					chart = vm.vocabularyChart;
        					chartBindTo = '#vocabularyChart';
        					title = '어휘';
        					color = '#339BFF';
        					break;
        				case 'grammar':
        					chart = vm.grammarChart;
        					chartBindTo = '#grammarChart';
        					title = '문법';
        					color = '#BB3EFF';
        					break;
        				case 'intelligibility':
        					chart = vm.intelligibilityChart;
        					chartBindTo = '#intelligibilityChart';
        					title = '이해도';
        					color = '#04B92B';
        					break;
        			}
        			
        			if(!chart) {
        				chart = c3.generate({
        		            bindto: chartBindTo,
        		            size: {
        		                height: 140,
        		                width: 140,
        		            },
        		            data: {
        		                json: {
        		                    data1 : [],
        		                    data2 : [],
        		                },
        		                type : 'donut',
        		                colors: {
        		                    data1: '#eeeeee',
        		                    data2: color,
        		                },
        		            },
        		            donut: {
        		            	title: title,
        		            	width: 15,
        		                label: {
        		                	show: false,
        		                }
        		            },
        		            legend: {
        				        show: false
        				    },
        				    tooltip: {
        				        show: false
        				    },
        				    oninit: function() {
        				    	d3.select(chartBindTo + ' .c3-chart-arcs-title').attr('y', -20).attr('fill', '#666666');
        				    	d3.select(chartBindTo + ' .c3-chart-arcs-title').append('tspan').attr('y', '10%').attr('x', 0).attr('style','font-size: 40px;font-weight: 700;vertical-align: bottom;fill: '+ color +';').text(data[type]);
        				    },
        		        });
        			}
        			
        			if(data) {
        				chart.load({
        					json: {
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
        	vm.makeMonthlyScoreChart = function(data) {
        		if(!vm.monthlyScoreChart) {
        			vm.monthlyScoreChart = c3.generate({
        	        	bindto: '#monthlyScoreChart',
        	        	size: {
        	                height: 150,
        	            },
        	            axis: {
        			    	y: {
        			    		max: 100,
        			    		padding: {top:0, bottom:0},
        			    		tick: {
        			    			count:5,
        			    		},
        			    	},
        			    	x: {
        			    		padding: {left:0, right:0},
        			    		type: 'category',
        			    		categories: (function(){
        							var categories = [];
        							
        							for(var i=5; i>=0; i--) {
        								var date = new Date();
        								date.setMonth(date.getMonth() - i);
        								
        								categories.push(date.getMonth()+1 + '월');
        							}
        							
        							return categories;
        						})(),
        			    	}
        			    },
        			    padding: {
        	                top: 10,
        	                right: 0,
        	                bottom: 0,
        	                left: 30,
        	            },
        	            grid: {
        			        x: {
        			            show: false
        			        },
        			        y: {
        			            show: true
        			        }
        			    },
        	            legend: {
        			        show: false
        			    },
        	            data: {
        	            	json: {
        					},
        	                type: 'bar',
        	                groups: [
        	                    ['발음', '어휘', '문법', '이해도']
        	                ],
        	                colors: {
        	                	발음: '#FFA800',
        	                	어휘: '#339BFF',
        	                	문법: '#BB3EFF',
        	                	이해도: '#04B92B',
        	                },
        	            },
        	        });
        		}
        		
        		if(data) {
        			vm.monthlyScoreChart.load({
        				json: {
        					발음: data['pronunciation'],
                            어휘: data['vocabulary'],
                            문법: data['grammar'],
                            이해도: data['intelligibility']
                        },
        			});
        		}
        	};
        	
        	/**
        	 * 월간 출석율 차트 생성
        	 */
        	vm.makeAttendanceRateChart = function(data) {
        		if(!vm.attendanceRateChart) {
        			vm.attendanceRateChart = c3.generate({
        	            bindto: '#attendanceRateChart',
        	            size: {
        	                height: 150,
        	            },
        	            padding: {
        	                top: 10,
        	                right: 0,
        	                bottom: 0,
        	                left: 30,
        	            },
        	            axis: {
        			    	y: {
        			    		max:100,
        			    		min:0,
        			    		padding: {top:0, bottom:0},
        			    		tick: {
        			    			count:5,
        			                format: function (d) { return d.toFixed(0); }
        			    		},
        			    	},
        			    	x: {
        			    		padding: {left:0, right:0},
        			    		type: 'category',
        			    		categories: (function(){
        							var categories = [];
        							
        							for(var i=5; i>=0; i--) {
        								var date = new Date();
        								date.setMonth(date.getMonth() - i);
        								
        								categories.push(date.getMonth()+1 + '월');
        							}
        							
        							return categories;
        						})(),
        			    	}
        			    },
        			    point: {
        			        r: 3
        			    },
        			    grid: {
        			        x: {
        			            show: false
        			        },
        			        y: {
        			            show: true
        			        }
        			    },
        			    legend: {
        			        show: false
        			    },
        	            data: {
        	            	json: {
        	                },
        	                types: {
        	                	출석율: 'line',
        	                },
        	                colors: {
        	                	출석율: '#FF6B6B',
        	                },
        	            },
        	            tooltip: {
        	                format: {
        	                    value: function (value, ratio, id) {
        	                        return value + ' %';
        	                    }
        	                }
        	            },
        	            onrendered: function () {
        	            	$('#attendanceRateChart .c3-circle-5').addClass('pointer');
        	            	
        	            	$('#attendanceRateChart .c3-chart-line.c3-target.c3-target-출석율').parents('.c3-chart').attr('clip-path',null);
        			    }
        	        });
        		}
        		
        		if(data) {
        			vm.attendanceRateChart.load({
        				json: {
        					출석율: data,
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

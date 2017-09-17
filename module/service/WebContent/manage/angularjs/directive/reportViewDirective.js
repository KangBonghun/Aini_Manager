ainiApp.directive('reportViewDirective', function() {
    return {
        replace: true,
        templateUrl: 'angularjs/template/reportView.html',
        controllerAs: 'vm',
        controller: function($rootScope, $scope, $element, $attrs, $timeout) {
        	
        	var vm = this;
        	
        	
        	/**
        	 * 보고서 조회
        	 */
        	$scope.loadReport = function(userId, year, month) {
        		visibleLoader(true);
        		
        		console.log(userId + ' | ' + year + ' | ' + month);
        		
        		vm.reportData = {};
        		
        		var timeoutPromise = $timeout(function(){
        			vm.reportData.summary = {};
        			vm.reportData.summary.score = 88;
        			vm.reportData.summary.rank = 10.25;
        			vm.reportData.summary.step = 5;
        			
        			vm.reportData.class = {};
        			vm.reportData.class.name = '중국어초급반';
        			vm.reportData.class.time = '월수금 7:40 - 8:40';
        			vm.reportData.class.startDate = '2017-05-12';
        			vm.reportData.class.endDate = '2017-07-20';
        			vm.reportData.class.day = '11';
        			vm.reportData.class.manager = '가나다';
        			vm.reportData.class.teacher = '라마바';
        			vm.reportData.class.email = 'aini@aini.co.kr';
        			
        			vm.reportData.goal = {};
        			vm.reportData.goal.goal = '동해물과백두산이마르고닳도록하느님이보우하사우리나라만세';
        			
        			vm.reportData.step = {};
        			vm.reportData.step.step = 8;
        			vm.reportData.step.score = 20;
        			vm.reportData.step.monthly = [2, 2, 3, 3, 4, 8];
        			
        			vm.reportData.score = {};
        			vm.reportData.score.totalScore = 88;
        			vm.reportData.score.pronunciation = 8;
        			vm.reportData.score.vocabulary = 15;
        			vm.reportData.score.grammar = 20;
        			vm.reportData.score.intelligibility = 25;
        			vm.reportData.score.monthly = {
        					pronunciation: [10, 10, 10, 10, 10, 10],
        					vocabulary: [10, 10, 10, 10, 10, 10],
        					grammar: [25, 10, 10, 10, 10, 10],
        					intelligibility: [10, 10, 10, 10, 10, 10],
        			};
        			
        			vm.reportData.comment = {};
        			vm.reportData.comment.strength = '이기상과이맘으로충성을다하여괴로우나즐거우나나라사랑하세';
        			vm.reportData.comment.weakness = '남산위에저소나무철갑을두른듯바람서리불변함은우리기상일세';
        			
        			
        			vm.reportData.attendance = {};
        			vm.reportData.attendance.monthly = [2, 2, 3, 3, 4, 100];
        			
        			
        			
        			
        			
        			
        			vm.makeStepChart(vm.reportData.step.step);
        			vm.makeStepScoreChart(5);
        			vm.makeMonthlyStepChart(vm.reportData.step.monthly);
        			vm.makeScoreChart(vm.reportData.score);
        			vm.makeMonthlyScoreChart(vm.reportData.score.monthly);
        			vm.makeAttendanceRateChart(vm.reportData.attendance.monthly);
        		}, 300);
        		
        		timeoutPromise.then(function(){
        			visibleLoader(false);      
        			$timeout.cancel(timeoutPromise);
        		});
        	};
        	
        	
        	
        	/**
        	 * 스탭 차트 생성
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
        			    	if(step) {
        			    		$('#stepChart .c3-event-rect-'+step+'').addClass('region');
        				        $('#stepChart .c3-circle-'+step+'').addClass('pointer');
        				        
        				        var height = d3.select('#stepChart .c3-event-rect.region').attr('height');
        				        
        				        d3.select('#stepChart .c3-event-rect.region').attr('y', 1).attr('height', height-2);
        			    	}
        			    	
        			    	$('#stepChart .c3-chart-line.c3-target.c3-target-STEP').parents('.c3-chart').attr('clip-path',null);
        			    }
        	        });
        		}
        	};
        	
        	
        	/**
        	 * 스탭 점수 차트 생성
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
        					columns: [
        					          ['data1', 0, 10, 5, 10, 25, 40, 60, 70, 50, 30, 25, 10, 5, 1, 6, 3, 0, 0, 0],
        					          ['data2', 0, 10, 5, 10, 25, 40, 60, 70, 50, 30, 25, 10, 5, 1, 6, 3, 0, 0, 0],
        					          ],
        					          types: {
        					        	  data1: 'area-spline',
        					        	  data2: 'area-spline',
        					          },
        					          colors: {
        					        	  data1: '#DFDFE3',
        					        	  data2: '#5ea4ff',
        					          },
        				},
        				oninit: function() {
        					$('#stepScoreChart .c3-chart-lines').after($('#stepScoreChart .c3-event-rects'));
        					
        					d3.select('#stepScoreChart defs').append('clipPath').attr('id', 'region').append('rect');
        					d3.select('#stepScoreChart .c3-chart-line.c3-target.c3-target-data2').attr('clip-path','url(#region)');
        				},
        				onrendered: function () {
        					if(data) {
        						$('#stepScoreChart .c3-event-rect-' + data + '').addClass('score-region');
        						
        						var rect = d3.select('#stepScoreChart .c3-event-rect.score-region');
        						
        						var height = rect.attr('height');
        						var width = rect.attr('width');
        						var x = rect.attr('x');
        						var y = rect.attr('y');
        						
        						d3.select('#stepScoreChart .c3-event-rect.score').attr('y', 1).attr('height', height-2);
        						d3.select('#region rect').attr('x',x-1).attr('y',y).attr('width',parseInt(width)+2).attr('height',height);
        					}
        				}
        			});	
        		}
        	};	
        	
        	/**
        	 * 월간 스탭 차트 생성
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
        				    	d3.select(chartBindTo + ' .c3-chart-arcs-title').append('tspan').attr('y', 25).attr('x', 0).attr('style','font-size: 40px;font-weight: 700;vertical-align: bottom;fill: '+ color +';').text(data[type]);
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

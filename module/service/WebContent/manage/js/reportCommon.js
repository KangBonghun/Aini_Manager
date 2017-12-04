function bindReportData(reportData) {
	if (reportData) {
//		reportData = JSON.parse(reportData);
		
		//리포트 정보
		var year = reportData.reportInfo.year;
		var month = reportData.reportInfo.month;
		
		$('#bind-reportYear').text(year);
		$('#bind-reportMonth').text(month);
		
		//수강생 정보
		$('#bind-name').text(reportData.reportInfo.userName);
		$('#bind-tel').text(phoneFormat(reportData.reportInfo.mobileNumber));
		$('#bind-email').text(reportData.reportInfo.userId);
		
		//종합 정보
		$('#bind-score').text(reportData.reportInfo.totalScore);
		$('#bind-rank').text(calcRankPercentage(reportData.reportInfo.stepScore, reportData.classInfo.language));
		$('#bind-step').text(reportData.reportInfo.step);
		
		//차트 점수
		$('#bind-chartStep').text(reportData.reportInfo.step);
		$('#bind-chartStepScore').text(reportData.reportInfo.stepScore);
		
		//클래스 정보
		$('#bind-className').text(reportData.classInfo.className);
		$('#bind-classDate').text(getClassDateLabel(reportData.classInfo) + ' ' + getClassTimeLabel(reportData.classInfo.startTime) + ' - ' + getClassTimeLabel(reportData.classInfo.endTime));
		$('#bind-startDate').text(stringToDate(reportData.classInfo.startDate).format('yyyy-MM-dd'));
		$('#bind-endDate').text(stringToDate(reportData.classInfo.endDate).format('yyyy-MM-dd'));
		$('#bind-dateCount').text(reportData.classInfo.dateCount);
		$('#bind-managerName').text(reportData.classInfo.managerName);
		$('#bind-teacherName').text(reportData.classInfo.teacherName);
		$('#bind-teacherEmail').text(reportData.classInfo.teacherEmail);
		
		//학습목표
		$('#bind-goal').text(reportData.reportInfo.studyGoal);
		
		//최초평가
		$('#bind-firstDate').text(stringToDate(reportData.reportInfo.firstEvaluationDate).format('yyyy-MM-dd'));
		$('#bind-firstStep').text(reportData.reportInfo.firstStep);
		$('#bind-firstStepScore').text(reportData.reportInfo.firstStepScore);
		$('#bind-firstComment').text(reportData.reportInfo.firstComment);
		
		//평가점수
		var p = reportData.reportInfo.pronunciation;
		var v = reportData.reportInfo.vocabulary;
		var g = reportData.reportInfo.grammar;
		var i = reportData.reportInfo.intelligibility;
		
		$('#bind-pronunciation').text(p);
		$('#bind-vocabulary').text(v);
		$('#bind-grammar').text(g);
		$('#bind-intelligibility').text(i);
		$('#bind-totalScore').text(p+v+g+i);
		
		//강점,보완점
		$('#bind-strength').text(reportData.reportInfo.strength);
		$('#bind-weakness').text(reportData.reportInfo.weakness);
		
		// 차트
		makeStepChart(reportData.reportInfo.step);
		makeStepScoreChart(reportData.reportInfo.stepScore, reportData.classInfo.language);
		makeMonthlyStepChart(reportData.monthlyStep, year, month);
		makeScoreChart(reportData.reportInfo);
		makeMonthlyScoreChart(reportData.monthlyScore, year, month);
		makeAttendanceRateChart(reportData.monthlyAttendance, year, month);
	} else {
		makeStepChart(0);
		makeStepScoreChart(0);
		makeMonthlyStepChart([ 0, 0, 0, 0, 0, 0 ]);
		makeScoreChart(0);
		makeMonthlyScoreChart({
			pronunciation : [ 0, 0, 0, 0, 0, 0 ],
			vocabulary : [ 0, 0, 0, 0, 0, 0 ],
			grammar : [ 0, 0, 0, 0, 0, 0 ],
			intelligibility : [ 0, 0, 0, 0, 0, 0 ],
		});
		makeAttendanceRateChart([ 0, 0, 0, 0, 0, 0 ]);
	}
}

var stepChartEl = null;
var stepScoreChartEl = null;
var monthlyStepChartEl = null;
var pronunciationChartEl = null;
var vocabularyChartEl = null;
var grammarChartEl = null;
var intelligibilityChartEl = null;
var monthlyScoreChartEl = null;
var attendanceRateChartEl = null;


/**
 * 스텝 차트 생성
 */
var makeStepChart = function(step) {
	if (!stepChartEl) {
		stepChartEl = c3.generate({
			bindto : '#stepChart',
			size : {
				height : 200,
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
			oninit : function() {
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


var makeStepScoreChart = function(data, language) {
	if (!stepScoreChartEl) {
		stepScoreChartEl = c3
				.generate({
					bindto : '#stepScoreChart',
					size : {
						height : 200,
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
 * 월간 스텝 점수 차트
 */
var makeMonthlyStepChart = function(data, year, month) {
	if (!monthlyStepChartEl) {
		monthlyStepChartEl = c3.generate({
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
			oninit : function() {
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
		monthlyStepChartEl.load({
			json : {
				스텝점수 : data,
			},
		});
	}
};



var makeScoreChart = function(data) {
	var scoreTypes = [ 'pronunciation', 'vocabulary', 'grammar','intelligibility' ];

	scoreTypes.forEach(function(type) {
		var chart;
		var chartBindTo;
		var title;
		var color;

		switch (type) {
		case 'pronunciation':
			chart = pronunciationChartEl;
			chartBindTo = '#pronunciationChart';
			title = '발음';
			color = '#FF7F67';
			break;
		case 'vocabulary':
			chart = vocabularyChartEl;
			chartBindTo = '#vocabularyChart';
			title = '어휘';
			color = '#9ACE62';
			break;
		case 'grammar':
			chart = grammarChartEl;
			chartBindTo = '#grammarChart';
			title = '문법';
			color = '#33C8E9';
			break;
		case 'intelligibility':
			chart = intelligibilityChartEl;
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
 * 월간 점수 차트
 */
var makeMonthlyScoreChart = function(data, year, month) {
	if (!monthlyScoreChartEl) {
		monthlyScoreChartEl = c3.generate({
			bindto : '#monthlyScoreChart',
			size : {
				height : 200,
			},
			axis : {
				y : {
					max : 25,
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
				colors : {
					발음 : '#FF7F67',
					어휘 : '#9ACE62',
					문법 : '#33C8E9',
					이해도 : '#AB93EB',
				},
				labels : {
					position: 'outer-center',
					format : function(v) {
						return v;
					}
				},
			},
			oninit : function() {
				
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
		monthlyScoreChartEl.load({
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
 * 월간 출석율 차트
 */
var makeAttendanceRateChart = function(data, year, month) {
	if (!attendanceRateChartEl) {
		attendanceRateChartEl = c3
				.generate({
					bindto : '#attendanceRateChart',
					size : {
						height : 200,
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
					oninit : function() {
						
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
		attendanceRateChartEl.load({
			json : {
				출석율 : data,
			},
		});
	}
};
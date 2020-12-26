
$(document).ready(function() {
    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        credits: {
            enabled: false
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        }
    });

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#FFFFFF',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'],
                [0.5, '#DDDF0D'],
                [0.9, '#DF5353']
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };


    var pointerCurrent = Highcharts.chart('container-currentRate', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 2,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'curRate',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:28px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">uSv/h</span></div>'
            },
            tooltip: {
                valueSuffix: ' uSv/h'
            }
        }]

    }));

    var pointerAverage = Highcharts.chart('container-averageRate', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 2,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'avgRate',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">uSv/h</span></div>'
            },
            tooltip: {
                valueSuffix: ' uSv/h'
            }
        }]

    }));
	
	var pointerCPM = Highcharts.chart('container-cpm', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'cpm',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:12px;color:silver"></span></div>'
            },
            tooltip: {
                valueSuffix: ' '
            }
        }]

    }));

	var chartCurrentRate = 	Highcharts.chart('container-chart-currentRate', {
		title: {
			text: ''
		},
		legend: {
			enabled: false
		},
		xAxis: {
			categories: [],
			title: {
				text: ''
			}
		},
		yAxis: {
			title: {
				text: '',
				style: {
					fontWeight: 'normal'
				}
			}
		},
		series: [
			{
				name: 'Value',
				data: [0],
				color: '#093AC9',
				marker: {
					enabled: false
				}
			}
		]
	});
	
	var chartAverageRate = 	Highcharts.chart('container-chart-averageRate', {
		title: {
			text: ''
		},
		legend: {
			enabled: false
		},
		xAxis: {
			categories: [],
			title: {
				text: ''
			}
		},
		yAxis: {
			title: {
				text: '',
				style: {
					fontWeight: 'normal'
				}
			}
		},
		series: [
			{
				name: 'Value',
				data: [0],
				color: '#093AC9',
				marker: {
					enabled: false
				}
			}
		]
	});
	
	var chartCPM = 	Highcharts.chart('container-chart-cpm', {
		title: {
			text: ''
		},
		legend: {
			enabled: false
		},
		xAxis: {
			categories: [],
			title: {
				text: ''
			}
		},
		yAxis: {
			title: {
				text: '',
				style: {
					fontWeight: 'normal'
				}
			}
		},
		series: [
			{
				name: 'Value',
				data: [0],
				color: '#093AC9',
				marker: {
					enabled: false
				}
			}
		]
	});

    setInterval(function() {
        $.getJSON('currtenData', function(data){
            if(window.dashboard != null)
            {
                window.dashboard_old = window.dashboard;
            }
            window.dashboard = data;

        });

        if(window.dashboard != null){
			
			$("#version").text(window.dashboard.version);
			$("#time").text(window.dashboard.timestamp);
			$("#current-DoseRate").text(window.dashboard.currentDoseRate);
			$("#average-DoseRate").text(window.dashboard.averageDoseRate);
			$("#cpm").text(window.dashboard.cpm);
			
			$("#chart-currentRate-value").text(window.dashboard.currentDoseRate);
			$("#chart-averageRate-value").text(window.dashboard.averageDoseRate);
			$("#chart-cpm-value").text(window.dashboard.cpm);
			
			
            var point;
            if (pointerCurrent) {
                point = pointerCurrent.series[0].points[0];
                point.update(window.dashboard.currentDoseRate);
            }
            if (pointerAverage) {
                point = pointerAverage.series[0].points[0];
                point.update(window.dashboard.averageDoseRate);
            }
            if (pointerCPM) {
                point = pointerCPM.series[0].points[0];
                point.update(window.dashboard.cpm);
            }
          
			if(chartCurrentRate.series[0].data.length >=30){
				chartCurrentRate.series[0].addPoint(window.dashboard.currentDoseRate, true, true);
			}
			else{
				chartCurrentRate.series[0].addPoint(window.dashboard.currentDoseRate);
			}
			
			if(chartAverageRate.series[0].data.length >=30){
				chartAverageRate.series[0].addPoint(window.dashboard.averageDoseRate, true, true);
			}
			else{
				chartAverageRate.series[0].addPoint(window.dashboard.averageDoseRate);
			}
			if(chartCPM.series[0].data.length >=30){
				chartCPM.series[0].addPoint(window.dashboard.cpm, true, true);
			}
			else{
				chartCPM.series[0].addPoint(window.dashboard.cpm);
			}
            
        }
    }, 2000);



});
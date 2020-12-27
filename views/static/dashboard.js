
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
    }, 3000);

  	$(".datepicker").each(function () {
		$(this).datepicker();
	});
	
	$('#container').highcharts({ 
	colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
	chart: {
		renderTo: 'container',
		type: 'spline',
		zoomType: 'x',
		spacingRight: 20,
        backgroundColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 1
            },
            stops: [[0, 'rgb(255, 255, 255)'], [1, 'rgb(240, 240, 255)']]
        },
        borderWidth: 0,
        plotBackgroundColor: 'rgba(255, 255, 255, .9)',
        plotShadow: true,
        plotBorderWidth: 1
	    },
    title: {
		style: {
           color: '#000',
           font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
       	},
		text: '趋势图(拉选区块可放大查看)'
	},
/*			subtitle: {
		text: document.ontouchstart === undefined ?
			'拉选区块可放大查看':''
	},
*/
	xAxis: {
		gridLineWidth: 1,
        lineColor: '#000',
        tickColor: '#000',
        labels: {
            style: {
                color: '#000',
                font: '11px Trebuchet MS, Verdana, sans-serif'
            },
            formatter:function(){
		        return Highcharts.dateFormat('%m-%d %H:%M:%S',this.value);
		    }
            
        },
        title: {
            style: {
                color: '#333',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            }
        },
		type: 'datetime',
		minRange: 360000 
	},
	yAxis: {
		minorTickInterval: 'auto',
        lineColor: '#000',
        lineWidth: 1,
        tickWidth: 1,
        tickColor: '#000',
        labels: {
            style: {
                color: '#000',
                font: '11px Trebuchet MS, Verdana, sans-serif'
            }
        },
        title: {
            style: {
                color: '#333',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            },
			text: ''
        }
	},
	tooltip: {
	 formatter: function() {
		return '<b>'+ this.series.name +'</b><br/>'+
		Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
		Highcharts.numberFormat(this.y, 2);
	  }
	},
	//legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', borderWidth: 0 },
	legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle: {
            color: '#039'
        },
        itemHiddenStyle: {
            color: 'gray'
        },
        layout: 'horizontal', 
        align: 'left', 
        verticalAlign: 'top', 
        borderWidth: 0
    },
	labels: {
        style: {
            color: '#99b'
        }
    },
    navigation: {
        buttonOptions: {
            theme: {
                stroke: '#CCCCCC'
            }
        }
    },
	series: [
	{
		name: "实际值"+"(uSv/h)",
		visible: true,
		data: []
	},
	{
		name: "平均值"+"(uSv/h)",
		visible: true,
		data: []
	},
	{
		name: "CPM",
		visible: true,
		data: []
	},
	]
});

});

function onDataReceived(json) {
	var arr = new Array();
	var historyChart = $('#container').highcharts();
	$.each( historyChart.series, function(i, k){
		var item = new Array();
		arr.push(item);
		historyChart.series[i].setData(null);
	});
	$.each(json, function(i, item) {
		var ts = Date.parse(new Date(new Date(item.timeStamp).toJSON().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')));
		arr[0].push([ts,("undefined"==typeof(item.currentDoseRate))? null:parseFloat(item.currentDoseRate)])
		arr[1].push([ts,("undefined"==typeof(item.averageDoseRate))? null:parseFloat(item.averageDoseRate)])
		arr[2].push([ts,("undefined"==typeof(item.cpm))? null:parseFloat(item.cpm)])
	});
	$.each( historyChart.series, function(i, k){
		historyChart.series[i].setData(arr[i]);
	});
} 
function Search()
{
	var startTime,stopTime;
	startTime = $("#startTime").val()+" 00:00:00";
	stopTime = $("#stopTime").val()+" 00:00:00";
	if((startTime==" 00:00:00")||(stopTime==" 00:00:00"))
	{
		alert("请选择开始时间和结束时间");
		return 0;
	}
	var chart = $('#container').highcharts();
	var arr = new Array();
	$.each( chart.series, function(i, k){
		var item = new Array();
		arr.push(item);
		chart.series[i].setData(null);
	});
	
 	$.ajax({
		url: "/historyData",
		type: "GET",
		data:{'start':startTime,"stop":stopTime},
		dataType: "json",
		success: onDataReceived
	}); 
}
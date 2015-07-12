var country;
var featuredExchange = 'bitstamp';
var availableExchanges = ['bitstamp', 'kraken', 'anxbtc'];
var exchangeUrl;
var adblock = false;

Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	    c = isNaN(c = Math.abs(c)) ? 2 : c, 
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$(document).ready(function(){
	
	var today = new Date();
	
	var month = today.getUTCMonth();
	var date = today.getUTCDate();
	var year = today.getUTCFullYear();
	var monthString = '';
	
	switch (month) {
		case 0: monthString = 'JAN'; break;
		case 1: monthString = 'FEB'; break;
		case 2: monthString = 'MAR'; break;
		case 3: monthString = 'APR'; break;
		case 4: monthString = 'MAY'; break;
		case 5: monthString = 'JUN'; break;
		case 6: monthString = 'JUL'; break;
		case 7: monthString = 'AUG'; break;
		case 8: monthString = 'OCT'; break;
		case 9: monthString = 'SEP'; break;
		case 10: monthString = 'NOV'; break;
		case 11: monthString = 'DEC'; break;
	}
	
	$('.subheader').html(monthString + ' ' + date + ', ' + year);
	
	var searchForm = $('<form method="GET" action="/en/bitcoin-news-search">')
		.append('<input type="text" placeholder="Search" id="searchbox" name="q">')
		.append('<input type="submit" style="display: none;">');
	
	$('div.pure-u-8-24.right nav').before(searchForm);
	
	var attempts = 0;
	
	var checkTickerAd = setInterval(function(){
		var exchange = $('.news-header-ad-unit-300x100').find('img').first().attr('title');
		
		if (exchange != null) {
			
      		featuredExchange = exchange;
      	    getTicker();
      	    setInterval(function(){ getTicker(); }, 60000);
			
			clearInterval(checkTickerAd);
		} else {
			attempts++;
		}
		
		if (attempts > 15)
		{
			adblock = true;
			getTickerFromBackend()
			clearInterval(checkTickerAd);
		}
	}, 500);
	
	$.ajax({
	    url: "/api/ticker/30dayUSD",
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	console.log(response);
	            	
	            	var graphData = [];
	            	
	            	for (var i=0; i<response.data.length; i++)
	            	{
	            		graphData[graphData.length] = response.data[i][1];
	            	}
	            	drawChart(graphData);
	            },
	            500: function (response) {
	            	console.log(response);
	            }
	          },
	          complete: function(e, xhr, settings){
	          }
	});
	
});

function getTicker() {
	$.ajax({
	    url: "/api/ticker/" + featuredExchange,
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	console.log(response);
	            	
	            	var last = parseFloat(response.last);
	            	var high = parseFloat(response.high);
	            	var low = parseFloat(response.low);
	            	var currency = response.currency;
	            	var change = ( parseFloat(response.vwap) / parseFloat(response.high) -1 ) * 100;
	            	var triangle = ' ▼';
	            	change = change.toFixed(2);
	            	
	            	if (response.currency == 'USD')
	            	{
	            		$('.news-header-bitcoin-price div.quote').html('$' + last.formatMoney(2, '.', ' '));
	            		$('.news-header-bitcoin-price span.daily-high').html('HI: $' + high.formatMoney(2, '.', ','));
	            		$('.news-header-bitcoin-price span.daily-low').html('LOW: $' + low.formatMoney(2, '.', ','));
	            	} else if (response.currency == 'EUR') {
	            		$('.news-header-bitcoin-price div.quote').html(last.formatMoney(2, '.', ' ') + '€');
	            		$('.news-header-bitcoin-price span.daily-high').html('HI: ' + high.formatMoney(2, '.', ' ') + '€');
	            		$('.news-header-bitcoin-price span.daily-low').html('LOW: ' + low.formatMoney(2, '.', ' ') + '€');
	            	} else if (response.currency == 'JPY') {
	            		$('.news-header-bitcoin-price div.quote').html(last.formatMoney(0, '.', ',') + '円');
	            		$('.news-header-bitcoin-price span.daily-high').html('HI: ' + high.formatMoney(0, '.', ',') + '円');
	            		$('.news-header-bitcoin-price span.daily-low').html('LOW: ' + low.formatMoney(0, '.', ',') + '円');
	            	}
	            	if (!isNaN(change) && false)
	            	{
	            		if (change > 0)
	            		{
	            			triangle = ' ▲';
	            			$('.news-header-bitcoin-price span.change').removeClass('down');
	            			$('.news-header-bitcoin-price span.change').addClass('up');
	            		}
	            		$('.news-header-bitcoin-price span.currency').html(currency + triangle);
	            		$('.news-header-bitcoin-price span.change').html(change +'%'+ triangle);
	            	} else {
	            		$('.news-header-bitcoin-price span.currency').html(currency);
	            		$('.news-header-bitcoin-price span.change').remove();
	            	}
	            	
	            	if ($('.news-header-bitcoin-price div.quote').html().length > 6)
	            	{
	            		$('.news-header-bitcoin-price div.quote').css('font-size', '2.5em');
	            	} // http://bitcoin.com/url?promo=bitflyer-JP&url=https://www.bitflyer.jp/
            		// $('div.news-header-ad-unit-300x100 img').attr('src', '/img/news/exchange/' + response.exchange + '.png')
            		if (featuredExchange == 'bitstamp')
            		{
            			exchangeUrl = "https://bitstamp.net";
            		} else if (featuredExchange == 'kraken') 
            		{
            			exchangeUrl = "https://kraken.com";
            		} else if (featuredExchange == 'anxbtc') 
            		{
            			exchangeUrl = "https://anxbtc.com";
            		}
	            },
	            500: function (response) {
	            	console.log(response);
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  $('.news-header-bitcoin-price').fadeTo( 200 , 1, function() {
	        		    
	        	  });
	        	  $('.news-header-ad-unit-300x100').fadeTo( 200 , 1, function() {
	        		    
	        	  });
	          }
	});
}

function getTickerFromBackend() {
	$.ajax({
	    url: "/api/tickercontent",
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	console.log(response);
	            	
	            	var element = document.createElement('div');
	            	$(element).html('Bitcoin price by:')
	            	var link = document.createElement('a');
	            	$(link).attr('href', response.url);
	            	var image = document.createElement('img');
	            	$(image).attr('src', response.image);
	            	$(link).append($(image));
	            	$(element).append($(link));
	            	
	            	$('div.news-header-ad-unit-300x100').html($(element));
	            	
	            	featuredExchange = response.exchangeId;
	    			getTicker();
	    			
	          	    setInterval(function(){ getTicker(); }, 60000);
	            },
	            500: function (response) {
	            	console.log(response);
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  
	          }
	});
}

function drawChart(graphData) {
	
	var today = new Date();
	var startDate = new Date().setDate(today.getDate()-30);
	
	$('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        credits: {
        	enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            text: null,
            labels: {
              enabled: false
            }
        },
        yAxis: {
            text: null,
            title: null,
            labels: {
                enabled: false
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                            [0, '#2c6fad'],
                            [1, '#2c6fad']
                        ]
                },
                marker: {
                    radius: 0
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'USD per BTC',
            pointInterval: 24 * 3600 * 1000,
            pointStart: startDate,
            data: graphData
        }]
    });
}

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}
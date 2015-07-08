var divBodyHeight;

$(document).ready(function(){
	
	$( "body" ).on( "click", "div.exchange-listing", function() {
		
		var href = $( this ).find('a').attr('href');
		
		if (href.indexOf('/url') == 0)
		{
			window.location = href;
		}
	});
	
	$('#show-more').hide();
	divBodyHeight = $('div.body').height();
	// $('div.body').css('overflow-y', 'auto');
		
	$.ajax({
	    url: "/api/frontend/buyBitcoins",
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	
	            	console.log(response);
	            	
	            	$('#listingsloader').hide();
	            	var baseText = $('#featuredH1').data('text');
	            	$('#featuredH1').html(baseText.replace("@", response.localizedCountryName));
	            	
	            	for (var i=0; i<response.localListings.length; i++) {
	            		var listingData = response.localListings[i];
	            		
	            		$('#exchange-listing-container').append($('<div class="exchange-listing" data-listid="'+listingData.id+'" id="listing-'+listingData.id+'">')
	            			.append($('<div class="exchange-listing-right">')
	            				.append($('<div class="exchange-listing-title"><img src="'+listingData.icon+'">'+listingData.name+'</div>'+
	            						'<div class="exchange-listing-description">'+listingData.description+'</div>'+
	            						'<a href="/url?promo='+listingData.promoCode+'&url='+listingData.homepageURL+'"><div class="exchange-listing-button">Buy bitcoin</div></a>')
	            				)
	            			)
	            		);
	            	}
	            	
					if (response.promotedCampaigns && response.promotedCampaigns.length > 0)
	            	{
	            		$('.exchange-listing').hide();
						var sponsoredId = '#listing-' + response.promotedCampaigns[0].tagname;
	            		var listCont = $('#exchange-listing-container').width();
	            		var marginLeft = (listCont - 408)/2;
	            		if (marginLeft < 0)
	            		{
	            			marginLeft = 0;
	            		}
	            		$(sponsoredId).show();
	            		if ($('#exchange-listing-container').width() <= 626) {
	            			$(sponsoredId).css('width', '91%');
	            		} else {
	            			$(sponsoredId).css('width', '400px');
	            		}
	            		$(sponsoredId).css('margin-left', marginLeft + 'px');
	            		$('#show-more').show(200);
	            	} else {
	            			var realHeight = $('div.body').height();
	            			$('#show-more').hide(200);
	            	        if ($('#exchange-listing-container').width() > 626)
	            	        {
	            	        		var maxHeight = 0;
	            	        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
	            	        	    	if ($(this).height() > maxHeight)
	            	        	    	{
	            	        	    		maxHeight = $(this).height();
	            	        	    	}
	            	        	    });
	            	        		$('.exchange-listing').height(maxHeight);
	            	        		realHeight += $('#exchange-listing-container').height() + 150;
	            	        		// $('div.body').height(realHeight);
	            	        } else if ($('#exchange-listing-container').width() <= 626)
	            	        {
	            	        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
	            	        			$(this).css('margin-right', '8px');
	            	        			$(this).width('91%');
	            	        	    	$(this).show(300);
	            	        	    });
	            	        		
	            	        		realHeight += $('#exchange-listing-container').height() + 150;
	            	        		// $('div.body').height(realHeight);
	            	        }
	            	}
	            },
	            500: function (response) {
	
	            }
	          },
	          complete: function(e, xhr, settings){

	          }
	});

});

$(document).on("click", "#show-more", function(event) {
    event.preventDefault();
    $('#show-more').hide(200);
    var realHeight = $('div.body').height();
    $('#exchange-listing-container').children('.exchange-listing').each(function () {
        if ($(this).width() > 272 && $('#exchange-listing-container').width() > 626)
        {
        	$(this).animate({ width: "272px", marginLeft: "8px"}, 500, function() {
        		var maxHeight = 0;
        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
        	    	if ($(this).height() > maxHeight)
        	    	{
        	    		maxHeight = $(this).height();
        	    	}
        	    });
        		$('.exchange-listing').height(maxHeight);
        		$('.exchange-listing').show(300);
        		realHeight += $('#exchange-listing-container').height() + 150;
        		// $('div.body').height(realHeight);
        	});
        } else if ($('#exchange-listing-container').width() <= 626)
        {
        	$(this).animate({ width: "91%", marginLeft: "8px"}, 500, function() {
        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
        			$(this).css('margin-right', '8px');
        			$(this).width('91%');
        	    	$(this).show(300);
        	    });
        		
        		realHeight += $('#exchange-listing-container').height() + 150;
        		// $('div.body').height(realHeight);
        	});
        }
    });
    
    $('#bump').show(200);
    
    $.ajax({
        url: "/api/frontend/buyBitcoinsViewAll",
        type: "GET",
        cache: false,
        data: { },
        statusCode: {
                200: function (response) {
              	  	console.log(response);
                },
                500: function (response) {
                }
              },
              complete: function(e, xhr, settings){
              }
	});
});

var app = angular.module('buyBitcoins', []);

app.factory('LocalData', function() {
  var obj = {}
  return {

  getValue: function(update) {
      var defaultValue = '';

      if( typeof(update)==='undefined') {
        obj.val = {
            city : '',
            regionCode: '',
            countryCode: '',
            country: ''
        };
      } else {
        obj.val = update;
      }
     //console.log('should be changed to', update);
     return obj;
   },

  getCountries: function(update) {
    var defaultValue = '';

    if( typeof(update)==='undefined') {
      obj.countries = {};
    } else {
      obj.countries = update;
    }
    //console.log('should be changed to', update);
    return obj;
    }
  }
});


app.controller('exchangeStatsCtrl', function($scope, LocalData, $http) {
	
	$('#content').children().animate({ opacity: 1}, 200, function() {
		
	});
	
	$http.get("/api/frontend/buyBitcoins")
	.success(function(response) {
	console.log(response);
	$scope.exchange = response;
	LocalData.getValue(response);
	});
});


app.controller('exchangeLocationCtrl', function($scope, LocalData, $http) {
	$('#bump').hide();
    $http.get("/api/frontend/countryList", {sort: false})
    .success(function(response) {
      $scope.countries = response;
      LocalData.getCountries(response);
      $scope.localData = LocalData.getValue();
      console.log(response);
    });

    $scope.update = function( value ) {
      for( var prop in $scope.countries ) {
          if( $scope.countries.hasOwnProperty( prop ) ) {
               if( $scope.countries[ prop ] === value )
               {
            	   listExchanges(prop);
            	   angular.element(document.getElementById('exchangeTreeviewCtrlId')).scope().hideCountries(null);
               }
          }
      }
    }
});

app.controller('exchangeListingCtrl',function($scope, LocalData, $http) {
  $scope.localData = LocalData.getValue();
});

app.controller('exchangeTreeviewCtrl',function($scope, LocalData, $http) {
	$('#bump').hide();
	if ($('#content').width() <= 530)
	{
		console.log("Small page");
		$('.exchange-location-treeview').css('padding-left', '0px');
		$('.exchange-location-treeleft').css("width", "auto");
		$('.exchange-location-treeright').css("width", "auto");
		$('.exchange-multiselect-input').css('width', '100%');
	}
	
	$('div.exchange-location-treeleft').children().each(function(){
    	var padWidth = $(this).width() - $(this).find('a').width() - 30;
    	$(this).find('a').css('padding-right', padWidth);
    });
    $('div.exchange-location-treeright').children().each(function(){
    	var padWidth = $(this).width() - $(this).find('a').width() - 30;
    	$(this).find('a').css('padding-right', padWidth);
    });
    
  $http.get("/api/frontend/regionMap")
  .success(function(response) {
    $scope.regions = response.data;
    console.log(response);
  });

  $scope.countries = LocalData.getCountries();

  $scope.getCountryFromCode = function( value ) {
    return $scope.countries.countries[value];
  }
  
  $scope.hideCountries = function(region) {
		if ($scope.showEU != null && region != 'showEU')
			$scope.showEU = false;			
		if ($scope.showNA != null && region != 'showNA')
			$scope.showNA = false;
		if ($scope.showCR != null && region != 'showCR')
			$scope.showCR = false;
		if ($scope.showAF != null && region != 'showAF')
			$scope.showAF = false;
		if ($scope.showSA != null && region != 'showSA')
			$scope.showSA = false;
		if ($scope.showOP != null && region != 'showOP')
			$scope.showOP = false;
		if ($scope.showME != null && region != 'showME')
			$scope.showME = false;
		if ($scope.showAS != null && region != 'showAS')
			$scope.showAS = false;
		$('div.body').css('height', '');
  }

  $scope.showListings = function(countryCode, event) {
	$scope.hideCountries(null);
	event.preventDefault();
	$('#bump').hide();
	
	$('#listingsloader').show();
	$('.exchange-listing').hide();
	$('#featuredH1').hide();
	
	$("#countrySelect option[value='" + countryCode + "']").attr('selected', 'selected');
	
	$.ajax({
        url: "/api/frontend/buyBitcoinsViewAll?country=" + countryCode,
        type: "GET",
        cache: false,
        data: { },
        statusCode: {
                200: function (response) {

              	  	console.log(response);
              	  
                },
                500: function (response) {

                }
              },
              complete: function(e, xhr, settings){
              	
              }
	});
	
	$.ajax({
	    url: "/api/frontend/buyBitcoins?country="+countryCode,
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	
	            	$scope.stats = response.stats.data;
	            	
	            	console.log(response);
	            	var baseText = $('#featuredH1').data('text');
	            	$('#featuredH1').html(baseText.replace("@", response.localizedCountryName));
	            	$('#featuredH1').show();
	            	
	            	$('#listingsloader').hide();
	            	$('.exchange-listing').remove();
	            	
	            	for (var i=0; i<response.localListings.length; i++) {
	            		var listingData = response.localListings[i];
	            		
	            		$('#exchange-listing-container').append($('<div class="exchange-listing" data-listid="'+listingData.id+'" id="listing-'+listingData.id+'">')
	            			.append($('<div class="exchange-listing-right">')
	            				.append($('<div class="exchange-listing-title"><img src="'+listingData.icon+'">'+listingData.name+'</div>'+
	            						'<div class="exchange-listing-description">'+listingData.description+'</div>'+
	            						'<a href="/url?promo='+listingData.promoCode+'&url='+listingData.homepageURL+'"><div class="exchange-listing-button">Buy bitcoin</div></a>')
	            				)
	            			)
	            		);
	            	}
					if (response.promotedCampaigns && response.promotedCampaigns.length > 0)
	            	{
	            		$('.exchange-listing').hide();
						var sponsoredId = '#listing-' + response.promotedCampaigns[0].tagname;
	            		var listCont = $('#exchange-listing-container').width();
	            		var marginLeft = (listCont - 408)/2;
	            		if (marginLeft < 0)
	            		{
	            			marginLeft = 0;
	            		}
	            		if ($('#exchange-listing-container').width() <= 626) {
	            			$(sponsoredId).css('width', '91%');
	            		} else {
	            			$(sponsoredId).css('width', '400px');
	            		}
	            		$(sponsoredId).css('margin-left', marginLeft + 'px');
	            		$('#show-more').show(200);
	            		$(sponsoredId).show();
	            	} else {
	            			var realHeight = divBodyHeight;
	            			$('#show-more').hide(200);
	            	        if ($('#exchange-listing-container').width() > 626)
	            	        {
	            	        		var maxHeight = 0;
	            	        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
	            	        	    	if ($(this).height() > maxHeight)
	            	        	    	{
	            	        	    		maxHeight = $(this).height();
	            	        	    	}
	            	        	    });
	            	        		$('.exchange-listing').height(maxHeight);
	            	        		realHeight += $('#exchange-listing-container').height() + 150;
	            	        		// $('div.body').height(realHeight);
	            	        } else if ($('#exchange-listing-container').width() <= 626)
	            	        {
	            	        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
	            	        			$(this).css('margin-right', '8px');
	            	        			$(this).width('91%');
	            	        	    	$(this).show(300);
	            	        	    });
	            	        		
	            	        		realHeight += $('#exchange-listing-container').height() + 150;
	            	        		// $('div.body').height(realHeight);
	            	        }
	            	}
	            },
	            500: function (response) {
	
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  
	          }
	});
  }
});

function listExchanges(countryCode) {
	
	var url = "/api/frontend/buyBitcoins?country="+countryCode;		
	
	$('#listingsloader').show();
	$('.exchange-listing').hide();
	$('#featuredH1').hide();
	$('#bump').hide();
	
	$.ajax({
	    url: url,
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	
	            	console.log(response);
	            	var baseText = $('#featuredH1').data('text');
	            	$('#featuredH1').html(baseText.replace("@", response.localizedCountryName));
	            	$('#featuredH1').show();
	            	
	            	$('#listingsloader').hide();
	            	$('.exchange-listing').remove();
	            	
	            	for (var i=0; i<response.localListings.length; i++) {
	            		var listingData = response.localListings[i];
	            		
	            		$('#exchange-listing-container').append($('<div class="exchange-listing" data-listid="'+listingData.id+'" id="listing-'+listingData.id+'">')
	            			.append($('<div class="exchange-listing-right">')
	            				.append($('<div class="exchange-listing-title"><img src="'+listingData.icon+'">'+listingData.name+'</div>'+
	            						'<div class="exchange-listing-description">'+listingData.description+'</div>'+
	            						'<a href="/url?promo='+listingData.promoCode+'&url='+listingData.homepageURL+'"><div class="exchange-listing-button">Buy bitcoin</div></a>')
	            				)
	            			)
	            		);
	            	}
					if (response.promotedCampaigns && response.promotedCampaigns.length > 0)
	            	{
	            		$('.exchange-listing').hide();
						var sponsoredId = '#listing-' + response.promotedCampaigns[0].tagname;
	            		var listCont = $('#exchange-listing-container').width();
	            		var marginLeft = (listCont - 408)/2;
	            		if (marginLeft < 0)
	            		{
	            			marginLeft = 0;
	            		}
	            		$(sponsoredId).show();
	            		if ($('#exchange-listing-container').width() <= 626) {
	            			$(sponsoredId).css('width', '91%');
	            		} else {
	            			$(sponsoredId).css('width', '400px');
	            		}
	            		$(sponsoredId).css('margin-left', marginLeft + 'px');
	            		$('#show-more').show(200);
	            	} else {
	            		$('#exchange-listing-container').children('.exchange-listing').each(function () {
	            			var realHeight = divBodyHeight;
	            	        if ($('#exchange-listing-container').width() > 626)
	            	        {
	            	        		var maxHeight = 0;
	            	        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
	            	        	    	if ($(this).height() > maxHeight)
	            	        	    	{
	            	        	    		maxHeight = $(this).height();
	            	        	    	}
	            	        	    });
	            	        		$('.exchange-listing').height(maxHeight);
	            	        		realHeight += $('#exchange-listing-container').height() + 150;
	            	        		// $('div.body').height(realHeight);
	            	        } else if ($('#exchange-listing-container').width() <= 626)
	            	        {
	            	        		$('#exchange-listing-container').children('.exchange-listing').each(function () {
	            	        			$(this).css('margin-right', '8px');
	            	        			$(this).width('91%');
	            	        	    	$(this).show(300);
	            	        	    });
	            	        		
	            	        		realHeight += $('#exchange-listing-container').height() + 150;
	            	        		// $('div.body').height(realHeight);
	            	        }
	            	    });
	            	}
	            },
	            500: function (response) {
	
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  
	          }
	});
}


var qrClicked;

$(document).ready(function(){
	
	qrClicked = false;
	
	var selectedWallet = window.location.hash.substr(1);
	var loadedAddresses = [];

	$.ajax({
              url: "/api/frontend/chooseYourWalletDonation",
              type: "GET",
              cache: false,
              data: { },
              statusCode: {
                      200: function (response) {

                    	  	console.log(response);
                    	  
                    	  	keys = Object.keys(response);
                    	  	walletMap = response;
                    	  	
                    	  	var walletWarray = [];
                    	  	var keyOrder = [];
                        	
			  				for (var i=0; i<keys.length; i++)
			  				{
			  					var item = walletMap[keys[i]];
			  					walletWarray[walletWarray.length] = item;
			  					keyOrder[keyOrder.length] = keys[i] + '-' + i;
			  				}
			  				
			  				keyOrder.sort();
			  				
			  				for (var i=0; i<keyOrder.length; i++)
			  				{
			  					var arrayIndex = keyOrder[i].substring(keyOrder[i].indexOf("-")+1);
			  					var item = walletWarray[arrayIndex];
			  					// console.log(item);
			  					
			  					var wallet = $('.walletinfo').first().clone();
			  					var divId = 'wallet' + item.id;
			  					$(wallet).attr('id', divId);
			  					$(wallet).find('.walletlogo img').attr('src', item.icon);
			  					$(wallet).find('h2').html(item.name);
			  					$(wallet).find('b.address').html(item.btcaddr);
			  					$(wallet).find('#bitcoin-uri').attr('href', 'bitcoin:' + item.btcaddr);
			  					$(wallet).find('#bitcoin-be-url').attr('href', 'https://blockchain.info/address/' + item.btcaddr);
			  					$(wallet).find('.qrcodeshow').data('address', item.btcaddr)
			  					$(wallet).find('.qrcodeshow').data('qrid', item.id)
			  					
			  					loadedAddresses[loadedAddresses.length] = item.btcaddr;
			  					
			  					var platforms = 'Available for ';
			  					var platformItems = 0;
			  					
			  					for (var j=0; j<item.categories.length; j++)
			  					{
			  						if ((item.categories[j] == 'default' || item.categories[j] == 'mobile' || item.categories[j] == 'desktop') == false)
			  						{
			  							if (platformItems>0)
				  							platforms += ', ';
			  							
			  							platformItems++;
			  							
			  							if (item.categories[j] == 'bank')
			  							{
			  								platforms = 'Available as bank service';
			  							} else {
			  								platforms += item.categories[j];
			  							}
			  						}
			  					}
			  					$(wallet).find('.platforms').html(platforms);
			  					
			  					var qrId = 'qr' + item.id;
			  					$(wallet).find('.walletqr').attr('id', qrId);
			  					$(wallet).show();
			  					$(wallet).attr('style', '');
			  					$('#walletlist').append($(wallet));
			  					
			  					/*
			  					var qrcode = new QRCode(qrId, {
			  					    text: item.btcaddr,
			  					    width: 144,
			  					    height: 144,
			  					    colorDark : "#000000",
			  					    colorLight : "#ffffff",
			  					    correctLevel : QRCode.CorrectLevel.H
			  					});
			  					*/
			  				}
                    	  
                      },
                      500: function (response) {

                      }
                    },
                    complete: function(e, xhr, settings){
                    	
                    	$('#loader').hide();
                    	
                    	if (selectedWallet != null && selectedWallet != '')
                    	{
                    		var walletId = '#wallet' + selectedWallet;
                    		var offset = $(walletId).offset().top;
                    		
                    		$("html, body").animate({ scrollTop: $(walletId).offset().top - 100 }, 1000);                    		
                    	}
                    	
                    	getBtcBalance(loadedAddresses);
                    }
	});
});


$('div').on('click', '.qrcodeshow', function(event){
	event.preventDefault();
	
	if (!qrClicked)
	{
		qrClicked = true;
		var qrId = 'qr' + $(this).data('qrid');
		
		$('.walletqr').find('img').hide();
		$('a.qrcodeshow').show();
		$('a.qrcodeshow').find('img').show();
		
		$(this).hide();
		
		var qrcode = new QRCode(qrId, {
			    text: 'bitcoin:' + $(this).data('address'),
			    width: 144,
			    height: 144,
			    colorDark : "#000000",
			    colorLight : "#ffffff",
			    correctLevel : QRCode.CorrectLevel.H
			});
		setTimeout(function (){
			qrClicked = false;
		}, 500);
	}
});

function getBtcBalance(addressList) {
	
	var addressQuery = '';
	
	for (var i=0; i<addressList.length; i++)
	{
		if (i == 0) {
			addressQuery += addressList[i];
		} else {
			addressQuery += '|' + addressList[i];
		}
	}
	
	$.ajax({
        url: "https://blockchain.info/multiaddr?active=" + addressQuery,
        type: "GET",
        cache: false,
        data: { },
        statusCode: {
                200: function (response) {
              	  	console.log(response);
              	  	
              	  	response.addresses;
                },
                500: function (response) {

                }
              },
              complete: function(e, xhr, settings){
              	
        }
});
	
}
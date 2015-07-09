var nextToken;

$(document).ready(function(){
	listNewsItems();
	
});

$('#seemore').click(function(event){
	event.preventDefault();
	if (nextToken)
	{
		listMoreArticles(nextToken);
	}
});

function listMoreArticles(pageToken) {
	
	var urlString = "/api/news/posts?pageToken=" + pageToken;
	
	$.ajax({
	    url: urlString,
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	// console.log(response);
	            	
	            	if (response.items)
	            	{
	            		for (var i=0; i<response.items.length; i++)
	            		{
	            			var newTertiaryStory = $('.tertiary-story').first().clone();
	            			$(newTertiaryStory).find('img').attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=');
	            			
	            			var html = $.parseHTML( response.items[i].content );
	            			var element = document.createElement('div');
	            			$(element).html(response.items[i].content);
	            			
	            			var link = document.createElement('a');
	            			$(link).html(response.items[i].title);
	            			
	            			var imgUrl = response.items[i].images[0].url;
	            			imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
	            			
	            			var urlSlug = response.items[i].id;
	            			urlSlug += '-' + convertToSlug(response.items[i].title);
	            			
	            			$(newTertiaryStory).find('.headline').html('');
	            			$(newTertiaryStory).find('.headline').append($(link));
	            			$(newTertiaryStory).find('.date').html(prettyDate(response.items[i].published));
	            			$(newTertiaryStory).find('img').attr('src',imgUrl);
	            			$(newTertiaryStory).find('a').attr('href','bitcoin-news/' + urlSlug);
	            			$(newTertiaryStory).find('.description').html($(element).find('div#brief').first().html());
	            			$(newTertiaryStory).css('display: none;')
	            			
	            			$('div.news-tertiary').append($(newTertiaryStory));
	            			
	            		}
	            		$('div.news-tertiary div').show();
	            		$('.tertiary-story').first().hide();
	            		if (!response.nextPageToken)
	            		{
	            			$('#seemore').hide();
	            		} else {
	            			nextToken = response.nextPageToken;
	            		}
	            	} else {
	            		$('#seemore').hide();
	            	}
	            	
	            },
	            500: function (response) {
	            	console.log(response);
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  
	          }
	});
}

function listNewsItems(pageToken) {
	
	var urlString = "/api/news/posts";
	
	$.ajax({
	    url: urlString,
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	
	            	// console.log(response);
	            	
	            	var hasPrimary = false;
	            	var hasSecondary = false;
	            	var hasVOTD = false;
	            	var secondaryHeadlines = [0, 0, 0, 0];
	            	var usedArticles = [];
	            	var secondaryHeadlineLocations = [0, 1, 2, 3];
	            	
	            	nextToken = response.nextPageToken;
	            	
	            	for (var i=0; i<response.items.length; i++)
	            	{
		            	if (response.items[i].labels != null && response.items[i].labels.indexOf('headline') != -1)
	            		{
		            		if (!hasPrimary)
		            		{
		            			var imgUrl = response.items[i].images[0].url;
            					imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
            					
            					var urlSlug = response.items[i].id;
                				urlSlug += '-' + convertToSlug(response.items[i].title);
            					
		            			$('.news-featured .lead-story img').attr('src',imgUrl);
		            			$('.news-featured .lead-story .figcaption').html(response.items[i].title);
		            			$('.news-featured .lead-story a').attr('href','bitcoin-news/' + urlSlug);
		            			usedArticles[usedArticles.length] = response.items[i].id;
		            			hasPrimary = true;
		            		} else {
		            			for (var j=0; j<secondaryHeadlines.length; j++)
		            			{
		            				if (secondaryHeadlines[j] == 0 && secondaryHeadlines.indexOf(response.items[i].id) == -1)
		            				{
		            					$('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).find('.headline').remove();
		            					$('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).find('.figcaptionsmall').html(response.items[i].title);
		            					var figCaptionHeight = $('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).find('.figcaptionsmall').height();
		            					figCaptionHeight = 200 - figCaptionHeight - 10; 
		            					$('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).find('.figcaptionsmall').css('margin-top', figCaptionHeight + 'px');
		            					
		            					var imgUrl = response.items[i].images[0].url;
		            					imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
		            					
		            					var urlSlug = response.items[i].id;
		                				urlSlug += '-' + convertToSlug(response.items[i].title);
		            					
		            					$('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).find('img').attr('src',imgUrl);
		            					$('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).find('a').attr('href','bitcoin-news/' + urlSlug);
		            					
		            					var parentHeight = $('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).height();
		            					var parentWidth = $('.news-secondary .secondary-story').eq(secondaryHeadlineLocations[j]).width();
		            					
		            					secondaryHeadlines[j] = response.items[i].id;
		            					usedArticles[usedArticles.length] = response.items[i].id;
		            				}
		            			}
		            		}
	            		}
	            	}
	            	$('.news-featured .latest-stories .latest-story').remove();
	            	
	            	var newsListLength = response.items.length;
	            	if (newsListLength > 10)
	            	{
	            		newsListLength = 10;
	            	}
	            	
	            	var tertiaryStory = 0;
	            	
	            	for (var i=0; i<newsListLength; i++)
	            	{
	            		if (response.items[i].labels != null && response.items[i].labels.indexOf('news') != -1)
	            		{
	            			var imgUrl = response.items[i].images[0].url;
        					imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
        					
        					var urlSlug = response.items[i].id;
            				urlSlug += '-' + convertToSlug(response.items[i].title);
        					
	            			$('.news-featured .latest-stories').append($('<div class="latest-story">').
	            					append(
	            							'<a href="bitcoin-news/'+ urlSlug +'"><img src="'+ imgUrl +'" />' + response.items[i].title +
	            							'</a><div class="date" title="'+ response.items[i].published +'">' + prettyDate(response.items[i].published) + '</div>'
	            					)
	            			);
	            			if (usedArticles.indexOf(response.items[i].id) == -1 && tertiaryStory <= 5) {
	            				usedArticles[usedArticles.length] = response.items[i].id;
	            				
	            				var newTertiaryStory = $('.tertiary-story').first().clone();
		            			$(newTertiaryStory).find('img').attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=');
	            				
	            				var html = $.parseHTML( response.items[i].content );
	            				var element = document.createElement('div');
	            				$(element).html(response.items[i].content);
	            				
	            				var link = document.createElement('a');
	            				$(link).html(response.items[i].title)
	            				
	            				var urlSlug = response.items[i].id;
	            				urlSlug += '-' + convertToSlug(response.items[i].title);
	            				
	            				var imgUrl = response.items[i].images[0].url;
            					imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
	            				
	            				$(newTertiaryStory).find('.headline').html('');
		            			$(newTertiaryStory).find('.headline').append($(link));
		            			$(newTertiaryStory).find('.date').html(prettyDate(response.items[i].published));
		            			$(newTertiaryStory).find('img').attr('src',imgUrl);
		            			$(newTertiaryStory).find('a').attr('href','bitcoin-news/' + urlSlug);
		            			$(newTertiaryStory).find('.description').html($(element).find('div#brief').first().html());
		            			$(newTertiaryStory).css('display', '');
		            			
		            			$('div.news-tertiary').append($(newTertiaryStory));
	            				
	            				tertiaryStory++;
	            			}
	            		}
	            	}
	            	
	            },
	            500: function (response) {
	
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  $('.starthidden').fadeTo( 400 , 1, function() {
	        		    // Animation complete
	        	  });
	          }
	});
}

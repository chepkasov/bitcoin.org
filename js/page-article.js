var listLoaded;
var articleLoaded;
var articleId;
var linkClicked = false;
var statePoped = false;
var firstLoad = true;

$(document).ready(function(){
	
	listLoaded = false;
	articleLoaded = false;
	
	listNewsItems();
	
	articleId = document.URL.substr(document.URL.lastIndexOf('/')+1);
	
	if (articleId != null)
	{
		getArticle(articleId);
	}
});

function listNewsItems() {
	$.ajax({
	    url: "/api/news/posts",
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	
	            	// console.log(response);
	            	
	            	var hasPrimary = false;
	            	var hasSecondary = false;
	            	var hasVOTD = false;
	            	var usedArticles = [];
	            	
	            	var newsListLength = response.items.length;
	            	if (newsListLength > 5)
	            	{
	            		newsListLength = 5;
	            	}
	            	
	            	for (var i=0; i<newsListLength; i++)
	            	{
	            		if (response.items[i].labels != null && response.items[i].labels.indexOf('news') != -1)
	            		{
	            			var articleItem = response.items[i];
	            			
	            			var storyItem = $('#latest-story-template').clone();
	            			var imgUrl = articleItem.images[0].url;
        					imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
            				
        					var urlSlug = articleItem.id;
            				urlSlug += '-' + convertToSlug(articleItem.title);
	            			
	            			$(storyItem).removeAttr('id');
	            			$(storyItem).data('articleid', articleItem.id);
	            			$(storyItem).find('.date').html(prettyDate(articleItem.published));
	            			$(storyItem).find('img').attr('src', imgUrl);
	            			$(storyItem).find('a').attr('href', urlSlug);
	            			$(storyItem).find('a').html(articleItem.title);
	            			
	            			if (articleItem.id == articleId)
	            			{
	            				$(storyItem).hide();
	            			}
	            			$('#right-story-container').append($(storyItem));
	            		}
	            	}
	            	$('#latest-story-template').remove();
	            	
	            },
	            500: function (response) {
	
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  
	        	  listLoaded = true;
	        	  
	        	  if (listLoaded && articleLoaded)
	        	  {
	        		  $('.starthidden').fadeTo( 300 , 1, function() {
	        			  // Animation complete
	        		  });	        		 
	        	  }
	          }
	});
}

$('div').on('click', '.article-link', function(event) {
	event.preventDefault();
	if (linkClicked != true) {
		linkClicked = true;
		var articleId = $(this).attr('href');
		$('.lead-story').fadeTo( 300 , 0, function() {
			getArticle(articleId);
			$('#right-story-container .latest-story').show(600);
			$('#right-story-container .latest-story a[href='+articleId+']').parent().hide(600);
		});
	}
});

window.onpopstate = function(e){
    if (e.state && !linkClicked)
    {
    	var articleId = e.state;
    	statePoped = true;
    	getArticle(articleId);
		$('#right-story-container .latest-story').show(600);
		$('#right-story-container .latest-story a[href='+articleId+']').parent().hide(600);
    }
};

function getArticle(articleId) {
	
	articleId = articleId.substr(0, articleId.indexOf('-'));
	
	$.ajax({
	    url: "/api/news/post/" + articleId,
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	// console.log(response);
	            	var content = document.createElement('div');
	            	$(content).html(response.content);
	            	
	            	$(content).find('img').each(function () {
	            		var imgUrl = $(this).attr('src');
	            		imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
	            		$(this).attr('src', imgUrl)
	            	});
	            	
	            	// Take the first image, place it first and remove it
	            	$(content).find('img').first().remove();
	            	
	            	var imgUrl = response.images[0].url;
					imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
	            	
	            	$('.news-featured .lead-story .pure-img').attr('src',imgUrl);
	            	
	            	$('#textcontent').html($(content).html());
	            	$('.news-featured .lead-story h1').html(response.title);
	            	
	            	document.title = response.title;
	            	
					$("meta[name='description']").remove();
					$('head').append($('<meta name="description">').attr('content', $(content).find('div#brief').first().text()));

					$("meta[property='og\\:title']").remove();
					$('head').append($('<meta property="og:title">').attr('content', response.title));
					$("meta[property='og\\:description']").remove();
					$('head').append($('<meta property="og:description">').attr('content', $(content).find('div#brief').first().text()));
					$("meta[property='og\\:image']").remove();
					$('head').append($('<meta property="og:image">').attr('content', imgUrl));

					$("meta[property='twitter\\:card']").remove();
					$('head').append($('<meta property="twitter:card">').attr('content', 'summary_large_image'));
					$("meta[property='twitter\\:site']").remove();
					$('head').append($('<meta property="twitter:site">').attr('content', '@BTCTN'));
					$("meta[property='twitter\\:creator']").remove();
					$('head').append($('<meta property="twitter:creator">').attr('content', '@BTCTN'));
					$("meta[property='twitter\\:title']").remove();
					$('head').append($('<meta property="twitter:title">').attr('content', response.title));
					$("meta[property='twitter\\:description']").remove();
					$('head').append($('<meta property="twitter:description">').attr('content', $(content).find('div#brief').first().text()));
					$("meta[property='twitter\\:image']").remove();
					$('head').append($('<meta property="twitter:image">').attr('content', imgUrl));
	            	
	            	$('#article-timestamp span').eq(0).html(prettyDate(response.published));
	            	$('#article-timestamp span').eq(1).html(prettyDate(response.updated));
	            	
	            	if ($(content).find('#author').length != 0)
	            	{
	            		$('#byline').html('Writen by ' + $(content).find('#author').first().html());
	            	} else {
	            		$('#byline').html('Writen by ' + response.author.displayName);
	            	}
	            	
	            	if ($(content).find('#btcaddr').length != 0)
	            	{
	            		var qrcode = new QRCode("qrcodeimg", {
	            		    text: "bitcoin:" + $(content).find('#btcaddr').first().html(),
	            		    width: 128,
	            		    height: 128,
	            		    colorDark : "#000000",
	            		    colorLight : "#ffffff",
	            		    correctLevel : QRCode.CorrectLevel.H
	            		});
	            		$('#qrcodelink').attr('href', 'https://blockchain.info/address/' + $(content).find('#btcaddr').first().html());
	            	}
	            	
	            	var urlSlug = response.id;
    				urlSlug += '-' + convertToSlug(response.title);
	            	
	            	if (!statePoped && !firstLoad)
	            	{
	            		window.history.pushState(urlSlug, response.title, urlSlug);
	            	} else {
	            		statePoped = false;	            		
	            	}
	            	firstLoad = false;
	            	
	            },
	            500: function (response) {
	            	console.log(response);
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  articleLoaded = true;
	        	  
	        	  if (listLoaded && articleLoaded)
	        	  {
	        		  $('.starthidden').fadeTo( 300 , 1, function() {
	        			  
	        		  });
	        		  $('.lead-story').fadeTo( 300 , 1, function() {
	        			  
	        		  });
	        	  }

	        	  // Load comments
	        	  var disqus_shortname = 'bitcoincom';
		      	    (function() {
		      	        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		      	        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		      	        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		      	    })();
		      	    
		      	  // Load FB share button
		      	  $('.fb-share-button').attr('href', window.location.href);
		      	  (function(d, s, id) {
		      	  var js, fjs = d.getElementsByTagName(s)[0];
		      	  if (d.getElementById(id)) return;
		      	  js = d.createElement(s); js.id = id;
		      	  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.3";
		      	  fjs.parentNode.insertBefore(js, fjs);
		      	  }(document, 'script', 'facebook-jssdk'));
		      	  
	        	  linkClicked = false;
	          }
	});
}

function getComments(articleId) {
	$.ajax({
	    url: "/api/news/comments/" + articleId,
	    type: "GET",
	    cache: false,
	    data: { },
	    statusCode: {
	            200: function (response) {
	            	// console.log(response);
	            	var comment = document.createElement('div');
	            	$(comment).html($('#comment-template').html());
	            	
	            	if ('items' in response)
	            	{
	            		for (var i=0; i<response.items.length; i++)
	            		{
	            			var comment = document.createElement('div');
	            			$(comment).html($('#comment-template').html());
	            			$(comment).addClass('tertiary-story');
	            				
	            			var commentData = response.items[i];
	            			var author = commentData.author.displayName
	            				
	            			$(comment).find('.headline').html(author + ' says:');
	            			$(comment).find('.description').html(commentData.content);
	            			$(comment).find('.date').html(prettyDate(commentData.published));
	            				
	            			$('#comment-container').append($(comment));
	            		}
	            	} else {
	            		var comment = document.createElement('h2');
            			$(comment).html('No comments');
            			$('#comment-container').html($(comment));
	            	}
	            	$('#comment-template').remove();
	            	$('.html-template').remove();
	            },
	            500: function (response) {
	            	console.log(response);
	            }
	          },
	          complete: function(e, xhr, settings){
	        	  
	          }
	});
}

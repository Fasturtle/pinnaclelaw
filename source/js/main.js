var pinnacle = {
	functions:{},
	settings:{
		title:'Pinnacle Law',
		transitions:{
			_default:300,
			background:500
		},
		breakPoints:{
			desktop:1024,
			tablet:768,
			mobile:480
		},
		contentPadding:{
			top:70,
			right:60,
			bottom:70,
			left:50
		},
		infoScroll : false,
		placeholderImage:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
	},
	preloaded:[]
};

(function ($) {
          
          var throttle = function (func, minThreshold, maxThreshold, execAsap) {
            var minTimeout, maxTimeout, startTime;
            minThreshold = minThreshold || 300;
            maxThreshold = maxThreshold || 9000000;

            return function throttled() {
              var obj = this, args = arguments;

              function maxDelayed() {
                execFunc();
              }

              function minDelayed() {
                if (!execAsap){
                  execFunc();
                }
                startTime = null;
              }

              function execFunc(){
                func.apply(obj, args);

                minTimeout = null;
                startTime = null;
                clearTimeout(minTimeout);
              }
              
              
              if (minTimeout && (Date.now()-startTime)<maxThreshold){
                clearTimeout(minTimeout);
              }
              else if (execAsap || (Date.now()-startTime)>maxThreshold){
                clearTimeout(minTimeout);
                execFunc();
              }
             if(!startTime){
                startTime = Date.now();
              }
              minTimeout = setTimeout(minDelayed, minThreshold);
              
            };
          };
          // smartresize 
          var createFn = function(fn1,fn2){
            jQuery.fn[fn1] = function (fn,a,b,c) { return fn ? this.bind(fn2, throttle(fn,a,b,c)) : this.trigger(fn1); };
          }          

          createFn('smartscroll','mousewheel');

        })(jQuery);

$(document).ready(function(){
	// load json data
	pinnacle.functions.loadData();
});


pinnacle.functions.loadData = function(){
	$.ajax({
		url:'/data/data.min.json',
		method:'GET',
		dataType:'json'
	}).done(function(data){
		pinnacle.data = data;
		pinnacle.functions.init();
	}).fail(function(){
		console.log('fail');
	});
};


pinnacle.functions.init = function(){
	var currentUrl = pinnacle.functions.currentUrl();

	// setup app links
	$('.app-link').each(function(){
		pinnacle.functions.setupAppLink($(this));
	});

	// setup forms
	$('form').each(function(){
		pinnacle.functions.setupForm($(this));
	});

	// setup map
	pinnacle.functions.setupMap();
	

	// setup accordions
	$('.accordion li').each(function(){
		pinnacle.functions.setupAccordion($(this));
	});

	// set next and prev
	pinnacle.functions.setNextPrev(currentUrl);

	// setup url change listener
	$(window).on('popstate', function(event){
		pinnacle.functions.changePage(pinnacle.functions.currentUrl());
	});

	// set current break point
	pinnacle.functions.setBreakPoint();

	// set orietation
	pinnacle.functions.setOrientation();

	// size and position content
	pinnacle.functions.sizePosition(currentUrl);

	/* OLD
	// scroll listner
	pinnacle.transitioning = false;
	$('#content').on('mousewheel',function(event){
		if(!pinnacle.transitioning){
			if(event.deltaY > 0 || event.deltaX < 0){
				// previous
				if(!pinnacle.transitioning && typeof pinnacle.previousUrl != 'undefined'){
					pinnacle.functions.changePage(pinnacle.previousUrl,'previous');
				}
			}else{
				// next
				if(!pinnacle.transitioning && typeof pinnacle.nextUrl != 'undefined'){
					pinnacle.functions.changePage(pinnacle.nextUrl,'next');
				}
			}
		}
	});

	*/
	// scroll listner
	pinnacle.transitioning = false;
	$('#content').smartscroll(function(event){

		//console.log(pinnacle.settings.infoScroll);

		var offContent = true;
		if(pinnacle.settings.infoScroll == true) {
			offContent = $(event.target).parents('#info_wrapper').length > 0 ? false : true;
		} 

		if(!pinnacle.transitioning && offContent == true){
			if(event.deltaY > 0 || event.deltaX < 0){
				// previous
				if(!pinnacle.transitioning && typeof pinnacle.previousUrl != 'undefined'){
					pinnacle.functions.changePage(pinnacle.previousUrl,'previous');
				}
			}else{
				// next
				if(!pinnacle.transitioning && typeof pinnacle.nextUrl != 'undefined'){
					pinnacle.functions.changePage(pinnacle.nextUrl,'next');
				}
			}
		}
	},500,8000,true);


	// swipe listner
	pinnacle.transitioning = false;
	$('#content').on('swipeleft',function(){
		if(!pinnacle.transitioning && typeof pinnacle.nextUrl != 'undefined'){
			pinnacle.functions.changePage(pinnacle.nextUrl,'next');
		}
	});
	$('#content').on('swiperight',function(){
		if(!pinnacle.transitioning && typeof pinnacle.previousUrl != 'undefined'){
			pinnacle.functions.changePage(pinnacle.previousUrl,'previous');
		}
	});


	// resize listener
	pinnacle.resizing = false;
	$(window).on('resize',function(){
		pinnacle.resizing = true;
		clearTimeout(pinnacle.resizingTimer);
		pinnacle.resizingTimer = setTimeout(function(){
			pinnacle.resizing = false;

			// set current break point
			pinnacle.functions.setBreakPoint();

			// set orientation
			pinnacle.functions.setOrientation();

			// size and position content
			pinnacle.functions.sizePosition(pinnacle.functions.currentUrl());
		},300);

		pinnacle.functions.setOrientation();
		pinnacle.functions.sizeVideo();
	});
	pinnacle.functions.sizeVideo();

	// mobile nav button
	$('#mobile-nav').on('click',function(event){
		var $body = $('body');
		if($body.hasClass('mobile-nav-active')){
			$body.removeClass('mobile-nav-active');
		}else{
			$body.addClass('mobile-nav-active');
		}
	});
}


pinnacle.functions.currentUrl = function(){
	return window.location.pathname;
};


pinnacle.functions.setOrientationImage = function(){
	var $activeBg = $('#content .background.active');
	var currentBgUrl = $activeBg.css('background-image');
	var currentBg = $activeBg.data('background') || {'landscape':'' , 'portrait':''};
	var validImage = currentBg.landscape || currentBg.portrait || '';
	
	validImage = currentBg[pinnacle.orientation] || validImage || '';

	if(validImage != currentBgUrl && currentBgUrl.indexOf(validImage) == -1){
		$activeBg.css({'background-image':'url("'+validImage+'")'});
		//console.log('orientation switched to ' + pinnacle.orientation)
	}


	var $notActiveBg = $('#content .background:not(.active)');
	var notActiveCurrentBgUrl = $notActiveBg.css('background-image');
	var notActiveCurrentBg = $notActiveBg.data('background') || {'landscape':'' , 'portrait':''};
	var notActiveValidImage = notActiveCurrentBg.landscape || notActiveCurrentBg.portrait;
	
	notActiveValidImage = notActiveCurrentBg[pinnacle.orientation] || notActiveValidImage;

	if(notActiveValidImage != notActiveCurrentBgUrl && notActiveCurrentBgUrl.indexOf(notActiveValidImage) == -1){
		$notActiveBg.css({'background-image':'url("'+notActiveValidImage+'")'});
		//console.log('orientation switched to ' + pinnacle.orientation)
	}
};


pinnacle.functions.sizeVideo = function(){
	var $video = $('.background').find('video');
	
	if($video.length){
		var $parent = $video.closest('.background'),
		parentWidth = $parent.innerWidth(),
		parentHeight = $parent.innerHeight(),
		parentRatio = parentHeight/parentWidth,
		videoWidth = 1280,
		videoHeight = 720,
		videoRatio = videoHeight/videoWidth,
		videoCSS = {};
		if (parentRatio > videoRatio) {
			videoCSS['height'] = parentHeight,
			videoCSS['width'] = Math.round(parentHeight / videoRatio);
			videoCSS['top'] = 0;
			videoCSS['left'] = Math.round((parentWidth - videoCSS['width']) / 2);
		} else if (parentRatio < videoRatio) {
			videoCSS['width'] = parentWidth,
			videoCSS['height'] = Math.round(parentWidth * videoRatio);
			videoCSS['left'] = 0;
			videoCSS['top'] = Math.round((parentHeight - videoCSS['height']) / 2);
		} else {
			videoCSS['width'] = parentWidth;
			videoCSS['height'] = parentHeight;
			videoCSS['left'] = 0;
			videoCSS['top'] = 0;
		}
		$video.css(videoCSS);
	}
}


pinnacle.functions.setNextPrev = function(url){
	var pageData = pinnacle.functions.pageData(url);
	if(pageData){
		if(typeof pageData['next_url'] != 'undefined'){
			pinnacle.nextUrl = pageData['next_url'];
		}else{
			delete pinnacle.nextUrl;
		}
		if(typeof pageData['previous_url'] != 'undefined'){
			pinnacle.previousUrl = pageData['previous_url'];
		}else{
			delete pinnacle.previousUrl;
		}
	}
}


pinnacle.functions.setOrientation = function(){

	var $window = $(window);
	var windowHeight = $window.height();
	var windowWidth = $window.width();

	pinnacle.orientation = (parseInt(windowHeight) < parseInt(windowWidth)) ? 'landscape' : 'portrait';

	//console.log(pinnacle.orientation)
	pinnacle.functions.setOrientationImage();

};


pinnacle.functions.setBreakPoint = function(){
	var windowWidth = $(window).width();
	var breakPoint = 'desktop';
	for(var value in pinnacle.settings.breakPoints){
		if(parseInt(pinnacle.settings.breakPoints[value]) > windowWidth){
			breakPoint = value;
		}
	}
	pinnacle.breakPoint = breakPoint;
};


pinnacle.functions.pageData = function(url){
	if(typeof url != 'undefined' && typeof pinnacle.data != 'undefined'){
		for(var i=0; i<pinnacle.data.pages.length; i++){
			var page = pinnacle.data.pages[i];
			if(page.url == url){
				return page;
			}
		}
	}
	return false;
};


pinnacle.functions.preloadImage = function(src){
	var image = new Image();
	/*image.onload = function(){
		return true;
	}*/
	image.src = src;
};


pinnacle.functions.hidePage = function(){
	pinnacle.transitioning = true;
	
	// hide info top
	$('#page_info .top_container').animate({opacity:0.0}, pinnacle.settings.transitions._default);
	// hide info bottom
	$('#page_info .bottom_container').animate({opacity:0.0}, pinnacle.settings.transitions._default);
	// hide scroll
	$('#sub_nav').animate({opacity:0.0}, pinnacle.settings.transitions._default);
	// hide image
	$('#page_image').animate({opacity:0.0}, pinnacle.settings.transitions._default).removeClass();
	// hide mape
	$('#google-map').animate({opacity:0.0}, pinnacle.settings.transitions._default, function(){
		$(this).children('#map').removeClass('active');
	});
};


pinnacle.functions.showPage = function(direction){
	var $container = $('#content');
	var $activeBg = $('#content .background.active');
	var $notActiveBg = $('#content .background:not(.active)');
	var containerWidth = $container.innerWidth();
	var activeLeftTo = -containerWidth;
	var notActiveLeftTo = '0px';
	var notActiveLeftFrom = containerWidth;

	if(typeof direction != 'undefined' && direction == 'previous'){
		activeLeftTo = containerWidth;
		notActiveLeftFrom = -containerWidth;
	}

	/* OLD
	// slide in next background
	$notActiveBg.css({'display':'block', 'left':notActiveLeftFrom}).animate({'left':notActiveLeftTo}, pinnacle.settings.transitions.background);
	$activeBg.css({'display':'block'}).animate({'left':activeLeftTo}, pinnacle.settings.transitions.background, function(){
			$(this).css({'display':'none'});
		});
	*/

	// slide in next background
	$notActiveBg.css({'display':'block', 'left':notActiveLeftFrom}).animate({'left':notActiveLeftTo}, pinnacle.settings.transitions.background);
	$activeBg.css({'display':'block'}).animate({'left':activeLeftTo}, pinnacle.settings.transitions.background, function(){
			$(this).css({'display':'none'});
		});

	// trigger css3 animation class
	$('body').addClass('css_transition_refresh');
	setTimeout(function(){
	  $('body').removeClass('css_transition_refresh');	
	},10);// small delay to allow DOM to make the change


	// show page content
	// show info top
	$('#page_info .top_container').animate({opacity:1.0}, pinnacle.settings.transitions._default);
	// show info bottom
	$('#page_info .bottom_container').animate({opacity:1.0}, pinnacle.settings.transitions._default);
	// show scroll
	$('#sub_nav').animate({opacity:1.0}, pinnacle.settings.transitions._default);
	// show image
	$('#page_image').animate({opacity:1.0}, pinnacle.settings.transitions._default);
	if(pinnacle.currentUrl == "/contact/") {
		// show map only on contact page
		$('#google-map').animate({opacity:1.0}, pinnacle.settings.transitions._default, function(){
			$(this).children("#map").addClass('active');
		});		
	}

	// set active
	$notActiveBg.addClass('active');
	$activeBg.removeClass('active');

	// transition finished
	setTimeout(function(){
		pinnacle.transitioning = false;
	},pinnacle.settings.transitions.background);
};


pinnacle.functions.setupForm = function($element){
	var $form =  $element;

	// setup select
	var selectDefaults = {
		multiple:false
	}

	$form.find('.select li').each(function(){
		$(this).on('click.form',function(event){
			var $thisItem = $(event.target);
			var $thisSelect = $thisItem.closest('.select');
			var $thisForm = $thisItem.closest('form');
			var targetInputName = $thisSelect.data('input');
			var allowMultiple = $thisSelect.data('multiple');
			var $targetInput = $thisForm.find('input[name="'+targetInputName+'"]');
			var newValue = $thisItem.html();

			if(allowMultiple === true){
				// add active class to item
				$thisItem.toggleClass('active');

				newValue = [];
				$thisSelect.find('li.active').each(function(){
					newValue.push($(this).html())
				})

				// set value
				$targetInput.val(newValue.join(', '));
			} else {
				// set value
				$targetInput.val(newValue);

				// remove active from all
				$thisSelect.find('li').removeClass('active');

				// add active class to item
				$thisItem.addClass('active');
			}
		});
	});

	$form.find('.cta').on('click.form',function(event){
		event.preventDefault();
		var $thisForm = $(event.target).closest('form');

		var $fields = $thisForm.find('input');
		var postData = {};
		var message = '';
		var $servicesValues = $thisForm.find('input[name="service"]').val().split(',');

		// verify data
		$fields.each(function(){
			var $this = $(this);
			var value = $this.val();
			
			if(typeof value == 'undefined' || value == ''){
				message += 'Please provide "'+$this.attr('placeholder')+'"<br>';
			}else{
				postData[$this.attr('name')] = value;
			}
		});

		if(message == ''){
			// send data
			//console.log(postData);
			$.ajax({
				url:$form.attr('action'),
				method:'POST',
				dataType:'json',
				data:postData
			}).done(function(data){
				// conversion tracking
				var servicesValue = $thisForm.find('input[name="service"]').val();
				if(servicesValue.indexOf('Traffic') != -1){
					//OLD CONVERSION CODE
					//$('<img src="http://www.googleadservices.com/pagead/conversion/942888148/?label=O-f1CMvQ1l8Q1KnNwQM&amp;guid=ON&amp;script=0">');
					
					$('<img src="//www.googleadservices.com/pagead/conversion/881081874/?label=uqgTCKWN_GYQkvyQpAM&amp;guid=ON&amp;script=0"/>');
				}
				if(servicesValue.indexOf('Criminal') != -1){
					//OLD CONVERSION CODE
					//$('<img src="http://www.googleadservices.com/pagead/conversion/942888148/?label=nJi9CKT64V8Q1KnNwQM&amp;guid=ON&amp;script=0">');
					
					$('<img src="//www.googleadservices.com/pagead/conversion/881081874/?label=vWepCOPKi2cQkvyQpAM&amp;guid=ON&amp;script=0"/>');
				}
				if(servicesValue.indexOf('DUI') != -1){
					//OLD CONVERSION CODE
					//$('<img src="http://www.googleadservices.com/pagead/conversion/942888148/?label=b00uCKf64V8Q1KnNwQM&amp;guid=ON&amp;script=0">');
					
					$('<img src="//www.googleadservices.com/pagead/conversion/881081874/?label=PIfdCOS9kGcQkvyQpAM&amp;guid=ON&amp;script=0"/>');
				}
				
				// reset form
				$fields.val('');
				$thisForm.find('.select li').removeClass('active');

				// message user
				pinnacle.functions.siteMessage('Your message has been sent.');
			}).fail(function(){
				// message user
				pinnacle.functions.siteMessage('There was an error sending your message.');
			});
		}else{
			// errro message
			//alert(message);
			pinnacle.functions.siteMessage('MISSING INFORMATION<hr>'+message);
		}
	});
};


pinnacle.functions.siteMessage = function(message){
	$messageBox = $('#site-message');
	
	// set message
	$messageBox.find('.message').html(message);

	// show message
	$messageBox.css({opacity:0.0,display:'table'}).animate({opacity:1.0}, pinnacle.settings.transitions._default);

	// hide message
	setTimeout(function(){
		$messageBox.animate({opacity:0.0}, pinnacle.settings.transitions._default*2, function(){
			$messageBox.css({display:'none'});
		});
	},5000);
};


pinnacle.functions.setupAppLink = function($element){
	// remove event listener to avoid multiple handler calls
	$element.off('click.applink');
	// add event listener
	$element.on('click.applink', function(event){
		event.preventDefault();
		pinnacle.functions.changePage($(this).attr('href'));
	});
};


pinnacle.functions.setupAccordion = function($element){
	// remove event listener to avoid multiple handler calls
	$element.off('click.accordion');
	// add event listener
	$element.on('click.accordion', function(event){
		var $this = $(this);
		var $accordion  = $this.parent();
		if($this.hasClass('active')){
			$(this).removeClass('active');
		}else{
			$accordion.find('li').each(function(){
				$(this).removeClass('active');
			});
			$this.addClass('active');
		}
	});
};


pinnacle.functions.changePage = function(url, direction){
	if(typeof pinnacle.currentUrl == 'undefined'){
		pinnacle.currentUrl = pinnacle.functions.currentUrl();
	}

	if(pinnacle.currentUrl != url){
		// hide previous page
		pinnacle.functions.hidePage();

		// close mobile menu
		$('body').removeClass('mobile-nav-active');

		// load next page data
		setTimeout(function(){
				pinnacle.functions.loadPage(url);
			}, pinnacle.settings.transitions._default);

		// size and position content
		setTimeout(function(){
				pinnacle.functions.sizePosition(url);
			}, pinnacle.settings.transitions._default);

		// show next page
		setTimeout(function(){
				pinnacle.functions.showPage(direction);
			}, pinnacle.settings.transitions._default);
		
		// save current url
		pinnacle.currentUrl = url;

		// tracking events
		pinnacle.functions.tracking();
	}
}


pinnacle.functions.tracking = function(){
	// google tracking
	if(typeof ga != 'undefined'){
		ga('create', 'UA-64306760-1', 'auto');
	    ga('send', 'pageview');
	}
};

pinnacle.functions.sizePosition = function(url){
	var pageData = pinnacle.functions.pageData(url);
	
	$("#newImg").remove();

	var $window = $(window);
	var windowHeight = $window.height();
	var windowWidth = $window.width();
	var $content = $('#content');

	// position sub nav
	var $subNav = $('#sub_nav');
	var subNavHeight = $subNav.height();
	var subNavWidth = $subNav.width();
	$subNav.css({'margin-top':-(subNavHeight/2)});

	pinnacle.functions.sizeVideo();

	pinnacle.functions.setOrientation();
	
	// size info
	var $pageInfo = $('#page_info');
	var $infoWrapper = $('#info_wrapper');
	/*if(typeof pageData.content.size != 'undefined' && typeof pageData.content.size[pinnacle.breakPoint] != 'undefined'){
		var pageInfoSizes = pageData.content.size[pinnacle.breakPoint].split(' ');
		// set width
		$pageInfo.css({'width':pageInfoSizes[0], 'height':''});
		if(typeof pageInfoSizes[1] != 'undefined'){
			// height if there is one
			$pageInfo.css({'height':pageInfoSizes[1]});
		}
	}else{
		$pageInfo.css({'width':'', 'height':''});
	}*/

	// size image
	var $pageImage = $('#page_image');
	/*if(typeof pageData.image != 'undefined' && typeof pageData.image.size != 'undefined' && typeof pageData.image.size[pinnacle.breakPoint] != 'undefined'){
		var pageImageSizes = pageData.image.size[pinnacle.breakPoint].split(' ');
		// set width
		$pageImage.css({'width':pageImageSizes[0], 'height':''});
		if(typeof pageImageSizes[1] != 'undefined'){
			// height if there is one
			$pageImage.css({'height':pageImageSizes[1]});
		}
	}else{
		$pageImage.css({'width':'', 'height':''});
	}*/

	// position info
	if(typeof pageData.content.position != 'undefined' && typeof pageData.content.position[pinnacle.breakPoint] != 'undefined'){
		var pageInfoPositions = pageData.content.position[pinnacle.breakPoint].split(' ');

		// horizontal position
		if(pageInfoPositions[1] == 'left'){
			//$pageInfo.css({'left':pinnacle.settings.contentPadding.left, 'right':'', 'margin-left':''});
			$pageInfo.addClass('horizontal-left').removeClass('horizontal-center horizontal-right').css({'margin-left':''});
		}
		if(pageInfoPositions[1] == 'right'){
			//$pageInfo.css({'right':pinnacle.settings.contentPadding.right+subNavWidth, 'left':'', 'margin-left':''});
			$pageInfo.addClass('horizontal-right').removeClass('horizontal-center horizontal-left').css({'margin-left':''});
		}
		if(pageInfoPositions[1] == 'center'){
			//$pageInfo.css({'left':'50%', 'margin-left':-($pageInfo.width()/2), 'right':''});
			/*if($pageInfo.width() > $content.width()){
				$pageInfo.addClass('horizontal-left').removeClass('horizontal-right horizontal-center').css({'margin-left':''});
			}else{
				$pageInfo.addClass('horizontal-center').removeClass('horizontal-right horizontal-left').css({'margin-left':-($pageInfo.width()/2)});
			}*/
			$pageInfo.addClass('horizontal-center').removeClass('horizontal-right horizontal-left').css({'margin-left':''});
		}
		// vertical position
		if(pageInfoPositions[0] == 'top'){
			//$pageInfo.css({'top':pinnacle.settings.contentPadding.top, 'bottom':'', 'margin-top':''});
			$pageInfo.addClass('vertical-top').removeClass('vertical-center vertical-bottom contact-bottom').css({'margin-top':''});
		}
		if(pageInfoPositions[0] == 'bottom'){
			//$pageInfo.css({'bottom':pinnacle.settings.contentPadding.bottom, 'top':'', 'margin-top':''});
			$pageInfo.addClass('vertical-bottom').removeClass('vertical-center vertical-top contact-bottom').css({'margin-top':''});
		}
		if(pageInfoPositions[0] == 'center'){
			//$pageInfo.css({'top':'50%', 'margin-top':-($pageInfo.height()/2), 'bottom':''});
			/*if($pageInfo.height() > $content.height()){
				$pageInfo.addClass('vertical-top').removeClass('vertical-center vertical-bottom').css({'margin-top':''});
			}else{
				$pageInfo.addClass('vertical-center').removeClass('vertical-top vertical-bottom').css({'margin-top':-($pageInfo.height()/2)});
			}*/
			$pageInfo.addClass('vertical-center').removeClass('vertical-top vertical-bottom contact-bottom').css({'margin-top':''});
		}
		// contact page position with google map
		if(pageInfoPositions[0] == 'contact-bottom'){
			//$pageInfo.css({'top':pinnacle.settings.contentPadding.top, 'bottom':'', 'margin-top':''});
			$pageInfo.addClass('contact-bottom').css({'margin-top':''});
		}


		//set the content to the top
		$('#page_info').scrollTop(0);
	}

	// position image
	if(typeof pageData.image != 'undefined' && typeof pageData.image.position != 'undefined' && typeof pageData.image.position[pinnacle.breakPoint] != 'undefined'){
		var pageImagePositions = pageData.image.position[pinnacle.breakPoint].split(' ');
		var pageImageEffect = pageData.image.effect;
		var pageImageSrc = pageData.image.src;
		var newImg = $("<img>", {class: "drunkanimate", id: "newImg", src: pageImageSrc});
				
		// vertical position
		if(pageImagePositions[0] == 'top'){
			$pageImage.css({'top':'0', 'bottom':'', 'margin-top':''});
			newImg.css({'top':'0', 'bottom':'', 'margin-top':''});
			$pageImage.addClass('fadeInDownBig animated');

		}
		if(pageImagePositions[0] == 'bottom'){
			$pageImage.css({'bottom':'0', 'top':'', 'margin-top':''});
			newImg.css({'bottom':'0', 'top':'', 'margin-top':''});
			$pageImage.addClass('fadeInUpBig animated');
		}
		if(pageImagePositions[0] == 'center'){
			$pageImage.css({'top':'50%', 'margin-top':-($pageImage.height()/2), 'bottom':''});
			newImg.css({'top':'50%', 'margin-top':-($pageImage.height()/2), 'bottom':''});
			$pageImage.addClass('fadeInRightBig animated');
		}
		// horizonal position
		if(pageImagePositions[1] == 'left'){
			$pageImage.css({'left':'0', 'right':'', 'margin-left':''});
			newImg.css({'left':'0', 'right':'', 'margin-left':''});
		}
		if(pageImagePositions[1] == 'right'){
			$pageImage.css({'right':'0', 'left':'', 'margin-left':''});
			newImg.css({'right':'0', 'left':'', 'margin-left':''});
			$pageImage.addClass('fadeInRightBig animated');
		}
		if(pageImagePositions[1] == 'center'){
			$pageImage.css({'left':'50%', 'margin-left':-($pageImage.width()/2), 'right':''});
			newImg.css({'left':'50%', 'margin-left':-($pageImage.width()/2), 'right':''});
		}
	}

	if(typeof pageImageEffect != 'undefined' && typeof pageImageSrc != 'undefined' && typeof pageImageEffect != 'undefuned') {
		var newImg;
		setTimeout(function () { 
		    $pageImage.addClass('drunk2animate');
		    newImg.insertAfter($('#page_image'));
		}, 600);
	}

	//scroll for long content
	if( pinnacle.settings.infoScroll != 'undefined' && ( $infoWrapper.innerHeight() > $pageInfo.outerHeight() ))   {
		pinnacle.settings.infoScroll = true;
	} else {
		pinnacle.settings.infoScroll = false;
	}
}


pinnacle.functions.loadPage = function(url){
	//console.log('loadPage: '+url)
	// get data
	var pageData = pinnacle.functions.pageData(url);
	
	if(pageData){
		// update page data
		// page title
		var pageTitle = pageData.title != '' ? pinnacle.settings.title+' - '+pageData.title : pinnacle.settings.title;
		$('title').html(pageTitle);

		// update browser url
		window.history.pushState({'pageTitle':pageTitle}, '', url);

		// add page class to body
    	$('body').attr({'data-url':url});

    	// set next and previous
    	pinnacle.functions.setNextPrev(url);

		// background
		var $container = $('#content');
		var $activeBg = $('#content .background.active');
		var $notActiveBg = $('#content .background:not(.active)');

		$notActiveBg.data('background',pageData.background);
		
		// remove videos
		if(typeof pageData.video_background != 'undefined'){
			// add video
			$notActiveBg.html('<video poster="'+pageData.background.landscape+'" preload="auto" autoplay loop muted><source type="video/mp4" src="'+pageData.video_background+'.mp4"><source type="video/ogg" src="'+pageData.video_background+'.ogv"><source type="video/webm" src="'+pageData.video_background+'.webm"></video>');
		}
		// clear out old video
		setTimeout(function(){
			$activeBg.html('');
		},pinnacle.settings.transitions.background);

		// top info
		if(typeof pageData.content.top != 'undefined' && typeof pageData.content.top.html != 'undefined'){
			$('#page_info .top_container').html(pageData.content.top.html);
		}else{
			// clear old content
			$('#page_info .top_container').html('');
		}

		// bottom info
		if(typeof pageData.content.bottom != 'undefined' && typeof pageData.content.bottom.html != 'undefined'){
			$('#page_info .bottom_container').html(pageData.content.bottom.html);
		}else{
			// clear old content
			$('#page_info .bottom_container').html('');
		}
		
		// image src
		if(typeof pageData.image != 'undefined'){
			$('#page_image').attr({'src':pageData.image.src});
		}else{
			$('#page_image').attr({'src':pinnacle.settings.placeholderImage});
		}

		// tabs
		var $tabNav = $('#page_info .tabs');
		if(typeof pageData.tab != 'undefined'){
			$tabNav.css({'display':'table'}).html('');
			
			// get tab data
			var tabData = pinnacle.data.tabs[pageData.tab.name];

			for(var i=0; i<tabData.length; i++){
				// creat new tab item
				var $newTabItem = $('<li href="'+tabData[i].url+'" class="app-link"><a href="#">'+tabData[i].html+'</a></li>');
				
				// set active
				if(tabData[i].tab == pageData.tab.active){
					$newTabItem.addClass('active');
				}

				$tabNav.append($newTabItem);
			}
		}else{
			$tabNav.css({'display':'none'}).html('');
		}

		// subnav
		var $subNav = $('#sub_nav');
		if(typeof pageData.sub_nav != 'undefined'){
			if(pageData.sub_nav.type == 'scroll'){
				var $scroll = $subNav.find('.scroll');

				// setup link
				$scroll.find('a').attr({'href':pageData.sub_nav.url});

				// show scroll link
				$scroll.css({'display':'block'});
				$subNav.find('.list').css({'display':'none'});
			}else if(pageData.sub_nav.type == 'list'){
				// setup link list
				// clear list out
				var $list = $subNav.find('.list').html('');
				
				// get list data
				var listData = pinnacle.data.lists[pageData.sub_nav.name].links;
				
				// create list items
				for(var link in listData){
					// creat new list item
					var $newListItem = $('<li><a href="'+listData[link]+'" class="app-link">'+link+'</a></li>');
					
					// set active
					if(url == listData[link]){
						$newListItem.addClass('active');
					}

					$list.append($newListItem);
				}

				// show list of links
				$subNav.find('.scroll').css({'display':'none'});
				$list.css({'display':'block'});
			}
		}else{
			// hide subnav 
			$subNav.find('.scroll').css({'display':'none'});
			$subNav.find('.list').css({'display':'none'});
		}

		// setup app links
		$('.app-link').each(function(){
			pinnacle.functions.setupAppLink($(this));
		});

		// setup forms
		$('form').each(function(){
			pinnacle.functions.setupForm($(this));
		});

		// setup accordions
		$('.accordion li').each(function(){
			pinnacle.functions.setupAccordion($(this));
		});
	}
};


pinnacle.functions.sizeElements = function(){
	var elements = ['#page_info','#page'];
};

pinnacle.functions.setupMap = function(){
// map center
var center = new google.maps.LatLng(33.7074665,-112.0044353);


// marker position
var pinnacle = new google.maps.LatLng(33.6771871,-112.0034053);

function initialize() {
  var mapOptions = {
    center: center,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  };

  var map = new google.maps.Map(document.getElementById("map"),mapOptions);

	// Resize stuff...
	google.maps.event.addDomListener(window, "resize", function() {
	   var center = map.getCenter();
	   google.maps.event.trigger(map, "resize");
	   map.setCenter(center); 
	});


  /* Create a custom map type */
	var texturedMapType = new google.maps.ImageMapType({
	    getTileUrl: function(tileCoord, zoom, ownerDocument)
	    {
	        /* Return the same tile for every coord and zoom level */
	        return '/images/pattern_overlay.png';
	    },
	    isPng: true,                    
	    tileSize: new google.maps.Size(200, 200)
	});

	/* Add a new layer between the map and the markers and render tiles here */
	map.overlayMapTypes.push(null);
	map.overlayMapTypes.setAt(0, texturedMapType);

  // InfoWindow content
  var content = '<div id="iw-container">' +
                    '<div class="iw-content">' +
                    	'<table cellpadding="0" cellspacing="0" border="0"><tr colspan="2"><td style="vertical-align:middle">' +
                    		'<img src="/images/header_logo.png" alt="" width="60" style="margin-right:20px;">' +
                    		'</td><td style="vertical-align:middle;padding-bottom:10px">' +
                      		'<h2 style="font-family: Abel;color:#152834;font-size:24px;margin-bottom:8px;">Pinnacle Law</h2>' +
                      		'<p style="margin-bottom:8px;line-height:18px;"><a target="_blank" style="color:#415360;font-weight:bold;text-decoration:underline" href="https://www.google.com/maps/place/Pinnacle+Law/@33.6744529,-111.9782146,15z/data=!4m2!3m1!1s0x0:0x7847a6e84e6ca623">20860 North Tatum Blvd. Suite 180<br/>Phoenix, AZ 85050</a></p>' +
                    		'<p><a href="tel:4803005380" style="color:#415360;font-size:16px;margin-bottom:8px;text-decoration:underline">480.300.5380</a></p>' +
                    	'</td></tr></table>' +
                    '</div>' +
                  '</div>';

  // A new Info Window is created and set content
  var infowindow = new google.maps.InfoWindow({
    content: content,
    position: pinnacle,
    maxWidth: 300
  });
  infowindow.open(map);

  var pinColor = "f5843b";
	var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));
  
   
  // marker options
  var marker = new google.maps.Marker({
    position: pinnacle,
    map: map,
    icon: pinImage
  });

  // When this event is fired the Info Window is opened.
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  // *
  // START INFOWINDOW CUSTOMIZE.
  // The google.maps.event.addListener() event expects
  // the creation of the infowindow HTML structure 'domready'
  // and before the opening of the infowindow, defined styles are applied.
  // *
  google.maps.event.addListener(infowindow, 'domready', function() {

    // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');

    /* Since this div is in a position prior to .gm-div style-iw.
     * We use jQuery and create a iwBackground variable,
     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
    */
    var iwBackground = iwOuter.prev();

    // Removes background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

    // Removes white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    // Moves the infowindow 115px to the right.
    iwOuter.parent().parent().css({left: '5px', top: '-20px'});

    // Moves the shadow of the arrow 76px to the left margin.
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important; display:none'});

    iwOuter.css({'padding': '14px', 'background': '#fcfae6', 'border': '1px solid #415360'});

    // Moves the arrow 76px to the left margin.
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important; display:none'});

    // Changes the desired tail shadow color.
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0) 0px 1px 6px', 'z-index' : '1', 'background': '#fcfae6'});

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({opacity: '0', right: '-16px', top: '18px'});

    // the gradient is removed.
    $('.iw-bottom-gradient').css({display: 'none'});
    
    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });
  });
}
google.maps.event.addDomListener(window, 'load', initialize);
}
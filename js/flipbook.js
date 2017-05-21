/*-----------------------------------------------------------------------------------*/
/*	Flip Book JS
/*-----------------------------------------------------------------------------------*/

(function () {

	/* Basic Settings */
	
	// define pages (default are numbers 1-N)
	var pages = [],
		tocIndex = 3, /* table of content index */
		zoomStrength = 2, /* zoom strength */
		slideShowInterval = 2000, /* slide show delay in miliseconds */
		slideshowTimeout;
	
	/* do NOT EDIT bellow this line */
		
	function postion(firstWidth, firstHeight){
		//$(".position-book").css("height", firstHeight +	 80	);
		$(".position-book").css("margin-left", 20 );
		console.log(($(window).width() - firstWidth)/2 );
	}
	// check hash
	function checkHash(hash) {
		var hash = getHash(), 
			k, 
			intRegex = /^\d+$/;
		
		if (( k = jQuery.inArray(hash, pages)) != -1) {
			k = k+1;
		} else if (intRegex.test(hash)) {
			k = hash;
		} else {
			k = 1;
		}
		
		return k;
	}
	
	// get url 
	function getURL() {
			return window.location.href.split('#').shift();
	}
	
	// get hash tag from url
	function getHash() {
			return window.location.hash.slice(1);
	}
	
	// set hash tag
	function setHashTag(flipbook) {
		var currentID = flipbook.turn('page'),
			pageURL;
			
		if(pages[currentID] != "" && pages[currentID] != undefined) {
			pageURL = getURL() + '#' + pages[currentID];
		} else {
			if(currentID % 2 != 0)
				pageURL = getURL() + '#' + currentID;
			else if(currentID == flipbook.data().totalPages)
				pageURL = getURL() + '#' + currentID;
			else
				pageURL = getURL() + '#' + (currentID + 1);	
		}
			
		window.location.href = pageURL;
	}
	
	// fired when hash changes inside URL
	function hashChange(flipbook, fbCont) {
		var page = checkHash(),
			position = flipbook.position();
			
		page = parseInt(page);
		
		if(page-1 == flipbook.turn('page')) // check if the current page is ok
			return;
			
		if(page == flipbook.data().totalPages) {
			disableShadows(flipbook);
			flipbook.turn('page', page);
		} else if(page % 2 != 0) {
			disableShadows(flipbook);
			flipbook.turn('page', page);
		} else {
			disableShadows(flipbook);
			flipbook.turn('page', (page+1));	
		}
	}
	
	// add inside book shadow
	function addInsideBookShadow(flipbook) {
		
		// inside book shadow
		flipbook.find('div.even div.fb-page').prepend('<div class="fb-inside-shadow-left"></div>');
		flipbook.find('div.odd div.fb-page').prepend('<div class="fb-inside-shadow-right"></div>');
		flipbook.find('div.last div.fb-page').prepend('<div class="fb-inside-shadow-left"></div>');
		flipbook.find('div.first div.fb-page').prepend('<div class="fb-inside-shadow-right"></div>');
	
		// edge page shadow
		flipbook.find('div.even div.fb-page').prepend('<div class="fb-page-edge-shadow-left"></div>');
		flipbook.find('div.odd div.fb-page').prepend('<div class="fb-page-edge-shadow-right"></div>');
		
		//bottom book page (under pages)
		flipbook.append('<div class="fb-shadow-bottom-left"></div>');
		flipbook.append('<div class="fb-shadow-bottom-right"></div>');
		flipbook.append('<div class="fb-shadow-top-left"></div>');
		flipbook.append('<div class="fb-shadow-top-right"></div>');
	}
	
	// hide shadows
	function hideShadows(caller, arrow, flipbook, fbCont, posLeft) {
		var view = flipbook.turn('view'),
			page = flipbook.turn('page'),
			active,
			nextY, nextYend,
			prevY, prevYend,
			posLeft,
			animate = false;
	
		if(animate)
			return;	
	
		if(isNaN(posLeft)){
			posLeft = parseInt(flipbook.position().left);
		} else {
			animate = true;
		}
		
		if(caller == 'start' || animate)
			active = flipbook.activePageCorner();
		
		if((caller == 'start' && active != 'tl' && active != 'bl' && active != 'tr' && active != 'br') ||
			(animate && active != 'tl' && active != 'bl' && active != 'tr' && active != 'br')) {
			active = arrow;
		}
	
		flipbook.children('div.fb-shadow-top-left').stop().clearQueue();
		flipbook.children('div.fb-shadow-bottom-left').stop().clearQueue();
		flipbook.children('div.fb-shadow-top-right').stop().clearQueue();
		flipbook.children('div.fb-shadow-bottom-right').stop().clearQueue();
		
		fbCont.find('div.preview').stop(true, true);
		fbCont.find('div.next').stop(true, true);
	
		if(fbCont.find('div.preview').hasClass('small')) {
			nextY = posLeft + flipbook.width() - 40;
			prevY = posLeft - 45;
			nextYend = posLeft + flipbook.width() - 50;
			prevYend = posLeft;
		} else {
			nextY = posLeft + flipbook.width() + 24;
			prevY = posLeft - 110;
			nextYend = posLeft + flipbook.width() - 50;
			prevYend = posLeft;
		}

		if(page == 2 && animate && (active == 'tl' || active == 'bl' || active == 'left')){
			flipbook.children('div.fb-shadow-top-left').animate( { opacity: 0 }, 200);
			flipbook.children('div.fb-shadow-bottom-left').animate( { opacity: 0 }, 200);
		} else if (page == flipbook.data().totalPages - 2 && animate && (active == 'tr' || active == 'br' || active == 'right')) {
			flipbook.children('div.fb-shadow-top-right').animate( { opacity: 0 }, 200);
			flipbook.children('div.fb-shadow-bottom-right').animate( { opacity: 0 }, 200);
		}
		
		if(animate)
			return;
		
		if (page == 2 && (active == 'tl' || active == 'bl' || active == 'left')) {
			flipbook.children('div.fb-shadow-top-left').animate( { opacity: 0 }, 200);
			flipbook.children('div.fb-shadow-bottom-left').animate( { opacity: 0 }, 200);
			
			fbCont.find('div.preview').animate( {
				opacity: 0,
				left: prevYend
			}, 500, 'easeOutExpo', function(){
				animate = false;
			});
		} else if(page != 1) {
			flipbook.children('div.fb-shadow-top-left').animate( { opacity: 1 }, 500);
			flipbook.children('div.fb-shadow-bottom-left').animate( { opacity: 1 }, 500);
			fbCont.find('div.preview').animate( {
				opacity: 1,
				left: prevY
			}, 500, 'easeOutExpo', function(){
				animate = false;
			});
		} 
		
		if (page == flipbook.data().totalPages - 2 && (active == 'tr' || active == 'br' || active == 'right')) {
			flipbook.children('div.fb-shadow-top-right').animate( { opacity: 0 }, 200);
			flipbook.children('div.fb-shadow-bottom-right').animate( { opacity: 0 }, 200);
			fbCont.find('div.next').animate( {
				opacity: 0,
				left: nextYend
			}, 500, 'easeOutExpo', function(){
				animate = false;
			});
		} else if(page != flipbook.data().totalPages) {
			flipbook.children('div.fb-shadow-top-right').animate( { opacity: 1 }, 500);
			flipbook.children('div.fb-shadow-bottom-right').animate( { opacity: 1 }, 500);
			fbCont.find('div.next').animate( {
				opacity: 1,
				left: nextY
			}, 500, 'easeOutExpo', function(){
				animate = false;
			});
	 	}
	}
	
	function repositionArrows(flipbook, fbCont) {
		var posLeft, nextY, prevY, nextYend, prevYend, page;

		page = flipbook.turn('page');
		posLeft = parseInt(flipbook.position().left);

		if(fbCont.find('div.preview').hasClass('small')) {
			nextY = posLeft + flipbook.width() - 40;
			prevY = posLeft - 45;
			nextYend = posLeft + flipbook.width() - 50;
			prevYend = posLeft;
		} else {
			nextY = posLeft + flipbook.width() + 24;
			prevY = posLeft - 110;
			nextYend = posLeft + flipbook.width() - 50;
			prevYend = posLeft;
		}
		
		if (page == 1) {
			fbCont.find('div.preview').animate( {
				opacity: 0,
				left: prevYend
			}, 200, 'easeOutExpo');
		} else {
			fbCont.find('div.preview').animate( {
				opacity: 1,
				left: prevY
			}, 200, 'easeOutExpo');
		} 
		
		if (page == flipbook.data().totalPages) {
			fbCont.find('div.next').animate( {
				opacity: 0,
				left: nextYend
			}, 200, 'easeOutExpo');
		} else {
			fbCont.find('div.next').animate( {
				opacity: 1,
				left: nextY
			}, 200, 'easeOutExpo');
	 	}
	}

	function rotated() {	
		return Math.abs(window.orientation)==90;
	}
	
	function resizeFB(fbWidth, fbHeight, flipbook, fbCont, zoomed) {
		var singleWidth,
			singleHeight;
		
		flipbook.turn('size', fbWidth, fbHeight);
		
		singleWidth = flipbook.find('div.turn-page-wrapper.first').width();
		singleHeight = flipbook.find('div.turn-page-wrapper.first').height();
		
		if(zoomed) {
			var largeImage = false;

			zoomCont = fbCont.find('div.zoomed');

			fbZoomedBorder = parseInt(zoomCont.css('border-left-width'));
			
			var fbOffset = fbCont.offset();
			fbTopMargin = fbOffset.top;
			
			if(zoomCont.find('img.bg-img').hasClass('zoom-large'))
				largeImage = true;
				
			if(!largeImage) {
				zoomCont.find('img.bg-img').css({
					'margin-top': '0px',
					'opacity': 1
				});
				zoomCont.find('img.bg-img.zoom-large').css('opacity', 0);
			} else {
				zoomCont.find('img.bg-img').css('display', 'none');
				
				zoomCont.find('img.bg-img.zoom-large').css({
					'margin-top': '0px',
					'opacity': 1,
					'display': 'block'
				});	
			} 
			
			zoomCont.children().css('margin-top', 0);

			// add classes from the page parent
			if(jQuery(this).find('div.fb-page').hasClass('double')){
				zoomCont.addClass('double');
			}
			
			if(jQuery(this).hasClass('odd')){
				zoomCont.addClass('odd');
			}
					
			// zoom container size
			zoomCont.width(flipbook.width() * 0.5 * zoomStrength);
			zoomCont.height(flipbook.height() - (fbZoomedBorder * 2)); 
			
			zoomCont.find(' > div, img.bg-img, div.video').each(function() {
				var $this = jQuery(this);
				if($this.hasClass('video')){
					//$this.css('height', $this.height() * zoomStrength + "px");
				} else {
					if(zoomCont.hasClass('double')){
						$this.width(100 * zoomStrength + '%');
						$this.height(flipbook.find('div.first').height() * zoomStrength);
					} else {
						$this.width(flipbook.find('div.first').width() * zoomStrength);
						$this.height(flipbook.find('div.first').height() * zoomStrength);
					}	
				}
			});
			
			zoomCont.find('.enlarge').each(function() {
				var $this = jQuery(this),
					enlargeHeight = $this.height() *  zoomStrength;
				
				$this.css({
					'font-size': Math.round(parseInt($this.css('font-size')) * zoomStrength) + "px" ,
					'line-height': Math.round(parseInt($this.css('line-height')) * zoomStrength) + "px"
				});
			});
			
			// set img.bg-img
			zoomCont.find('img.bg-img').width(flipbook.find('div.first').width() * zoomStrength);
			zoomCont.find('img.bg-img').height(flipbook.find('div.first').height() * zoomStrength);

			fbCont.find('div.zoomed.double img.bg-img').width(flipbook.find('div.first').width() * 2 * zoomStrength);
			fbCont.find('div.zoomed.double.odd img.bg-img').css('margin-left', '0px');
			fbCont.find('div.zoomed.double img.bg-img').css({
				'left' : '0px',
				'right' : '0px' 
			});
			
			zoomCont.css('left', (fbCont.width() - zoomCont.outerWidth()) / 2);
			fbCont.find('div.zoomed-shadow').css({
				'left': (parseInt(zoomCont.css('left')) + fbZoomedBorder),
				'top': (parseInt(zoomCont.css('top')) + fbZoomedBorder),
				'width': zoomCont.css('width'),
				'height': zoomCont.css('height')
			});
			fbCont.find('div.zoomed-shadow-top').css({
				'left': (parseInt(zoomCont.css('left')) + fbZoomedBorder),
				'width': zoomCont.css('width')
			});
			fbCont.find('div.zoomed-shadow-bottom').css({
				'left': (parseInt(zoomCont.css('left')) + fbZoomedBorder),
				'top': zoomCont.height() - 40 + fbZoomedBorder * 2,
				'width': zoomCont.css('width')
			});
		}

		flipbook.find('div.page-content').each(function () {
			var $this = jQuery(this);
			$this.width(singleWidth - parseInt($this.css('margin-top')));
			$this.height(singleHeight - (parseInt($this.css('margin-top')) * 2));
			$this.find('img.bg-img').height($this.height());
			if($this.find('object, iframe').length)
				$this.find('.preview-content').height('100%');
			if($this.parent().hasClass('double')) {
				$this.find('img.bg-img').width($this.width() * 2);
	
				if($this.parent().parent().parent().hasClass('odd')) {
					rightMargin = parseInt($this.css('margin-right')); 
					$this.find('img.bg-img').css('margin-left', - $this.width() + "px");
					$this.find('div.container img.bg-img').css('margin-left', "0px");
				}
			} else {
				$this.find('img.bg-img').width($this.width());
			}
			$this.parent().find('div.fb-inside-shadow-left').height($this.height());
			$this.parent().find('div.fb-inside-shadow-right').height($this.height());
			$this.parent().find('div.fb-page-edge-shadow-left').height($this.height());
			$this.parent().find('div.fb-page-edge-shadow-right').height($this.height());
		});
		
		flipbook.find('div.fb-shadow-bottom-left').width(fbWidth/2);
		flipbook.find('div.fb-shadow-bottom-right').width(fbWidth/2);
		flipbook.find('div.fb-shadow-top-left').width(fbWidth/2);
		flipbook.find('div.fb-shadow-top-right').width(fbWidth/2);
		fbCont.find('div.preview, div.next').css('top', (flipbook.find('div.turn-page-wrapper.first').height() - 86) / 2);
	}
	
	
	function centerBook(page, flipbook, fbCont, activeArrow) {
		var rendered = flipbook.data().done,
			width = flipbook.width(),
			pageWidth = width/2,
			options = {	duration: (!rendered) ? 0 : 600, 
						easing: 'easeOutExpo', 
						complete: function() { 
							flipbook.turn('resize');
						}
					 };
		
		flipbook.stop(true);
		
		if ((page == 1 || page == flipbook.data().totalPages)) {
			var left;
	
			if(page == 1) 
				left = Math.floor((fbCont.width() - pageWidth) * 0.5) - pageWidth;
			else
				left = Math.floor((fbCont.width() - pageWidth) * 0.5);
		
			if(parseInt(flipbook.css('left')) != left){
				flipbook.animate({left: left }, options);
				
				hideShadows('center', activeArrow, flipbook, fbCont , Math.floor((fbCont.width() - pageWidth) * 0.5) - pageWidth );
			}
			
		} else {
			flipbook.animate({left: Math.floor((fbCont.width() - width) * 0.5) }, options);
			
			hideShadows('center', activeArrow, flipbook, fbCont , Math.floor((fbCont.width() - width) * 0.5));
		}	
	}
	
	
	function fbFirstRun(flipbook, fbCont) {
		// resize the book
		jQuery(window).trigger('resize');
		fbCont.find('div.next').stop().clearQueue();
		fbCont.find('div.preview').stop().clearQueue();
		fbCont.find('div.preview').css('left', 0);
		fbCont.find('div.next').css('left', jQuery(window).width() * 0.5);
		// adjust shadows
		hideShadows('turned', 'false', flipbook, fbCont, 'first run');		
		
		// show bottom ui
		if(jQuery('div.fb-nav').hasClass('small')){
			jQuery('div.fb-nav').animate( {
				opacity: 1,
				top: - 40 - parseInt(flipbook.css('margin-bottom').replace("px", "")) - parseInt(jQuery('div.fb-nav').css('margin-top').replace("px", ""))
			}, 1000, 'easeOutExpo');
		} else {
			jQuery('div.fb-nav').animate( {
				opacity: 1,
				top: '0'
			}, 1000, 'easeOutExpo');
		}

		// remove preloader
		flipbook.parent().css('background-image', 'none');
	}
	
	function fbOut(flipbook, activeCorner) {
		flipbook.find('div.turn-page-wrapper').each(function (){
			$(this).children('div:first-child').width(flipbook.width() * 0.5 + 'px');
			$(this).children('div:first-child').height(flipbook.height() + 'px');
		});
	
	}
	
	function disableShadows(flipbook) {
		flipbook.find('div.fb-shadow-bottom-left').css('opacity', 0);
		flipbook.find('div.fb-shadow-top-left').css('opacity', 0);
		flipbook.find('div.fb-shadow-bottom-right').css('opacity', 0);
		flipbook.find('div.fb-shadow-top-right').css('opacity', 0);
	}
	
	jQuery(document).ready(function($) {
		var flipbook = $('.flipbook'),
			fbCont = $('div.flipbook-container'),
			slideshow = false,
			zoomed = false,
			activeArrow = 'false',
			pageID = 0,
			lastID,
			firstWidth,
			firstHeight,
			activeCorner = false,
			fbOver = false,
			pageTurning = false,
			ie = false,
			touch = 'ontouchstart' in document.documentElement,
			hash,
			$swap;

		if(navigator.appName == "Microsoft Internet Explorer")
			ie = true;
		
		flipbook.bind('turning', function(e, page) {
			pageTurning = true;
		});
	
		
		flipbook.bind('turned', function(e, page) {
			var $this = $(this);
			
			var rendered = $this.data().done;
			
			centerBook(page, flipbook, fbCont, activeArrow);	
			
			fbCont.find('div.preview, div.next').css('top', (flipbook.find('div.turn-page-wrapper.first').height() - 86) / 2);
			
			
			if(slideshow) {
				slideshowTimeout = setTimeout(function() {
					$this.turn('next');

					if(flipbook.turn('page') + 2 >= flipbook.data().totalPages) { // turn off slide show on last slide
					
						slideshow = false;
						

						setTimeout(function() {
							fbCont.find('div.next, div.preview').fadeIn(500);
						}, 600);

						hideShadows('start', 'right', flipbook, fbCont, 'end');
					}
				}, slideshowDelay);
			}
			
			hideShadows('turned', 'false', flipbook, fbCont, 'end');	
			setTimeout(function() {
				repositionArrows(flipbook, fbCont);
			}, 350);
			pageTurning = false;
		});	
				
		/* Duplicate Double Pages */
		flipbook.find('div.fb-page').each(function() {
			var $this = $(this);
			
			if($this.hasClass('double')){
				clone = $this.clone(true);
				clone.insertAfter($this);
			} 
		});
		
		/* Initialize Flip Book */
		hash = checkHash();
		if(hash != 1 && pages.length < 2) {
			flipbook.turn({
				page: hash+1, // define start page,
				acceleration: true, // enable hardware acceleration,
				shadows: !$.isTouch, // enable/disable shadows,
				duration: 500, // page flip duration.
			});
		} else {
			flipbook.turn({
				page: hash, // define start page,
				acceleration: true, // enable hardware acceleration,
				shadows: !$.isTouch, // enable/disable shadows,
				duration: 500, // page flip duration.
			});
		}

		/* Add Class for Even and Odd Pages */
		flipbook.find('div.turn-page-wrapper').each(function() {
			var $this = $(this),
				pageID = $(this).attr('page'),
				lastID = flipbook.data().totalPages,
				clone;
			
			if(pageID == 1) {
				$this.addClass('first');
				$this.find('div.page-content').addClass('first');
			} else if(pageID == lastID){
				$this.addClass('last');
				$this.find('div.page-content').addClass('last');
			} else if(pageID % 2 == 0) {
				$this.addClass('even');
				$this.find('div.page-content').addClass('even');
			} else {
				$this.addClass('odd');
				$this.find('div.page-content').addClass('odd');
			}
		
			
			if(pageID % 2 != 0 && pageID != 1 && pageID != lastID) {
				rightMargin = parseInt($this.find('div.double div.page-content').css('margin-right'));
				$this.find('div.double div.page-content img.bg-img').css('margin-left', - $this.width() + rightMargin +"px");
				$this.find('div.container img.bg-img').css('margin-left', "0px");
			}
		});
		
		/* If double page set properly the odd page container */
		flipbook.find(' > div:last-child > div').each(function() {
			var $this = $(this);
			
			pageID ++;
			lastID = flipbook.data().totalPages;
			
			$this.addClass('page-transition')
			$this.attr('page', pageID);
			
			if(pageID == 1)
				$this.addClass('first');
			else if(pageID == lastID)
				$this.addClass('last');
			else if(pageID % 2 == 0)
				$this.addClass('even');
			else
				$this.addClass('odd');
		});
	
		var tpwWidth = flipbook.find('div.turn-page-wrapper > div').width(),
			tpwHeight = flipbook.find('div.turn-page-wrapper > div').height();
		
		
		
		/*-----------------------------------------------------------------------------------*/
		/*	Flip Book Navigation
		/*-----------------------------------------------------------------------------------*/
		
		var slideshowDelay = slideShowInterval,
			navWidth = 0,
			i = 0;
			
		
		
		
		
		/* Next & Previous */
		fbCont.find('div.next').on('click', function(e){
			if(pageTurning)
				return;
			activeArrow = 'right';	
			flipbook.trigger('mouseover');
			flipbook.turn('next');
		});
		
		fbCont.find('div.preview').on('click', function(e){
			if(pageTurning)
				return;
				
			activeArrow = 'left';
			flipbook.trigger('mouseover');
			flipbook.turn('previous');
		});	
	
		/*-----------------------------------------------------------------------------------*/
		/* Shadows	
		/*-----------------------------------------------------------------------------------*/
			
		addInsideBookShadow(flipbook);
		
		/*-----------------------------------------------------------------------------------*/
		/* Events	
		/*-----------------------------------------------------------------------------------*/
		
		hashChange(flipbook, fbCont);
		
		firstWidth = flipbook.width(),
		firstHeight = flipbook.height();
		var posArray = new Array(),
			i = 0;
		$('.flipbook div.page-content .enlarge').each(function() {
			posArray.push(new Array());
			posArray[i].push(parseInt($(this).css('font-size')));
			posArray[i].push(parseInt($(this).css('line-height')));
			i++;
		});
		
		/* Window Resize */
		/*$(window).on('resize', function() {
			var currentID = flipbook.turn('page');
	
			var $this = $(this),
				width = $this.width(), // window width
				height; // window height
				
				
			
			var fbNext = fbCont.find('div.next'),
				fbPrev = fbCont.find('div.preview'),
				ratio, fbWidth, fbHeight, fbPercentage,
				areaHeight = parseInt(flipbook.css('margin-top')) + parseInt(flipbook.css('margin-bottom')) + flipbook.height()  + 40,
				areaWidth = flipbook.width() + 390, 
				areaMinHeight = parseInt(flipbook.css('margin-top')) + flipbook.height() - 55,
				areaMinWidth = flipbook.width() + 140,
				position = flipbook.position();

			if(fbCont.height() / firstHeight < fbCont.width() / firstWidth)
				ratio = fbCont.height() / firstHeight;
			else 
				ratio = fbCont.width() / firstWidth;

			fbWidth = fbCont.width();
			fbHeight = fbCont.height();
			
			if(fbWidth < firstWidth) {
				var ratio = fbWidth / firstWidth;

				fbWidth = firstWidth * ratio;
				fbHeight = firstHeight * ratio;
			}

			if(fbWidth > firstWidth || fbHeight > firstHeight) {
				fbWidth = firstWidth;
				fbHeight = firstHeight;
			}

			

			if(fbWidth != flipbook.width() || fbHeight != flipbook.height())
				resizeFB(fbWidth, fbHeight, flipbook, fbCont, zoomed);
			
			if(height > areaHeight && width > areaWidth) {
				fbWidth = firstWidth;
				fbHeight = firstHeight;
				resizeFB(firstWidth, firstHeight, flipbook, fbCont, zoomed);
			}
			
			fbPercentage = flipbook.height() / firstHeight;
			fbPercentage = parseInt(fbPercentage * 100);
			
			var i = 0;
			
			
			$('.flipbook div.page-content .enlarge').each(function() {
				if(fbPercentage == 100) {
					$(this).css('font-size', posArray[i][0] + "px");
					$(this).css('line-height', posArray[i][1] + "px");
				} else {
					$(this).css('font-size', posArray[i][0] * (fbPercentage/100) + "px");
					$(this).css('line-height', posArray[i][1] * (fbPercentage/100) + "px");	
				}
				i++;
			});

			width = $this.width();

			
			areaHeight = parseInt(flipbook.css('margin-top').replace("px", "")) + parseInt(flipbook.css('margin-bottom').replace("px", "")) + fbHeight ;
			areaWidth = fbWidth + 330; 
			
			areaMinHeight = parseInt(flipbook.css('margin-top').replace("px", "")) + fbHeight  - 55;
			areaMinWidth = fbWidth + 140;
			
			if ((currentID == 1 || currentID == flipbook.data().totalPages)) {
				var left;
		
				if(currentID == 1) 
					left = Math.floor((fbCont.width() - flipbook.width()/2) * 0.5) - flipbook.width()/2;
				else
					left = Math.floor((fbCont.width() - flipbook.width()/2) * 0.5);
		
				if(parseInt(flipbook.css('left')) != left)
					flipbook.css({'left': left });
				
			} else {
				flipbook.css( {'left': Math.floor((fbCont.width() - flipbook.width()) * 0.5) });

				if(zoomed) {
					fbCont.children('div.zoomed').css( {'left': Math.floor((fbCont.width() - flipbook.width()) * 0.5) - 10 });
					fbCont.children('div.zoomed-shadow, div.zoomed-shadow-bottom, div.zoomed-shadow-top').css( {'left': Math.floor((fbCont.width() - flipbook.width()) * 0.5) });
				}
			}	

			
			if(width < areaWidth ) {
				fbNext.addClass('small').css({ left: position.left + flipbook.width() - 40 });
				fbPrev.addClass('small').css({ left: position.left - 45 });
				fbPrev.find('span.button-icon').css({ left: 6 });
				fbNext.find('span.button-icon').css({ left: 41 });
			} else if (width > areaWidth) {
				fbNext.removeClass('small').css({ left: position.left + flipbook.width() + 24 });
				fbPrev.removeClass('small').css({ left: position.left - 110 });
				fbPrev.find('span.button-icon').css({ left: 22 });
				fbNext.find('span.button-icon').css({ left: 26 });
			}

			if(fbPrev.css('opacity') == "0")
				fbPrev.css('left', '100px'); 
			
			if(fbNext.css('opacity') == "0")
				fbNext.css('right', '100px'); 

			if(zoomed) {
				var l = parseInt(fbCont.find('div.zoomed').css('left'));
				
				fbCont.children('.big-side.show-previous')
					.css({
						'left': l - 40
					})
					.height(fbHeight)
					.children('.center, .center.hover')
						.height(fbHeight - 24);

				fbCont.children('.big-side.show-next')
					.css({
						'right': l - 40
					})
					.height(fbHeight)
					.children('.center, .center.hover')
						.height(fbHeight - 24);
			}

			 
			
	
		});*/
		
		/* Flip Book Events */
		flipbook.bind('turned', function(e, page, pageObj) {
			setHashTag(flipbook);
			return false;
		});
		
		/* Global Events */
		$(window).bind('keydown', function(e) { // keyboard events
			if (e.keyCode == 37) {
				if(pageTurning)
					return;

				if(zoomed) {
					var $prev = fbCont.children('.big-side.show-previous');
					if(!$prev.is(':hidden')) {
						$prev.click();
					}
				} else {
					activeArrow = 'left';
					flipbook.trigger('mouseover');
					flipbook.turn('previous');
				}
			} else if (e.keyCode == 39) {
				if(pageTurning)
					return;

				if(zoomed) {
					var $next = fbCont.children('.big-side.show-next');
					if(!$next.is(':hidden')) {
						$next.click();
					}
				} else {
					activeArrow = 'right';
					flipbook.trigger('mouseover');
					flipbook.turn('next');
				}
			} else if (e.keyCode == 27) {
				flipbook.css({
					'visibility': 'visible',
					'pointer-events': 'all'
				});
				flipbook.stop(true).animate({opacity: 1}, 300, function(){
					hideShadows('turned', 'false', flipbook, fbCont, 'zoom');
				});  
				
				fbCont.find('div.zoomed').animate({opacity: 0}, 300, function(){
					$(this).remove();
					zoomed = false;
					
				});
				
				

				fbCont.find('div.next, div.preview').stop(true).fadeIn(500);

				fbCont.find('div.zoomed-shadow-top').clearQueue();
				fbCont.find('div.zoomed-shadow-bottom').clearQueue();
				fbCont.find('div.zoomed-shadow').animate( { opacity: 0 }, 300, function(){ $(this).remove(); });
				fbCont.find('div.zoomed-shadow-bottom').animate( { opacity: 0 }, 100, function(){ $(this).remove(); });
				fbCont.find('div.zoomed-shadow-top').animate( { opacity: 0 }, 100, function(){ $(this).remove(); });
				fbCont.find('span.big-side.show-previous').fadeOut(200);
				fbCont.find('span.big-side.show-next').fadeOut(200);
			}
		}).bind('hashchange', function() { // hashchange event (unique url for each page)
			hashChange(flipbook, fbCont);	
		}).bind('touchstart', function(e) { // touch events for mobile stuff
			var t = e.originalEvent.touches;
			if (t[0]) 
				touchStart = {
						x: t[0].pageX, 
						y: t[0].pageY };
						
			touchEnd = null;
		}).bind('touchmove', function(e) {
			var t = e.originalEvent.touches, 
				pos = flipbook.offset();
				
			if (t[0].pageX>pos.left && t[0].pageY>pos.top && t[0].pageX<pos.left+flipbook.width() && t[0].pageY<pos.top+flipbook.height()) {
				if (t.length==1)
					e.preventDefault();
					
				if (t[0]) 
					touchEnd = {
						x: t[0].pageX, 
						y: t[0].pageY 
					};
			}
			
		}).bind('touchend', function(e) {
			if (window.touchStart && window.touchEnd) {
				var w = flipbook.width()/2,
					d = { 
						x: touchEnd.x-touchStart.x, 
						y: touchEnd.y-touchStart.y },
					pos = {
						x: touchStart.x-flipbook.offset().left, 
						y: touchStart.y-flipbook.offset().top };
			
				if (Math.abs(d.y)<100) {
					if(pageTurning)
						return;
					 if (d.x>100 && pos.x<w) {
					 	flipbook.turn('previous');
					 } else if (d.x<100 && pos.x>w) {
					 	flipbook.turn('next');
					 }		
				}
			}
		}).bind('start', function(e, turn) {
			if(ie) {
				flipbook.find('div.fpage object').css({ 'display' : 'none' });
				flipbook.find('div.video object').css({ 'display' : 'none' });
			} else {
				flipbook.find('div.fpage object').css({ opacity : 0 });
			}
			hideShadows('start', activeArrow, flipbook, fbCont, 'start');	
			activeCorner = true;
		}).bind('end', function(e){
			if(ie) {
				flipbook.find('div.fpage object').css({ 'display' : 'block' });
				flipbook.find('div.video object').css({ 'display' : 'block' });
			} else {
				flipbook.find('div.fpage object').css({ opacity : 1 });
			}
			hideShadows('turned', 'false', flipbook, fbCont, 'end');
			activeCorner = false;
			limiter = 0;
		});	
		
		resizeFB(firstWidth, firstHeight, flipbook, fbCont, zoomed);
		

		
		


		fbFirstRun(flipbook, fbCont);
	});

})();


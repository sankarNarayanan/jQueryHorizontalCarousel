/*
 * Important - Please go through this before implmenting horizontalCarousel.setContents 1. Only class names should be passed and identifiers should
 * not be passed 2. Please add data-page attribute to every child tag and it has to be incremental 2. Class names should be sent with out a '.' symbol
 * 3. The position and other styles of the indication division should be wriiten seperately 4. Wriiten to support webkit, moz and ms browser engines
 */
/*
 * params = { swippedElement: Parent holding the wrapper which contains child elements parentDiv: Wrapper class holding child elements totalWidth:
 * Total width of the carousel - OPTIONAL height: Height of the carousel elementWidth: Child element width showIndication: Boolean variable to
 * show/Hide indication indicationDiv: Class of the division where indication should be displayed childPanel: Not required indicationStyle: default
 * style of the indication elements indicationStyleActive: Selected style of the indication elements } params that can be passed to set contents
 */
horizontalCarousel = (function($){
	var setContents = function(params){
		/* Assigning params that is got from user */
		var slider = $('.' + params.parentDiv), childrenCount = slider.length, swippedElement = '.' + (params.swippedElement || false), parentDiv = '.' + (params.parentDiv || false), height = params.height || $(parentDiv).height(), showIndication = params.showIndication || false, indicationDiv = '.' + (params.indicationDiv || false), indicationStyle = params.indicationStyle || false, indicationStyleActive = params.indicationStyleActive || false, childPanel = '.' + (params.childPanel || false), dynamicContent = '', children = slider.children(), noOfChildren = children.length, windowWidth = $(
				window).width(), elementWidth = 0, totalWidth = '', callback = params.callback || function(){
		};
		/* Calculating element width and total width, to align content */
		if (slider.length > 1) {
			noOfChildren = noOfChildren / childrenCount;
		}
		if (noOfChildren > 0) {
			elementWidth = params.elementWidth || $(children[0]).width();
			totalWidth = noOfChildren * elementWidth;
		} else {
			elementWidth = params.elementWidth || 180;
			totalWidth = $(window).width();
		}
		$(children[0]).addClass('active'); /* Adding active to first element */
		$(parentDiv).addClass('carouselwrapperdiv');
		$(parentDiv).parent().addClass('carouselwrapperdivparent');
		$(parentDiv).addClass('carouseltransition');
		$(parentDiv).css({
			'width' : totalWidth,
			'height' : height
		});
		$(childPanel).css('width', windowWidth * noOfChildren);
		$.each(slider, function(index,child){
			children = $(child).children();
			$.each(children, function(indexVal,childEle){
				if ($(childEle).attr('data-page')) {
					// To ensure only divs with page attribute is translated
					$(childEle).addClass('carouselcontents').css('width', elementWidth + 'px');
					var x = indexVal > 0 ? (elementWidth * indexVal)+(6 * indexVal) : elementWidth * indexVal, y = 0, trans = 'translate(' + x + 'px,' + y + ')';
					addTransformation(childEle, trans);
					dynamicContent = dynamicContent + '<div class="' + indicationStyle + '"></div>';
				}
			});
			if (showIndication && indicationDiv && noOfChildren > 1) {
				$(child).parent().find(indicationDiv).html(dynamicContent);
				/* $(indicationDiv).addClass('selectedParent'); */
				setSelected(0, indicationDiv, params.indicationStyleActive);
				dynamicContent = '';
			}
		});
		if (childPanel) {
			alignChildContainer(childPanel, windowWidth);
		}
		
		//Increasing swipe smothness for Carousal
		//$.event.special.swipe.horizontalDistanceThreshold=15;
		
		$(swippedElement).off().on("swiperight swipeleft", function(e){
			e.stopPropagation();
			e.preventDefault();
			var parameters = {
				direction : e.type,
				parentDiv : parentDiv,
				indicationDiv : indicationDiv,
				width : elementWidth,
				totalWidth : totalWidth,
				windowWidth : windowWidth,
				childPanel : childPanel,
				indicationStyleActive : indicationStyleActive,
				callback : callback
			};
			navigate(parameters);
		});
	};
	var alignChildContainer = function(childPanel,windowWidth){
		var childPanels = $(childPanel).children();
		$.each(childPanels, function(index,child){
			$(child).addClass('carouselcontents');
			var x = windowWidth * index, y = 0, trans = 'translate(' + x + 'px,' + y + ')';
			addTransformation(child, trans);
		});
	};
	var navigate = function(params){
		var slider = $(params.parentDiv), activeElement = slider.find('.active'), page = $(activeElement).data('page');
		var noOfChildren = slider.children().length / slider.length;
		if (params.direction === 'swiperight' && page > 0) {
			moveRight(params);
		} else if (params.direction === 'swipeleft' && page < noOfChildren - 1) {
			moveLeft(params);
		} else {
			$(activeElement).addClass('active');
			// To retain if the swipe is invalid after reacing last element on both sides
		}
	};
	var setSelected = function(page,indicationDiv,indicationStyleActive){
		var currentPage = page;
		currentPage += 1;
		$(indicationDiv + ' div').removeClass(indicationStyleActive);
		$(indicationDiv + ' div:nth-child(' + currentPage + ')').addClass(indicationStyleActive);
	};
	var moveRight = function(params){
		var slider = $(params.parentDiv), activeElement = slider.find('.active'), page = $(activeElement).data('page');
		$(activeElement).removeClass('active');
		$(activeElement).removeClass('active');
		page -= 1;
		var x = -(params.width * page)-(page * 6), trans = 'translate(' + x + 'px,' + 0 + ')', containerXaxis = -(params.windowWidth * page), containerTrans = 'translate(' + containerXaxis + 'px,' + 0 + ')';
		// 2 is subtracted so as to ensure first element stays in left corner
		$(activeElement).prev().addClass('active');
		addTransformation(slider, trans);
		if (params.childPanel) {
			addTransformation(params.childPanel, containerTrans);
		}
		if (params.indicationDiv) {
			setSelected(page, params.indicationDiv, params.indicationStyleActive);
		}
		params.callback({
			direction : params.direction,
			page : page,
			parentDiv : params.parentDiv
		});
	};
	var moveLeft = function(params){
		var slider = $(params.parentDiv), activeElement = slider.find('.active'), page = $(activeElement).data('page');
		$(activeElement).removeClass('active');
		$(activeElement).removeClass('active');
		page += 1;
		// 2 is added so as to ensure last element reaches the left corner
		var xaxis = -(params.width * page)-(page * 6), containerXaxis = -(params.windowWidth * page), trans = 'translate(' + xaxis + 'px,' + 0 + ')', containerTrans = 'translate(' + containerXaxis + 'px,' + 0 + ')';
		//JSHint 08-12-2014 Fixed: Expected an assignment or function call and instead saw an expression 
		//$(activeElement).next() && $(activeElement).next().addClass('active');
		if($(activeElement).next()){
			$(activeElement).next().addClass('active');
		}
		addTransformation(slider, trans);
		if (params.childPanel) {
			addTransformation(params.childPanel, containerTrans);
		}
		if (params.indicationDiv) {
			setSelected(page, params.indicationDiv, params.indicationStyleActive);
		}
		params.callback({
			direction : params.direction,
			page : page,
			parentDiv : params.parentDiv
		});
	};
	var addTransformation = function(element,transformation){
		$(element).css({
			'-webkit-transform' : transformation,
			'-moz-transform' : transformation,
			'-ms-transform' : transformation
		});
	};
	return {
		setContents : setContents
	};
})(jQuery);

horizontalTabCarousel = (function($){
	var viewport = $(window).width(),elementWidth = 0,totalWidth;
	setContents = function(params){
		/* Assigning params that is got from user */
		var swippedElement = '.' + (params.swippedElement || 'pageWrapper'), parentDiv = '.' + params.parentDiv || 'slidePge', slider = $(parentDiv), children = slider.children(), noOfChildren = children.length, windowWidth = $(window).width(), minHeight = params.height,activeIndex = params.activeIndex,x;
		//JSHint 04-12-2014 defining 'var trans' 
		var trans;
		/* Calculating element width and total width, to align content */
		elementWidth = params.elementWidth || $(children[0]).width();
		totalWidth = noOfChildren * elementWidth;
		$(children[activeIndex]).addClass('active mt-tab-active'); /* Adding active to passed param element and active style added*/
		slider.addClass('carouselwrapperdiv');
		slider.parent().addClass('carouselwrapperdivparent');
		slider.addClass('carouseltransition');
		slider.css({
			'width' : totalWidth,
			height : minHeight || 80
		});
		$.each(children, function(index,child){
			if ($(child).attr('data-page')) { /* To ensure only divs with page attribute is translated */
				$(child).addClass('carouselcontents').css('width', elementWidth + 'px');
				var x = elementWidth * index, y = 0;
				//JSHint 04-12-2014 trans already defined. So removed var. 
				trans = 'translate(' + x + 'px,' + y + ')';
				addTransformation(child, trans);
			}
		});
		
		//To make the activeIndex to position according to it's index
		x = -(elementWidth * activeIndex);
		var centerpos = (viewport - elementWidth) / 2;
		if (activeIndex === 1) {
			//x = x + elementWidth / 2; /* In order to translate accordingly when second element comes */
			x = -(elementWidth - centerpos);
		}
		if (activeIndex === 2) {
			x = -((elementWidth - centerpos) * 2);
		}

		trans = 'translate(' + x + 'px,' + 0 + ')';
		addTransformation(slider, trans);
		//callback for tab click
		if(params.callBack){
			$(children).off().on(window.scrollSupportEventHandler, function(e){
				params.callBack(e,this);
			});
		}
		// commented below changes as click event is not binded in tabs
	/*	$.event.special.swipe.horizontalDistanceThreshold = 30;*/
		/*if(getIsWindowsPhone()){*/
		$(swippedElement).off().on("swiperight swipeleft", function(e){
			e.stopPropagation();
			e.preventDefault();
			var param = {
				direction : e.type,
				parentDiv : parentDiv,
				width : elementWidth,
				totalWidth : totalWidth,
				windowWidth : windowWidth
			};
			navigate(param);
		});
	};
	navigate = function(params){
		var slider = $(params.parentDiv), activeElement = slider.find('.active'), page = $(activeElement).data('page');
		var noOfChildren = slider.children().length;
		if (params.direction === 'swiperight' && page > 0) {
			moveRight(params);
		} else if (params.direction === 'swipeleft' && page < noOfChildren - 1) {
			moveLeft(params);
		} else {
			$(activeElement).addClass('active'); /* To retain if the swipe is invalid after reacing last element on both sides */
		}
	};
	moveRight = function(params){
		//JSHint 04-12-2014 defining centerpos in the line below. 
		var slider = $(params.parentDiv), activeElement = slider.find('.active'), page = $(activeElement).data('page'), trans, centerpos;
		$(activeElement).removeClass('active');
		page -= 1;
		var x = -(params.width * page);
		if (page === 1) {
			//x = x + params.width / 2; /* In order to translate accordingly when second element comes */
			//JSHint 04-12-2014 centerpos already defined. So removing from the line below.
			centerpos = (viewport - elementWidth)/2;
			x = -(elementWidth - centerpos);
		}
		if (page === 2) {
			//x = x + params.width;
			centerpos = (viewport - elementWidth)/2;
			x = -((elementWidth - centerpos)*2);
		}
		trans = 'translate(' + x + 'px,' + 0 + ')';
		$(activeElement).prev().addClass('active');
		addTransformation(slider, trans);
	};
	moveLeft = function(params){
		//JSHint 04-12-2014 defining centerpos
		var slider = $(params.parentDiv), activeElement = slider.find('.active'), page = $(activeElement).data('page'), trans,centerpos;
		$(activeElement).removeClass('active');
		page += 1;
		var x = -(params.width * page);
		if (page === 1) {
			//x = x + params.width / 2; /* In order to translate accordingly when second element comes */
			//JSHint 04-12-2014 centerpos already defined. So removing var
			centerpos = (viewport - elementWidth)/2;
			x = -(elementWidth - centerpos);
		}
		if (page === 2) {
		//	x = x + params.width;
			//JSHint 04-12-2014 centerpos already defined. So removing var
			centerpos = (viewport - elementWidth)/2;
			x = -((elementWidth - centerpos)*2);
		}
		trans = 'translate(' + x + 'px,' + 0 + ')';
		//JSHint 08-12-2014 Fixed: Expected an assignment or function call and instead saw an expression
		//$(activeElement).next() && $(activeElement).next().addClass('active');
		if($(activeElement).next()){
			$(activeElement).next().addClass('active');
		}
		addTransformation(slider, trans);
	};
	//JSHint 04-12-2014 addTransformation defined. Added var
	 var addTransformation = function(element,transformation){
		$(element).css({
			'-webkit-transform' : transformation,
			'-moz-transform' : transformation,
			'-ms-transform' : transformation,
			'transform' : transformation,
		});
	};
	return {
		setContents : setContents
	};
})(jQuery);
// FUNCTIONS
function stickHeader() {
	if ($(window).scrollTop() >= 0) {
		$('header').addClass('fix');
	}
	if ($(window).scrollTop() <= 30) {
		$('header').removeClass('fix');
	}
}

// Scroll to anchor
function scrollToAnchor(id){
	var anchor = $(id);
	if(anchor != undefined) {
		$('html,body').animate({scrollTop: (anchor.offset().top-290)},'slow');
	}
}

function setViewPortBodyClass(width){
	if(width <= 768) {
		$('body').addClass('mb');
	} else if(width > 768 && width < 960) {
		$('body').addClass('device');
	} else if(width >= 960) {
		$('body').addClass('screen');
	}
}
// PANEL
var panelIsOpen = false;

// Launch app
jQuery(document).ready(function($) {
	// set view port class
	var outerwidth = $(window).outerWidth();
	setViewPortBodyClass(outerwidth);
	// Observe resize of window
	$(window).resize(function() {
		// clean
		$('body').removeClass('mb');
		$('body').removeClass('device');
		$('body').removeClass('screen');
		// set view port class
		outerwidth = $(window).outerWidth();
		setViewPortBodyClass(outerwidth);
	});

	$('#open-menu-trigger').click(function() {
		$('header').toggleClass('nav-opened');
	});
	$('nav a').click(function() {
		$('header').toggleClass('nav-opened');
	});
	// Header fixed on scroll
	$(window).bind('scroll', function() {
		stickHeader();
	});
	stickHeader();

	$('a').click(function() {
		var id = $(this).attr('href').substr($(this).attr('href').indexOf("#"));
		scrollToAnchor(id)
	});

	// PANEL CUSTOM
	$(document).on('click.chepk.panel.data-api', '[data-toggle="panel"]', function (e) {
		var $this   = $(this)
		var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7

		if ($this.is('a')) e.preventDefault()

		if(!panelIsOpen) {
			// move panel
			panelIsOpen = true;
			var e = $.Event('show.chepk.panel', { relatedTarget: $this })
			$target.trigger(e);
		} else {
			// move back panel
			var e = $.Event('hide.chepk.panel', { relatedTarget: $this })
			$target.trigger(e);
		}
	});

	$('#ajax-panel').on('hide.chepk.panel', function (event) {
	    var panel = $(event.target);
		// reset body and title
		$('body').removeClass('popup-is-open');
		panel.find('.modal-title').text('');
		panel.find('.modal-body').text('');
        panelIsOpen = false;
	});
	
	// Tab
    $('.tabs').each(function() {
        $(this).find('.tab-content').css('height', $(this).find('.tab-content .active').height() + 'px');
    });

	$(document).on('click.cssThea.panel.data-api', '[data-toggle="tab"]', function (e) {
		var $this   = $(this)
		var $target = $($this.data('target'));
		// remove all class active and hide current tab content 
		$this.closest('.tabs').find('.tabs-head').children().removeClass('active');
		$this.closest('.tabs').find('.tab-content').children().removeClass('active');
        $this.closest('.tabs').find('.tab-content').css('height', $target.height() + 'px');
		// set tab active and display target tab content
		$this.addClass('active');
		$target.addClass('active');
	});

});
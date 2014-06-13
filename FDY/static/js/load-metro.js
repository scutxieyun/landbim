$(function(){
    if ((document.location.host.indexOf('.dev') > -1) || (document.location.host.indexOf('modernui') > -1) ) {
        $("<script/>").attr('src', 'js/metro/metro-loader.js').appendTo($('head'));
    } else {
        $("<script/>").attr('src', 'js/metro/metro-core.js').appendTo($('head'));
		$("<script/>").attr('src', 'js/metro/metro-carousel.js').appendTo($('head'));
		$("<script/>").attr('src', 'js/metro/metro-tab-control.js').appendTo($('head'));
    }
})
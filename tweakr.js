/*
 * Do some work
 *		Loading the options is done via background.html
 */
chrome.extension.sendRequest({ action: "getOptions" }, function (options) {
	//
	// Tags
	//
		// Create a common sidebar options div
		var el = $('<div />', { id: 'my_tags', 'class': 'advanced_option' });
		// Add the tags if we gottem
		if(options.tags){
			$.each(options.tags, function(k,v){
				el.append($('<span />', { html: v }));
			});
		}
		// Add a link to the options page
		el.append($('<a />', { href: chrome.extension.getURL("options.html"), html: 'tweakr settings', target: '_blank' }));
		// Clearing
		el.append($('<div />', { 'class': 'clear' }));
		// Add it to the page
		$('#set_tags').after(el);
		// Add the click events
		$('#my_tags span').click(function(e){
			insert_tag($(this).text())
			 _gaq.push(['_trackEvent', $(this).text(), 'tagged']);
		});
	//
	// Editor height
	//
		if(options.editor_height){
			var style = $('<style />');
			style.text('#post_two_ifr {height: ' + options.editor_height + 'px!important;}');
			$('head').append(style);
		}
	//
	// Syntaxes
	//
		var addSyntaxes = function(){
			// Reference the last tool
			var lastTool = $('#post_two_code').parent();
			// If the iframe is ready
			if(lastTool.length == 0){
				// Not ready yet, try again shortly
				setTimeout(addSyntaxes, 500);
				return;
			}
			// Add the tools
			$.each(options.syntaxes, function(k, v){
				var el = $('<td><span class="tweakr">' + v +'</span></td>');
				el.click(function(e){
					injectHTML('<pre class="brush: ' + v + ';">your ' + v + ' code here...</pre>');
					_gaq.push(['_trackEvent', v, 'syntaxed']);
				});
				lastTool.after(el);
			});
		};
		// If we want syntaxes, we need to wait for the iframe to be ready...
		if(options.syntaxes){
			setTimeout(addSyntaxes, 500);
		}
});
/*
 * This is a copy of the insert_tag function used by tumblr.
 *		I must redefeine it due to security restrictions.
 *		I have done so with jQuery.
 *		It is missing truncation and localization. Oh well.
 *		Is also a bit of a crowbar.
 */
insert_tag = function(tag) {
	// Their gubbins
    tag = tag.replace(/[",#]/g, '').replace(/</g, '&lt;');
    if (tag.replace(/,/g, '')) {
        // Add the tag
        $('#tokens').append($('<div class="token"><span class="tag">' + tag + '</span><a href="#" onclick="tag_editor_remove_tag($(this).up()); return false;" title="remove tag">x</a></div>'))
		// Remove the label
		$('#post_tags_label').remove();
		// Focus the tags thing
		$('#tag_editor_input').focus();
    }
};
/*
 * WYSIWYG
 *		Very fundamental for the time being
 */
injectHTML = function(html){
	// For now, just this
	$('#post_two_ifr').contents().find('body').append($(html));
};
/**
 * Analytics
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-24181653-6']);
_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
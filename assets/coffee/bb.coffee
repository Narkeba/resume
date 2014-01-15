$(document).ready ->
	$('#additionally').collapse()
	$('body').scrollspy target: 'nav', offset: 80
	$('.navbar li a').click (event) ->
		event.preventDefault()
		$($(this).attr 'href')[0].scrollIntoView()
		scrollBy 0, -79
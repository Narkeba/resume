$(document).ready(function() {
  $('#additionally').collapse();
  $('body').scrollspy({
    target: 'nav',
    offset: 80
  });
  return $('.navbar li a').click(function(event) {
    event.preventDefault();
    $($(this).attr('href'))[0].scrollIntoView();
    return scrollBy(0, -79);
  });
});

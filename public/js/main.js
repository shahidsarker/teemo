/* eslint-env jquery, browser */
$(document).ready(() => {

  // Place JavaScript code here...

});

$("#exampleFormControlSelect2").keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  console.log("Key pressed!");
  if(keycode == '13'){
    var theList = $('#theList .row');
    var item = $("<li></li>")
    item.text($('#exampleFormControlSelect2').val());
    item.appendTo(theList);
    $("<hr>").appendTo(theList);
  }
});

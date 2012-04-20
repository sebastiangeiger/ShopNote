var debug_output = function(items) {
  var texts = '';
  for(var i=0; i<items.length; i++){
    texts += (i+1) + '. ';
    if (items[i].quantity){
      texts += items[i].quantity + " of "
    } 
    texts += items[i].name;
    if(i+1<items.length){
      texts += "\r\n ";
    }
  }
  return texts;
};

console.log("Hello from add_checkboxes");
$(".zutaten tr").append("<td><form class=\"shopnote\"><input class=\"shopnote-buy-ingredient\" type=\"checkbox\"/></form></td>");
var button = $('<button>').attr('id', 'add_to_shopping_list').text('Add to shopping list').on("click", function() {
  var items = $("input.shopnote-buy-ingredient:checked").map(function(){
    var siblings = $(this).parent().parent().siblings();
    var quantity = $.trim($(siblings).filter('.amount').text());
    var name = $.trim($(siblings).filter('.name').text());
    return {quantity: quantity, name: name};
  });
  console.log("Need to buy:\r\n " + debug_output(items));
});
var button_context = $('<tr><th></th><th></th><th></th></tr>');
var button_mount_point = $(button_context).children().filter(":last");
$(button_mount_point).append(button);
$(".zutaten tbody").append(button_context)
console.log("And good night");

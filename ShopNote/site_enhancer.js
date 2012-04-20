var siteEnhancer = (function() {
  var button_context, 
      button_mount_point,
      checkbox_mount_points,
      navigation_for_quantity,
      navigation_for_item_name,
      addButton,
      prepareCanvas,
      debug_output,
      addNecessaryElementsFunction;

  debug_output = function(items) {
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

  addButton = function() {
    var button = $('<button>').attr('id', 'add_to_shopping_list').text('Add to shopping list').on("click", function(event) {
      event.preventDefault();
      var items = $("input.shopnote-buy-ingredient:checked").map(function(){
        var top_level_container = $(this).parent().parent();
        var quantity = $.trim(navigation_for_quantity(top_level_container));
        var name = $.trim(navigation_for_item_name(top_level_container));
        return {quantity: quantity, name: name};
      });
      console.log("Need to buy:\r\n " + debug_output(items));
    });
    $(button_mount_point).append(button);
  };

  prepareCanvas = function() {
    // TODO: Find a way to wrap the form in a td if necessary
    // $(checkbox_mount_points).append("<td><form class=\"shopnote\"><input class=\"shopnote-buy-ingredient\" type=\"checkbox\"/></form></td>");
    $(checkbox_mount_points).prepend("<form class=\"shopnote\"><input class=\"shopnote-buy-ingredient\" type=\"checkbox\"/></form>");
    addButton();
 "something" };


  return {
    addNecessaryElements: function(func) {
      addNecessaryElementsFunction = func;
    },
  
    buttonMountPoint: function(selector) {
      button_mount_point = selector;
    },

    checkboxMountPoints: function(selector) {
      checkbox_mount_points = selector;
    },

    navigationForQuantity: function(func) {
      navigation_for_quantity = func;
    },

    navigationForItemName: function(func) {
      navigation_for_item_name = func;
    },

    enhance: function() {
      if(addNecessaryElementsFunction) {
        addNecessaryElementsFunction();
      }
      prepareCanvas();
    }
  };
})();

var siteEnhancer = (function() {
  var button_context, 
      button_mount_point,
      checkbox_mount_points,
      navigation_for_quantity,
      navigation_for_item_name,
      addTheAddToShoppingListButton,
      addTheCheckboxes,
      prepareCanvas,
      debug_output,
      extractItems,
      showDialog,
      theDialog,
      addNecessaryElementsFunction;

  debug_output = function(items) {
    var texts = '';
    for(var i=0; i<items.length; i++){
      texts += (i+1) + '. ';
      if (items[i].quantity){
        texts += items[i].quantity + " of ";
      } 
      texts += items[i].name;
      if(i+1<items.length){
        texts += "\r\n ";
      }
    }
    return texts;
  };

  extractItems = function() {
    return $("input.shopnote-buy-ingredient:checked").map(function(){
        var top_level_container = $(this).parent().parent();
        var quantity = $.trim(navigation_for_quantity(top_level_container));
        var name = $.trim(navigation_for_item_name(top_level_container));
        return {quantity: quantity, name: name};
      });
  };

  addTheAddToShoppingListButton = function() {
    var button = $('<button>').attr('id', 'add_to_shopping_list').text('Add to shopping list').on("click", function(event) {
      event.preventDefault();
      var items = extractItems();
      var debugOutput = "Need to buy:\r\n " + debug_output(items);
      console.log(debugOutput);
      showDialog(debugOutput);
    });
    $(button_mount_point).append(button);
  };

  addTheCheckboxes = function() {
    var form = $("<form>").attr("class","shopnote");
    var checkbox = $("<input>").attr({"class": "shopnote-buy-ingredient", "type": "checkbox"});
    $(form).append(checkbox);
    $(checkbox_mount_points).prepend(form);
  };

  showDialog = function(text){
    theDialog.html(text);
    theDialog.dialog('open');
    return false;
  };

  prepareCanvas = function() {
    addTheCheckboxes();
    addTheAddToShoppingListButton();
    theDialog = $('<div></div>')
      .html('text')
      .dialog({
        autoOpen: false,
        modal: true,
        title: 'ShopNote'
      });
  };


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

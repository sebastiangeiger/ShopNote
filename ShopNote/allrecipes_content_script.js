console.log("Beginning to load the content script");
siteEnhancer.addNecessaryElements( function() {
  $(".ingredients ul").append('<li></li>');
});
siteEnhancer.checkboxMountPoints(".ingredients li:not(:last)");
siteEnhancer.buttonMountPoint(".ingredients ul li:last");
siteEnhancer.navigationForQuantity(function(checkbox) {
  return null; //TODO: Parse out the quantity
});
siteEnhancer.navigationForItemName(function(checkbox) {
  return $(checkbox).text();
});
siteEnhancer.enhance();
console.log("Done loading the content script");

console.log("Beginning to load the content script");
siteEnhancer.addNecessaryElements( function() {
  $(".zutaten tbody").append('<tr><th></th><th></th><th></th></tr>');
});
siteEnhancer.checkboxMountPoints(".zutaten tr");
siteEnhancer.buttonMountPoint(".zutaten tbody tr:last th:last");
siteEnhancer.navigationForQuantity(function(checkbox) {
  return $(checkbox).siblings().filter('.amount').text();
});
siteEnhancer.navigationForItemName(function(checkbox) {
  return $(checkbox).siblings().filter('.name').text();
});
siteEnhancer.enhance();
console.log("Done loading the content script");

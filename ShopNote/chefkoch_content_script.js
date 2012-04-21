console.log("Beginning to load the content script");
siteEnhancer.addNecessaryElements( function() {
  $(".zutaten tr").prepend($('<td>').attr('class', 'shopnote-checkbox-wrapper'));
  $(".zutaten tbody").append('<tr><td colspan=3></td></tr>');
});
siteEnhancer.checkboxMountPoints(".zutaten tr td.shopnote-checkbox-wrapper");
siteEnhancer.buttonMountPoint(".zutaten tbody tr:last td:first");
siteEnhancer.navigationForQuantity(function(checkbox) {
  return $(checkbox).siblings().filter('.amount').text();
});
siteEnhancer.navigationForItemName(function(checkbox) {
  return $(checkbox).siblings().filter('.name').text();
});
siteEnhancer.enhance();
console.log("Done loading the content script");

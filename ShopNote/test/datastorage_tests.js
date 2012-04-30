  $(document).ready(function(){
        
    QUnit.testStart = function(){
      datastorage.reset();
    }
    
    module("#size");
    test("it is defined", function() {
      ok( datastorage.size != undefined );
      ok( datastorage.size instanceof Function );
    });
    test("the initial size is 0", function() {
      equal( datastorage.size(), 0);
    });

    module("#addNote");
    test("it is defined", function() {
      ok( datastorage.addNote != undefined );
      ok( datastorage.addNote instanceof Function );
    });
    test("increases the size by one", function() {
      equal( datastorage.size(), 0 );
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.size(), 1 );
    });

    module("#needsToBeRetrieved");
    test("it is defined", function() {
      ok( datastorage.needsToBeRetrieved != undefined );
      ok( datastorage.needsToBeRetrieved instanceof Function );
    });
    test("returns true if the key does not exist", function() {
      equal( datastorage.needsToBeRetrieved("someKey"), true );
    });
    test("returns false if the key does exists", function() {
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.needsToBeRetrieved("retrievedKey"), false );
    });

    module("#getNote");
    test("it is defined", function() {
      ok( datastorage.getNote != undefined );
      ok( datastorage.getNote instanceof Function );
    });
    test("returns undefined if no notes have been added yet", function() {
      ok( datastorage.getNote("someKey") == undefined ); 
    });
    test("returns the note if one key does exist", function() {
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.size(), 1);
      equal( datastorage.getNote("retrievedKey").title, "retrievedNote" ); 
      equal( datastorage.getNote("retrievedKey").key, "retrievedKey" ); 
    });
    test("returns undefined if key does exist", function() {
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.size(), 1);
      ok( datastorage.getNote("someKey") == undefined ); 
    });
    test("returns undefined if key does exist", function() {
      datastorage.addNote("someKey", "someNote");
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.size(), 2);
      ok( datastorage.getNote("someKey").title === "someNote" ); 
      ok( datastorage.getNote("someKey").key === "someKey" ); 
    });


  });

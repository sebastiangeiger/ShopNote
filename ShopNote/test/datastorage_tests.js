  $(document).ready(function(){
        
    QUnit.testDone = function(){
      datastorage.reset();
    }
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
    
    module("#getKeys");
    test("it is defined", function() {
      ok( datastorage.getKeys != undefined );
      ok( datastorage.getKeys instanceof Function );
    });
    test("returns an empty array if no notes have been added yet", function() {
      equal( datastorage.getKeys().length, 0 );
    });
    test("returns an array with size one if a note has been added", function() {
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.getKeys().length, 1 );
      equal( datastorage.getKeys()[0], "retrievedKey" );
    });
    test("returns an array with size two if two notes have been added", function() {
      datastorage.addNote("someKey", "someNote");
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.getKeys().length, 2 );
      equal( datastorage.getKeys()[0], "someKey" );
      equal( datastorage.getKeys()[1], "retrievedKey" );
    });

    module("#deleteNote");
    test("it is defined", function() {
      ok( datastorage.deleteNote != undefined );
      ok( datastorage.deleteNote instanceof Function );
    });
    test("deletes a note that was stored under the key", function() {
      datastorage.addNote("someKey", "someNote");
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.size(), 2 );
      datastorage.deleteNote("someKey");
      equal( datastorage.size(), 1 );
    });
    test("does nothing when the key did not exist", function() {
      datastorage.addNote("someKey", "someNote");
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.size(), 2 );
      datastorage.deleteNote("someOtherKey");
      equal( datastorage.size(), 2 );
    });

    module("#reset");
    test("it is defined", function() {
      ok( datastorage.reset != undefined );
      ok( datastorage.reset instanceof Function );
    });
    test("deletes all notes", function() {
      datastorage.addNote("someKey", "someNote");
      datastorage.addNote("retrievedKey", "retrievedNote");
      equal( datastorage.size(), 2 );
      datastorage.reset();
      equal( datastorage.size(), 0 );
    });

  });

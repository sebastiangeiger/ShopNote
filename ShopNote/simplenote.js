var simpleNote = function(){
  var numberOfNotes,
      api,
      getListOfNotes;

  api = new SimpleNote();

  api.enableDebug( true );   // because we're curious

  getListOfNotes = function(block){
      api.auth({
        email: block.email,
        password: block.password,
        success: function(){
          api.retrieveIndex({
            success: function(resultsArray){block.success(resultsArray);},
            error: block.listRetrievalError
          });
        }, 
        error: block.loginError
      }); 
    };

  return {
    tryToLogin: function(block){
      api.auth(block); 
    },
    getNotesWithKeysAndTitles: function(block){
      getListOfNotes({
        email: block.email,
        password: block.password,
        loginError: block.loginError,
        listRetrievalError: block.listRetrievalError,
        success: function(listOfNotes){
          block.numberOfExpectedItems(listOfNotes.length);
          for(var i=0;i<listOfNotes.length;i++){
            var note = listOfNotes[i];
            api.retrieveNote({
              key: note.key,
              success: function( noteHash ){
                noteHash.title = noteHash.body.split(/\r\n|\r|\n/)[0];
                block.success(noteHash);
              },
              error: function(code){
                block.noteRetrievalError(code,note);
              }
            });
          }
        }
      });
    }
  };
}();

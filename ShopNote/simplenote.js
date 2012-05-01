var simpleNote = function(){
  var numberOfNotes,
      api,
      getListOfNotes,
      getNotes;

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

  getNotes = function(block){
    api.auth({
      email: block.email,
      password: block.password,
      success: function(){
        for(var i = 0; i < block.keys.length; i++){
          api.retrieveNote({
            key: block.keys[i],
            success: function( noteHash ){
              noteHash.title = noteHash.body.split(/\r\n|\r|\n/)[0];
              block.success(noteHash);
            },
            error: function(code){
              block.noteRetrievalError(code,block.keys[i]);
            }
          });
        }
      },
      error: block.loginError
    });
  };

  return {
    tryToLogin: function(block){
      api.auth(block); 
    },
    getListOfNotes: function(block){
      getListOfNotes(block);
    },
    getNotes: function(block){
      getNotes(block);
    } 
  };
}();

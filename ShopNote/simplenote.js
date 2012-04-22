var simpleNote = function(){
  var numberOfNotes,
      api,
      getNoteTitle;

  api = new SimpleNote();

  api.enableDebug( true );   // because we're curious

  // getNoteTitle = function(note,numberOfTries){
  //   if(! numberOfTries){
  //     numberOfTries = 0;
  //   }
  //   if(!localStorage["note_title_"+note.key]){
  //     console.info("Trying to retrieve the note with they key: " + note.key);
  //     api.retrieveNote({
  //       key: note.key,
  //       success: function( noteHash ) {
  //         var title = noteHash.body.split(/\r\n|\r|\n/)[0];
  //         $('ul').append($('<li>').text(title));
  //         localStorage["note_title_"+note.key] = title;
  //         var numberOfNotesSoFar = $('ul li').length;
  //         $('h1').text("[getting notes] Notes in my account ("+numberOfNotesSoFar+"/"+numberOfNotes+")");
  //         if(numberOfNotes === numberOfNotesSoFar) {
  //           $('h1').text("Notes in my account ("+numberOfNotesSoFar+")");
  //           $('h1').after($('<h2>').text(localStorage.key(0)));
  //         }
  //       }
  //     }
  //   },
  //   error: function(code) {
  //       if(numberOfTries < 2){
  //         numberOfTries += 1;
  //         getNoteTitle(note,numberOfTries);
  //       }
  //       else {
  //         $('ul').append($('<li class="error">').text("Error: "+code+" ("+note.key+")"));
  //         var numberOfNotesSoFar = $('ul li').length;
  //         $('h1').text("[getting notes] Notes in my account ("+numberOfNotesSoFar+"/"+numberOfNotes+")");
  //         if(numberOfNotes === numberOfNotesSoFar) {
  //           $('h1').text("Notes in my account ("+numberOfNotesSoFar+")");
  //         }
  //       }
  //     }
  //   });
  // }

  return {
    tryToLogin: function(block){
      api.auth({
        email: block.email,
        password: block.password,
        success: block.success, 
        error: block.error
      }); 
    }//,
    // retrieveNotes: function(){
    //     success: function() {
    //       $('h1').text("[logging in] Notes in my account");
    //       console.log( api.isLoggedIn() );
    //       $('h1').text("[getting notes] Notes in my account");
    //       api.retrieveIndex({
    //         success: function( resultsArray ) {
    //           numberOfNotes = resultsArray.length
    //           $('h1').text("[getting notes] Notes in my account (0/"+numberOfNotes+")");
    //           for(var i=0; i < resultsArray.length; i++){
    //             getNoteTitle(resultsArray[i]);
    //           }
    //         },
    //         error: function( code ) {
    //           console.error( code );
    //         }
    //       });
    //     },
    //   }); 
    // }
  };
}();

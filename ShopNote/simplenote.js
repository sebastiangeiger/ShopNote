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
  var getListOfNotes = function(block){
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
          console.log("called the right thing with " + listOfNotes.length + " notes");
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

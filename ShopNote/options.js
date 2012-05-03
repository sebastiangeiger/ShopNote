var shopNoteOptions = function(){
  var loginButton,
      usernameField,
      passwordField,
      requestLogin,
      tryAutomaticLogin,
      saveCredentials,
      forgetCredentials,
      enableEmailAndPasswordField,
      disableEmailAndPasswordField,
      startRetrievingNotes,
      initializeFields;

  initializeFields = function(){
    loginButton = $('.simplenote button#login');
    usernameField = $('.simplenote input:text');
    passwordField = $('.simplenote input:password');
    page.initializeFields();
  };

  var siteState = function(){
    var initial = 1,
        notEnoughInfoProvided = 2,
        readyForLogin = 3,
        loginRequested = 4,
        notLoggedIn = 5,
        loggedIn = 6,
        notesPartiallyRetrieved = 7,
        notesRetrieved = 8,
        state,
        allNotesRetrieved,
        numberOfNotes = 0,
        numberOfRetrievedNotes = 0,
        emailOrPasswordFieldUpdated;

    state = initial;

    emailOrPasswordFieldUpdated = function(){
      switch (state) {
        case notEnoughInfoProvided: //Caution Falling through here!
        case readyForLogin:
          if(page.credentialsProvided()){
            state = readyForLogin;
            page.enableLoginButton();
          } else {
            state = notEnoughInfoProvided;
            page.disableLoginButton();
          }
          break;
        case notLoggedIn:
          page.clearMessages();
          if(page.credentialsProvided()){
            state = readyForLogin;
            page.enableLoginButton();
          } else {
            state = notEnoughInfoProvided;
            page.disableLoginButton();
          }
          break;
        default:
          console.error("unforseen state change");
          break;
      }
    };

    return {
      initialStates: function(){
        console.log("initialStates");
        page.showLoginButton();
        page.disableLoginButton();
        page.hideSpinner();
        page.clearMessages();
        page.hideNotesList();
        page.hideProgressBar();
        page.hideLoginStatusField();
        page.hideForgetCredentialsButton();
        readEmailAndPasswordFromStorage();
      },
      virginState: function(){
        state = notEnoughInfoProvided;
      },
      emailFieldUpdated: function(){
        console.log("emailFieldUpdated");
        emailOrPasswordFieldUpdated();
      },
      passwordFieldUpdated: function(){
        console.log("passwordFieldUpdated");
        emailOrPasswordFieldUpdated();
      },
      loginButtonPressed: function(){
        console.log("loginButtonPressed");
        switch(state) {
          case initial: //Caution! Falling through
          case readyForLogin: //Caution! Falling through
          case notLoggedIn:
            page.clearMessages();
            page.showSpinner();
            page.hideLoginButton();
            page.disableEmailAndPasswordField();
            state = loginRequested;
            requestLogin();
            break;
          default:
            console.error("unforseen state change");
            break;
        }
      },
      loginSuccess: function(){
        if(state === loginRequested){
          state = loggedIn;
          page.hideSpinner();
          saveCredentials();
          page.setLoggedInUser($(usernameField).val());
          page.fadeOutLoginPrompt({afterwards: function(){
              page.showLoginStatusField();
              page.showProgressBar();
            }
          });
          startRetrievingNotes();
        } else {
          console.error("unforseen state change");
        }
      },
      loginFailed: function(){
        if(state === loginRequested){
          state = notLoggedIn;
          page.hideSpinner();
          page.showLoginButton();
          page.enableLoginButton();
          page.enableEmailAndPasswordField();
          page.showErrorMessage("Please check your username and password.");
        } else {
          console.error("unforseen state change");
        }
      },
      forgetCredentialsButtonPressed: function(){
        if(state === loggedIn){
          forgetCredentials();
          page.fadeOutLoginStatusField({afterwards: page.showLoginPrompt()});
          page.enableEmailAndPasswordField();
          page.clearEmailAndPasswordFields();
          page.showLoginButton();
          page.disableLoginButton();
          page.clearMessages();
          state = notEnoughInfoProvided;  
        } else {
          console.error("unforseen state change");
        }
      },
      numberOfAllNotes: function(number){
        numberOfNotes = number;
        console.log("Number of all notes is now "  + numberOfNotes);
      },
      retrievedNote: function(){
        numberOfRetrievedNotes += 1;
        console.log("Got " + numberOfRetrievedNotes + " / " + numberOfNotes +" !");
        switch(state){
          case loggedIn: //Falling through
            page.updateProgressBarTo(0);
          case notesPartiallyRetrieved:
            if(numberOfRetrievedNotes==numberOfNotes){
              page.updateProgressBarTo(100*numberOfRetrievedNotes/numberOfNotes);
              state = notesRetrieved;
              page.showNotesList();
              page.selectNoteInNotesList(localStorage["selectedNoteKey"]);
              page.hideProgressBar();
            } else {
              page.updateProgressBarTo(100*numberOfRetrievedNotes/numberOfNotes);
              state = notesPartiallyRetrieved;
            }
            break;
          default:
            console.error("unforseen state change");
            break;
        }
      }
    };
  }();

  var page = function(){
    var forgetCredentialsButton,
        errorField,
        successField,
        statusField,
        loginSpinner,
        notesList,
        notesListLabel,
        notesSelection,
        loginStatusField,
        loggedInIndicator,
        progressBar,
        progressBarWrapper;

    String.prototype.truncate = function(length){
      if(this.length < length){
        return this;
      } else {
        return this.substr(0,length-4) + "...";
      }
    };

    var addNote = function(key,title){
      console.log("Called addNote with "+title+" (key: "+key+")");
      if(title){
        $(notesList).append($('<option>').attr('value', key).text(title.truncate(47)));
      }
    };

    var updateNotesList = function(changes){
      if(changes && changes["added"]){
        for(var i = 0; i < changes.added.length; i++){
          var note = changes["added"][i];
          addNote(note.key, note.title);
        }
      } else if (! changes) {
        console.error("Something went wrong while updating the list");
      }
    };

    return {
      initializeFields: function(){
        errorField = $('.simplenote .error');
        successField = $('.simplenote .success');
        loginSpinner = $('.simplenote .spinner');
        loginStatusField = $('.simplenote #loggedin_indicator');
        loggedInIndicator = $(loginStatusField).children('#regular');
        forgetCredentialsButton = $(loginStatusField).children('#hover');
        notesList = $('.simplenote #notes_selection select');
        notesListLabel = $('.simplenote #notes_selection label');
        notesSelection = $('.simplenote #notes_selection');
        progressBarWrapper = $('.simplenote #progress_bar_wrapper');
        progressBar = $('.simplenote #progress_bar_wrapper #progress_bar');
        progressBar.progressbar({value:0});
        datastorage.invokeWhenUpdated(updateNotesList);
      },
      clearEmailAndPasswordFields: function(){
        $(usernameField).val("");
        $(passwordField).val("");
      },
      credentialsProvided: function(){
        var username = $(usernameField).val();
        var password = $(passwordField).val();
        return username && password;
      },
      enableEmailAndPasswordField: function(){
        $(usernameField).attr("disabled", false);
        $(passwordField).attr("disabled", false);
      },
      disableEmailAndPasswordField: function(){
        $(usernameField).attr("disabled", true);
        $(passwordField).attr("disabled", true);
      },
      showSuccessMessage: function(text,options){
        $(successField).show();
        $(successField).text(text);
        if(options && options["fadeout"]){
          setTimeout(function(){
            $(successField).fadeOut();
          }, options["fadeout"]*1000);
        }
      },
      showErrorMessage: function(text){
        $(errorField).text(text);
      },
      clearMessages: function(){
        $(errorField).text("");
        $(successField).text("");
      },
      showSpinner: function(){
        $(loginSpinner).show();
      },
      hideSpinner: function(){
        $(loginSpinner).hide();
      },
      showLoginButton: function(){
        $(loginButton).show();
        $(loginSpinner).hide();
      },
      disableLoginButton: function(){
        $(loginButton).attr("disabled", true);
      },
      enableLoginButton: function(){
        $(loginButton).attr("disabled", false);
      },
      fadeOutLoginPrompt: function(block){
        $('#login_form').fadeOut(300,block.afterwards);
      },
      showLoginPrompt: function(block){
        $('#login_form').show();
      },
      showLoginStatusField: function(){
        $(loginStatusField).show();
      },
      hideLoginStatusField: function(){
        $(loginStatusField).hide();
      },
      fadeOutLoginStatusField: function(block){
        $(loginStatusField).fadeOut(300, block.afterwards);
      },
      hideForgetCredentialsButton: function(){
        $(forgetCredentialsButton).hide();
      },
      setLoggedInUser: function(username){
        $(loggedInIndicator).text("Logged in as " + username + "");
        $(forgetCredentialsButton).text("[x] Logout " + username + ""); //TODO: Find a nice [x] icon here!
      },
      hideLoginButton: function(){
        $(loginButton).hide();
      },
      hideNotesList: function(){
        $(notesSelection).hide();
      },
      showNotesList: function(){
        $(notesSelection).show();
      },
      enableNotesList: function(){
        $(notesList).attr("disabled", false);
      },
      disableNotesList: function(){
        $(notesList).attr("disabled", true);
      },
      addNote: function(key,title){
        addNote(key,title);
      },
      showProgressBar: function(){
        $(progressBarWrapper).show();
      },
      hideProgressBar: function(){
        $(progressBarWrapper).hide();
      },
      updateProgressBarTo: function(percentage){
        $(progressBar).progressbar("option","value",percentage);
      },
      selectNoteInNotesList: function(key){
        if(key){
          $(notesList).children('option[value='+key+']').prop('selected', true);
        }
      },


      initializeButtons: function(){
        $(loginStatusField).hover(
          function(){$(loggedInIndicator).hide();$(forgetCredentialsButton).show();},
          function(){$(loggedInIndicator).show();$(forgetCredentialsButton).hide();}
        );
        $(loginButton).on("click", function(event){
          event.preventDefault();
          siteState.loginButtonPressed();
        });
        $(forgetCredentialsButton).on("click", function(event){
          siteState.forgetCredentialsButtonPressed();
        });
        $(notesList).on("change", function(event){
          setSelectedNote({key: $(notesList).children(':selected').val()});
          page.showSuccessMessage("Saved.", {"fadeout": 3});
        });
      },
      
      connectButtonsToStates: function(){
        $(usernameField).on("change", function(event){
          siteState.emailFieldUpdated();
        });
        $(passwordField).on("change", function(event){
          siteState.passwordFieldUpdated();
        });
      }
    };
  }();

  tryAutomaticLogin = function(){
    if(localStorage["simpleNoteEmail"] && localStorage["simpleNotePassword"]){
      readEmailAndPasswordFromStorage();
      $(loginButton).click();
    } else {
      siteState.virginState();
    }
  };

  requestLogin = function(){
    simpleNote.tryToLogin({
      email: $(usernameField).val(),
      password: $(passwordField).val(),
      success: function(){
        siteState.loginSuccess();
      },
      error: function(){
        siteState.loginFailed();
      }
    });
  };

  startRetrievingNotes = function(){
    simpleNote.getListOfNotes({
      email: $(usernameField).val(),
      password: $(passwordField).val(),
      numberOfExpectedItems: function(number){
        console.log("numberOfExpectedItems called");
        siteState.numberOfAllNotes(number);  
      },
      success: function(listOfNotes){
        var keysOfNotesThatNeedToBeFetched = [];
        for(var i=0; i<listOfNotes.length; i++){
          var note = listOfNotes[i];
          if(datastorage.needsToBeRetrieved(note.key, note.modify)){
            keysOfNotesThatNeedToBeFetched.push(note.key);
          } else {
            var storedNote = datastorage.getNote(note.key);
            page.addNote(storedNote.key, storedNote.title);
          }
        }  
        this.numberOfExpectedItems(keysOfNotesThatNeedToBeFetched.length);
        simpleNote.getNotes({
          email: $(usernameField).val(),
          password: $(passwordField).val(),
          keys: keysOfNotesThatNeedToBeFetched,
          success: function(note){
            siteState.retrievedNote();
            console.log("Works!");
            datastorage.addNote(note.key,note.title);
          },
          noteRetrievalError: function(code,key){
            siteState.retrievedNote();
            console.error("Could not get the title of the note with the key " + key);
          }
        });
      },
      listRetrievalError: function(){
        console.error("Could not get the list");
      },
      loginError: function(){
        console.error("Login didn't work");
      }
    });
  };

  forgetCredentials = function(){
    localStorage["simpleNoteEmail"] = "";
    localStorage["simpleNotePassword"] = "";
  };

  saveCredentials = function(){
    localStorage["simpleNoteEmail"] = $(usernameField).val();
    localStorage["simpleNotePassword"] = $(passwordField).val();
  };

  readEmailAndPasswordFromStorage = function(){
    $(usernameField).val(localStorage["simpleNoteEmail"]);
    $(passwordField).val(localStorage["simpleNotePassword"]);
  };

  setSelectedNote = function(object){
    if(object && object["key"]){
      localStorage["selectedNoteKey"] = object.key
    } else {
      console.error("object was undefined or did not have a key attribute")
    }
  }
  return {
    init: function() {
      initializeFields();
      page.connectButtonsToStates();
      page.initializeButtons();
      siteState.initialStates();
      tryAutomaticLogin();
    }
  };
}();

$(function(){
    shopNoteOptions.init();
});

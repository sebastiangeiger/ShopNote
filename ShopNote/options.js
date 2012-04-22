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
        page.hideForgetCredentialsButton();
        // page.hideNotesList();
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
          page.showForgetCredentialsButton();
          saveCredentials();
          page.showSuccessMessage("Logged in");
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
          page.enableEmailAndPasswordField();
          page.clearEmailAndPasswordFields();
          page.hideForgetCredentialsButton();
          page.showLoginButton();
          page.disableLoginButton();
          page.clearMessages();
          state = notEnoughInfoProvided;  
        } else {
          console.error("unforseen state change");
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
        notesList;

    return {
      initializeFields: function(){
        forgetCredentialsButton = $('.simplenote button#forget_credentials');
        errorField = $('.simplenote .error');
        successField = $('.simplenote .success');
        statusField = $('.simplenote .status');
        loginSpinner = $('.simplenote .spinner');
        notesList = $('.simplenote #notes_selection select');
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
      showSuccessMessage: function(text){
        $(successField).text(text);
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
      hideLoginButton: function(){
        $(loginButton).hide();
      },
      hideForgetCredentialsButton: function(){
        $(forgetCredentialsButton).hide();
      },
      showForgetCredentialsButton: function(){
        $(forgetCredentialsButton).show();
      },
      hideNotesList: function(){
        $(notesList).hide();
      },
      showNotesList: function(){
        $(notesList).show();
      },
      enableNotesList: function(){
        $(notesList).attr("disabled", false);
      },
      disableNotesList: function(){
        $(notesList).attr("disabled", true);
      },
      addNote: function(key,title){
        console.log("Called addNote");
        $(notesList).append($('<option>').attr('value', key).text(title));
      },


      initializeButtons: function(){
        $(loginButton).on("click", function(event){
          event.preventDefault();
          siteState.loginButtonPressed();
        });
        $(forgetCredentialsButton).on("click", function(event){
          event.preventDefault();
          siteState.forgetCredentialsButtonPressed();
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

  String.prototype.truncate = function(length){
    if(this.length < length){
      return this;
    } else {
      return this.substr(0,length-4) + "...";
    }

  };

  startRetrievingNotes = function(){
    simpleNote.getNotesWithKeysAndTitles({
      email: $(usernameField).val(),
      password: $(passwordField).val(),
      success: function(note){
        page.addNote(note.key,note.title.truncate(47));
      },
      noteRetrievalError: function(code,key){
        console.error("Could not get the title of the note with the key " + key);
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

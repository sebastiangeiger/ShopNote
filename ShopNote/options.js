var shopNoteOptions = function(){
  var credentialsProvided,
      clearMessages,
      connectButtonsToStates,
      initializeButtons,
      loginButton,
      forgetCredentialsButton,
      errorField,
      usernameField,
      passwordField,
      loginSpinner,
      showSpinner,
      hideSpinner,
      showLoginButton,
      showNoCredentialsProvided,
      requestLogin,
      enableEmailAndPasswordField,
      disableEmailAndPasswordField,
      initializeFields;

  initializeFields = function(){
    loginButton = $('.simplenote button#login');
    forgetCredentialsButton = $('.simplenote button#forget_credentials');
    errorField = $('.simplenote .error');
    successField = $('.simplenote .success');
    statusField = $('.simplenote .status');
    usernameField = $('.simplenote input:text');
    passwordField = $('.simplenote input:password');
    loginSpinner = $('.simplenote .spinner');
  };

  var siteState = function(){
    var initial = 1,
        notEnoughInfoProvided = 2,
        readyForLogin = 3,
        loginRequested = 4,
        notLoggedIn = 5,
        loggedIn = 6,
        state,
        emailOrPasswordFieldUpdated;

    state = initial;

    emailOrPasswordFieldUpdated = function(){
      switch (state) {
        case notEnoughInfoProvided: //Caution Falling through here!
        case readyForLogin:
          if(credentialsProvided()){
            state = readyForLogin;
            enableLoginButton();
          } else {
            state = notEnoughInfoProvided;
            disableLoginButton();
          }
          break;
        case notLoggedIn:
          clearMessages();
          if(credentialsProvided()){
            state = readyForLogin;
            enableLoginButton();
          } else {
            state = notEnoughInfoProvided;
            disableLoginButton();
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
        showLoginButton();
        disableLoginButton();
        hideSpinner();
        clearMessages();
        hideForgetCredentialsButton();
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
            clearMessages();
            showSpinner();
            hideLoginButton();
            disableEmailAndPasswordField();
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
          hideSpinner();
          showForgetCredentialsButton();
          rememberCredentials();
          showSuccessMessage("Logged in");
        } else {
          console.error("unforseen state change");
        }
      },
      loginFailed: function(){
        if(state === loginRequested){
          state = notLoggedIn;
          hideSpinner();
          showLoginButton();
          enableLoginButton();
          enableEmailAndPasswordField();
          showErrorMessage("Please check your username and password.");
        } else {
          console.error("unforseen state change");
        }
      },
      forgetCredentialsButtonPressed: function(){
        if(state === loggedIn){
          forgetCredentials();
          enableEmailAndPasswordField();
          clearEmailAndPasswordFields();
          hideForgetCredentialsButton();
          showLoginButton();
          disableLoginButton();
          clearMessages();
          state = notEnoughInfoProvided;  
        } else {
          console.error("unforseen state change");
        }
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
  }
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

  forgetCredentials = function(){
    localStorage["simpleNoteEmail"] = "";
    localStorage["simpleNotePassword"] = "";
  };

  rememberCredentials = function(){
    localStorage["simpleNoteEmail"] = $(usernameField).val();
    localStorage["simpleNotePassword"] = $(passwordField).val();
  };

  readEmailAndPasswordFromStorage = function(){
    $(usernameField).val(localStorage["simpleNoteEmail"]);
    $(passwordField).val(localStorage["simpleNotePassword"]);
  };

  clearEmailAndPasswordFields = function(){
    $(usernameField).val("");
    $(passwordField).val("");
  };

  credentialsProvided = function(){
    var username = $(usernameField).val();
    var password = $(passwordField).val();
    return username && password;
  };

  enableEmailAndPasswordField = function(){
    $(usernameField).attr("disabled", false);
    $(passwordField).attr("disabled", false);
  };
  disableEmailAndPasswordField = function(){
    $(usernameField).attr("disabled", true);
    $(passwordField).attr("disabled", true);
  };

  showSuccessMessage = function(text){
    $(successField).text(text);
  };

  showErrorMessage = function(text){
    $(errorField).text(text);
  };


  clearMessages = function(){
    $(errorField).text("");
    $(successField).text("");
  };

  showSpinner = function(){
    $(loginSpinner).show();
  };

  hideSpinner = function(){
    $(loginSpinner).hide();
  };

  showLoginButton = function(){
    $(loginButton).show();
    $(loginSpinner).hide();
  };

  disableLoginButton = function(){
    $(loginButton).attr("disabled", true);
  };
  enableLoginButton = function(){
    $(loginButton).attr("disabled", false);
  };
  hideLoginButton = function(){
    $(loginButton).hide();
  };
  hideForgetCredentialsButton = function(){
    $(forgetCredentialsButton).hide();
  };
  showForgetCredentialsButton = function(){
    $(forgetCredentialsButton).show();
  };

  initializeButtons = function(){
    $(loginButton).on("click", function(event){
      event.preventDefault();
      siteState.loginButtonPressed();
    });
    $(forgetCredentialsButton).on("click", function(event){
      event.preventDefault();
      siteState.forgetCredentialsButtonPressed();
    });
  };
  
  connectButtonsToStates = function(){
    $(usernameField).on("change", function(event){
      siteState.emailFieldUpdated();
    });
    $(passwordField).on("change", function(event){
      siteState.passwordFieldUpdated();
    });
  };
  

  return {
    init: function() {
      initializeFields();
      connectButtonsToStates();
      initializeButtons();
      siteState.initialStates();
      tryAutomaticLogin();
    }
  };
}();

$(function(){
    shopNoteOptions.init();
});

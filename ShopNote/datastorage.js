var datastorage = function(){
  var callbacks = []; 
  return {
    reset: function(){
      localStorage.clear();
      // notifyListeners(); //TODO: {"removed": all_keys}
    },
    addNote: function(key,title,updatedTimeStamp){
      var added = {"key":key,"title":title,"updatedTimeStamp":updatedTimeStamp};
      localStorage[key] = title;
      localStorage[key+"_updatedTimeStamp"] = updatedTimeStamp;
      var changeSet = {"added":[added]};
      this.notifyListeners(changeSet);
    },
    size: function(){
      var keys = [];
      for(var i = 0; i < localStorage.length; i++){
        keys.push(localStorage.key(i).split("_")[0]);
      }
      return $.unique(keys).length
    },
    getNote: function(key){
      var title = localStorage[key];
      var updatedTimeStamp = localStorage[key+"_updatedTimeStamp"];
      if (title) {
        return {"key": key, "title": title, "updatedTimeStamp": updatedTimeStamp};
      }
    },
    deleteNote: function(key){
      delete localStorage[key+"_updatedTimeStamp"];
      delete localStorage[key];
    },
    needsToBeRetrieved: function(key,updatedTimeStamp){
      if(this.getNote(key)){
        //TODO: Check for the timestamp here, only retrieve notes that have been modified in the meantime
        return false;
      } else {
        return true;
      }
    },
    invokeWhenUpdated: function(callback){
      callbacks.push(callback); 
    },
    notifyListeners: function(changeSet){
      for(var i=0; i<callbacks.length; i++){
        callbacks[i](changeSet);
      } 
    }

  }
}();


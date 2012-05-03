var datastorage = function(){
  var storage = [];
  var callbacks = []; 
  var indexOf = function(key){
    for(var i=0; i<storage.length; i++){
      if(storage[i].key === key){
        return i;
      }
    }
    return -1;
  }
  return {
    reset: function(){
      var keys = this.getKeys();
      for(var i=0; i<keys.length; i++){
        this.deleteNote(keys[i]); 
      }
      // notifyListeners(); //TODO: {"removed": all_keys}
    },
    addNote: function(key,title,updatedTimeStamp){
      var added = {"key":key,"title":title};
      storage.push(added);
      var changeSet = {"added":[added]};
      this.notifyListeners(changeSet);
    },
    size: function(){
      return storage.length
    },
    getKeys: function(){
      var keys = [];
      for(var i=0; i<storage.length; i++){
        keys.push(storage[i].key);
      }
      return keys;
    },
    getNote: function(key){
      var index = indexOf(key);
      if(index >= 0){
        return storage[index];
      } else {
        return undefined;
      }
    },
    deleteNote: function(key){
      var index = indexOf(key);
      if(index >= 0){
        storage.splice(index,1) 
      } //TODO: notifyListener here!
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


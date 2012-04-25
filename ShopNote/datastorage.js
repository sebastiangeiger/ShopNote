var datastorage = function(){
  var storage = []
  return {
    reset: function(){
      storage = []
    },
    addNote: function(key,title,updatedTimeStamp){
      storage.push({"key":key,"title":title});
    },
    size: function(){
      return storage.length
    },
    getNote: function(key){
      return storage[0];
    },
    needsToBeRetrieved: function(key,updatedTimeStamp){
      if(this.getNote(key)){
        //TODO: Check for the timestamp here, only retrieve notes that have been modified in the meantime
        return false;
      } else {
        return true;
      }
    }
  }
}();


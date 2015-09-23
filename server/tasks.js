// This code only runs on the server
Tasks = new Mongo.Collection(null);


Meteor.publish("tasks", function () {
  var self = this;

  // initial tasks
  var cursor = Tasks.find();

  cursor.forEach(function(task){
    self.added("items", task._id, task);
  });


  self.ready();

  cursor.observeChanges({
    added: function(id, fields){
      self.added("items", id, fields);
    },
    removed: function(id){
      self.removed("items", id);
    },
    changed: function(id, fields){
      self.changed("items", id, fields);
    }
  });
});


Meteor.methods({

  addTask: function (task) {
    Meteor._sleepForMs(1000);
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert(task);
  },

  deleteTask: function (taskId) {
    Meteor._sleepForMs(1000);
    restrictOwner(taskId);
    Tasks.remove(taskId);
  },  

  setChecked: function (taskId, setChecked) {
    Meteor._sleepForMs(1000);
    restrictPublicOrOwner(taskId);
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function (taskId, setPrivate) {
    Meteor._sleepForMs(1000);
    restrictOwner(taskId);
    Tasks.update(taskId, { $set: { private: setPrivate} });  
  }  
});



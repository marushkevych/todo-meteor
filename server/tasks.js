// This code only runs on the server
var tasks = new Tasks();

Meteor.publish("tasks", function () {
  var self = this;
  // initial tasks
  tasks.getTasks().forEach(function(task){
    self.added("items", task._id, task);
  });
  self.ready();

  tasks.observeChanges({
    added: function(id, fields){
      self.added("items", id, fields);
    },
    removed: function(id){
      self.removed("items", id);
    }
  });

});


// Tasks observable model - constructor
function Tasks(){
  var callbacksArray = [];
  var tasks = [
    {
      _id: Meteor.uuid(),
      text: "task1",
      checked: true,
      createdAt: new Date(),        
    },
    {
      _id: Meteor.uuid(),
      text: "task2",
      createdAt: new Date(),        
    }
  ];


  return {
    getTasks: function(){
      return tasks;
    },
    observeChanges: function(callbacks){
      callbacksArray.push(callbacks);
    },
    add: function(task){
      tasks.push(task);
      callbacksArray.forEach(function(callbacks){
        callbacks.added(task._id, task);
      });
    },
    remove: function(id){
      tasks = tasks.filter(function(item){
        return item._id !== id;
      });
      callbacksArray.forEach(function(callbacks){
        callbacks.removed(id);
      });

    }
  }
}

Meteor.methods({

  addTask: function (task) {
    Meteor._sleepForMs(3000);

    console.log('addTask method')
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    tasks.add(task);
  },

  deleteTask: function (taskId) {
    Meteor._sleepForMs(3000);
    tasks.remove(taskId);
  },

  setChecked: function (taskId, setChecked) {
    Meteor._sleepForMs(3000);
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function (taskId, setPrivate) {
    Meteor._sleepForMs(3000);
    Tasks.update(taskId, { $set: { private: setPrivate} });  
  }
});



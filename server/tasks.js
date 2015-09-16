// This code only runs on the server
Tasks = new TasksCollection();

Meteor.publish("tasks", function () {
  var self = this;
  // initial tasks
  Tasks.getTasks().forEach(function(task){
    self.added("items", task._id, task);
  });
  self.ready();

  Tasks.observeChanges(self);

});


// tasks observable model - constructor
function TasksCollection(){
  var listeners = [];
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
    findOne: function(taskId){
      return R.find(R.propEq('_id', taskId))(tasks);
    },
    getTasks: function(){
      return tasks;
    },
    observeChanges: function(listener){
      listeners.push(listener);
    },
    add: function(task){
      tasks.push(task);
      listeners.forEach(function(listener){
        listener.added("items", task._id, task);
      });
    },
    remove: function(id){
      tasks = tasks.filter(function(item){
        return item._id !== id;
      });
      listeners.forEach(function(listener){
        listener.removed("items", id);
      });

    }
  }
}

Meteor.methods({

  addTask: function (task) {
    Meteor._sleepForMs(1000);

    console.log('addTask method')
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.add(task);
  },

  deleteTask: function (taskId) {
    Meteor._sleepForMs(1000);
    restrictOwner(taskId);
    Tasks.remove(taskId);
  },

  setChecked: function (taskId, setChecked) {
    Meteor._sleepForMs(1000);
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function (taskId, setPrivate) {
    Meteor._sleepForMs(1000);
    Tasks.update(taskId, { $set: { private: setPrivate} });  
  }
});



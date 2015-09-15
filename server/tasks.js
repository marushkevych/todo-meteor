// This code only runs on the server
var tasks = new Tasks();

Meteor.publish("tasks", function () {
  var self = this;
  // initial tasks
  tasks.getTasks().forEach(function(task){
    self.added("items", task.id, task);
  });
  self.ready();

  tasks.observeChanges({
    added: function(id, fields){
      self.added("items", id, fields);
    }
  });

});


// Tasks observable model - constructor
function Tasks(){
  var callbacksArray = [];
  var tasks = [
    {
      id: Meteor.uuid(),
      text: "task1",
      checked: true,
      createdAt: new Date(),        
    },
    {
      id: Meteor.uuid(),
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
        callbacks.added(Meteor.uuid(), task);
      });
    },
    remove: function(id){
      tasks = tasks.filter(function(item){
        
      });

    }
  }
}

Meteor.methods({

  addTask: function (text) {
    Meteor._sleepForMs(3000);

    console.log('addTask method')
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var newTask = {
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    };
    tasks.add(newTask);
  },

  deleteTask: function (taskId) {
    restrictOwner(taskId);
    Tasks.remove(taskId);
  },

  setChecked: function (taskId, setChecked) {
    restrictPublicOrOwner(taskId);
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function (taskId, setPrivate) {
    restrictOwner(taskId);
    Tasks.update(taskId, { $set: { private: setPrivate} });  
  }
});

var restrict = R.curry(function(predicate, taskId){
  var task = Tasks.findOne(taskId);

  if (!predicate(task)) {
    throw new Meteor.Error("not-authorized");
  }
});

var restrictOwner = restrict(function (task){
  return task.owner === Meteor.userId();
});

var restrictPublicOrOwner = restrict(function (task){
  return !task.private || task.owner === Meteor.userId();
});

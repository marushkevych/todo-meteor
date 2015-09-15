
// This code only runs on the client

// create minimongo collection on the client (no collection is created in mongoDB)
Tasks = new Mongo.Collection("items");

Meteor.subscribe("tasks");

Template.body.helpers({
  tasks: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the tasks
      var tasks = Tasks.find({}, {sort: {createdAt: -1}});
      tasks.forEach(function(task){
        console.log(task)
      })
      return tasks;
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  },
  incompleteCount: function () {
    return Tasks.find({checked: {$ne: true}}).count();
  }
});



Template.body.events({
  "submit .new-task": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var text = event.target.text.value;

    // Insert a task into the collection
    Meteor.call("addTask", text);

    // Clear form
    event.target.text.value = "";
  },
  "click .hide-completed": function(){
     Session.set("hideCompleted", event.target.checked);
  }
});

Template.task.events({
  "click .toggle-checked": function(event){
    Meteor.call("setChecked", this._id, ! this.checked);
  },
  "click .delete": function(event){
    Meteor.call('deleteTask', this._id);
  },
  "click .toggle-private": function(){
    Meteor.call("setPrivate", this._id, !this.private);
  }
});

Template.task.helpers({
  isOwned: function(){
    return this.owner === Meteor.userId();
  },
  privacyState: function(){
    return this.private ? 'private' : 'public';
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});


Meteor.methods({

  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert({
      text: text + ' loading...',
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
});


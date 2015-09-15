

// Meteor.methods({

//   // addTask: function (text) {
//   //   // Make sure the user is logged in before inserting a task
//   //   if (! Meteor.userId()) {
//   //     throw new Meteor.Error("not-authorized");
//   //   }
 
//   //   Tasks.insert({
//   //     text: text,
//   //     createdAt: new Date(),
//   //     owner: Meteor.userId(),
//   //     username: Meteor.user().username
//   //   });
//   // },

//   deleteTask: function (taskId) {
//     restrictOwner(taskId);
//     Tasks.remove(taskId);
//   },

//   setChecked: function (taskId, setChecked) {
//     restrictPublicOrOwner(taskId);
//     Tasks.update(taskId, { $set: { checked: setChecked} });
//   },

//   setPrivate: function (taskId, setPrivate) {
//     restrictOwner(taskId);
//     Tasks.update(taskId, { $set: { private: setPrivate} });
//   }
// });

// var restrict = R.curry(function(predicate, taskId){
//   var task = Tasks.findOne(taskId);

//   if (!predicate(task)) {
//     throw new Meteor.Error("not-authorized");
//   }
// });

// var restrictOwner = restrict(function (task){
//   return task.owner === Meteor.userId();
// });

// var restrictPublicOrOwner = restrict(function (task){
//   return !task.private || task.owner === Meteor.userId();
// });


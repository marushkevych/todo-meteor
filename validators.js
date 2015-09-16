var restrict = R.curry(function(predicate, taskId){
  var task = Tasks.findOne(taskId);

  if (!predicate(task)) {
    throw new Meteor.Error("not-authorized");
  }
});

restrictOwner = restrict(function (task){
  return task.owner === Meteor.userId();
});

restrictPublicOrOwner = restrict(function (task){
  return !task.private || task.owner === Meteor.userId();
});

Template.players.helpers({
  topScorers: function(){
    return [
      {
        name: 'foo',
        leagueIs: 'senior',
        score: new ReactiveVar(10)
      },
      {
        name: 'bar',
        leagueIs: 'junior',
        score: new ReactiveVar(1)
      }
    ];
  },

  leagueIs: function(league){
    return this.leagueIs === league;
  }

});

Template.playerScore.events({
  "click .give-points": function(event){
    this.score.set(this.score.get() + 1 );
  }
});

Template.playerScore.helpers({
  getScore: function(event){
    return this.score.get();
  }
});

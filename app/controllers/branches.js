import Ember from 'ember';

export default Ember.Controller.extend({
  defaultBranch: Ember.computed('model.activeBranches', function () {
    return this.get('model.activeBranches').filterBy('defaultBranch')[0];
  }),

  branchesExist: Ember.computed.notEmpty('model.activeBranches'),
  nonDefaultBranches: Ember.computed.filter('model.activeBranches', function (branch) {
    return !branch.default_branch;
  }),

  activeBranches: Ember.computed('model.activeBranches', function () {
    const activeBranches = this.get('nonDefaultBranches').filterBy('existsOnGithub');
    return this._sortBranchesByFinished(activeBranches);
  }),

  _sortBranchesByFinished(branches) {
    const unfinished = branches.filter(branch => {
      return Ember.isNone(Ember.get(branch, 'last_build.finished_at'));
    });
    const sortedFinished = branches.filterBy('last_build.finished_at')
      .sortBy('last_build.finished_at').reverse();

    return unfinished.concat(sortedFinished);
  }
});

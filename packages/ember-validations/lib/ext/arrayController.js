Ember.ArrayController.reopen({
  controllerAt: function(idx, object, controllerClass) {
    this._super(idx, object, controllerClass);
    var subControllers = Ember.get(this, '_subControllers'),
        subController = subControllers[idx];

    if (subController.parentController.childControllers.indexOf(subController) === -1) {
      subController.parentController.childControllers.pushObject(subController);
      subController.willDestroy = function() {
        this.parentController.childControllers.removeObject(this);
      };
    }
  }
});

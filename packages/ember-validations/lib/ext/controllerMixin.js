Ember.ControllerMixin.reopen({
  childControllers: Ember.A(),
  setupAsChildController: function() {
    if (this.parentController && this.parentController.childControllers) {
      this.parentController.childControllers.pushObject(this);
      this.reopen({
        willDestroy: function() {
          this._super();
          this.parentController.childControllers.removeObject(this);
        }
      });
    }
  }.on('init')
});

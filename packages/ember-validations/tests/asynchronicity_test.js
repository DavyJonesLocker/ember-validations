/*globals QUnit */

var user, User, SyncValidator, semaphore;
var sequence = [];
var readable = function(s) {
  return "\n\n"+s.join("\n")+"\n\n";
};

QUnit.assert.occursAfter = function(second, first, optional){
  var ix_second = sequence.indexOf(second);
  var ix_first = -1;
  first = [].concat(first);
  first.forEach(function(event) {
    ix_first = Math.max(sequence.indexOf(event));
  });
  var message;
  if(!optional && (ix_second < 0)) {
    message = "'" + second + "' never occurred";
  } else if(!optional && (ix_first < 0)) {
    message = "'" + first + "' never occurred";    
  } else if(ix_second < ix_first) {
    message = "'" + second + "' occurs before " + "'" + first + "'";
  }
  QUnit.push( !message, message, 
    "'" + second + "' to occur after " + "'" + first + "'", 
    "in the sequence:" + readable(sequence) );
};

QUnit.assert.validSequence = function(){
  QUnit.assert.occursAfter(s.test_end, s.test_start);
  QUnit.assert.occursAfter(s.sync_end, s.sync_start);
  QUnit.assert.occursAfter(s.set_isValid, 
    [s.sync_validator_call_valid, s.sync_validator_call_invalid], true);
  QUnit.assert.occursAfter(s.get_isValid, 
    [s.sync_validator_call_valid, s.sync_validator_call_invalid], true);
};

var s = {
  test_start:                  'TEST START',
  test_end:                    'TEST END',
  sync_start:                  'SYNC START',
  sync_end:                    'SYNC END',
  set_isValid:                 'isValid.set',
  get_isValid:                 'isValid.get',
  work_after_valid:            'WORK after valid',
  work_after_invalid:          'WORK after invalid',
  sync_validator_call_valid:   'SyncValidator.call: valid',
  sync_validator_call_invalid: 'SyncValidator.call: invalid',
  get_validate_promise:        '--SYNC get validate promise',
  add_work_to_promise:         '--SYNC add work to validate promise'
};

module('Validate test', {
  setup: function() {
    function clearSequence() {
      while (sequence.length > 0) {
         sequence.pop();
       }
    }

    User = Ember.Object.extend(Ember.Validations.Mixin, {
      _isValid: true,
      isValid: function(key, value) {
        if (arguments.length > 1) {
          sequence.push(s.set_isValid);
          this.set('_isValid', value);
        } else {
          sequence.push(s.get_isValid);
        }
        return this.get('_isValid');
      }.property(),

      validations: {
        firstName: {
          sync: true
        }
      },
      
      validWork: function(){
        sequence.push(s.work_after_valid);
        start();
      },
    
      invalidWork: function(){
        sequence.push(s.work_after_invalid);
        start();
      }
      
    });

    Ember.Validations.validators.local.Sync = Ember.Validations.validators.Base.extend({
      init: function() {
        this._super();
        /*jshint expr:true*/
        if (this.options === true) {
          this.options = {};
        }

      },
      call: function() {
        if (semaphore === 'invalid') {
          sequence.push(s.sync_validator_call_invalid);
          this.errors.pushObject(this.options.message);
        } else {
          sequence.push(s.sync_validator_call_valid);         
        }
      }
    });
    
    Ember.run(function() {
      user = User.create();
      clearSequence();
    });
  }
});

asyncTest('work after validate is async', function(assert) {
  semaphore = 'valid';
  sequence.push(s.test_start);
  stop();
  Ember.run(function(){
    sequence.push(s.sync_start);
    sequence.push(s.get_validate_promise);
    var p = user.validate();
    sequence.push(s.add_work_to_promise);
    p.then(user.validWork, user.invalidWork);
    sequence.push(s.sync_end);
    start();
  });
  sequence.push(s.test_end);
  assert.validSequence();
  assert.occursAfter(
    s.work_after_valid, s.sync_end
  );
});

asyncTest('settling isValid after validate is async', function(assert) {
  semaphore = 'valid';
  sequence.push(s.test_start);
  stop();
  Ember.run(function(){
    user.set('_isValid', false);
    sequence.push(s.sync_start);
    sequence.push(s.get_validate_promise);
    var p = user.validate();
    sequence.push(s.add_work_to_promise);
    p.then(user.validWork, user.invalidWork);
    sequence.push(s.sync_end);
    start();
  });
  sequence.push(s.test_end);

  assert.validSequence();

  assert.occursAfter(
    s.set_isValid, s.sync_end
  );
  
});

asyncTest('validator work is async', function(assert) {
  semaphore = 'valid';
  sequence.push(s.test_start);
  stop();
  Ember.run(function(){
    user.set('_isValid', false);
    sequence.push(s.sync_start);
    sequence.push(s.get_validate_promise);
    var p = user.validate();
    sequence.push(s.add_work_to_promise);
    p.then(user.validWork, user.invalidWork);
    sequence.push(s.sync_end);
    start();
  });
  sequence.push(s.test_end);

  assert.validSequence();

  assert.occursAfter(
    s.sync_validator_call_valid, s.sync_end
  );
  
});




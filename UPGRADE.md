# Notes on upgrading between versions

## 2.0.0-alpha.4

* `EmberValidations.Mixin` is no longer used. You can mix `EmberValidations` directly into your controllers:

```javascript
// now invalid
export default Ember.Controller.extend(EmberValidations.Mixin, {

// new valid syntax
export default Ember.Controller.extend(EmberValidations, {
```

Since the Mixin is exported by default when using inline validation you have to import the validator. And also create a new validator since elsewise jshint is gonna complain
```javascript
// now invalid

import EmberValidations from 'ember-validations';

...

inline: EmberValidations.validator(function() {
  if(this.model.get("something")) {
    return;
  } else {
    return "Something is not set";
  }
})

// now valid
import EmberValidations, { validator } from 'ember-validations';

...

inline: new validator(function() {
  if(this.model.get("something")) {
    return;
  } else {
    return "Something is not set";
  }
})

```

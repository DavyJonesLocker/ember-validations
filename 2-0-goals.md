# ember-validations 2.0 Goals

## Replace observers with CPs (for performance)

Currently ember-validations is a performance hog. This is due to the many observers being used throughout the library. Replacing all observers with
Computed Properties would resolve this issue.

## Composite Errors Object

The current Errors object baked into ember-validations only works to a single depth. Ideally we would want that object to reflect
all the error messages in the entire graph. This would help enable libraries like easy-form to easily derive error objects for property paths

Example:

```javascript
// parent
var Controller = Ember.Controller.extend(EmberValiations, {
  validations: {
    model: true,
    'model.name': {
      presence: true
    }
  } 
})

var Model = Ember.Object.extend(EmberValidations, {
  validations: {
    name: {
      length: 5
    }
  }
});

var model = Model.create();
var controller = Controller.create({model: model});

Ember.get(controller, 'errors.model.name.firstObject');
// "cannot be blank"
Ember.get(controller, 'isValid');
// false

Ember.set(controller, 'model.name', '1234');
Ember.get(controller, 'errors.model.name.firstObject');
// undefined
Ember.get(controller, 'isValid');
// false

Ember.get(model, 'errors.name.firstObject');
// must be length of 5

Ember.set(controller, 'model.name', '12345');
Ember.get(controller, 'errors.model.name.firstObject');
// undefined
Ember.get(model, 'errors.name.firstObject');
// undefined
Ember.get(controller, 'isValid');
// true
```

In the above example the first `get` on the `errors` object returns the expected value. `model.name` is not set yet
and so we expect the `Presence` validator to fail. After we `set` the value we see how the `get` on the `errors` object
now returns `undefined` yet the `isValid` state of `controller` is still `false`. The `errors` object on the `model` returns the
expected message. However, we want all child validateable object's error messages to coalesce into the parents `errors` object. 
The following is the goal:

```javascript
Ember.set(controller, 'model.name', '1234');
Ember.get(controller, 'errors.model.name.firstObject');
// must be length of 5
Ember.get(controller, 'isValid');
// false
```

## Full compatibility with Ember Data

ember-validations proposes that the only point of client side error messages is to instruct the user on how to react. That
can come in the form of making a correction to data that is invalid or waiting for a service that is not working to become available.

ember-validations does not believe that we should assume a 1:1 relationship between server-side error messages (validation or otherwise)
and client side models. We can coerse the error messages to map to client side models through transforms, but in some cases there will not be a
client-side analog to work with. For example, if the server-side error object contains an error for a remote API that is not currently available
to the backend. How do we properly map that to the client for display? It cannot be done.

Instead, ember-validations believes that the client should make a *best effort* to map. This can default to assuming 1:1 relationship if the client-side property
exists. If not then the error message for that property should go into a `base` object for display purposes only. It *should not* affect the validity of the model as
there is no associate that message with any property.

Ember Data itself has unfortunately gone in a very different direction. It will be up to ember-validations to have to push for the current implementation of DS.Errors
to be either dropped or replaced with something that is suitable for complex error message handling and correction.

## Refactor with es2015 syntax

I'd like to move as much code over to es2015.

## Break up test modules into individual files

One Best Practice we are putting into place at DockYard is one test module per file. ember-validation's test suite violates this rule quite a bit.

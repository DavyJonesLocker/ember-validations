# Notes on upgrading between versions

## 2.0.0-alpha.4

* `EmberValidations.Mixin` is no longer used. You can mix `EmberValidations` directly into your controllers:

```javascript
// now invalid
export default Ember.Controller.extend(EmberValidations.Mixin, {

// new valid syntax
export default Ember.Controller.extend(EmberValidations, {
```

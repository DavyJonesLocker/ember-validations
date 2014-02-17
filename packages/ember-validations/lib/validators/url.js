Ember.Validations.validators.local.Url = Ember.Validations.validators.Base.extend({
  regexp: null,
  regexp_ip: null,

  init: function() {
    this._super();

    if (this.get('options.message') === undefined) {
      this.set('options.message', Ember.Validations.messages.render('url', this.options));
    }

    if (this.get('options.protocols') === undefined) {
      this.set('options.protocols', ['http', 'https']);
    }

    // Regular Expression Parts
    var dec_octet = '(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])'; // 0-255
    var ipaddress = '(' + dec_octet + '(\\.' + dec_octet + '){3})';
    var hostname = '([a-zA-Z0-9\\-]+\\.)+([a-zA-Z]{2,})';
    var encoded = '%[0-9a-fA-F]{2}';
    var characters = 'a-zA-Z0-9$\\-_.+!*\'(),;:@&=';
    var segment = '([' + characters + ']|' + encoded + ')*';

    // Build Regular Expression
    var regex_str = '^';

    if (this.get('options.domainOnly') === true) {
      regex_str += hostname;
    } else {
      regex_str += '(' + this.get('options.protocols').join('|') + '):\\/\\/'; // Protocol

      // Username and password
      if (this.get('options.allowUserPass') === true) {
        regex_str += '(([a-zA-Z0-9$\\-_.+!*\'(),;:&=]|' + encoded + ')+@)?'; // Username & passwords
      }

      // IP Addresses?
      if (this.get('options.allowIp') === true) {
        regex_str += '(' + hostname + '|' + ipaddress + ')'; // Hostname OR IP
      } else {
        regex_str += '(' + hostname + ')'; // Hostname only
      }

      // Ports
      if (this.get('options.allowPort') === true) {
        regex_str += '(:[0-9]+)?'; // Port
      }

      regex_str += '(\\/';
      regex_str += '(' + segment + '(\\/' + segment + ')*)?'; // Path
      regex_str += '(\\?' + '([' + characters + '/?]|' + encoded + ')*)?'; // Query
      regex_str += '(\\#' + '([' + characters + '/?]|' + encoded + ')*)?'; // Anchor
      regex_str += ')?';
    }

    regex_str += '$';

    // RegExp
    this.regexp = new RegExp(regex_str);
    this.regexp_ip = new RegExp(ipaddress);
  },
  call: function() {
    var url = this.model.get(this.property);

    if (Ember.isEmpty(url)) {
      if (this.get('options.allowBlank') !== true) {
        this.errors.pushObject(this.get('options.message'));
      }
    } else {
      if (this.get('options.allowIp') !== true) {
        if (this.regexp_ip.test(url)) {
          this.errors.pushObject(this.get('options.message'));
          return;
        }
      }

      if (!this.regexp.test(url)) {
        this.errors.pushObject(this.get('options.message'));
      }
    }
  }
});


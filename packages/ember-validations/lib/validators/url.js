Ember.Validations.validators.local.Url = Ember.Validations.validators.Base.extend({
  init: function() {
    this._super();

    if (this.get('options.message') === undefined) {
      this.set('options.message', Ember.Validations.messages.render('inclusion', this.options));
    }

    if (this.get('options.protocols') === undefined) {
      this.set('options.protocols', ['http', 'https']);
    }
  },
  call: function() {
    var dec_octet = '(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])'; // 0-255
    var ipaddress = '(' + dec_octet + '(\\.' + dec_octet + '){3})';
    var hostname = '([a-zA-Z0-9\\-]+\\.)+([a-zA-Z]{2,})';
    var encoded = '%[0-9a-fA-F]{2}';
    var characters = 'a-zA-Z0-9$\\-_.+!*\'(),;:@&=';
    var segment = '([' + characters + ']|' + encoded + ')*';

    var regex_str = '^';

    // Build Regular Expression
    if (this.get('options.domainOnly') === true) {
      regex_str += hostname;
    } else {
      regex_str += '^';
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
      regex_str +=    '(' + segment + '(\\/' + segment + ')*)?';
      regex_str +=    '(\\?' + '([' + characters + '/?]|' + encoded + ')*)?';
      regex_str +=    '(\\#' + '([' + characters + '/?]|' + encoded + ')*)?';
      regex_str += ')?';
    }

    regex_str += '$';

    var url = this.model.get(this.property);
    var regexp = new RegExp(regex_str);
    var regexp_ip = new RegExp(ipaddress);

    if (Ember.isEmpty(url)) {
      if (this.get('options.allowBlank') !== true) {
        this.errors.pushObject(this.get('options.message'));
      }
    } else {
      if (this.get('options.allowIp') !== true) {
        if (regexp_ip.test(url)) {
          this.errors.pushObject(this.get('options.message'));
          return;
        }
      }

      if (!regexp.test(url)) {
        this.errors.pushObject(this.get('options.message'));
      }
    }
  }
});


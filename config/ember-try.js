module.exports = {
  scenarios: [
    {
      name: "ember-1.11.0",
      dependencies: {
        "ember": "1.11.0"
      }
    },
    {
      name: "ember-1.12.1",
      dependencies: {
        "ember": "1.12.1"
      }
    },
    {
      name: "ember-1.13",
      dependencies: {
        "ember": "1.13.11",
        "ember-data": "1.13.15"
      }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release',
        'ember-data': 'components/ember-data#release'
      },
      resolutions: {
        'ember': 'release',
        'ember-data': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta',
        'ember-data': 'components/ember-data#beta'
      },
      resolutions: {
        'ember': 'beta',
        'ember-data': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary',
        'ember-data': 'components/ember-data#canary'
      },
      resolutions: {
        'ember': 'canary',
        'ember-data': 'canary'
      }
    }
  ]
};

/*!
 * solution-center-communicator
 * https://github.com/zalando-incubator/solution-center-communicator
 * License: MIT
 */


angular.module('solutioncenter.communicator', []);

angular.module('solutioncenter.communicator')
    .constant('DEFAULT_ENVIRONMENT', 'INTEGRATION')
    .constant('ENVIRONMENTS', {
      PRODUCTION: {
        NAME: 'PRODUCTION',
        URL: 'https://www.solutions.zalando.com',
        DOMAIN: 'solutions.zalando.com',
        PORT: '',
        USER_SERVICE: 'https://user-management.norris.zalan.do',
        TOKEN_SERVICE: 'https://token-management.norris.zalan.do',
        MERCHANT_SERVICE: 'https://merchant-management.norris.zalan.do'
      },
      STAGE: {
        NAME: 'STAGE',
        URL: 'https://sc-stage.norris.zalan.do',
        DOMAIN: '.zalan.do',
        PORT: '',
        USER_SERVICE: 'https://um-stage.norris.zalan.do',
        TOKEN_SERVICE: 'https://tm-stage.norris.zalan.do',
        MERCHANT_SERVICE: 'https://merchant-stage.norris.zalan.do'
      },
      INTEGRATION: {
        NAME: 'INTEGRATION',
        URL: 'https://sc-integration.norris.zalan.do',
        DOMAIN: '.zalan.do',
        PORT: '',
        USER_SERVICE: 'https://um-integration.norris.zalan.do',
        TOKEN_SERVICE: 'https://tm-integration.norris.zalan.do',
        MERCHANT_SERVICE: 'https://merchant-integration.norris.zalan.do'
      },
      DEVELOPMENT: {
        NAME: 'DEVELOPMENT',
        URL: 'https://sc-development.norris.zalan.do',
        DOMAIN: '.zalan.do',
        PORT: '',
        USER_SERVICE: 'https://um-development.norris.zalan.do',
        TOKEN_SERVICE: 'https://tm-development.norris.zalan.do',
        MERCHANT_SERVICE: 'https://merchant-development.norris.zalan.do'
      },
      LOCAL: {
        NAME: 'LOCAL',
        URL: 'localhost',
        DOMAIN: 'localhost',
        PORT: 3333,
        USER_SERVICE: 'https://um-development.norris.zalan.do',
        TOKEN_SERVICE: 'https://tm-development.norris.zalan.do',
        MERCHANT_SERVICE: 'https://merchant-development.norris.zalan.do'
      },
      TESTING: {
        NAME: 'TESTING',
        URL: '',
        DOMAIN: '',
        PORT: '',
        MERCHANT_SERVICE: '',
        USER_SERVICE: '',
        TOKEN_SERVICE: ''
      }
    });

angular.module('solutioncenter.communicator')

  .provider('scEnvironments', ['ENVIRONMENTS', 'DEFAULT_ENVIRONMENT',
    function (ENVIRONMENTS, DEFAULT_ENVIRONMENT) {
      'use strict';

      var defaultEnvironment = ENVIRONMENTS[DEFAULT_ENVIRONMENT];
      var localEnvironment = ENVIRONMENTS['LOCAL'];
      var environment;

      /**
       * Get environment object by name
       * Possible values: 'PRODUCTION', 'STAGE', 'INTEGRATION', 'DEVELOPMENT', 'LOCAL', 'TESTING'
       *
       * @private
       * @param {string} name - Environment name
       * @returns {Object} Specified or default environment
       */
      var getNamedEnvironment = function (name) {
        return ENVIRONMENTS[name] || defaultEnvironment;
      };

      /**
       * Get environment object based on custom config
       *
       * The config object passed to this function must contain populated environment values to avoid using the
       * default environment. For example, the Zalando Solution Center populates this object via YAML files during
       * deployment.
       *
       * The `NAME` property of this object will contain either the YAML-supplied environment name (e.g. "PRODUCTION")
       * or the placeholder string "${NAME}". If we are in a non-LOCAL environment, "${NAME}" will have been replaced
       * with the appropriate value from the YAML file. The value in `NAME` is assigned to `name` below.
       *
       * If `name` does not contain a "$" sign, the custom environment is returned. If `name` does contain a "$" sign,
       * the LOCAL environment is returned. Otherwise, the default environment is returned.
       *
       * @private
       * @param {Object} env - Custom environment config
       * @returns {Object} Custom, local or default environment
       */
      var getCustomEnvironment = function (env) {
        var name = (env && env.NAME) || '';
        var dollar = name.indexOf('$') === -1;
        var custom = name.length && dollar && env;
        var local = name.length && !dollar && localEnvironment;

        return custom || local || defaultEnvironment;
      };

      return {

        /**
         * Set current environment
         *
         * @public
         * @param {string|Object} env - Environment name or custom environment object
         * @returns {Object} Named or custom environment
         */
        setCurrentEnvironment: function (env) {
          environment = (angular.isString(env) && getNamedEnvironment(env)) || getCustomEnvironment(env);
          return environment;
        },

        /**
         * Get current environment
         * If environment was not previously configured, use default environment
         *
         * @public
         * @returns {Object} Current or default environment
         */
        getCurrentEnvironment: function () {
          return environment || defaultEnvironment;
        },

        /**
         * Get specific environment
         *
         * @public
         * @param {string} name - Environment name
         * @returns {Object} Specific or default environment
         */
        getSpecificEnvironment: function (name) {
          return (name && getNamedEnvironment(name)) || defaultEnvironment;
        },

        $get: function () {
          return {
            setCurrentEnvironment: this.setCurrentEnvironment,
            getCurrentEnvironment: this.getCurrentEnvironment,
            getSpecificEnvironment: this.getSpecificEnvironment
          };
        }

      };

    }
  ]);

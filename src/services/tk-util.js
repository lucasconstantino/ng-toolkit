
/**
 * ------------------------------------------------------------------------
 * Utillity Service
 * ------------------------------------------------------------------------
 * A utillity service to handle common and easy AngularJS tasks.
 */

angular.module('tk-util', [])

  /**
   * Utillity service.
   */
  .service('tkUtil', function ($state, $injector, $modal, $timeout) {

    /**
     * Get a namespace string hierarchy.
     * e.g.: given a string 'foo.bar.baz', return a
     * array ['foo', 'foo.bar', 'foo.bar.baz'].
     */
    this.namespaceHierarchy = function(namespace) {
      return namespace.split('.').map(function (name, index, names) {
        names.slice(0, index).reverse().forEach(function (parentName) {
          name = parentName + '.' + name;
        });
        return name;
      });
    };

    /**
     * Returns the arguments os a function as key/value pairs of an object.
     * @param  {Function} callee    The callee function.
     * @param  {Array}    arguments The callee function's arguments.
     * @return {Object}             A object pairing arguments/values.
     */
    this.objectArguments = function(args) {

      var annotation  = $injector.annotate(args.callee),
          object      = {},
          length      = Math.max(annotation.length, args.length);

      for(var i = 0; i < annotation.length; i++) {
        object[annotation[i] || i] = args[i] || null;
      }

      return object;
    };

    /**
     * Transform a string into a machine name, following rules.
     * @param  {String} string The text to be transformed.
     * @return {Object}        A object of options.
     */
    this.toMachineName = function(source, settings) {

      // Default settings for transliteration.
      var defaultSettings = {
        maxlength: 32, // Max resulting length.
        replace: '_', // Replace unallowed chars with this.
        replacePattern: '^[^a-z_]|[^a-z0-9_]+' // Replace anything in this set.
      };

      // Crete settings object.
      settings = angular.extend({}, defaultSettings, settings);

      // Create a regex for not allowed chars.
      var regExp = new RegExp(settings.replacePattern, 'g');

      // Return the transformed text.
      return source.toLowerCase()
                   .replace(regExp, settings.replace)
                   .substr(0, settings.maxlength);
    };
  });

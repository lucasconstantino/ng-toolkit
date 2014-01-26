
/**
 * ------------------------------------------------------------------------
 * Toolkit Form Directives
 * ------------------------------------------------------------------------
 * Some utillity directives to extend forms.
 */

angular.module('tk-form', ['tk-util'])
  /**
   * Validate matching input models.
   */
  .directive('tkMatch', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var attributes = '[' + attrs.ngModel + ', ' + attrs.tkMatch + ']';
        scope.$watchCollection(attributes, function(values) {
          ctrl.$setValidity('unmatch', values[0] == values[1]);
        });
      }
    };
  });

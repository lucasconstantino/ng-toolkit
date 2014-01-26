
/**
 * ------------------------------------------------------------------------
 * Toolkit State Directives
 * ------------------------------------------------------------------------
 * Some utility directives.
 */

angular.module('tk')
  
  /* State Reference Related Directives
  ------------------------------------- */

  // Alias for 'ui-sref' and 'util-state-status'
  .directive('utilSref', function ($state, $compile) {
    return {
      restrict: 'A',
      replace: false,

      // This directive will insert other directives dynamically. We set
      // terminal=true to make this be the last directive to run and
      // priority=1000 (high number) to make it run first. Then we deal
      // with the creating of a new element with new directives and handle
      // the compilation manually.
      terminal: true,
      priority: 1000,
      compile: function (element, attrs) {

        // Inform user of invalid states.
        if (!attrs.utilSref) throw('Invalid state ref "' + attrs.utilSref + '" at');

        // Insert ui-router directive.
        element.attr('ui-sref', attrs.utilSref);

        // Insert state status directive, if not already set.
        element.attr('util-state-status') || element.attr('util-state-status', attrs.utilSref);

        // Remove self-directive, to avoid looping.
        element.removeAttr('util-sref');

        // Compilation object.
        return {
          post: function (scope, element) {
            // Re-compile element.
            $compile(element)(scope);
          }
        }
      }
    };
  })

  // Set 'active' for current state and 'active-trail' to parents.
  .directive('utilStateStatus', function ($state, $compile, Util) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {

        // Inform user of invalid states.
        if (!attrs.utilStateStatus) throw('Invalid state ref "' + attrs.utilStateStatus + '" at');

        // Grab referenced state.
        var state = $state.get(attrs.utilStateStatus);

        // Inform user of non-matching states.
        if (!state) throw('State not found: "' + attrs.utilStateStatus + '" at');

        // Define the target element.
        var parent = element.parent();
        var target = parent.is('li') ? parent : element;

        // Listen for state changes.
        $scope.$on('$stateChangeSuccess', function (e, to) {
          target.toggleClass('active', to.name == state.name);

          // Iterate parent states and identify occurence.
          var activeTrail = Util.namespaceHierarchy(state.name).indexOf(state.name) >= 0;
          target.toggleClass('active-trail', activeTrail);
        }); 
      }
    };
  })

  /* Form Related directives
  -------------------------- */

  // Validate matching input models.
  .directive('utilMatch', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var attributes = '[' + attrs.ngModel + ', ' + attrs.utilMatch + ']';
        scope.$watchCollection(attributes, function(values) {
          ctrl.$setValidity('unmatch', values[0] == values[1]);
        });
      }
    };
  });


/**
 * ------------------------------------------------------------------------
 * Toolkit State Directives
 * ------------------------------------------------------------------------
 * Some utillity directives to extend ui-router.
 */

angular.module('tk-route', ['tk-util'])
  
  /**
   * Alias for 'ui-sref' and 'tk-state-status' directives.
   */
  .directive('tkSref', function ($compile) {
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
  
  /**
   * Adds the class 'active' when current state matches the attribute's value.
   * Also, adds the class 'active-trail' if attribute's value is parent of
   * current state.
   */
  .directive('tkStateStatus', function ($rootScope, $state, $compile, tkUtil) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        // Inform user of invalid states.
        if (!attrs.tkStateStatus) throw('Invalid empty state ref at');

        // Grab referenced state.
        var state = $state.get(attrs.utilStateStatus);

        // Inform user of non-matching states.
        if (!state) throw('State not found: "' + attrs.utilStateStatus + '" at');

        // Define the target element.
        var parent = element.parent();
        var target = parent.is('li') ? parent : element;

        // Listen for state changes.
        $rootScope.$on('$stateChangeSuccess', function (e, to) {
          target.toggleClass('active', to.name == state.name);

          // Iterate parent states indentifying active trails.
          var activeTrail = tkUtil.namespaceHierarchy(state.name).indexOf(state.name) >= 0;
          target.toggleClass('active-trail', activeTrail);
        }); 
      }
    };
  });

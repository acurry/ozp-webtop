'use strict';

/**
 * ozpToolbar Renders a toolbar based on a state. It can be specified to be either 'top' or
 * 'bottom'.
 *
 * @example
 *     <ozp-toolbar location="top"></ozp-toolbar>
 *
 * @namespace directives
 * @class ozpToolbar
 * @constructor
 */
angular.module('ozpWebtopApp.directives')
    .directive('ozpToolbar', function (WorkspaceState) {

        /**
         * Helper function to find either the top or bottom toolbar in the toolbar array.
         *
         * @method findToolbar
         * @private
         * @return {Object} toolbar the toolbar state object pertaining to the specified location
         */
        var findToolbar = function(toolbars, location) {
            var toolbar = {};
            angular.forEach(toolbars, function(value){
                if (value.location === location){
                    toolbar = value;
                }
            });
            return toolbar;
        };

        /**
         * Decides which template to use based on a specified location
         *
         * @method getTemplate
         * @private
         * @param {String} location either a
         * @return {String} template a template's url
         */
        var getTemplate = function (location) {
            var template = '';

            // Use top or bottom template
            if (location === 'top') {
                template = 'templates/toptoolbar.html';
            } else if (location === 'bottom') {
                template = 'templates/bottomtoolbar.html';
            }
            return template;
        };

        // Directive definition object
        return {

            restrict: 'E',

            templateUrl: function(tElements, tAttrs) {
                var location = tAttrs.location.toLowerCase();
                return getTemplate(location);
            },

            controller: function ($scope, $element, $attrs) {

                // Private var to differentiate this toolbar controller by location
                var toolbarLocation = $attrs.location.toLowerCase();

                // Helper function to add a button to the specified toolbar
                var addButton = function (location, button) {

                    // Add to the specified scope
                    if (location === 'top') {
                        $scope.top.buttons.push(button);
                    } else if (location === 'bottom') {
                        $scope.bottom.buttons.push(button);
                    }

                };

                // Get the toolbar state file and set state on an Angular scope
                WorkspaceState.getStateFile('toolbars').then(function(data) {

                    $scope.top = findToolbar(data.toolbars, 'top');
                    $scope.bottom = findToolbar(data.toolbars, 'bottom');

                });


                // Handle the icon click event by adding a button to the toolbar
                $scope.$on('iconClick', function (event, icon) {
                    if (toolbarLocation === 'bottom'){
                        // For now, only add buttons to the bottom toolbar
                        addButton('bottom', icon);
                    }

                    // Todo: revisit button/icon relationship. For now they are structured the same
                });

            }
        };
    });

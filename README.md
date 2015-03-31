# How to use navigation service.

## Introduction

Navigation service helps implement navigation in registry controllers.

It is essentially a stack of past states. State is represented as 2-ple (path, context).
Path is stored automatically from Angular's $location object. Context is optionally passed into service method.

There are four public methods in Navigation - navigate(context), back(), restore() and clear().

Usage starts with navigate(context) method. This stores the current path and passed context into the navigation.
Then back() or restore() returns the previous states to user. clear() can be used before 
the first navigate(context) call to clear the navigation.

## back() vs. restore()

back() can be used to implement simple stateless history. It removes the last element from navigation
and automatically sets the location. This way the page returns to previous location, but without
restoring the context.

restore() can be used to implement navigation with state. It checks that current path equals the path
stored for last navigation item. Then returns the context for the last navigation item and removes
the last navigation item. This way the page stays in current location, state is restored by caller of
the restore() method from returned value.

## Example of controller

```javascript
	.controller('xpsui:AController', [
			'xpsui:NavigationService',
		function(navigationService) {

			// Navigation history is cleared, while creating the controller for the first time.
			$scope.firstInit = function() {
				navigationService.clear();
			}

			// Current state is stored, when moving to new path
			$scope.gotoNext = function() {
				navigationService.navigate($scope.model);
				$scope.model = {};
			};

			// State is restored when moving back in history
			$scope.goBack = function() {
				var restoreObj = navigationService.restore();
				if (restoreObj) {
					$scope.model = restoreObj;
				}
			};

		}]);
```

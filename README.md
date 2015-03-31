# How to use navigation service.

## Storing into navigation

1. Add includes into controller:
```javascript
	.controller('xpsui:AController', [
			'xpsui:NavigationService',
		function(navigationService) {
			navigationService.clear();

			$scope.gotoNext = function() {
				navigationService.navigate($scope.model);
				$scope.model = {};
			};

			$scope.goBack = function() {
				var restoreObj = navigationService.restore();
				if (restoreObj) {
					$scope.model = restoreObj;
				}
			};

		}]);
```


angular.module('counterApp', [])
.controller('CounterController', function($scope) {
  $scope.count = 0;
  $scope.reaction = '';

  $scope.increase = function() {
    $scope.count++;
    $scope.reaction = 'happy';
  };

  $scope.decrease = function() {
    $scope.count--;
    $scope.reaction = 'sad';
  };
});

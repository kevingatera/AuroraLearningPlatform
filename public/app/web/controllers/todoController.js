// This will control the todo section of the dashboard
var app = angular.module('todoController', [])

.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
})

.controller('todoCtrl', function($scope) {
      $scope.todoList = [];
      $scope.todoInput="";
      $scope.todoAdd = function() {
          console.log("Added new item");
          if ($scope.todoInput!="") {
          	$scope.todoList.push({todoText:$scope.todoInput, done:false});
          }
          $scope.todoInput = "";
          // console.log($scope.todoList);
      };

      $scope.remove = function() {
          var oldList = $scope.todoList;
          $scope.todoList = [];
          angular.forEach(oldList, function(x) {
              if (!x.done) $scope.todoList.push(x);
          });
      };
})


// app.controller('todoController', function($scope) {
//   $scope.user = {
//     name: 'awesome user'
//   };
//   console.log("OOOSA");
// });

/*
app.controller('todoCtrl', function($scope) {
    $scope.todoList = [];
    $scope.todoInput = "";
    $scope.todoAdd = function() {
        if ($scope.todoInput != "") {
            $scope.todoList.push({todoText: $scope.todoInput, done: false});
        }
        $scope.todoInput = "";
    };

    $scope.remove = function() {
        var oldList = $scope.todoList;
        $scope.todoList = [];
        angular.forEach(oldList, function(x) {
            if (!x.done)
                $scope.todoList.push(x);
            }
        );
    };
});
*/

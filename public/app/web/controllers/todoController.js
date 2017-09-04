// This will control the todo section of the dashboard
var app = angular.module('todoController', [])

.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
})

.controller('todoCtrl', function($scope) {
      $scope.selected = false;
      $scope.todoList = [];
      $scope.todoInput="";
      $scope.todoAdd = function() {
          console.log("Added new item");
          console.log($scope.todoList);
          if ($scope.todoInput!="") {
          	$scope.todoList.push({todoText:$scope.todoInput, done:false});
          }
          $scope.todoInput = "";
          // console.log($scope.todoList);
      };

      $scope.remove = function(x) {
        $scope.change(x);
        console.log("Removing item");
        console.log($scope.todoList);
          var oldList = $scope.todoList;
          $scope.todoList = [];
          angular.forEach(oldList, function(x) {
              if (!x.done) $scope.todoList.push(x);
          });
      };

      $scope.change = function(x) {
        console.log("X is " + x.done + " then")
        x.done = true;
        console.log("X becomes " + x.done);
      }
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

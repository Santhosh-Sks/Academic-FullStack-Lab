angular.module('todoApp', [])
.controller('TodoController', function($scope, $http) {
    $scope.todos = [];
    $scope.newTodo = '';

    const fetchTodos = () => {
        $http.get('/todos').then(response => {
            $scope.todos = response.data || [];
        });
    };

    $scope.addTodo = () => {
        if ($scope.newTodo) {
            $scope.todos.push($scope.newTodo);
            $scope.newTodo = '';
            saveTodos();
        }
    };

    $scope.removeTodo = (index) => {
        $scope.todos.splice(index, 1);
        saveTodos();
    };

    const saveTodos = () => {
        $http.post('/todos', JSON.stringify($scope.todos));
    };

    fetchTodos();
});

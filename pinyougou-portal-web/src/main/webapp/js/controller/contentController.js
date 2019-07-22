app.controller('contentController', function ($scope,contentService) {

    // $controller('baseController', {$scope: $scope});
    $scope.contentList = [];
    $scope.findByCategoryId = function (categoryId) {
        alert("portal");
        contentService.findByCategoryId(categoryId).success(
            function (response) {
                $scope.contentList[categoryId] = response;
            }
        )
    }

});
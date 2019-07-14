app.controller('loginController',function ($scope,loginService) {
    $scope.showLoginName=function(){
        alert("show")
        loginService.showLoginName().success(
            function (response) {
                alert("1")
                $scope.loginName=response.loginName;
            })
    }
});
app.service('loginService',function ($http) {
    this.showLoginName=function () {
        return $http.get('../seller/name.do');
    }

});
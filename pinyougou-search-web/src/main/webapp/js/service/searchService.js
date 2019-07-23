app.service('searchService',function ($http) {
    this.search=function (searchMap) {
        alert("fuwu")
        return $http.post('itemsearch/search.do',searchMap);
    }
});

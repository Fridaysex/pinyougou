app.controller('searchController',function ($scope,searchService) {
    //搜索
    $scope.search=function () {
        searchService.search($scope.searchMap).success(
            function (response) {
                $scope.resultMap=response;//搜索返回的结果
                buildPageLabel();
            }
        )
    };


    //搜索条件封装对象
    $scope.searchMap={'keywords':'','category':'','brand':'','spec':{},'price':'','pageNo':1,'pageSize':40};
    //添加搜索项
    $scope.addSearchItem=function (key, value) {
        if (key=='category'||key=='brand'||key=='price'){//如果点击的是分类或者品牌/价格
            $scope.searchMap[key]=value;
        }else {
            $scope.searchMap.spec[key]=value
        }
        $scope.search();
    };
    //移除复合搜索条件
    $scope.removeSearchItem=function (key) {
        if(key=="category"||key=="brand"||key=='price'){//如果是分类或者品牌
            $scope.searchMap[key]='';
        }else {
            delete $scope.searchMap.spec[key];//移除次属性
        }
        $scope.search();
    };

    //构建分页标签()totalPages为总页数,始终以当前页为中心页,分情况改变起始页和结束页

    buildPageLabel=function () {
        $scope.pageLabel=[];//新增分页栏属性
        var maxPageNo=$scope.resultMap.totalPages;//得到最大页码
        var firstPage=1;//开始页码
        var lastPage=maxPageNo;//截止页码
        if($scope.resultMap.totalPages>5){//如果总页数大于5,显示部分页码
            if ($scope.searchMap.pageNo<3){//如果当前页小于3
                lastPage=5;//前5页
            }else if($scope.searchMap.pageNo>=lastPage-2){//如果当前页大

                // 于等于最大页码-2
                firstPage=maxPageNo-4;
            }else {
                firstPage=$scope.searchMap.pageNo-2;
                lastPage=$scope.searchMap.pageNo+2;
            }
        }
        //循环产生页码标签
        for (var i=firstPage;i<=lastPage;i++){
            $scope.pageLabel.push(i);
            alert(i)
        }
    }
});
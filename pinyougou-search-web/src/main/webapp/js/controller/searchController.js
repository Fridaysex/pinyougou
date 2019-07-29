app.controller('searchController',function ($scope,searchService,$location) {
    //搜索
    $scope.search=function () {
        //前端传回的数字是字符串类型的
        $scope.searchMap.pageNo=parseInt($scope.searchMap.pageNo);
        searchService.search($scope.searchMap).success(
            function (response) {
                $scope.resultMap=response;//搜索返回的结果
                buildPageLabel();
            }
        )
    };


    //搜索条件封装对象
    $scope.searchMap={'keywords':'','category':'','brand':'','spec':{},'price':'','pageNo':1,'pageSize':40,'sortField':'','sort':''};
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
        $scope.firstDot=true;//前面有点
        $scope.lastDot=true;//后面有点
        var lastPage=maxPageNo;//截止页码
        if($scope.resultMap.totalPages>5){//如果总页数大于5,显示部分页码
            if ($scope.searchMap.pageNo<3){//如果当前页小于3
                lastPage=5;//前5页
                $scope.firstDot=false;
            }else if($scope.searchMap.pageNo>=lastPage-2){//如果当前页大于等于最大页码-2
                firstPage=maxPageNo-4;
                $scope.lastDot=false;
            }else {
                firstPage=$scope.searchMap.pageNo-2;
                lastPage=$scope.searchMap.pageNo+2;
            }
        }else {
            //如果总页数小于5，则前后都没点
            $scope.firstDot=false;
            $scope.lastDot=false;
        }
        //循环产生页码标签
        for (var i=firstPage;i<=lastPage;i++){
            $scope.pageLabel.push(i);

        }
    };

    //根据页码查询
    $scope.queryByPage=function (pageNo) {
        if (pageNo<1||pageNo>$scope.resultMap.totalPages){
            return;
        }
        $scope.searchMap.pageNo=pageNo;
        $scope.search();
    };


    //判断当前页是否是第一页
    isTopPage=function () {
        if ($scope.searchMap.pageNo==1){
            return true;
        }else {
            return false;
        }
    };

    //判断当前页是否是最后一页
    isEndPage=function () {
        if ($scope.searchMap.pageNo==$scope.resultMap.totalPages){
            return true;
        } else {
            return false;
        }
    };

    //设置排序规格
    $scope.sortSearch=function (sortField, sort) {
        $scope.searchMap.sortField=sortField;
        $scope.searchMap.sort=sort;
        $scope.search();
    }

    //判断关键字是否是品牌
    keywordsIsBrand=function () {
        //品牌是否出现在关键字里面
        for (var i=0;i<$scope.resultMap.brandList.length;i++){
            if ($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text)>=0){
                return true;
            }else {
                return false;
            }
        }
    }

    //接收首页关键词搜索的字
    $scope.loadkeywords=function () {
        $scope.searchMap.keywords=$location.search()['keywords'];
        $scope.search();
    }
});
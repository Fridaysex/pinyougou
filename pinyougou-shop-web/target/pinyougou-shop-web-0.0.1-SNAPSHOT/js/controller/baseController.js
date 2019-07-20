app.controller("baseController",function($scope){
	$scope.reloadList=function(){
		
		//切换页码
		//$scope.findPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
		$scope.search($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
	};
	//分页控件配置
	$scope.paginationConf={
		currentPage:1,
		totalItems:10,//初始化总记录数
		itemsPerPage:10,
		perPageOption:[10,20,30,40,50],
		onChange:function(){
			//alert("reload");
			$scope.reloadList();
		}
	};
	//选中添加到数组
	$scope.selectIds=[];
	$scope.updateSelection=function($event,id){
		if($event.target.checked){
			$scope.selectIds.push(id);
		}else{
			var idx=$scope.selectIds.indexOf(id);
			$scope.selectIds.splice(idx,1);
		}
	};

	$scope.jsonToString=function (jsonString,key) {
		var json=JSON.parse(jsonString);//将json字符串转换成json对象
		var value="";
		for (i=0;i<json.length;i++){
			if (i>0){
				value+=",";
			}
			value+=json[i][key];
		}
		return value;
    };

    //选项集合模型,集合中多个对象(一条name,value为一个对象)
    //[{“attributeName”:”规格名称”,”attributeValue”:[“规格选项 1”,“规格选项 2”.... ] } , .... ]
    /**
	 * 两种情况:
	 * 1.添加的规格选项其规格名已经存在,该情况直接在该对象中追加规格选项
	 * 2.添加的规格选项其规格名不存在,该情况需创建一个对象{attributeName:xxx,attributeValue:xxx}
	 * searchObject方法判断该规格名是否在集合中存在 key这里为attributeName,keyvalue为要添加的选项的规格名,这里作为值'网络'
     */
    $scope.searchObjectByKey=function (list,key,keyValue) {
		for (var i=0;i<list.length;i++){
			if (list[i][key]==keyValue){
				return list[i];
			}
		}
		return null;
    }
});
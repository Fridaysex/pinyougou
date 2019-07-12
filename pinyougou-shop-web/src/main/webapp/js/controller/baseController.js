app.controller("baseController",function($scope){
	$scope.reloadList=function(){
		
		//切换页码
		//$scope.findPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
		$scope.search($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
	}
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
	}
	//选中添加到数组
	$scope.selectIds=[];
	$scope.updateSelection=function($event,id){
		if($event.target.checked){
			$scope.selectIds.push(id);
		}else{
			var idx=$scope.selectIds.indexOf(id);
			$scope.selectIds.splice(idx,1);
		}
	}

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
    }
});
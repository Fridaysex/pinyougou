 //控制层 
app.controller('goodsController' ,function($scope,$controller,goodsService,uploadService,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	};
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	};
	
	//查询实体 
	$scope.findOne=function(id){				
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	};
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询
                   $scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	};
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	};
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	};

	//商品添加
	$scope.add=function () {
		$scope.entity.goodsDesc.introduce=editor.html();
		goodsService.add($scope.entity).success(
			function (response) {
				 if (response.success){
				 	alert("保存成功")
					 $scope.entity={}
					 //清空富文本编辑器内容
					 editor.html('')
				 }else {
				 	alert(response.message)
				 }
            }
		)
    };

    $scope.uploadFile=function () {
		uploadService.uploadFile().success(function (response) {
			if (response.success){
				$scope.image_entity.url=response.message;//设置文件地址
			}else {
				alert(response.message);
			}
        }).error(function () {
			alert("上传发生错误");
        });
    };

    $scope.entity={goods:{},goodsDesc:{itemImages:[]}};//定义页面实体结构
	//添加图片列表
	$scope.add_image_entity=function () {
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity)
    };
    $scope.remove_image_entity=function (index) {
		$scope.entity.goodsDesc.itemImages.splice(index,1);
    };

    //读取一级下拉框属性
	$scope.selectItemCat1List=function () {
		itemCatService.findByParentId(0).success(
			function (response) {
				$scope.itemCat1List=response;
            }
		)
    };

    //读取二级下拉框属性,通过监控上一级商品分类id的改变来查询下级数据,categoryid在itemcat表中为ID
	//将此ID作为parentId可查询下级
	$scope.$watch('entity.goods.category1Id',function (newValue, oldValue) {
		itemCatService.findByParentId(newValue).success(
			function (response) {
				$scope.itemCat2List=response;
            }
		)
    });
	//监控上级id变化,读取三级下拉框属性数据
	$scope.$watch('entity.goods.category2Id',function (newValue, oldValue) {
		itemCatService.findByParentId(newValue).success(
			function (response) {
				$scope.itemCat3List=response;
            }
		)
    });

	//读取三级分类后,读取模板ID
	$scope.$watch('entity.goods.category3Id',function (newValue, oldValue) {
		itemCatService.findOne(newValue).success(
			function (response) {
				$scope.entity.goods.typeTemplateId=response.typeId;//更新模板ID
            }
		)
    });

	//模板id更新后,更新品牌列表数据
	$scope.$watch('entity.goods.typeTemplateId',function (newValue,oldValue) {
		typeTemplateService.findOne(newValue).success(
			function (response) {
				//获取类型模板
				$scope.typeTemplate=response;
				alert(response.brandIds)
				//获取品牌列表
				$scope.typeTemplate.brandIds=JSON.parse($scope.typeTemplate.brandIds);
				//模板ID改变时,同时读取customAttribute属性值
				$scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.typeTemplate.customAttributeItems)
        })
    })

	$scope.findSpecList=function () {

    }
});	

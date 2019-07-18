 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,uploadService,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	};
	//审核状态
	$scope.status=['未审核','已审核','未通过','已关闭'];


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
	$scope.findOne=function(){
		var id=$location.search()['id'];//获取参数值
		if(id==null){
			return;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
				//想富文本器添加商品介绍
                editor.html($scope.entity.goodsDesc.introduction);
				//显示图片列表
				$scope.entity.goodsDesc.itemImages=JSON.parse($scope.entity.goodsDesc.itemImages);
				//显示商品扩展属性
				$scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.entity.goodsDesc.customAttributeItems);
				//读取商品规格属性
				$scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems);
				//sku列表规格转换
				for (var i=0;i<$scope.entity.itemList.length;i++){
					$scop.entity.itemList[i].spec=JSON.parse($scope.entity.itemList[i].spec)
				}
			}
		);
		//根据规格名称和选项名称返回是否被勾选
		$scope.checkAttributeValue=function (specName, optionName) {
			var items = $scope.entity.goodsDesc.specificationItems;
			var object=$scope.searchObjectByKey(items,'attributeName',specName);
			if (object==null){
				return false;
			}else {
				if (object.attributeValue.indexOf(optionName)>=0){
					return true;
				}else {
					return false;
				}
			}
        }
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
	//条件查询只需要将查询条件(属性设置为搜索实体的属性传到后端)
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
		$scope.entity.goodsDesc.introduction=editor.html();
		goodsService.add($scope.entity).success(
			function (response) {
				 if (response.success){
				 	alert("保存成功");
					 $scope.entity={};
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
				//获取品牌列表
				$scope.typeTemplate.brandIds=JSON.parse($scope.typeTemplate.brandIds);
				//模板ID改变时,同时读取customAttribute属性值
				if ($location.search()['id']==null){//如果没有商品id,则加载模板中的扩展属性
                    $scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.typeTemplate.customAttributeItems);
                    //模板ID改变的同时,改变规格的显示
                }

        });

		typeTemplateService.findSpecList(newValue).success(
			function (response) {
				$scope.specList=response;
            }
		)
    });

	$scope.entity={goodsDesc:{itemImages:[],specificationItems:[]}};
	//name为规格名,value为规格选项如网络制式:2G
	$scope.updateSpecAttribute=function ($event,name,value) {
		//执行勾选就开始判断,规格名是否在集合中存在
		var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,'attributeName',name);
		//返回值object为[]-{attributeName:xxx,attributeValue:[xxx1,xxx2]}中的单个对象[{},{}]
		if (object!=null){//规格名存在
			//判断是否选中
			if($event.target.checked){
                object.attributeValue.push(value);
			}else {//移除选项
                object.attributeValue.splice(object.attributeValue.indexOf(value),1);
                //如果所有选项都移除了
                if (object.attributeValue.length==0){
					$scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}
			}

		}else {//规格名不存在
			$scope.entity.goodsDesc.specificationItems.push(
				{"attributeName":name,"attributeValue":[value]}
				);
		}
    };
    //创建SKU列表
	$scope.createItemList=function () {
	//初始化sku列表
		$scope.entity.itemList=[{spec:{},price:0,num:9999,status:"0",isDefault:"0"}];
		//让一个SKU赋值上网络制式,颜色等属性值,遍历规格名看看有几个不同的规格,让每一个sku赋值上不同的规格及其值
		var items= $scope.entity.goodsDesc.specificationItems;
		for (var i =0;i<items.length;i++){
			//sku加规格及其属性值,item[i].attributeName为某种规格名,如网络制式,items[i]为网络制式的规格选项值
			$scope.entity.itemList=addColumn($scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
		}
    };
	//给每一个sku的属性list.attributeName =entity.goodsDesc.specificationItems里面的网络制式或者颜色赋值
	//specficaiton=[{网络:[2G,3G]},{颜色:['红色','黄色]}] list[i].网络
	//想想一个商品有多少个规格,就需要遍历多少次,每个规格有多少个不同的值就需要再遍历多少次,每次遍历都给不同的规格赋不同的值,
    addColumn=function (list, columnName, columnValues) {
		//新的集合
		//不同的规格以json格式存储在specfication中
		var newList=[];
		for (var i=0;i<list.length;i++){
			var oldRow=list[i];
			for (var j=0;j<columnValues.length;j++){
				//深克隆,复制一个新的list,如果不同深克隆,那么list[i]赋值规格和相应的属性后会被第二次循环将上次的赋值覆盖掉
				var newRow=JSON.parse(JSON.stringify(oldRow));
				//给sku某种规格赋值
				newRow.spec[columnName]=columnValues[j];
				newList.push(newRow)
			}
1
        }
        return newList;
    };


    //id查询商品分类名称
	$scope.itemCatList=[];//商品分类列表
	//加载商品分类列表
	$scope.findItemCatList=function () {
		itemCatService.findAll().success(
			function (response) {
				for (var i =0;i<response.length;i++){
					$scope.itemCatList[response[i].id]=response[i].name;
				}
			}
		)
    }


});	

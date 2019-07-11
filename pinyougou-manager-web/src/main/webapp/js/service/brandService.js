app.service("brandService",function($http){    //品牌服务层
				//读取列表数据绑定到表单中
				this.findAll=function(){
					return $http.get('../brand/findAll.do');
				}
				
				this.findPage=function(page,rows){
					return $http.get('../brand/findPage.do?page='+page+'&rows='+rows);
				}

				this.save=function(){
						var methodName="add";
						if($scope.entity.id!=null){
							methodName="update";
						}
					return	$http.post('../brand/'+methodName+'.do',$scope.entity);
				}

				this.findOne=function(id){
					return $http.get('../brand/findOne.do?id='+id);
				}
				
				this.dele=function(){
					return $http.get('../brand/delete.do?ids='+$scope.selectIds);
				}

				this.search=function(page,rows,searchEntity){
					return $http.post('../brand/search.do?page='+page+'&rows='+rows,searchEntity);
				}

				this.selectOptionList=function () {
					return $http.get('../brand/selectOptionList.do');
                }
				
			});
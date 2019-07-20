app.service("uploadService",function ($http) {
    this.uploadFile=function () {
        //html5中新增的一个类,常在文件上传时使用
        var formData=new FormData();
        //'file'为该类固定属性,file为文件上传框的name,多个框框的第一个
        formData.append("file",file.files[0]);
        return $http({
            method:'post',
            url:"../upload.do",
            data:formData,
            //headers默认为json,定义为undefined,则contenttype默认为MutlipartFile多媒体格式
            headers:{'Content-Type':undefined},
            //对表单信息进行二进制序列化
            transformRequest:angular.identity
        })
    }
        /*anjularjs 对于 post 和 get 请求默认的 Content-Type header 是 application/json。
        通过设置 ‘Content-Type’: undefined，这样浏览器会帮我们把 Content-Type 设置为multipart/form-data.
        通过设置 transformRequest: angular.identity ，anjularjs transformRequest function 将序列化 我们的 formdata object.
         */

})
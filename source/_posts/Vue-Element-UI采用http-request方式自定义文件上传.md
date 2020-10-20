---
title: Vue Element-UI 采用 http-request 方式自定义文件上传
pin: false
toc: true
tags: [Vue,文件上传]
categories: [Vue]
keywords: [Vue,element-ui,http-request,el-upload,文件上传]
abbrlink: 461108bb
date: 2020-07-29 08:42:50
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
description: 今天双手为大家奉上一篇关于 Vue 如何实现自定上传文件，希望你们多多支持。
---

Vue 的文件上传组件 upload，拥有支持多种格式文件上传，单文件多文件等都支持，许多项目现在都少不了文件上传功能，但是 vue 的 upload 组件如果直接引用，肯定也有一些不方便之处，有的时候需要传参数，需要手动触发上传方法，而不是选择了文件就上传，所以结合我项目实例，写一 vue 自定义文件上传的实现，包括前端和后台的处理以及参数的接收。

## :sun_with_face: Vue 界面示例
我这里是富文本中的图片上传，以下教程也同样适用于其他方面，可根据自己需求修改。

![](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-461108bb/vue示例.png)

## :sun_with_face: Vue 代码
以下代码可根据自己业务需求进行合理的修改使用。

```html
<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :http-request="uploadImage"
        action="#"
        class="editor-slide-upload"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { uploadALocalPicture } from '../../../api/upload'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    // 校验所有文件是否上传成功
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    // 确定提交事件
    handleSubmit() {
      // 我这里是将数组递交给父级组件，根据自己的需求进行合理处理
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      // 校验所有文件是否上传成功
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图像成功上传。如果出现网络问题，请刷新页面，然后重新上传！')
        return
      }
      // 集合递交给父级组件方法
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    // 移除文件
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    // 上传文件前调用的方法，主要为了校验文件
    beforeUpload(file) {
      if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/gif')) {
        this.$notify.warning({
          title: '警告',
          message: '上传应用Logo图片只能是 JPG/PNG/JPEG/GIF 格式！'
        })
        return false
      }
    },
    // 上传文件
    uploadImage(param) {
      const _self = this
      const fileName = param.file.uid
      this.listObj[fileName] = {}
      const formData = new FormData()
      formData.append('picFile', param.file)
      // 这里调用的axios封装的请求方法（根据自己项目进行调用）
      uploadALocalPicture(formData).then(res => {
        // 上传成功的图片会显示绿色的对勾
        param.onSuccess()
        console.log('上传图片成功')
        _self.listObj[fileName] = { hasSuccess: false, uid: param.file.uid }
        this.handleSuccess(res, param.file)
      })
    },
    // 上传成功时调用的方法
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .editor-slide-upload {
      margin-bottom: 20px;
      /deep/ .el-upload--picture-card {
        width: 100%;
      }
    }
</style>
```

## :sun_with_face: Java 代码
以下代码各位看个思路就行，具体代码实现根据自己情况而定。

```java
package com.scaffolding.demo.sys.controller;

import com.scaffolding.demo.annotation.CheckToken;
import com.scaffolding.demo.annotation.Log;
import com.scaffolding.demo.annotation.PassToken;
import com.scaffolding.demo.common.ErrorCode;
import com.scaffolding.demo.common.OperationLogConstant;
import com.scaffolding.demo.common.Result;
import com.scaffolding.demo.common.ResultGenerator;
import com.scaffolding.demo.config.EnvConfig;
import com.scaffolding.demo.exception.BusinessException;
import com.scaffolding.demo.utils.UuidUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Objects;

/**
 * @author: Xuxu
 * @date: 2020-01-16 15:41
 **/
@Slf4j
@RestController
@RequestMapping("/sys/upload")
@Api(value = "上传文件", tags = "操作上传文件相关API")
@ApiResponses({@ApiResponse(code = 400, message = "请求参数没填好"),
        @ApiResponse(code = 404, message = "请求路径没有或页面跳转路径不对")
})
public class UploadFileController {

    // 获取配置文件中的变量
    @Autowired
    private EnvConfig envConfig;

    /**
     * 上传图片
     *
     * @return
     */
    @CheckToken
    @PostMapping("/image")
    @ApiOperation(value = "上传图片")
    @Log(operationModule = "上传图片", operationType = OperationLogConstant.UPLOAD, operationDesc = "上传图片")
    public Result<String> uploadImage(@RequestParam("picFile") MultipartFile picFile) {
        log.info("开始上传图片");
        try {
            String showPath = uploadFile(picFile);
            return ResultGenerator.genSuccessResult(showPath);
        } catch (Exception e) {
            log.error("上传图片异常");
            e.printStackTrace();
            throw new BusinessException(ErrorCode.UPLOAD_IMAGE_ERROR);
        }
    }

    /**
     * 上传文件
     *
     * @param file
     * @return
     * @throws IOException
     */
    private String uploadFile(MultipartFile file) throws IOException {
        //获取原始文件名称(包含格式)
        String filename = file.getOriginalFilename();
        //获取文件类型，以最后一个`.`为标识
        String type = filename.substring(Objects.requireNonNull(filename).lastIndexOf(".") + 1);
        //文件名
        String name = filename.substring(0, Objects.requireNonNull(filename).lastIndexOf("."));
        //当前时间戳
        long timeMillis = System.currentTimeMillis();
        //获取文件在服务器的储存位置
        File filePath = new File(envConfig.getUploadPath());
        // 是否是文件夹
        if (!filePath.exists() && !filePath.isDirectory()) {
            System.out.println("目录不存在，创建目录:" + filePath);
            filePath.mkdir();
        }
        //在指定路径下创建一个文件
        File newFile = new File(envConfig.getUploadPath(), name + timeMillis + "." + type);
        // 上传文件
        file.transferTo(newFile);
        return envConfig.getShowPath() + name + timeMillis + "." + type;
    }

}
```

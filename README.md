# Thiea
> 一个基于 Django+Vue2.0 编写的系统

## 介绍
>包括设备管理、生产、质量模块部分页面

### 说明

　本项目展示的是vuejs2.0和element-ui 2.x搭建的UI。
    
### 项目结构
```
├── build  #webpack编译相关文件目录，一般不用动 
├── config  #配置目录
│   ├────dev.env.js  #开发环境变量
│   ├────index.js    #主配置文件
│   └────prod.env.js #生产环境变量
├── dist  #生产环境下build后的文件存放目录（发布目录）
├── src #前端项目源码目录
│   ├───—api  #封装的接口文件目录
│   ├───—assets  #资源目录
│   ├───—common  #公用文件目录
│   ├───—components  #组件及页面文件目录
│   ├───—router  #路由目录
│   ├───—App.vue #项目入口文件
│   └────main.js  #项目的核心文件
├── static  #开发模式下的静态资源目录
├── index.html #首页入口文件
├── package.json #项目配置文件
└── README.md #项目的说明文档，markdown 格式
```

### 相关技术：
* vuejs2.0：一套构建用户界面的框架，易用、灵活、高效。
* element-ui：一套基于 Vue 2.0 的组件库。
* vue-router：官方的路由组件。
* axios: 基于 Promise 的 HTTP 请求客户端，可同时在浏览器和 node.js 中使用。

## 项目编译和运行

```
第一步： 先安装node环境，注意NodeJS版本要求为Node.js 10.x

第二步：下载项目
可以直接在git上下载项目源码或者通过git命令下载
#git命令下载
git clone https://github.com/lmk1566/Thiea.git
  
第三步：运行(以Windows 10为例)
（1）新开一个命令行窗口
（2）定位到项目目录并安装依赖
  > cd 你自己的位置/Thiea
  > npm install
（3）依赖安装成功后执行启动命令
  > npm run dev
 # 显示如下内容说明本地启动成功
 # DONE  Compiled successfully in 9115ms
 # Listening at http://localhost:8081
 
#正式环境编译命令
npm run build
```

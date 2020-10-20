---
title: Jenkins + Gitlab + Docker + Spring Boot 实现自动部署
pin: true
toc: true
icons: [fas fa-fire red]
tags: [Jenkins,Gitlab,Docker]
categories: [自动部署]
keywords: [Jenkins,Gitlab,Docker,Spring Boot,自动部署]
abbrlink: 3fe685e0
date: 2020-09-13 16:26:48
headimg: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-headimg/jenkins.png
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/docker.png
references:
    - title: SpringBoot+GitLab+Docker+Jenkins实现持续集成
      url: https://www.bilibili.com/read/cv5758217/
    - title: 基于Jenkins+Gitlab+Docker实现SpringBoot项目自动部署、持续集成、持续交付
      url: https://blog.csdn.net/hunheidaode/article/details/104003270
    - title: Jenkins+GitLab+docker+springboot 实现自动化部署
      url: https://www.cnblogs.com/sxdcgaq8080/p/10569906.html
description:
---

本文主要介绍持续集成的搭建方式，采用 Docker 的方式去搭建 Jenkins 环境，篇幅有点长，请仔细阅读。（无废话版）

<!-- more -->

推荐阅读本篇文章的注意事项篇节以后再进行搭建。

## :fire: Docker安装

本文中我们使用 Centos7.x 进行 Docker 安装，所以我们需要在虚拟中先安装 Centos7，这一步请阅读者自行安装。

### :tada: Docker安装步骤

```shell
# 1. yum 包更新到最新。
sudo yum update

# 2. 安装需要的软件包，yum-util提供yun-config-manager功能，另外两个是devicemapper驱动依赖的。
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# 3. 设置yum源为阿里云。
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 4. 安装docker。
sudo yum install docker-ce

# 5. 安装完成后查看docker版本。
docker -v
```

### :tada: 设置ustc的镜像(此处也可用阿里云免费镜像加速)

ustc是老牌的linux镜像服务提供者了，还在遥远的ubuntu 5.04版本的时候就在用。ustc的docker镜像加速器速度很快。ustc docker mirror的优势之一就是不需要注册，是真正的公共服务。

{% link ustc镜像帮助, https://lug.ustc.edu.cn/wiki/mirrors/help/docker %}

编辑该文件（没有该文件则新建）：
```shell
vim /etc/docker/daemon.json
```

在该文件中输入如下内容：
```yml
{
"registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
```

或阿里云的镜像加速（二选一）

```yml
{
"registry-mirrors": ["https://9cpn8tt6.mirror.aliyuncs.com"]
}
```

### :tada: Docker的启动与停止

```shell
# 启动docker
systemctl start docker

# 停止docker
systemctl stop docker

# 重启docker
systemctl restart docker

# 查看docker状态
systemctl status docker

# 开机启动docker
systemctl enable docker
```

{% link Docker的虚拟机常用命令, https://www.cnblogs.com/ghostdot/p/12652820.html %}

## :fire: Gitlab安装

GitLab是一个利用 Ruby on Rails 开发的开源应用程序，实现一个自托管的Git项目仓库，可通过Web界面进行访问公开的或者私人项目安装。类似GitHub，能够浏览源代码，管理缺陷和注释，可以管理团队对仓库的访问。

### :tada: 查询并拉取镜像

```shell
# 查询gitlab镜像版本
docker search gitlab
# 拉取镜像
docker pull gitlab/gitlab-ce:latest
```

### :tada: 创建GitLab的配置 (config) 、 日志 (log) 、数据 (data) 三个文件夹，放到容器之外， 便于日后升级， 因此请先准备这三个目录

```shell
mkdir -p /apps/Devops/gitlab/config
mkdir -p /apps/Devops/gitlab/log
mkdir -p /apps/Devops/gitlab/data
```

### :tada: 运行GitLab容器

运行成功后，此时会在上面我们创建的目录中生成一些文件，后面需要修改文件。
```shell
docker run --detach \
--publish 8443:443 --publish 8090:8090 --publish 2222:22 \
--name gitlab \
--restart always \
--volume /apps/Devops/gitlab/config:/etc/gitlab \
--volume /apps/Devops/gitlab/logs:/var/log/gitlab \
--volume /apps/Devops/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce:latest
```
8090端口是页面访问端口。

【注意】：gitlab初次启动比较慢，耐心等待后再访问页面！

### :tada: 修改配置文件

修改 `/apps/Devops/gitlab/config/gitlab.rb`
```shell
进入文件后，把external_url改成部署机器的域名或者IP地址，并取消注释。

vim /apps/Devops/gitlab/config/gitlab.rb
external_url 'http://192.168.137.119:8090'      #ip为部署机器的IP或域名
```
如图：

{% gallery %}
![gitlab配置访问](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/gitlab配置访问.png)
{% endgallery %}

### :tada: 更改完配置文件运行以下命令重启容器
```shell
docker restart gitlab
```

通过浏览器访问，默认账号root, 需要设置一个新密码。

访问报502说明容器还没启动完成，等待片刻即可访问到如下页面。

{% gallery %}
![gitlab登录](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/gitlab登录.png)
{% endgallery %}

至此，Gitlab搭建完成。

## :fire: Jenkins安装

### :tada: 拉取镜像

```shell
docker pull jenkins/jenkins:lts
```

### :tada: 创建目录

由于防止jenkins中重要文件因为容器损毁或删除导致文件丢失，因此创建文件对外挂载。
```shell
mkdir -p /apps/Devops/jenkins
```

并且需要对目录开放docker进程操作的完全读写的权限
```shell
chmod 777 /apps/Devops/jenkins
```

### :tada: 启动容器

```shell
docker run -itd -p 9980:8080 -p 50000:50000  --restart always -v /apps/Devops/jenkins:/var/jenkins_home --name jenkins  jenkins/jenkins:lts
```
-p 端口映射：Jenkins是Java程序，默认端口是8080

### :tada: 打开Jenkins管理页面

访问地址：`http://192.168.137.119:9980/`

{% gallery %}
![jenkins登录页](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/jenkins登录页.png)
{% endgallery %}

出现如上页面，代表jenkins启动成功。

### :tada: 查看日志获取初始密码

执行以下命令：
```shell
docker logs -f jenkins
```

复制下图中红框内的初始密码。

当然，你也可以不通过日志查看，你可以进入黄色框中描述的文件查看初始密码也是一样的，二选一。

{% gallery %}
![jenkins日志](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/jenkins日志.png)
{% endgallery %}

通过描述文件查看密码：
```shell
# 1. 进入运行的jenkins容器中。
docker exec -it jenkins /bin/bash

# 2. 进入容器中的/var/jenkins_home/secrets目录，初始密码就在initialAdminPassword文件中。
cd /var/jenkins_home/secrets
cat  initialAdminPassword

# 3. 退出容器
exit
```

将密码复制、粘贴到如下框框中，进入jenkins，需要等待数十秒（可能更久）！

{% gallery %}
![jenkins密码输入](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/jenkins密码输入.png)
{% endgallery %}

如果出现下图情况，等很久，还没有进入：

{% gallery %}
![jenkins登录加载中](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/jenkins登录加载中.png)
{% endgallery %}

解决方案：
（1）进入我们前面挂载的Jenkins目录 `/apps/Devops/jenkins`，修改文件 `hudson.model.UpdateCenter.xml`。
```shell
cd /apps/Devops/jenkins
vim hudson.model.UpdateCenter.xml
```

（2）将文件 `hudson.model.UpdateCenter.xml` 中 `https://updates.jenkins.io/update-center.json` 改成 `http://updates.jenkins.io/update-center.json`（把https改成http）。

{% gallery %}
![https替换](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/https替换.png)
{% endgallery %}

（3）保存，重启Jenkins容器
```shell
docker restart jenkins
```

（4）重新进入Jenkins管理页面：`http://192.168.137.119:9980/`（稍等一会儿，就可以进入）

### :tada: 安装推荐的插件

如下图所示，左侧显示安装建议的插件。右侧选择自定义安装插件。

先按照建议插件进行安装，点击左侧即可。

{% gallery %}
![安装推荐插件](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装推荐插件.png)
{% endgallery %}

如果全部都能正确安装，更好。出现安装失败的插件，等待所有结束，下方会有Retry可以进行重试。

最后重试后，依旧没有安装成功的，可以先continue,完成初始化的步骤。随后[参考这篇文章解决](https://www.cnblogs.com/sxdcgaq8080/p/10489326.html)。

安装完成后会自动出现如下界面：

{% gallery %}
![创建管理用户](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/创建管理用户.png)
{% endgallery %}

将信息输入对应输入框内，点击保存并完成，之后的步骤默认点击保存并完成即可。

### :tada: 成功安装Jenkins

出现下图代表成功安装Jenkins：

{% gallery %}
![jenkins安装成功图](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/jenkins安装成功图.png)
{% endgallery %}

安装成功之后重启一下jenkins容器：
```shell
docker restart jenkins
```

## :fire: Jenkins配置

### :tada: 设置Jenkins时区为北京时间

点击 Manage Jenkins（系统管理） ——> Script Console（脚本命令行）

{% gallery %}
![设置jenkins时区](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/设置jenkins时区.png)
{% endgallery %}

输入脚本并运行：
```
System.setProperty('org.apache.commons.jelly.tags.fmt.timeZone', 'Asia/Shanghai')
```

如图显示Result表示成功：

{% gallery %}
![设置jenkins时区成功](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/设置jenkins时区成功.png)
{% endgallery %}

### :tada: 安装自动化构建和部署所需的插件

所需插件：`Maven Integration`、`Pipeline Maven Integration`、`Gitlab`、`Gitlab hook`、`SSH`、`Publish Over SSH`、`Docker`

点击 Manage Jenkins（系统管理） ——> Manage Plugins（插件管理）

{% gallery %}
![插件管理](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/插件管理.png)
{% endgallery %}

#### :whale: 安装Maven插件

点击可选插件 ——> 过滤Maven Integration插件 ——> 勾选Maven Integration和Pipeline Maven Integration ——> 点击直接安装

{% gallery %}
![安装Maven插件](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装Maven插件.png)
{% endgallery %}

如图开始安装插件：

{% gallery %}
![安装Maven插件进行中](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装Maven插件进行中.png)
{% endgallery %}

安装完成后，即可在插件管理下的已安装选项卡下看到刚刚已经安装的插件。

#### :whale: 安装Gitlab插件

点击可选插件 ——> 过滤Gitlab插件 ——> 勾选Gitlab和Gitlab Hook ——> 点击直接安装

{% gallery %}
![安装Gitlab插件](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装Gitlab插件.png)
{% endgallery %}

#### :whale: 安装SSH插件和Publish Over SSH插件

安装Publish Over SSH插件的原因：因为本方式是使用docker启动jenkins服务，所以在jenkins后续执行构建任务时候，需要在build成功后，将服务的jar包（以spring boot）服务为例，需要将jar包拷贝到Dockerfile所在服务器的指定目录，进行微服务的启动；所以，此处需要配置SSH服务器的连接，意思就是在jenkins的任务结束后，去执行指定的服务器上的shell命令，做spring boot或cloud服务的镜像的构建，容器的运行，等一系列的事情。 

点击可选插件 ——> 过滤SSH插件 ——> 勾选SSH和Publish Over SSH ——> 点击直接安装

{% gallery %}
![安装SSH插件](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装SSH插件.png)
{% endgallery %}

#### :whale: 安装Docker插件

点击可选插件 ——> 过滤Docker插件 ——> 勾选Docker ——> 点击直接安装

{% gallery %}
![安装Docker插件](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装Docker插件.png)
{% endgallery %}

插件全部安装完成后，可以重启一下Jenkins。

### :tada: 添加凭据

点击 Manage Jenkins（系统管理） ——> Manage Credentials（凭据管理）

{% gallery %}
![凭据管理](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/凭据管理.png)
{% endgallery %}

点击添加凭据 ——> 输入宿主机服务器的用户名和密码等信息并保存

{% gallery %}
![凭据信息](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/凭据信息.png)
{% endgallery %}

### :tada: 配置SSH remote hosts

这个配置是干什么的呢？配置SSH连接Dockerfile所在服务器的相关信息，并添加凭证，最后测试连接并保存，以备后面使用！！！

点击 Manage Jenkins（系统管理） ——> 系统配置

{% gallery %}
![配置SSH-remote-hosts](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/配置SSH-remote-hosts.png)
{% endgallery %}

找到配置 ——> 下拉选择SSH remote hosts

{% gallery %}
![找到SSH-remote-hosts](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/找到SSH-remote-hosts.png)
{% endgallery %}

如下图，输入对应的信息，并校验是否连接成功！成功后，点击应用 ——> 点击保存

{% gallery %}
![SSH-remote-hosts配置信息](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/SSH-remote-hosts配置信息.png)
{% endgallery %}

### :tada: 配置Publish over SSH

找到配置 ——> 下拉选择SSH remote hosts

进行相关配置即可。

{% gallery %}
![Publish-over-SSH](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/Publish-over-SSH.png)
{% endgallery %}

### :tada: 全局工具配置

由于我们要实现的是SpringBoot项目的自动化部署操作，所以需要安装JDK、Git、Maven、Docker。

{% gallery %}
![全局工具配置](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/全局工具配置.png)
{% endgallery %}

#### :whale: 安装JDK

可以安装多个，根据项目JDK版本需求。

输入自定义JDK名称 ——> 勾选自动安装 ——> 输入Oracle账户、密码 ——> 选择JDK版本 ——> 勾选同意协议

{% gallery %}
![安装JDK](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装JDK.png)
{% endgallery %}

#### :whale: 安装Git

输入自定义Git名称 ——> 勾选自动安装

{% gallery %}
![安装Git](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装Git.png)
{% endgallery %}

#### :whale: 安装Maven

输入自定义名称 ——> 勾选自动安装 ——> 选择版本

{% gallery %}
![安装Maven](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装Maven.png)
{% endgallery %}

#### :whale: 安装Docker

输入自定义名称 ——> 勾选自动安装

{% gallery %}
![安装Docker](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装Docker.png)
{% endgallery %}

最后，点击应用 ——> 点击保存即可。

## :fire: 新建Jenkins任务

### :tada: 点击新建任务，输入名称

注意：本名称一般和项目名称一致，因为本名称会在jenkins工作空间下生成目录，类似于IDEA或Eclipse的工作空间的概念。所以，一般情况下，保证本名称=项目名称=docker镜像名称=docker容器名称 这样能尽可能的减轻jenkins配置的shell命令的复杂性！（空间命名要小写：因为镜像名不允许存在大写字母）

选择构建一个Maven项目（因为是Spring Boot的服务）

{% gallery %}
![构建Maven项目](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/构建Maven项目.png)
{% endgallery %}

### :tada: 源码管理

输入描述信息，源码管理选择Git，从gitlab复制克隆地址粘贴到Repository URL中，没有报错就表示OK的，（注意，这里我是克隆HTTP方式的地址，如果你是克隆SSH方式的地址，你需要添加Credentials，配置一下就可以了）

{% gallery %}
![源码管理](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/源码管理.png)
{% endgallery %}

### :tada: 构建触发器

接下来将会生成供gitlab配置webhook使用的URL和Token，请记录下来，后面会使用。

{% gallery %}
![触发构建URL](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/触发构建URL.png)
{% endgallery %}

点击高级，拉下来找到Generate并点击，生成一串Secret Token。

{% gallery %}
![触发构建Token](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/触发构建Token.png)
{% endgallery %}

### :tada: 添加webhook

前往gitlab，进入要构建的项目，在setting中选择Webhooks，输入URL和Secret Token 这两在上面图中已经给你标注了，去掉Enable SSL verification的勾选。

{% gallery %}
![gitlab-webhook配置](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/gitlab-webhook配置.png)
{% endgallery %}

点击Add webhook，如图表示成功添加了webhook：

{% gallery %}
![webhook配置成功](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/webhook配置成功.png)
{% endgallery %}

如果添加不成功解决方案请参考：[解决 Url is blocked: Requests to the local network are not allowed](https://www.cnblogs.com/zhongyuanzhao000/p/11379098.html)

### :tada: 构建环境

勾选Add timestamps to the Console Output，等下可以看到控制台打印的信息，这个根据自己的需求勾选。

{% gallery %}
![构建环境](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/构建环境.png)
{% endgallery %}

### :tada: Pre Steps(构建之前的步骤)

配置前一步需要做的事情是：清理本项目在jenkins的workspace中的历史文件夹。

你可以不用知道WORKSPACE具体的地址在哪里，因为下方有链接可以查看到当前jenkins中有哪些可用的变量供你使用。

默认WORKSPACE地址：`/var/jenkins_home/workspace`（如果你jenkins是docker启动的，并且挂载了目录在宿主机，那你在宿主机也是可以看到的，即 `/apps/Devops/jenkins/workspace`）

本处选择的是执行shell，则表示本处配置的shell命令，是默认在jenkins容器中执行的，而不是在宿主机上。

下拉选择执行 shell：

{% gallery %}
![执行构建前的操作](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/执行构建前的操作.png)
{% endgallery %}

在执行shell的命令中输入以下命令，设置全局变量：
```shell
SERVER_NAME_1=jenkins-docker-gitlab-springboot
echo "=========================>>>>>>>工作空间WORKSPACE的地址：$WORKSPACE "
cd $WORKSPACE
echo "=========================>>>>>>>进入工作空间WORKSPACE，清除工作空间中原项目的工作空间$SERVER_NAME_1 "
rm -rf $SERVER_NAME_1
echo "=========================>>>>>>>清除工作空间中原项目的工作空间$SERVER_NAME_1 ......成功success"
```

注意：本处的SERVER_NAME_1=jenkins-docker-gitlab-springboot是配置项目的名称

### :tada: Build(构建)

我们是SpringBoot项目，所以用到maven，这里设置一下全局操作，clean项目，并打成jar包，所以这里输入：`clean package`

{% gallery %}
![Build构建](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/Build构建.png)
{% endgallery %}

### :tada: Post Steps(执行任务)

只在jenkins构建成功后，才执行这一步。

因为最后的构建成功的maven项目的jar包是以docker启动服务为目的，所以最后的docker操作，一定是在jenkins容器以外的服务器上运行的，可能是本机宿主机，也可能是远程的服务器，这个根据自己的情况去配置。

本处选择，在远程的SSH执行shell脚本。

选中只有构建成功才执行这些命令，然后选择Execute shell script on remote host using ssh。

{% gallery %}
![执行任务](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/执行任务.png)
{% endgallery %}

{% folding green, shell命令 %}
```shell
#=====================================================================================
#=================================定义初始化变量======================================
#=====================================================================================

#操作/项目路径(Dockerfile存放的路劲)
BASE_PATH=/apps/jenkins-docker-gitlab-springboot

# jenkins构建好的源jar路径  
SOURCE_PATH=/apps/Devops/jenkins/workspace

#【docker 镜像】【docker容器】【Dockerfile同目录下的jar名字[用它build生成image的jar]】【jenkins的workspace下的项目名称】
#这里都以这个命名[微服务的话，每个服务都以 ms-项目名 这种格式命名]
#注意统一名称！！！！！
SERVER_NAME=jenkins-docker-gitlab-springboot

#容器id  [grep -w 全量匹配容器名] [awk 获取信息行的第一列，即容器ID]  [无论容器启动与否，都获取到]
CID=$(docker ps -a | grep -w "$SERVER_NAME" | awk '{print $1}')

#镜像id  [grep -w 全量匹配镜像名] [awk 获取信息行的第三列，即镜像ID]
IID=$(docker images | grep -w "$SERVER_NAME" | awk '{print $3}')

#源jar完整地址  [jenkins构建成功后，会在自己的workspace/项目/target 下生成maven构建成功的jar包，获取jar包名的完整路径]
#例如：/apps/Devops/jenkins/workspace/jenkins-docker-gitlab-springboot/target/jenkins-docker-gitlab-springboot-0.0.1-SNAPSHOT.jar
SOURCE_JAR_PATH=$(find "$SOURCE_PATH/$SERVER_NAME/target/"  -name "*$SERVER_NAME*.jar" )

DATE=`date +%Y%m%d%H%M%S`


#=====================================================================================
#============================对原本已存在的jar进行备份================================
#=====================================================================================



# 备份
function backup(){
    if [ -f "$BASE_PATH/$SERVER_NAME.jar" ]; then
        echo "=========================>>>>>>>$SERVER_NAME.jar 备份..."
            mv $BASE_PATH/$SERVER_NAME.jar $BASE_PATH/backup/$SERVER_NAME-$DATE.jar
        echo "=========================>>>>>>>备份老的 $SERVER_NAME.jar 完成"

    else
        echo "=========================>>>>>>>老的$BASE_PATH/$SERVER_NAME.jar不存在，跳过备份"
    fi
}



#=====================================================================================
#=========================移动最新源jar包到Dockerfile所在目录=========================
#=====================================================================================


 
# 查找源jar文件名，进行重命名，最后将源文件移动到Dockerfile文件所在目录
function transfer(){
       
         
    echo "=========================>>>>>>>源文件完整地址为 $SOURCE_JAR_PATH"

        
    echo "=========================>>>>>>>重命名源文件"
        mv $SOURCE_JAR_PATH  $SOURCE_PATH/$SERVER_NAME/target/$SERVER_NAME.jar

    echo "=========================>>>>>>>最新构建代码 $SOURCE_PATH/$SERVER_NAME/target/$SERVER_NAME.jar 迁移至 $BASE_PATH"
        cp $SOURCE_PATH/$SERVER_NAME/target/$SERVER_NAME.jar $BASE_PATH 

    echo "=========================>>>>>>>迁移完成Success"

}
 


#=====================================================================================
#==================================构建最新镜像=======================================
#=====================================================================================


 
# 构建docker镜像
function build(){
    
    #无论镜像存在与否，都停止原容器服务，并移除原容器服务
    echo "=========================>>>>>>>停止$SERVER_NAME容器，CID=$CID"
    docker stop $CID

    echo "=========================>>>>>>>移除$SERVER_NAME容器，CID=$CID"
    docker rm $CID

    #无论如何，都去构建新的镜像
    if [ -n "$IID" ]; then
        echo "=========================>>>>>>>存在$SERVER_NAME镜像，IID=$IID"


        echo "=========================>>>>>>>移除老的$SERVER_NAME镜像，IID=$IID"
        docker rmi $IID

        echo "=========================>>>>>>>构建新的$SERVER_NAME镜像，开始---->"
        cd $BASE_PATH
        docker build -t $SERVER_NAME .
        echo "=========================>>>>>>>构建新的$SERVER_NAME镜像，完成---->"

    else
        echo "=========================>>>>>>>不存在$SERVER_NAME镜像，构建新的镜像，开始--->"


        cd $BASE_PATH
        docker build -t $SERVER_NAME .
        echo "=========================>>>>>>>构建新的$SERVER_NAME镜像，结束--->"
    fi
}
 

#=====================================================================================
#==============================运行docker容器，启动服务===============================
#=====================================================================================




# 运行docker容器
function run(){
    backup
    transfer
    build

    docker run --name $SERVER_NAME -itd --net=host -v /etc/localtime:/etc/localtime:ro  -v /etc/timezone:/etc/timezone:ro  $SERVER_NAME 

}
 
#入口
run
```
{% endfolding %}

{% gallery %}
![shell脚本命令](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/shell脚本命令.png)
{% endgallery %}

OK，到这里基本的任务已经新建成功，至于后续的两个步骤，根据自己的需求自行配置，没有难度的。

点击应用，保存。

### :tada: 测试

测试push事件触发自动化构建和部署，点击test下拉选择push events，出现HTTP 200表示OK了。

{% gallery %}
![测试webhook](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/测试webhook.png)
{% endgallery %}

回到Jenkins可以看到任务列表，查看构建信息等。

{% gallery %}
![构建信息](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/构建信息.png)
{% endgallery %}

待Jenkins构建成功之后，在服务器上执行命令：`docker ps`，可以看到我们启动起来的 SpringBoot 容器：

{% gallery %}
![docker启动的容器](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/docker启动的容器.png)
{% endgallery %}

在浏览器输入：`http://服务器ip:端口/` 即可访问刚自动部署的项目：

{% gallery %}
![运行成功](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/运行成功.png)
{% endgallery %}

## :fire: 配置邮件通知

完成基于jenkins的持续集成部署后，任务构建执行完成，测试结果需要通知到相关人员（这个邮件通知根据自己需求选择添加，非必须）。

### :tada: 安装邮件插件

由于Jenkins自带的邮件功能比较鸡肋，因此这里推荐安装专门的邮件插件，不过下面也会顺带介绍如何配置Jenkins自带的邮件功能作用。

点击系统管理  ——>  插件管理  ——> 可选插件：

{% gallery %}
![安装邮件插件](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/安装邮件插件.png)
{% endgallery %}

选择Email Extension Plugin插件进行安装，安装好之后重启Jenkins。

{% gallery %}
![邮件插件](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/邮件插件.png)
{% endgallery %}

### :tada: 系统设置

点击系统管理  ——>  系统配置，进行邮件配置：

{% gallery %}
![系统配置](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/系统配置.png)
{% endgallery %}

#### :whale: 设置Jenkins地址和管理员邮箱地址

{% gallery %}
![jenkins-location配置](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/jenkins-location配置.png)
{% endgallery %}

#### :whale: 设置发件人等信息

这里的发件人邮箱地址切记要和系统管理员邮件地址保持一致（当然，也可以设置专门的发件人邮箱，不过不影响使用，根据具体情况设置即可）

{% gallery %}
![发件人信息](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/发件人信息.png)
{% endgallery %}

{% gallery %}
![SMTP邮件协议](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/SMTP邮件协议.png)
{% endgallery %}

#### :whale: 配置邮件内容模版

{% gallery %}
![邮件模板](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/邮件模板.png)
{% endgallery %}

{% folding green, 邮箱内容模版（Default Content） %}
```HTML
<!DOCTYPE html>    
<html>    
<head>    
<meta charset="UTF-8">    
<title>${ENV, var="JOB_NAME"}-第${BUILD_NUMBER}次构建日志</title>    
</head>    
    
<body leftmargin="8" marginwidth="0" topmargin="8" marginheight="4"    
    offset="0">    
    <table width="95%" cellpadding="0" cellspacing="0"  style="font-size: 11pt; font-family: Tahoma, Arial, Helvetica, sans-serif">    
        <tr>    
            本邮件由系统自动发出，无需回复！<br/>            
            各位同事，大家好，以下为${PROJECT_NAME}项目构建信息</br> 
            <td><font color="#CC0000">构建结果 - ${BUILD_STATUS}</font></td>   
        </tr>    
        <tr>    
            <td><br />    
            <b><font color="#0B610B">构建信息</font></b>    
            <hr size="2" width="100%" align="center" /></td>    
        </tr>    
        <tr>    
            <td>    
                <ul>    
                    <li>项目名称 ： ${PROJECT_NAME}</li>    
                    <li>构建编号 ： 第${BUILD_NUMBER}次构建</li>    
                    <li>触发原因： ${CAUSE}</li>    
                    <li>构建状态： ${BUILD_STATUS}</li>    
                    <li>构建日志： <a href="${BUILD_URL}console">${BUILD_URL}console</a></li>    
                    <li>构建  Url ： <a href="${BUILD_URL}">${BUILD_URL}</a></li>    
                    <li>工作目录 ： <a href="${PROJECT_URL}ws">${PROJECT_URL}ws</a></li>    
                    <li>项目  Url ： <a href="${PROJECT_URL}">${PROJECT_URL}</a></li>    
                </ul>    

<h4><font color="#0B610B">失败用例</font></h4>
<hr size="2" width="100%" />
$FAILED_TESTS<br/>

<h4><font color="#0B610B">最近提交(#$SVN_REVISION)</font></h4>
<hr size="2" width="100%" />
<ul>
${CHANGES_SINCE_LAST_SUCCESS, reverse=true, format="%c", changesFormat="<li>%d [%a] %m</li>"}
</ul>
详细提交: <a href="${PROJECT_URL}changes">${PROJECT_URL}changes</a><br/>

            </td>    
        </tr>    
    </table>    
</body>    
</html>
```
{% endfolding %}

#### :whale: 设置邮件触发机制

{% gallery %}
![邮件触发机制](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/邮件触发机制.png)
{% endgallery %}

上面的几步完成后，点击应用，保存即可。

#### :whale: 配置Jenkins自带的邮件功能

配置内容如下，和Email Extension Plugin插件同样的配置，可以通过勾选{% emp 通过发送测试邮件测试配置 %}按钮来测试配置是否成功发送邮件，如下图：

{% gallery %}
![自带的邮件功能](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/自带的邮件功能.png)
{% endgallery %}

完成上面的系统设置后，点击应用保存即可。

### :tada: 项目配置

在完成系统设置后，还需要给需要构建的项目进行邮件配置。

#### :whale: 进入项目配置界面

进入新建的项目界面，点击配置按钮，进入系统配置页面。

{% gallery %}
![进入项目配置](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/进入项目配置.png)
{% endgallery %}

#### :whale: 配置构建设置模块

点击上方的{% emp 构建设置 %}选项，配置内容如下：

{% gallery %}
![构建设置](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/构建设置.png)
{% endgallery %}

#### :whale: 配置构建后操作模块

点击上方的{% emp 构建后操作 %}选项，添加构建后操作步骤 `Editable Email Notification`，配置内容如下：

{% gallery %}
![构建后操作1](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/构建后操作1.png)
{% endgallery %}

接上图：

{% gallery %}
![构建后操作2](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/构建后操作2.png)
{% endgallery %}

配置内容默认即可，邮件内容类型可以根据自己的配置选择，收件人列表可以从前面的系统设置中默认收件人选项配置。

### :tada: 构建触发邮件测试

如下图，为我收到的测试邮件，邮件内容可以通过系统设置里面进行个性化的配置，可参考我上面的模板，或者自定义即可。

{% gallery %}
![构建触发邮件成功](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-3fe685e0/构建触发邮件成功.png)
{% endgallery %}

## :fire: 注意

（1）shell脚本中需要的文件夹没有则自建（不用完全跟我一样）。

（2）Dockerfile需和jar包放到同一目录下，附上我使用的Dockerfile文件内容：
```shell
FROM jdk1.8
MAINTAINER xuxu
COPY jenkins-docker-gitlab-springboot.jar jenkins-docker-gitlab-springboot.jar
CMD ["java","-jar","jenkins-docker-gitlab-springboot.jar"]
```

（3）如果没有基础 JDK 镜像可参照 [这篇文章](https://www.cnblogs.com/ztone/p/10558803.html) 完成。

（4）构建过程中可能提示没有权限操作文件夹，按照下面执行解决即可：
```
# 1. 查看所有容器
docker ps -a

# 2. 进入jenkins容器内部
docker exec -it jenkins /bin/bash

# 3. 查看当前操作用户是否是jenkins
whoami

# 4. 推出
exit

# 5. 以root用户进入jenkins容器内部
docker exec -it -u root jenkins /bin/bash

# 6. 切换到下面目录
cd /var/jenkins_home

# 7. 如果workspace可操作的用户不是jenkins用户需添加jenkins用户操作权限
ls -all

# 8. 添加jenkins用户操作权限
chown -R jenkins workspace

# 9. 添加目录操作权限
chmod 777 workspace
```

## :fire: 总结

经过我们多款软件的安装配置，我们逐步掌握了如何上床Spring Boot项目到Gitlab中，并使用Jenkins自动构建任务，另外依托于Docker，让这一切变得更加方便，希望大家都多多思考，让机器自动干活，减少我们IT从业人员的重复、繁琐的工作量。

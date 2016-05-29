# NodeJS-Microblog
本DEMO学习自Node.js开发指南

主要是简单搭建了一个微博功能,提供登录注册,发微博,显示全部微博等功能.采用的node.js开发后台,express框架,采用mongoDB搭建数据库.

### Node.js
这里就不对Node.js背景,安装等进行介绍了,百度一下太多了.

#### Express
我们是使用的express进行开发,express框架是一个简单灵活的Node.js web开发的框架.具体可以查看[Node.js中文官网](http://www.expressjs.com.cn/)

##### 开始
`express -e ejs microblog`命令会创建microblog基本文件结构.(书上说是`express -t ejs microblog`,但是express 3.x之后变了)

`cd microblog && npm install`进入并安装依赖.这会自动安装ejs和express,具体安装的依赖可以在package.json的dependecies属性中查看.

接下来,我们可以`npm start`就可以启动服务器(书上说是`npm app.js`,但是版本不同,现在使用),打开浏览器输入`http://localhost:3000`就可以看到express欢迎页.

##### ejs模板
ejs(Embedded JavaScript)模板就是和JSP/PHP/ASP相似,是一个标签替换引擎,易于学习,被广泛使用.还有一种模板是jade,是express默认的,功能强大,我没用过,书中介绍的也仅仅是ejs.
ejs的语法及其简单,我们只使用了一下:
1. <%= title %> //输出数据中title中对应的值的内容
2. <% javascript %> //中间输入javascript代码
3. <%- code %> //显示原始HTML内容。

接下来看书就行了,没有什么太大的坑,主要文件结构有些变了,还有主要是路由控制那边.

##### 片段试图
Express试图系统从3.x之后不支持partial了,可以通过ejs模版include其他html文件就可以了.具体见文件中如何引用top.ejs和bottom.ejs就知道了.

##### flash
现在Express不支持flash,需要安装connect-flash来引入flash功能,也可以用locals来代替.

##### cypto
`var crypt = require('crypto');`//不能命名成crypto,因为已经被webkit占用

写了两个星期的DEMO,现在才来写一些坑的总结,好多不记得了,有机会再写吧,头疼!


Node.js常见问题寻找[这里](http://www.muzidx.com/code/0317.html)



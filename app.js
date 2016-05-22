var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//MongoDB
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');
var flash = require('connect-flash');
// var cookieSession = require('cookie-session');


// view engine setup
app.set('views', path.join(__dirname, 'views'));//__dirname为全局变量,是脚本当前目录,即设置views文件夹为存放试图文件的目录,即存放模板的目录
app.set('view engine', 'ejs');//设置试图模板引擎为ejs
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//设置/public/favicon.ico为favicon图标
app.use(logger('dev'));//加载日志中间件
app.use(bodyParser.json());//加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));//加载解析urlencoder的中间件
app.use(cookieParser());//加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public')));//设置Public文件夹为存放静态文件的路径

//mongoDB   必须放在设置路由控制器前面
app.use(session({
  secret: setting.cookieSecret,
  store: new MongoStore ({
    // db: setting.db,
    url: 'mongodb://localhost/microblog'
  }),
  resave: true, 
  saveUninitialized: true
}));

//路由控制器
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// app.dynamicHelpers({
//   user: function(req, res) {
//     return req.session.user;
//   },
//   error: function(req, res) {
//     var err = req.flash('error');
//     if (err.length) {
//       return err;
//     } else {
//       return NULL;
//     }
//   },
//   success: function(req, res) {
//     var succ = req.flash('success');
//     if (succ.length) {
//       return succ;
//     } else {
//       return NULL;
//     }
//   }
// });

// app.use(function(req,res){
//   res.locals.user = req.session.user;

//   var err = req.flash(error);
//   var succ = req.flash(success);

//   res.locals.error = err.length ? err : null;
//   res.locals.success = succ.length ? succ : null;
// });

module.exports = app;

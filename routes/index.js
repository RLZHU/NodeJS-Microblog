var express = require('express');
var router = express.Router();
var crypt = require('crypto');//不能命名成crypto,因为已经被webkit占用
var User = require('../models/user.js');
var Post = require('../models/post.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.get(null, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('index', { title: 'Microblog',
                            user: req.session.user,
                            posts: posts,
                            success: req.flash('success').toString(),
                            error: req.flash('error').toString()
                          });//通过路由实例捕获访问主页的GET请求,导出这个路由,并在app.use('/',routes)加载,这样,当访问主页时,就会调用这句渲染views/index.ejs模板
  });
});

router.get('/u/:user', function(req, res) {
    User.get(req.params.user, function(err, user) {
    if (!user) {
      req.flash('error', 'user is not exists');
      return res.redirect('/');
    }

    Post.get(user.name, function(err, posts) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      console.log(posts);
      res.render('user', {
        title: user.name,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
});

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res, next) {
	res.render('reg', {title: '用户注册',
					    user: req.session.user,
    				  success: req.flash('success').toString(),
              error: req.flash('error').toString()
              });
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res, next) {
	//检查两次输入的密码是否一致
	if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入口令不一样');
		return res.redirect('/reg');
	}

	//生成口令的散列值
	var md5 = crypt.createHash('md5');
	var password = md5.update(req.body['password']).digest('base64');

	var newUser = new User({
		name: req.body.username,
		password: password,
	});
	//检查用户名是否存在
	User.get(newUser.name, function(err, user) {
		if (user) {
      // console.log("User name already exists");
			err = 'Username already exists';
		}
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		//如果不存在,则创建新的
		newUser.save(function(err) {
			if (err) {
        // console.log("err");
        // console.log(err);
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
	res.render('login', {title: "用户登录",
						 user: req.session.user,
						 success: req.flash('success').toString(),
						 error: req.flash('error').toString()
						});
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res, next) {
	var md5 = crypt.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	User.get(req.body.username, function(err, user) {
		if (!user) {
			req.flash('error', '用户名不存在');
			return res.redirect('/login');
		}
		if (user.password != password) {
			req.flash('error', '用户口令错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success', '登录成功');
		res.redirect('/');
	});
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res, next) {
	req.session.user = null;
	req.flash('success', '退出登录成功');
	res.redirect('/');
});

router.post('/post', checkLogin);
router.post('/post', function(req, res) {
  var currentUser = req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发表成功');
    res.redirect('/u/' + currentUser.name);
  });
});

module.exports = router;

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录');
    return res.redirect('/');
  }
  next();
}

//自定义路由规则
// router.get('/hello', function (req, res) {
//   res.send('The time is ' + new Date().toString());
// });

//路径匹配   路径规则/user/:username会被自动编译为正则表达式,类似于\/user\/([^\/]+)\/? 这样的形式。路径参数可以在响应函数中通过 req.params 的属性访问。
// router.get('/user/:username', function (req, res) {
//   res.send('user: ' + req.params.username);
// });

//控制权转移  一个路径匹配多个路由,第一个路由优先相应,可以通过next进行控制权转移
// var users = {
//   'byvoid': {
//     name: 'Carbo',
//     websit: 'http:www.byvoid.com'
//   }
// };
//
// router.all('user/:username', function (req, res, next) {
//   if (user[req.params.username]) {
//     next();
//   } else {
//     next(new Error(req.params.username + 'does not exist.'));
//   }
// });
//
// router.get('/user/:username', function (req, res) {
//   res.send(JSON.stringify(users[req.params.username]));
// });
//
// router.put('/user/:username', function (req, res) {
//   res.send('Done');
// });

//片段视图,partial在3.0以后就被移除了,现在使用forEach 和 include,具体件List.ejs
// router.get('/list', function (req, res) {
//   res.render('list', {
//     title: 'List',
//     items: [1991, 'byvoid', 'express', 'Node.js']
//   });
// });

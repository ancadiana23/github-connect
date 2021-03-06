var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Ideas = mongoose.model('Ideas');
var Projects = mongoose.model('Projects');


exports.index = function(req, res) {
	var uid;
  if (req.user) uid = req.user.github.id;
	
  Users.find (function (err, users, count) {
    Ideas.find (function (err, ideas, count) {
      Projects.find (function (err, projects, count) {
			
        var user = null;
        if (req.user) uid = req.user.github.id;

        Users.findOne ({ 'user_id': uid }, function (err, user) {
          if (err) return handleError(err);

          res.render('index', { 
            title: "Welcome to Github-connect",
            user: user,
            users: users.length,
            ideas: ideas.length,
            projects: projects.length
          });
        });
        
      });
    });
  });
};

exports.login_dev = function(req, res) {
  var u = {
    id: 1,
    github: {
      id: '1830744',
      login: 'cmarius02',
      user_id: 'cmarius02',
      user: {id: '1830744'},
      repos: [],
      projects: [{}]
    },
    loggedIn: true,
    userId: 0
  }
  req.session.auth = u;
  req.user = u;
  res.redirect('/');
}

exports.login = function(req, res) {
	if (req.user) res.redirect('/profile');
  res.render('login', { 
    title: "Log in",
    tab: req.query.rf
  });
};

exports.profile = function(req, res) {
  //console.log(req.session.oauth);
  var cuname, uname;
  if (req.user) {
		cuname = req.user.github.login;
		uname = cuname;
	}	
  if (req.query.name) cuname = req.query.name;   
  
  // restrict /profile unless logged in or other user
  if (!req.user && !req.query.name) res.redirect('/login');
  else {
    Users.findOne ({ 'user_name': cuname }, function (err, cuser) {

      if (!cuser) res.redirect('/login');
      
      else {      
				Users.findOne ({ 'user_name': uname }, function (err, user) {
          
          // keep vital info about logged user in session var
          req.session.user = user;
          
					Ideas
					.find({ 'user_id': cuser.id })
					.sort('-date_post')
					.exec(function(err, ideas) {
						res.render('profile', {
							title: "User info",
							cuser: cuser,
							ideas: ideas,
							user: user
						});
					});
				});
      }
    });
  }
};

exports.contact = function(req, res) {
	if (req.user)
		Users.findOne ({ 'user_id': req.user.github.id }, function (err, user) {
			if (err) return handleError(err);
			
			res.render('contact', { 
				title: "Get in touch with us",
				user: user
			});
		});
									 
	else
		res.render('contact', { 
			title: "Get in touch with us"
		});
};

exports.faq = function(req, res) {
	if (req.user)
		Users.findOne ({ 'user_id': req.user.github.id }, function (err, user) {
			if (err) return handleError(err);
			
			res.render('faq', { 
				title: "F.A.Q.",
				user: user
			});
		});
									 
	else
		res.render('faq', { 
			title: "F.A.Q"
		});
};

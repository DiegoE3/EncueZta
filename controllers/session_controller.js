// Middleware de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
  if (req.session.user){
    next();
  }else{
    res.redirect('/login');
  }
};

// Get /login --Formulario de login
exports.new = function(req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

//POST /login --Crear la sesión
exports.create = function(req, res){
  var login     = req.body.login;
  var password  = req.body.password;

  var userController = require('./user_controller');
  userController.autentificar (login, password, function(error, user){
    if (error){ //si hay error retornamos mensajes de error de sesión
      req.session.errors = [{"message": 'Se ha producido un error: '+error}]; //"message" mismo nombre que en layout.ejs (errors[i].message)
      res.redirect("/login");
      return;
    }

    // Crear req.session.user y guardar campos id y username
    // La sesión se define por la existencia de: req.session.user
    req.session.user = {id:user.id, username:user.username};

    //Limitando el tiempo de sesión (5 seg.)
    //req.session.cookie.expires = new Date(Date.now() + 5000);
    //o
    //req.session.cookie.maxAge = 5000;

    res.redirect(req.session.redir.toString()); //redirección al path anterior
  });
};

// DELETE /logout --Destruir la sesión
exports.destroy = function(req, res){
  delete req.session.user;

  //ver app.js, sino no funcionan métodos 1 y 2 porque
  //al hacer logout manual (si expira la cookie todo ok) olvida req.session.redir
  //req.session.cookie.maxAge = 600000;

  req.session.tiempoInicioSesion = null;  //ver app.js Método 3

  res.redirect(req.session.redir.toString()); //redirección al path anterior al login
};

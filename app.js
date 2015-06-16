var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Encuezta 2015')); //'Encuezta 2015' es una semilla, poco segura por cierto, para el cifrado de cookies.
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Limitando el tiempo de una sesión
//Métodos 1 y 2 sólo funcionan con el parche de session_controller.js --Destruir la sesión
//Método 1:
//app.use(function(req, res, next) {
//  req.session.cookie.expires = new Date(Date.now() + 5000);
  //o
//  req.session.cookie.maxAge = 5000;
//  next();
//});
//Método 2:
//ver session_controller.js en --Crear la sesión
//Método 3:
app.use(function(req, res, next) {
  //Si hay un usuario logeado = existe una sesión
  if(req.session.user){
    //Si no lo hay, guarda el tiempo de inicio de sesión
    if(!req.session.tiempoInicioSesion){
      req.session.tiempoInicioSesion = (new Date()).getTime();
      console.log(req.session.tiempoInicioSesion);
    }else{
      //Si el tiempo actual es mayor que el tiempo de incio de sesión, más 5 segundos
      //se ha cumplido el tiempo de inactividad y entonces se destruye la sesión y tiempoInicioSesion
      if((new Date()).getTime() > req.session.tiempoInicioSesion + 5000){
        delete req.session.user;                //Destrucción de la sesión
        req.session.tiempoInicioSesion = null;  //Destrucción de la variable 'tiempoInicioSesion'
        //También hay que 'destruir' tiempoInicioSesion al hacer logout manual en session_controller.js --Destruir la sesión
      }else{  //Si se realiza cualquier petición HTTP se reinicia el contador tiempoInicioSesion
        req.session.tiempoInicioSesion = (new Date()).getTime();
      }
    }
  }
  next();
});

// Helpers dinámicos:
app.use(function(req, res, next){

  //guardar path en session.redir para después de login
  if (!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

module.exports = app;

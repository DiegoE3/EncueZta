var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if (quiz){
        req.quiz = quiz;
        next();
      }else {next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error) {next(error);});
};

// GET /quizes/
exports.index = function(req, res){
  //GET /quizes?busqueda
  //Si busqueda contine algo realiza la búsqueda en el campo pregunta de la BBDD
  //y lista las preguntas que coinciden con el patrón busqueda.
  if (req.query.busqueda){
    models.Quiz.findAll({ where: {"pregunta": {like: '%'+req.query.busqueda+'%' } },
                          //Ordenación descendente , order: 'pregunta DESC'
                          order: 'pregunta' }).then(
      function(quizes){
        res.render('quizes/index.ejs', {quizes: quizes});
      }
    ).catch(function(error) {next(error);});
  //Si no, lista todas las preguntas
  }else{
    models.Quiz.findAll().then(
      function(quizes){
        res.render('quizes/index.ejs', {quizes: quizes});
      }
    ).catch(function(error) {next(error);});
  }
};

// GET /quizes/:id
exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

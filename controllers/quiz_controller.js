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
  //Si busqueda contine algo realiza la búsqueda en el campo pregunta de la BD
  //y lista las preguntas que coinciden con el patrón busqueda.
  if (req.query.busqueda){
    models.Quiz.findAll({ where: {"pregunta": {like: '%'+req.query.busqueda.replace(/ /g,'%')+'%' } },
                          //el replace sustituye espacios por % --> / / <--expresión regular espacio en blanco g <--global
                          //Ordenación descendente , order: 'pregunta DESC'
                          order: 'pregunta' }).then(
                                                function(quizes){
                                                  res.render('quizes/index.ejs', {quizes: quizes, errors: [] });
                                                }
                                               ).catch(function(error) {next(error);});
  //Si no, lista todas las preguntas
  }else{
    models.Quiz.findAll().then(
      function(quizes){
        res.render('quizes/index.ejs', {quizes: quizes, errors: [] });
      }
    ).catch(function(error) {next(error);});
  }
};

// GET /quizes/:id
exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(  //Crea el objeto quiz
    {pregunta: "pregunta", respuesta: "respuesta"}
  );
  res.render('quizes/new', {quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en la BD los campos pregunta y respuesta de quiz
  quiz
  .validate()
  .then(
    function(err){
      if (err){
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      }else{
        quiz //save: guarda en la BD pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then(function(){res.redirect('/quizes')})
      } //res.redirect: redirección HTTP a la lista de preguntas
    }
  );
};

// GET /author
exports.author = function(req, res){
  res.render('author', {quiz: req.quiz, errors: [] });
};

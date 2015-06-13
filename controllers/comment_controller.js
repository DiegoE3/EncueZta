var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res){
  var comment = models.Comment.build({
    texto: req.body.comment.texto,
    tablaQuizId: req.params.quizId
    //la clave foranea sequelize la llama automáticamente con el
    //nombre de la tabla forámea más Id; en este caso tablaQuizId
  });

  comment
  .validate()
  .then(
    function(err){
      if (err){
        res.render('comments/new.ejs',
          {comment: comment, quizid: req.params.quizId, errors: err.errors});
      }else{
        comment //save: guarda en la BD campo texto de comment
        .save()
        .then( function(){ res.redirect('/quizes/'+req.params.quizId)})
      } //res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

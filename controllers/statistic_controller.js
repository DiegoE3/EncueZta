var models = require('../models/models.js');

// Cargando las estadísticas
exports.load = function(req, res, next) {
  //Equvalente a un SELECT * FROM tablaQuizzes (Quiz --> quiz.js)
  models.Quiz.findAll().then(function(quizes){
    //Equivalente a un SELECT * FROM tablacomentarios WHERE publicado = 1 (Comment --> comment.js)
    //Atención, "publicado" es boolean así que a postgreSQL no le vale ni -->where: ["publicado = 1"]<-- ni -->where: {"publicado": {like: true}}<-- ni variantes
    //sólo le vale comparar el booleano publicado con otro booleano, !!1 para true, !1 para false. No se me ocurre nada mejor
    models.Comment.findAll({where: {publicado: !!1 } }).then(function(comentariosPublic){
      //Equivalente a SELECT * FROM tablaQuizzes INNER JOIN tablaComentarios ON tablaQuizzes.id = tablaComentarios.tablaQuizId WHERE publicado = 1
      models.Quiz.findAll({include: [{model: models.Comment, where: {publicado: !!1 } }]}).then(function(quizzesYComentsPublic) {
        //Equivalente a un SELECT * FROM tablacomentarios
        models.Comment.findAll().then(function(comentariosTot){
          //Equivalente a SELECT * FROM tablaQuizzes INNER JOIN tablaComentarios ON tablaQuizzes.id = tablaComentarios.tablaQuizId
          models.Quiz.findAll({include: [{model: models.Comment}]}).then(function(quizzesYComentsTot) {

            var numPreguntas=quizes.length;
            var numComentariosPublic=comentariosPublic.length;
            var mediaComentariosPublicPorPregunta=(numComentariosPublic/numPreguntas).toFixed(2);

            var pregConComentPublic=0;
            var pregSinComentPublic=0;
            for( i in quizzesYComentsPublic ) {
              //Si la longitud del array tablaComentarios (=número de comentarios) del quizz i
              //es mayor que 0, suma uno al número de preguntas con comentarios.
              if (quizzesYComentsPublic[i].tablaComentarios.length) {
                pregConComentPublic++;
              }
            }
            pregSinComentPublic=numPreguntas-pregConComentPublic;

            var numComentariosTot=comentariosTot.length;
            var mediaComentariosPorPreguntaTot=(numComentariosTot/numPreguntas).toFixed(2);

            var pregConComentTot=0;
            var pregSinComentTot=0;
            for( i in quizzesYComentsTot ) {
              if (quizzesYComentsTot[i].tablaComentarios.length) {
                pregConComentTot++;
              }
            }
            pregSinComentTot=numPreguntas-pregConComentTot;

        		res.render('quizes/statistics', {numPreguntas: numPreguntas,
              numComentariosPublic: numComentariosPublic,
              numComentariosTot: numComentariosTot,
              mediaComentariosPublicPorPregunta: mediaComentariosPublicPorPregunta,
              mediaComentariosPorPreguntaTot: mediaComentariosPorPreguntaTot,
              pregSinComentPublic: pregSinComentPublic,
              pregSinComentTot: pregSinComentTot,
              pregConComentPublic: pregConComentPublic,
              pregConComentTot: pregConComentTot,
              errors: []});

          }).catch (function (error) { next(error)});
        }).catch (function (error) { next(error)});
      }).catch (function (error) { next(error)});
    }).catch (function (error) { next(error)});
  }).catch (function (error) { next(error)});
};

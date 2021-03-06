var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticController = require('../controllers/statistic_controller.js');

// Página de entrada (homepage)
router.get('/', function(req, res) {
  res.render('index', { title: 'EncueZta', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId',    quizController.load); //autoload :quizId
router.param('commentId', commentController.load); //autoload :commentId

// Definición de rutas de sesión
router.get('/login',  sessionController.new);     //formulario login
router.post('/login', sessionController.create);  //crear sesión
router.get('/logout', sessionController.destroy); //destruir sesión

// Definición de rutas de /quizes
router.get('/quizes/',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
//Creación de nuevas preguntas
//Primero un GET que solicite el formulario para introducir la nueva pregunta
router.get('/quizes/new',                   sessionController.loginRequired, quizController.new);
//segundo un POST para modificar la BD
router.post('/quizes/create',               sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',         sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',      sessionController.loginRequired, quizController.destroy);

// Rutas para los comentarios,
//get para el formulario que crea el comentario, post para insertar el comentario en la BD
router.get('/quizes/:quizId(\\d+)/comments/new',  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',     commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

// Ruta estadísticas
router.get('/quizes/statistics',  statisticController.load);

/*Ruta autor. P2P obligatorio modulo 6, apartado 2b*/
router.get('/author',                       quizController.author);

module.exports = router;

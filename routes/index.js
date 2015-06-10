var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

// Página de entrada (homepage)
router.get('/', function(req, res) {
  res.render('index', { title: 'EncueZta' });
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId

//Definición de rutas de /quizes
router.get('/quizes/',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
//Creación de nuevas preguntas
//Primero un GET que solicite el formulario para introducir la nueva pregunta
router.get('/quizes/new',                   quizController.new);
//segundo un POST para modificar la BD
router.post('/quizes/create',               quizController.create);

/*P2P obligatorio modulo 6, apartado 2b*/
router.get('/author', function(req,res){
  res.render('author', {});
});

module.exports = router;

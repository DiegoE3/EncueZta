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

/*P2P obligatorio modulo 6, apartado 2b*/
router.get('/author', function(req,res){
  res.render('author', {});
});

module.exports = router;

var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'EncueZta' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

/*P2P obligatorio modulo 6, apartado 2b*/
router.get('/author', quizController.author);

module.exports = router;

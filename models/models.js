var path = require('path');

//Postgres DATABASE_URL = postgres://user:password@host:port/DATABASE_URL
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6]||null);
var user      = (url[2]||null);
var pwd       = (url[3]||null);
var protocol  = (url[1]||null);
var dialect   = (url[1]||null);
var port      = (url[5]||null);
var host      = (url[4]||null);
var storage   = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  {
    dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  //sólo SQLite (.env)
    omitNull: true      //sólo Postgres
  }
);

//Importar la definición de la tabla tablaQuiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz.js'));

//Importar definición de la tabla tablaComentarios (igual que con tablaQuiz pero en dos líneas)
var comment_path = path.join(__dirname, 'comment.js');
var Comment = sequelize.import(comment_path);

//definiendo la relación entre las tablas tablaQuiz y tablaComentarios (1aN)
//Cada comentario pertenece a una sola Quiz
Comment.belongsTo(Quiz);
//Cada Quiz puede tener varios comentarios
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //Exportar definición de tabla tablaQuiz
exports.Comment = Comment; //Exporta la tabla de comentarios

//sequelize.sync() crea e inicializa la tabla de labla de preguntas en la BBDD
sequelize.sync().then(function(){
  //then(...) ejecuta el manejador, una vez creada la tabla
  Quiz.count().then(function (count){
    if (count === 0){ //la tabla se inicializa sólo si está vacía
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma',
        tema: 'Humanidades'
      });
      Quiz.create({
        pregunta: 'Capital de Portugal',
        respuesta: 'Lisboa',
        tema: 'Humanidades'
      })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});

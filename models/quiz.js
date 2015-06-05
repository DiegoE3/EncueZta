// Definición del modelo de Quiz

module.exports = function(sequelize, Datatypes){
  return sequelize.define('tablaQuiz', {
                                        pregunta: Datatypes.STRING,
                                        respuesta: Datatypes.STRING,
                                       });
};

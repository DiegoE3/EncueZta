// Definición del modelo de Quiz

module.exports = function(sequelize, Datatypes){
  return sequelize.define('tablaQuiz', { //sequelice convierte el nombre de la tabla al pluras "tablaQuizzes" ¿?
                                        pregunta: {
                                          type: Datatypes.STRING,
                                          validate: {notEmpty: {msg: "->Falta pregunta"} }
                                        },
                                        respuesta: {
                                          type: Datatypes.STRING,
                                          validate: {notEmpty: {msg: "->Falta respuesta"} }
                                        },
                                        tema: {
                                          type: Datatypes.STRING,
                                          validate: {notEmpty: {msg: "->Falta el tema o categoría"} }
                                        }
                                       }
                         );
};

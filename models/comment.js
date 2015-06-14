// Definición del modelo de Comment con validación
//, en cristiano, crear tabla para guardar comentarios en la BD

module.exports = function(sequelize, DataTypes){
  return sequelize.define('tablaComentario', { //sequelice pluraliza el nombre de la tabla
    texto: {
      type: DataTypes.STRING,
      validate: { notEmpty: {msg: "->Falta comentario"}}
    },
    publicado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
}

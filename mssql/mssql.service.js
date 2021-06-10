
// Importo servicios de todas las entidades
var ElementMSSql = require("./element.mssql");

// Armo un objeto para juntar y exportar todos los servicios
var MSSql = {};

// Agrego todos los servicios
Object.assign(
    MSSql,
    ElementMSSql,
);

// Exporto el objeto obtenido
exports.MSSql = MSSql;

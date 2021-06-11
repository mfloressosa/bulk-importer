
// Importo servicios de todas las entidades
var ImportMSSql = require("./import.mssql");

// Armo un objeto para juntar y exportar todos los servicios
var MSSql = {};

// Agrego todos los servicios
Object.assign(
    MSSql,
    ImportMSSql,
);

// Exporto el objeto obtenido
exports.MSSql = MSSql;

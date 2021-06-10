
// Importo servicios de todas las entidades
var CurrencyMSSql = require("./currency.mssql");
var ProductMSSql = require("./product.mssql");

// Armo un objeto para juntar y exportar todos los servicios
var MSSql = {};

// Agrego todos los servicios
Object.assign(
    MSSql,
    CurrencyMSSql,
    ProductMSSql,
);

// Exporto el objeto obtenido
exports.MSSql = MSSql;

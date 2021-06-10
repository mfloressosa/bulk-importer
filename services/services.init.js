// Importo librerías
var log4js = require("log4js");

// Obtengo logger
var logger = log4js.getLogger('ServerScripts');

// Importo funciones de inicialización para cada entidad
var CurrencyService = require("./currency.service").CurrencyService;
var ProductService = require("./product.service").ProductService;

// Funcion para inicializar srevicios del
exports.ServicesInit = function(app) {

    // Escribo log
    logger.info('Incializando servicios');
    
    // Inicializo servicios
    CurrencyService(app);
    ProductService(app);
};

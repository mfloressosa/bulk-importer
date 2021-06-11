// Importo librerías
var sql = require("mssql");
var log4js = require("log4js");

// Importo configuraciones
var MSSQL_CONFIG = require("../config/mssql.config").MSSQL_CONFIG;

// Importo funciones de inicialización para cada entidad
var ImportMSSql = require("./import.mssql").ImportMSSql;

// Obtengo logger
var logger = log4js.getLogger('BulkImporter');

// Funcion para inicializar conexion
function MsSqlInit(app) {

    // Armo y devuelvo promesa con la inicialización
    return new Promise(function (resolve, reject) {

        // Escribo a log
        logger.info('Iniciando conexión a base de datos \'' + MSSQL_CONFIG.server + '\'');

        // Creo e inicializo la conexion
        var sqlConn = new sql.Connection(MSSQL_CONFIG, function (err) {
            // Verifico si hubo error
            if (err) {
                // Mensaje de error
                var errMsg = (typeof err === 'string' ? err : err.message || err.description || 'Error al ejecutar solicitud');

                // Escribo a log
                logger.error('No se pudo establecer conexion a base de datos: ' + errMsg);

                // Resultado error de la promesa
                reject(err);
            } else {
                // Escribo a log
                logger.info('Conexión a base de datos establecida');             

                // Resultado OK de la promesa
                resolve(true);
            }
        });

        // Asocio la conexion al objeto para luego recuperarla
        app.set('sqlConn', sqlConn);

        // Inicializo los servicios de acceso a base de datos
        ImportMSSql(app);
    });
}

// Exporto la funcion
exports.MsSqlInit = MsSqlInit;

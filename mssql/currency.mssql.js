// Importo librerías
var sql = require("mssql");
var log4js = require("log4js");

// Obtengo logger
var logger = log4js.getLogger('ServerScripts');

// Referencia a la conexion a base de datos
var sqlConn;

// Función para inicialización del servicio
exports.CurrencyMSSql = function(app) {
    // Obtengo y guardo referencia a la conexión
    sqlConn = app.get('sqlConn');
}

/////////////////////////////////////////
// Funciones de acceso a base de datos //
/////////////////////////////////////////

// Función asociada al SP GetCurrencies
exports.GetCurrencies = function(id, description) {

    // Ejecuto SP usando la conexión y los parametros recibidos
    return new sql.Request(sqlConn)
    .input('ID', sql.VarChar(50), id)
    .input('Description', sql.VarChar(200), description)
    .execute('GetCurrencies')
    .then(
        function(recordsets) {

            // Busco el primer recordset del resultado de la ejecución
            let recordset = (recordsets && recordsets.length > 0 ? recordsets[0] : null);

            // Devuelvo el array de recordsets obtenido
            return Promise.resolve(recordset);
        }
    ).catch(
        function(err) {

            // Obtengo mensaje formateado para el error
            var errorMsg = (err && err.procName ? 'Error al ejecutar \'' + err.procName + '\': ' : 'Error al ejecutar consulta: ') + (err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Escribo a log
            logger.error(errorMsg);

            // Propago el error
            return Promise.reject(err);
        }
    );
}

// Función asociada al SP GetCurrency
exports.GetCurrency = function(id) {

    // Ejecuto SP usando la conexión y los parametros recibidos
    return new sql.Request(sqlConn)
    .input('ID', sql.VarChar(50), id)
    .execute('GetCurrency')
    .then(
        function(recordsets) {

            // Busco el primer recordset del resultado de la ejecución
            var recordset = (recordsets && recordsets.length > 0 ? recordsets[0] : null);

            // Obtengo el elemento a devolver dentro del recordset (la primera fila del recordset)
            var currency = (recordset && recordset.length > 0 ? recordset[0] : null);

            // Devuelvo el objeto obtenido
            return Promise.resolve(currency);
        }
    ).catch(
        function(err) {

            // Obtengo mensaje formateado para el error
            var errorMsg = (err && err.procName ? 'Error al ejecutar \'' + err.procName + '\': ' : 'Error al ejecutar consulta: ') + (err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Escribo a log
            logger.error(errorMsg);

            // Propago el error
            return Promise.reject(err);
        }
    );
}


// Función asociada al SP SaveCurrency
exports.SaveCurrency = function(id, description, exchangeRate, createdDate, lastModifiedDate) {

    // Ejecuto SP usando la conexión y los parametros recibidos
    return new sql.Request(sqlConn)
    .input('ID', sql.VarChar(50), id)
    .input('Description', sql.VarChar(200), description)
    .input('ExchangeRate', sql.Numeric(10,5), exchangeRate)
    .input('CreatedDate', sql.DateTime, createdDate)
    .input('LastModifiedDate', sql.DateTime, lastModifiedDate)
    .execute('SaveCurrency')
    .then(
        function(recordsets) {

            // Busco el primer recordset del resultado de la ejecución
            var recordset = (recordsets && recordsets.length > 0 ? recordsets[0] : null);

            // Obtengo el elemento a devolver dentro del recordset (la primera fila del recordset)
            var output = (recordset && recordset.length > 0 ? recordset[0] : null);

            // Devuelvo resultado
            return Promise.resolve(output && output.result === 1);
        }
    ).catch(
        function(err) {

            // Obtengo mensaje formateado para el error
            var errorMsg = (err && err.procName ? 'Error al ejecutar \'' + err.procName + '\': ' : 'Error al ejecutar consulta: ') + (err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Escribo a log
            logger.error(errorMsg);

            // Propago el error
            return Promise.reject(err);
        }
    );
}

// Función asociada al SP DeleteCurrency
exports.DeleteCurrency = function(id) {

    // Ejecuto SP usando la conexión y los parametros recibidos
    return new sql.Request(sqlConn)
    .input('ID', sql.VarChar(50), id)
    .execute('DeleteCurrency')
    .then(
        function(recordsets) {

            // Busco el primer recordset del resultado de la ejecución
            var recordset = (recordsets && recordsets.length > 0 ? recordsets[0] : null);

            // Obtengo el elemento a devolver dentro del recordset (la primera fila del recordset)
            var output = (recordset && recordset.length > 0 ? recordset[0] : null);

            // Devuelvo resultado
            return Promise.resolve(output && output.result === 1);
        }
    ).catch(
        function(err) {

            // Obtengo mensaje formateado para el error
            var errorMsg = (err && err.procName ? 'Error al ejecutar \'' + err.procName + '\': ' : 'Error al ejecutar consulta: ') + (err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Escribo a log
            logger.error(errorMsg);

            // Propago el error
            return Promise.reject(err);
        }
    );
}

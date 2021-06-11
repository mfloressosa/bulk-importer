// Importo librerías
var sql = require("mssql");
var log4js = require("log4js");

// Obtengo logger
var logger = log4js.getLogger('BulkImporter');

// Referencia a la conexion a base de datos
var sqlConn;

// Función para inicialización del servicio
exports.ImportMSSql = function(app) {
    // Obtengo y guardo referencia a la conexión
    sqlConn = app.get('sqlConn');
}

/////////////////////////////////////////
// Funciones de acceso a base de datos //
/////////////////////////////////////////

// Función asociada al SP DeleteImport
var DeleteImport = function(ImportId) {

    return new sql.Request(sqlConn)
    .input('ImportId', sql.VarChar(50), ImportId)
    .execute('DeleteImport')
    .then(
        function(sqlResult) {

            // Busco el primer recordset del resultado de la ejecución
            var recordset = (sqlResult && sqlResult.length > 0 ? sqlResult[0] : null);

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

// Exporto la función DeleteImport
exports.DeleteImport = DeleteImport;

// Función asociada al SP SaveImportHeader
var SaveImportHeader = function(ImportId, FileName, ExecutionDate, ExecutionElements, ExecutionNameValues) {

    // Ejecuto SP usando la conexión y los parametros recibidos
    return new sql.Request(sqlConn)
    .input('ImportId', sql.VarChar(50), ImportId)
    .input('FileName', sql.VarChar(200), FileName)
    .input('ExecutionDate', sql.DateTime, ExecutionDate)
    .input('ExecutionElements', sql.Int, ExecutionElements)
    .input('ExecutionNameValues', sql.Int, ExecutionNameValues)
    .execute('SaveImportHeader')
    .then(
        function(sqlResult) {

            // Busco el primer recordset del resultado de la ejecución
            var recordset = (sqlResult && sqlResult.length > 0 ? sqlResult[0] : null);

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

// Exporto la función SaveImportHeader
exports.SaveImportHeader = SaveImportHeader;

// Función asociada al SP BulkImportElements
var BulkImportElements = function(importElements) {

    // Si no hay datos para insertar devuelvo true y no sigo
    if (!importElements || !importElements.length) return Promise.resolve(true);

    // Creo tabla temporal para volcar todos los datos
    let tempImportElements = new sql.Table('#TempImportElements');

    // Flag de create a true
    tempImportElements.create = true;

    // Agrego las columnas a recibir
    tempImportElements.columns.add('ImportId', sql.VarChar(50), { nullable: true });
    tempImportElements.columns.add('ElementId', sql.VarChar(50), { nullable: true });
    tempImportElements.columns.add('Phone', sql.VarChar(200), { nullable: true });

    // Recorro las filas recibidas
    for (let row of importElements) {
        // Tiene datos
        hasData = true;
        // Agrego los datos de cada fila a la tabla
        tempImportElements.rows.add(
            row['ImportId'],
            row['ElementId'],
            row['Phone'],
        );
    }

    // Escribo a log
    logger.info('Insertando elementos en tabla temporal para ImportElements');
    
    // Ejecuto transacción de bulk parandole la tabla y la función asociada
    return TransactionBulk(tempImportElements, BulkInsertImportElements, '#TempImportElements', true);
}

// Exporto la función BulkImportElements
exports.BulkImportElements = BulkImportElements;

// Función para llamar al SP de procesamiento para ImportElements
function BulkInsertImportElements(request) {

    // Ejecuto la función de volcado asociada
    return request.execute('BulkInsertImportElements').then(
        sqlResult => {
            // Escribo a log
            logger.info('BulkInsertImportElements: Ejecución ccorrecta');

            // Devuelvo true
            return Promise.resolve(true);
        }
    ).catch(
        err => {
            // Escribo a log
            logger.error('BulkInsertImportElements: Ejecución con error: ' + err.message);

            // Propago el error
            return Promise.reject(err);
        }
    );
}

// Función asociada al SP BulkImportElementNameValues
var BulkImportElementNameValues = function(importElementNameValues) {

    // Si no hay datos para insertar devuelvo true y no sigo
    if (!importElementNameValues || !importElementNameValues.length) return Promise.resolve(true);

    // Creo tabla temporal para volcar todos los datos
    let tempImportElementNameValues = new sql.Table('#TempImportElementNameValues');

    // Flag de create a true
    tempImportElementNameValues.create = true;

    // Agrego las columnas a recibir
    tempImportElementNameValues.columns.add('ImportId', sql.VarChar(50), { nullable: true });
    tempImportElementNameValues.columns.add('ElementId', sql.VarChar(50), { nullable: true });
    tempImportElementNameValues.columns.add('Name', sql.VarChar(200), { nullable: true });
    tempImportElementNameValues.columns.add('Value', sql.VarChar(200), { nullable: true });

    // Recorro las filas recibidas
    for (let row of importElementNameValues) {
        // Tiene datos
        hasData = true;
        // Agrego los datos de cada fila a la tabla
        tempImportElementNameValues.rows.add(
            row['ImportId'],
            row['ElementId'],
            row['Name'],
            row['Value'],
        );
    }

    // Escribo a log
    logger.info('Insertando elementos en tabla temporal para ImportElementNameValues');
    
    // Ejecuto transacción de bulk parandole la tabla y la función asociada
    return TransactionBulk(tempImportElementNameValues, BulkInsertImportElementNameValues, '#TempImportElementNameValues', true);
}

// Exporto la función BulkImportElementNameValues
exports.BulkImportElementNameValues = BulkImportElementNameValues;

// Función para llamar al SP de procesamiento para ImportElementNameValues
function BulkInsertImportElementNameValues(request) {

    // Ejecuto la función de volcado asociada
    return request.execute('BulkInsertImportElementNameValues').then(
        sqlResult => {
            // Escribo a log
            logger.info('BulkInsertImportElementNameValues: Ejecución ccorrecta');

            // Devuelvo true
            return Promise.resolve(true);
        }
    ).catch(
        err => {
            // Escribo a log
            logger.error('BulkInsertImportElementNameValues: Ejecución con error: ' + err.message);

            // Propago el error
            return Promise.reject(err);
        }
    );
}

//////////////////////////////////////////////
// Funciones compartidas para transacciones //
//////////////////////////////////////////////

function TransactionBulk(tempTable, processFunction, tempTamleName, returnOutput) {

    // Creo nueva transacción SQL
    let transaction = new sql.Transaction(sqlConn);
    // Request para la ejecución del query
    let request;
    // Resultado del query
    let output;

    // Inicio la transacción
    return transaction.begin()
    .then(
        resultBegin => {
            // Escribo a log
            logger.info('TransactionBulk: Creando transacción');

            // Creo el request a partir de la transacción
            return new sql.Request(transaction);
        }
    ).then(
        resultRequest => {
            // Guardo la referencia al request
            request = resultRequest;

            // Inserto los datos con bulk en tabla temporal
            return request.bulk(tempTable).then(
                rowCount => {
                    // Escribo a log
                    logger.info('TransactionBulk: Se insertaron ' + rowCount + ' elementos en la tabla temporal \'' + tempTamleName + '\'');

                    // Devuelvo true
                    return true;
                }
            ).catch(
                err => {
                    // Escribo a log
                    logger.error('TransactionBulk: Error al insertar bulk en la tabla temporal \'' + tempTamleName + '\': ' + err.message);

                    // Propago error
                    throw err;
                }
            );
        }
    ).then(
        rowCount => {
            // Escribo a log
            logger.info('TransactionBulk: Ejecutando procesamiento de datos desde tabla temporal');

            // Llamo al método recibido
            return processFunction(request);
        }
    ).then(
        result => {
            // Guardo el resultado de la ejecución
            output = result;

            // Escribo a log
            logger.info('TransactionBulk: Confirmando la transaccion');

            // Hago el commit de la transtacción
            return transaction.commit();
        }
    ).then(
        result => {
            // Devuelvo el output o true segun corresponda
            return Promise.resolve(returnOutput ? output : true);
        }
    ).catch(
        err => {
            // Si hubo error mando a hacer el rollback de la transacción
            transaction.rollback();

            // Escribo a log
            logger.error('TransactionBulk: Error al realizar el procesamiento: ' + err.message);

            // Rechazo la promesa
            return Promise.reject(err);
        }
    );
}

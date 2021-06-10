// Importo librerías
var express = require('express');
var path = require('path');
var fs = require('fs');
var log4js = require("log4js");
var moment = require('moment');
var xlsx = require('xlsx');

// Importo configuraciones
var LOGGER_CONFIG = require("./config/logger.config").LOGGER_CONFIG;
var INPUT_FOLDER_PATH = require("./config/app.config").INPUT_FOLDER_PATH;
var OUTPUT_FOLDER_PATH = require("./config/app.config").OUTPUT_FOLDER_PATH;

// Importo funciones compartidas
var CreateFolder = require('./shared/file.shared.js').CreateFolder;
var DummyPromise = require('./shared/promise.shared.js').DummyPromise;

// Importo funcioón de inicialización para conexión a SQL
var MsSqlInit = require('./mssql/mssql.init.js').MsSqlInit;

// Obtengo aplicacion de Exress
var app = express();

// Función para lanzar ejecución
function ExecuteProcess() {

    // Obtengo la ruta para la carpeta de logs
    var logsPath = path.resolve(__dirname, 'logs');

    // Si no existe la creo
    if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath);

    // Incremento la cantidad de listeners para evitar que el logger tire warning al inicializar
    global.process.setMaxListeners(20);

    // Inicializo los logs
    log4js.configure(LOGGER_CONFIG);

    // Obtengo logger
    var logger = log4js.getLogger('BulkImporter');

    // Anuncio servicio inicializandose
    logger.info('********************************************************');
    logger.info('* Inicializando proceso de importación                 *');
    logger.info('********************************************************');

    // Genero código de ejecucion
    var executionId = Date.now().toString();

    // Valido la existencia de filtros en el comando de consola
    var fileName = (process.argv && process.argv[2] ? process.argv[2] : null);

    // Inicio cadena de promesas
    return DummyPromise()
    .then(
        result => {
            // Inicializo conexion a base de datos SQL Server
            return MsSqlInit(app);
        }
    ).then(
        result => {
            // Creo la carpeta de input si no existe
            return CreateFolder(INPUT_FOLDER_PATH);
        }
    ).then(
        resultXlsx => {
            // Creo la carpeta de output si no existe
            return CreateFolder(OUTPUT_FOLDER_PATH);
        }
    ).then(
        resultXlsx => {
            // Obtengo la ruta al archivo a importar
            var inputFilePath = path.resolve(INPUT_FOLDER_PATH, fileName);

            // Escribo a log
            logger.info('Se procesará el archivo \'' + inputFilePath + '\'');

            // Leo el contenido del archivo
            return xlsx.readFile(inputFilePath, { type: 'string', raw: true });
        }
    ).then(
        resultXlsx => {
            // Busco el nombre de la primera hoja del excel
            var sheetName = (
                resultXlsx && resultXlsx.SheetNames && resultXlsx.SheetNames.length ? resultXlsx.SheetNames[0] :
                resultXlsx && resultXlsx.Workbook && resultXlsx.Workbook.Sheets && resultXlsx.Workbook.Sheets.length ? (resultXlsx.Workbook.Sheets[0]).name :
                ''
            );

            // Busco la definición del sheet correspondiente al nombre obtenido
            var sheet = resultXlsx && resultXlsx.Sheets ? resultXlsx.Sheets[sheetName] : null;

            // Obtengo el contenido del archivo y lo convierto a array de json (ya me parsea el header)
            var fileContent = (sheet ? xlsx.utils.sheet_to_json(sheet, { defval: '' }) : null) || [];

            // Si no se obtuvo ninguna fila lanzo error
            if (!fileContent || !fileContent.length) throw 'ERROR_UPLOAD_FILE_CONTENT_NO_ROWS';

        }
    ).then(
        result => {
            // Escribo a log
            logger.info('Servicio inicializado correctamente');
            // Logueo a consola
            console.log('Servicio inicializado correctamente');

            // Finalizo proceso (en timer para que le de tiempo a terminar de escribir logs)
            setTimeout(function() {
                process.exit(0);
            }, 200);
        }
    ).catch(
        err => {
            // Obtengo mensaje de error
            var errorMsg = (typeof err === 'string' ? err : err.message || err.description || '');

            // Escribo a log
            logger.error('Error al inicializar el servicio: ' + errorMsg);
            // Logueo a consola
            console.error('Error al inicializar el servicio: ' + errorMsg);

            // Finalizo proceso (en timer para que le de tiempo a terminar de escribir logs)
            setTimeout(function() {
                process.exit(0);
            }, 200);
        }
    );
}

// Llamo a función de ejecución
ExecuteProcess();

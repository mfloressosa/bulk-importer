// Importo librerías
var express = require('express');
var fs = require('fs');
var log4js = require("log4js");
var moment = require('moment');
var path = require('path');
var uuid = require('uuid');
var xlsx = require('xlsx');

// Importo configuraciones
var LOGGER_CONFIG = require("./config/logger.config").LOGGER_CONFIG;
var INPUT_FOLDER_PATH = require("./config/app.config").INPUT_FOLDER_PATH;
var OUTPUT_FOLDER_PATH = require("./config/app.config").OUTPUT_FOLDER_PATH;
var ELEMENT_MAPPING = require("./config/app.config").ELEMENT_MAPPING;

// Importo funciones compartidas
var ExistInFileSystem = require('./shared/file.shared.js').ExistInFileSystem;
var CreateFolder = require('./shared/file.shared.js').CreateFolder;
var DummyPromise = require('./shared/promise.shared.js').DummyPromise;

// Importo funcioón de inicialización para conexión a SQL
var MsSqlInit = require('./mssql/mssql.init.js').MsSqlInit;

// Importo servicio con funciones para MSSQL
var MSSql = require("../mssql/mssql.service").MSSql;

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

    // Datos del archivo a procesar
    var importFileName;
    var importFilePath;

    // Genero un ID para la importación
    var importId = uuid.v4();

    // Obtengo la fecha de ejecución
    var executionDate = moment().toDate();

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
            // El nombre del archivo se recibe del argumento de ejecución
            importFileName = (process.argv && process.argv[2] ? process.argv[2] : null);

            // Verifico que se haya recibido un nombre de archivo
            if (!importFileName) throw 'No se un nombre de archivo para procesar';

            // Armo la ruta completa al archivo (en la carpeta de input)
            importFilePath = path.resolve(INPUT_FOLDER_PATH, importFileName);

            // Verifico que el archivo recibido exista
            return ExistInFileSystem(importFilePath);
        }
    ).then(
        resultExistInFileSystem => {
            // Si el archivo a procesar no existe no sigo
            if (!resultExistInFileSystem) throw 'El archivo \'' + importFilePath + '\' no existe';

            // Escribo a log
            logger.info('Se procesará el archivo \'' + importFilePath + '\'');

            // Leo el contenido del archivo
            return xlsx.readFile(importFilePath, { type: 'string', raw: true });
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
            if (!fileContent || !fileContent.length) throw 'El archivo a importar está vacío o no contiene elementos válidos';

            // Escribo a log
            logger.info('Se obtuvieron ' + fileContent.length.toString() + ' filas');

            // Escribo a log
            logger.info('Se generarán datos para insertar en tablas');

            // Armo el objeto header
            var importHeader = {
                'ImportId': importId,
                'FileName':  importFileName,
                'ExecutionDate': executionDate,
                'ExecutionElements': null,
                'ExecutionNameValues': null,
            };

            // Armo los arrays a guardar en las tablas (Element y ElementNameValue)
            var importElements = [];
            var importElementsNameValues = [];

            // Lista de columnas del archivo que son requeridas
            var requiredColumns = ELEMENT_MAPPING.filter(item => item.required).map(item => item.column);

            // Lista de columnas del archivo que están mapeadas
            var mappedColumns = ELEMENT_MAPPING.map(item => item.column);

            // Mapeo archivo --> tabla
            var objMapping = {};

            // Recorro la lista y armo un mapeo como objeto JSON
            ELEMENT_MAPPING.forEach(item => objMapping[item.column] = item.property);

            // Tomo las columnas de la primera fila (asumo que son todas iguales)
            var rowColumns = Object.keys(fileContent[0]);
            
            // Recorro la lista de filas obtenidas del archivo
            fileContent.forEach(
                (row, index) => {
                    // Verifico que la fila exista y tenga todas las propiedades requeridas
                    if (!row || requiredColumns.some(
                        column => !row[column]
                    )) {
                        // Escribo a log
                        logger.warn('La fila número ' + (index + 1).toString() + ' no tiene todas las columnas requeridas, y será ignorada');
                        // Salteo la fila
                        return;
                    }

                    // Genero un ID autogenerado para el elemento
                    var elementId = uuid.v4();

                    // Creo un nuevo elemento para agregar (con el ID obtenido)
                    var element = {
                        'ImportId': importId,
                        'ElementId': elementId,
                    };

                    // Recorro la lista de propiedades de la fila
                    rowColumns.forEach(
                        column => {
                            // Verifico si la columna está entre las principales
                            if (mappedColumns.includes(column)) {
                                // Si es de las principales la agrego al element
                                element[objMapping[column]] = row[column];
                            } else {
                                // Sino, lo agrego como name value
                                importElementsNameValues.push(
                                    {
                                        'ImportId': importId,
                                        'ElementId': elementId,
                                        'Name': column,
                                        'Value': row[column],
                                    }
                                );
                            }
                        }
                    );

                    // Agrego el elemento al array
                    importElements.push(element);
                }
            );

            // Escribo a log
            logger.info('Se generaron ' + importElements.length.toString() + ' elementos y ' + importElementsNameValues.length.toString() + ' name-value asociados');

            // Actualizo las cantidades obtenidas
            importHeader['ExecutionElements'] = importElements.length;
            importHeader['ExecutionNameValues'] = importElementsNameValues.length;

            // Escribo a log
            logger.info('Se insertarán datos obtendos en base de datos');

            // Guardo el encabezado en base de datos
            return MSSql.SaveImportHeader(
                importHeader.ImportId,
                importHeader.FileName,
                importHeader.ExecutionDate,
                importHeader.ExecutionElements,
                importHeader.ExecutionNameValues,
            );
        }
    ).then(
        resultBulkInsertImport => {
            // Verifico que el proceso haya sido existoso
            if (!resultBulkInsertImport) throw 'Ocurrio un error al insertar elementos en la tabla ImportHeader';

            // Inserto los datos obtenidos en la tabla ImportElements
            return MSSql.BulkImportElements(importElements);
        }
    ).then(
        resultBulkImportElements => {
            // Verifico que el proceso haya sido existoso
            if (!resultBulkImportElements) throw 'Ocurrio un error al insertar elementos en la tabla ImportElements';

            // Inserto los datos obtenidos en la tabla ImportNameValue
            return MSSql.BulkInsertImportNameValue(importElementsNameValues);
        }
    ).then(
        resultBulkInsertImportNameValue => {
            // Verifico que el proceso haya sido existoso
            if (!resultBulkInsertImportNameValue) throw 'Ocurrio un error al insertar elementos en la tabla ImportNameValue';
            
            // Escribo a log
            logger.info('Elementos insertados exitosamente en base de datos');

            // Escribo a log
            logger.info('********************************************************');
            logger.info('* Proceso finalizado correctamente                     *');
            logger.info('********************************************************');

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
            logger.error('********************************************************');
            logger.error('* Error al procesar importación: ' + errorMsg);
            logger.error('********************************************************');

            // Finalizo proceso (en timer para que le de tiempo a terminar de escribir logs)
            setTimeout(function() {
                process.exit(0);
            }, 200);
        }
    );
}

// Llamo a función de ejecución
ExecuteProcess();

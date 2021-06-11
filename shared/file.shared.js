// Importo librerías
var fs = require('fs');
var mkdirp = require('mkdirp');
var log4js = require("log4js");

// Obtengo logger
var logger = log4js.getLogger('BulkImporter');

// Función para validar si un archivo existe en el file system
var ExistInFileSystem = function(fileSystemPath) {

    // Armo promesa para devolver
    return new Promise(function(resolve, reject) {
        // Chequeo si el archivo existe
        try {
            fs.stat(fileSystemPath, function(err, stat) {
                // Si no hay errores el archivo existe
                resolve(err === null || err === undefined);
            });
        } catch (e) {
            // Algo fallo, lanzo error
            reject(e);
        }
    });
}

// Exporto la función ExistInFileSystem
exports.ExistInFileSystem = ExistInFileSystem;

// Función para crear una carpeta en el file system
var CreateFolder = function(folderName) {

    // Verifico si el directorio a crear existe
    return ExistInFileSystem(folderName)
    .then(
        result => {
            // Si existe ya salgo
            if (result) return true;

            // Si la carpeta no existe la creo
            return mkdirp(folderName).then(
                value => {
                    // Devuelvo true
                    return true;
                }
            ).catch(
                err => {
                    // Obtengo mensajes de error
                    let errorMsg = (typeof err === 'string' ? err : err.message || err.description || '');
                    // Escribo a log
                    logger.error('Error al crear CreateFolder para \'' + folderName + '\': ' + errorMsg);
                    // Devuelvo false
                    return false;
                }
            );
        }
    );
}

// Exporto la función CreateFolder
exports.CreateFolder = CreateFolder;

// Función para mover un archivo de una ruta a otra
var MoveFile = function(sourceFile, destFile) {

    // Verifico que el archivo a mover exista
    return ExistInFileSystem(sourceFile)
    .then(
        result => {
            // Si no existe no sigo
            if (!result) throw 'El archivo \'' + sourceFile + '\' no existe';

            // Armo promesa para devolver
            return new Promise(function(resolve, reject) {
                // Muevo el archivo
                try {
                    fs.rename(sourceFile, destFile, function(err) {
                        // Si no hay errores devuelvo true
                        resolve(err === null || err === undefined);
                    }
                    );
                } catch (e) {
                    // Algo fallo, lanzo error
                    reject(e);
                }
            });
        }
    );
}

// Exporto la función MoveFile
exports.MoveFile = MoveFile;

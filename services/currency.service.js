// Importo librerías
var log4js = require("log4js");

// Importo funciones compartidas
var DummyPromise = require('../shared/promise.shared.js').DummyPromise;

// Importo servicio con funciones para MSSQL
var MSSql = require("../mssql/mssql.service").MSSql;

// Obtengo logger
var logger = log4js.getLogger('ServerScripts');

exports.CurrencyService = function(app) {

    app.post('/api/currency/get_currencies', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Obtengo valores de los filtros
        var id = req.body.id || null;
        var description = req.body.description || null;

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Ejecuto consulta a base de datos
                return MSSql.GetCurrencies(
                    id,
                    description,
                );
            }
        ).then(
            resultCurrencies  => {
                // No se obtuvo resultado de la consulta
                if (!resultCurrencies) throw 'No se pudo ejecutar consulta de monedas';

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: true, description: 'OK', data: resultCurrencies});
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                var clientMsg = (typeof err === 'string' ? err : 'Cannot process request');
                var errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'Error al ejecutar solicitud');

                // Escribo el error en el log
                logger.error('Error al procesar \'' + req.path + '\': ' + errorMsg);

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;
                // Devuelvo respuesta con el mensaje obtenido
                res.json({status: false, description: clientMsg, error: errorMsg});
            }
        );
    });

    app.get('/api/currency/get_currency/:currency_id', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Datos recibidos en el request
        var currencyId = req.params.currency_id;

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Valido que este todo lo necesario
                if (!currencyId) throw 'Missing currencyId input parameter';

                // Ejecuto consulta a base de datos
                return MSSql.GetCurrency(currencyId);
            }
        ).then(
            resultCurrency => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: true, description: 'OK', data: resultCurrency});
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                var clientMsg = (typeof err === 'string' ? err : 'Cannot process request');
                var errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'Error al ejecutar solicitud');

                // Escribo el error en el log
                logger.error('Error al procesar \'' + req.path + '\': ' + errorMsg);

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;
                // Devuelvo respuesta con el mensaje obtenido
                res.json({status: false, description: clientMsg, error: errorMsg});
            }
        );
    });

    app.post('/api/currency/create_currency', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Obtengo fecha y hora actual
        var nowUtc = moment().utc().toDate();

        // Armo objeto con con la data recibida
        var newCurrency = req.body || {};

        // Acomodo datos de creacion y modificacion (null mantiene el dato original)
        newCurrency.createdDate = nowUtc;
        newCurrency.lastModifiedDate = nowUtc;

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Ejecuto cadena de promesas enganchadas para guardar cada elemento del modelo
                return MSSql.GetCurrency(instance, newCurrency.id);
            }
        ).then(
            resultCurrency => {
                // Verifico si el ID recibido esta en uso
                if (resultCurrency) throw 'Ya existe una moneda con el identificador \'' + newCurrency.id + '\'.';

                // Mando a guardar
                return MSSql.SaveCurrency(
                    newCurrency.id,
                    newCurrency.description,
                    newCurrency.exchangeRate,
                    newCurrency.createdDate,
                    newCurrency.lastModifiedDate,
                );
            }
        ).then(
            resultSave => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Escribo a log
                logger.info('Currency \'' + newCurrency.id + '\' creado correctamente');

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: resultSaveCurrency, description: (resultSaveCurrency ? 'OK' : 'Currency create failed'), data: resultSaveCurrency});
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                var clientMsg = (typeof err === 'string' ? err : 'Cannot process request');
                var errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'Error al ejecutar solicitud');

                // Escribo el error en el log
                logger.error('Error al procesar \'' + req.path + '\': ' + errorMsg);

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;
                // Devuelvo respuesta con el mensaje obtenido
                res.json({status: false, description: clientMsg, error: errorMsg});
            }
        );
    });

    app.post('/api/currency/save_currency', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Obtengo fecha y hora actual
        var nowUtc = moment().utc().toDate();

        // Armo objeto con con la data recibida
        var newCurrency = req.body || {};

        // Acomodo datos de creacion y modificacion (null mantiene el dato original)
        newCurrency.createdDate = null;
        newCurrency.lastModifiedDate = nowUtc;

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Consulto datos actuales del elemento
                return MSSql.GetCurrency(newCurrency.id);
            }
        ).then(
            resultCurrency => {
                // Verifico que el elemento a actualizar exista
                if (!resultCurrency) throw 'No existe una moneda con el identificador \'' + newCurrency.id + '\'';

                // Mando a guardar
                return MSSql.SaveCurrency(
                    newCurrency.id,
                    newCurrency.description,
                    newCurrency.exchangeRate,
                    newCurrency.createdDate,
                    newCurrency.lastModifiedDate,
                );
            }
        ).then(
            resultSaveCurrency => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Escribo a log
                logger.info('Moneda \'' + newCurrency.id + '\' guardada correctamente');

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: resultSaveCurrency, description: (resultSaveCurrency ? 'OK' : 'Currency save failed'), data: resultSaveCurrency});
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                var clientMsg = (typeof err === 'string' ? err : 'Cannot process request');
                var errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'Error al ejecutar solicitud');

                // Escribo el error en el log
                logger.error('Error al procesar \'' + req.path + '\': ' + errorMsg);

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;
                // Devuelvo respuesta con el mensaje obtenido
                res.json({status: false, description: clientMsg, error: errorMsg});
            }
        );
    });

    app.post('/api/currency/delete_currency', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Datos recibidos en el request
        var currency = req.body.currency || {};

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Valido que este todo lo necesario
                if (!currency) throw 'Missing currency input parameter';

                // Ejecuto consulta a base de datos
                return MSSql.DeleteCurrency(currency.id);
            }
        ).then(
            resultDeleteCurrency => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Escribo a log
                logger.info('Moneda \'' + id + '\' eliminada correctamente');

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: resultDeleteCurrency, description: (resultDeleteCurrency ? 'OK' : 'Currency delete failed'), data: resultDeleteCurrency});
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                var clientMsg = (typeof err === 'string' ? err : 'Cannot process request');
                var errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'Error al ejecutar solicitud');

                // Escribo el error en el log
                logger.error('Error al procesar \'' + req.path + '\': ' + errorMsg);

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;
                // Devuelvo respuesta con el mensaje obtenido
                res.json({status: false, description: clientMsg, error: errorMsg});
            }
        );
    });

    app.post('/api/currency/delete_currencies', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Datos recibidos en el request
        var currencies = req.body.currencies || [];

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Valido que este todo lo necesario
                if (!currencies) throw 'Missing currencies input parameter';

                // Armo array de promesas con todas las ejecuciones a hacer
                var promiseArray = [];

                // Agrego el delete de cada elemento recibido en el array
                currencies.forEach(
                    currency => {
                        promiseArray.push(
                            MSSql.DeleteCurrency(currency.id)
                        );
                    }
                );

                // Ejecuto todo junto y devuelvo un unico resultado
                return Promise.all(promiseArray);
            }
        ).then(
            resultDeleteCurrencies => {
                // Resultado geneal del delete
                var result;

                // Verifico que se hayan borrado todos los elementos
                if (resultDeleteCurrencies.find(result => !result)) {
                    // Si hay al menos un delete que fallo paso el resultado a false
                    result = false;
                    // Escribo a log
                    logger.error('No se pudo eliminar todos los elementos solicitados.');
                } else {
                    // Se elimino todo
                    result = true;
                    // Escribo a log
                    logger.info('Moneda eliminada correctamente');
                }

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: result, description: (result ? 'OK' : 'Currencies delete failed'), data: result});
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                var clientMsg = (typeof err === 'string' ? err : 'Cannot process request');
                var errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'Error al ejecutar solicitud');

                // Escribo el error en el log
                logger.error('Error al procesar \'' + req.path + '\': ' + errorMsg);

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;
                // Devuelvo respuesta con el mensaje obtenido
                res.json({status: false, description: clientMsg, error: errorMsg});
            }
        );
    });
}

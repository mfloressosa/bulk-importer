// Importo librerías
var log4js = require("log4js");

// Importo funciones compartidas
var DummyPromise = require('../shared/promise.shared.js').DummyPromise;

// Importo servicio con funciones para MSSQL
var MSSql = require("../mssql/mssql.service").MSSql;

// Obtengo logger
var logger = log4js.getLogger('ServerScripts');

exports.ProductService = function(app) {

    app.post('/api/product/get_products', function(req, res, next) {

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
                return MSSql.GetProducts(
                    id,
                    description,
                );
            }
        ).then(
            resultProducts  => {
                // No se obtuvo resultado de la consulta
                if (!resultProducts) throw 'No se pudo ejecutar consulta de productos';

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: true, description: 'OK', data: resultProducts});
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

    app.get('/api/product/get_product/:product_id', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Datos recibidos en el request
        var productId = req.params.product_id;

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Valido que este todo lo necesario
                if (!productId) throw 'Missing productId input parameter';

                // Ejecuto consulta a base de datos
                return MSSql.GetProduct(productId);
            }
        ).then(
            resultProduct => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: true, description: 'OK', data: resultProduct});
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

    app.post('/api/product/create_product', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Obtengo fecha y hora actual
        var nowUtc = moment().utc().toDate();

        // Armo objeto con con la data recibida
        var newProduct = req.body || {};

        // Acomodo datos de creacion y modificacion (null mantiene el dato original)
        newProduct.createdDate = nowUtc;
        newProduct.lastModifiedDate = nowUtc;

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Ejecuto cadena de promesas enganchadas para guardar cada elemento del modelo
                return MSSql.GetProduct(instance, newProduct.id);
            }
        ).then(
            resultProduct => {
                // Verifico si el ID recibido esta en uso
                if (resultProduct) throw 'Ya existe un producto con el identificador \'' + newProduct.id + '\'.';

                // Mando a guardar
                return MSSql.SaveProduct(
                    newProduct.id,
                    newProduct.description,
                    newProduct.currency,
                    newProduct.costPerUnit,
                    newProduct.createdDate,
                    newProduct.lastModifiedDate,
                );
            }
        ).then(
            resultSave => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Escribo a log
                logger.info('Product \'' + newProduct.id + '\' creado correctamente');

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: resultSaveProduct, description: (resultSaveProduct ? 'OK' : 'Product create failed'), data: resultSaveProduct});
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

    app.post('/api/product/save_product', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Obtengo fecha y hora actual
        var nowUtc = moment().utc().toDate();

        // Armo objeto con con la data recibida
        var newProduct = req.body || {};

        // Acomodo datos de creacion y modificacion (null mantiene el dato original)
        newProduct.createdDate = null;
        newProduct.lastModifiedDate = nowUtc;

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Consulto datos actuales del elemento
                return MSSql.GetProduct(newProduct.id);
            }
        ).then(
            resultProduct => {
                // Verifico que el elemento a actualizar exista
                if (!resultProduct) throw 'No existe un producto con el identificador \'' + newProduct.id + '\'';

                // Mando a guardar
                return MSSql.SaveProduct(
                    newProduct.id,
                    newProduct.description,
                    newProduct.currency,
                    newProduct.costPerUnit,
                    newProduct.createdDate,
                    newProduct.lastModifiedDate,
                );
            }
        ).then(
            resultSaveProduct => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Escribo a log
                logger.info('Producto \'' + newProduct.id + '\' guardado correctamente');

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: resultSaveProduct, description: (resultSaveProduct ? 'OK' : 'Product save failed'), data: resultSaveProduct});
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

    app.post('/api/product/delete_product', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Datos recibidos en el request
        var product = req.body.product || {};

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Valido que este todo lo necesario
                if (!product) throw 'Missing product input parameter';

                // Ejecuto consulta a base de datos
                return MSSql.DeleteProduct(product.id);
            }
        ).then(
            resultDeleteProduct => {
                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Escribo a log
                logger.info('Producto \'' + id + '\' eliminado correctamente');

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: resultDeleteProduct, description: (resultDeleteProduct ? 'OK' : 'Product delete failed'), data: resultDeleteProduct});
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

    app.post('/api/product/delete_products', function(req, res, next) {

        // Escribo a log
        logger.info('Se recibió ' + req.method + ' para \'' + req.path + '\'');

        // Datos recibidos en el request
        var products = req.body.products || [];

        // Empiezo con promesa dummy para poder hacer throw y caer en el catch
        DummyPromise()
        .then(
            result => {
                // Valido que este todo lo necesario
                if (!products) throw 'Missing products input parameter';

                // Armo array de promesas con todas las ejecuciones a hacer
                var promiseArray = [];

                // Agrego el delete de cada elemento recibido en el array
                products.forEach(
                    product => {
                        promiseArray.push(
                            MSSql.DeleteProduct(product.id)
                        );
                    }
                );

                // Ejecuto todo junto y devuelvo un unico resultado
                return Promise.all(promiseArray);
            }
        ).then(
            resultDeleteProducts => {
                // Resultado geneal del delete
                var result;

                // Verifico que se hayan borrado todos los elementos
                if (resultDeleteProducts.find(result => !result)) {
                    // Si hay al menos un delete que fallo paso el resultado a false
                    result = false;
                    // Escribo a log
                    logger.error('No se pudo eliminar todos los elementos solicitados.');
                } else {
                    // Se elimino todo
                    result = true;
                    // Escribo a log
                    logger.info('Productos eliminados correctamente');
                }

                // Si alguno de los pasos anteriores ya envio respuesta, no sigo
                if (res.headersSent) return;

                // Envio respuesta con el resultado recibido del ultimo paso
                res.json({status: result, description: (result ? 'OK' : 'Products delete failed'), data: result});
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

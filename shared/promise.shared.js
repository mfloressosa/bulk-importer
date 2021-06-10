
// Función dummy para encadenar promesas
var DummyPromise = function() {
    // Devuelvo promesa dummy que siempre resuelve true
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
}

// Exporto la función DummyPromise
exports.DummyPromise = DummyPromise;

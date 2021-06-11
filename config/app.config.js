// Importo librerías
var path = require('path');

// Carpetas de entrada y salida del proceso
exports.INPUT_FOLDER_PATH = path.resolve(__dirname, '../files/input');
exports.OUTPUT_FOLDER_PATH = path.resolve(__dirname, '../files/output');

// Mapeo de columas para la tabla element (todo lo demas se mete como name value)
exports.ELEMENT_MAPPING = [
    {
        column: 'telefono',
        property: 'Phone',
        required: true,
    },
    {
        column: 'nombre',
        property: 'Name',
        required: true,
    }
];

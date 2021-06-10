
// Configuración de acceso a la base de datos
const MSSQL_HOST = '172.16.218.2';
const MSSQL_PORT = 1433;
const MSSQL_USER = 'inconcert';
const MSSQL_PASSWORD = '**************';
const MSSQL_DATABASE = 'WebServiceExample';
const MSSQL_CONN_TIMEOUT = 30 * 1000;
const MSSQL_REQ_TIMEOUT = 300 * 1000;
const MSSQL_POOL_MIN = 0;
const MSSQL_POOL_MAX = 50;
const MSSQL_POOL_IDLE_TIMEOUT = 24 * 60 * 60 * 1000;
const MSSQL_ENCRYPT = false;
const MSSQL_USE_UTC = true;
const MSSQL_CONFIG = {
    user: MSSQL_USER,
    password: MSSQL_PASSWORD,
    server: MSSQL_HOST,
    database: MSSQL_DATABASE,
    port: MSSQL_PORT,
    pool: {
        max: MSSQL_POOL_MAX,
        min: MSSQL_POOL_MIN,
        idleTimeoutMillis: MSSQL_POOL_IDLE_TIMEOUT
    },
    options: {
        encrypt: MSSQL_ENCRYPT,
        useUTC: MSSQL_USE_UTC,
        connectionTimeout: MSSQL_CONN_TIMEOUT,
        requestTimeout: MSSQL_REQ_TIMEOUT,
    }
};

// Exporto la configuración
exports.MSSQL_CONFIG = MSSQL_CONFIG;

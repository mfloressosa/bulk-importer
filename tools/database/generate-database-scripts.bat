@ECHO OFF

REM Datos de acceso al SQL de desarrollo
SET DATABASE_HOST=172.16.218.2
SET DATABASE_NAME=WebServiceExample
SET DATABASE_USER=inconcert
SET DATABASE_PASSWORD=**************
SET DATABASE_TIMEOUT=600

REM Armo el connection string
SET DATABASE_CONNECTION_STRING="Server=%DATABASE_HOST%;Database=%DATABASE_NAME%;User Id=%DATABASE_USER%;Password=%DATABASE_PASSWORD%;Connection Timeout=%DATABASE_TIMEOUT%;Timeout=%DATABASE_TIMEOUT%;"

REM Datos del repositorio local
SET TARGET_DIR=..\..\database

REM Tablas para las que quiero incluir los scripts de data
SET DATA_TABLES=Currency,Product

REM Limpio los scripts actuales 
RMDIR %TARGET_DIR%\data /S /Q
RMDIR %TARGET_DIR%\functions /S /Q
RMDIR %TARGET_DIR%\procedures /S /Q
RMDIR %TARGET_DIR%\tables /S /Q
RMDIR %TARGET_DIR%\users /S /Q

REM Ejecuto generador de scripts
SchemaZen.exe script^
    --connectionString %DATABASE_CONNECTION_STRING%^
    --scriptDir %TARGET_DIR%^
    --overwrite=true^
    --verbose=true^
    --dataTables=%DATA_TABLES%

PAUSE

REM Para exportar data de todas las tablas -->  --dataTablesPattern=(.*)

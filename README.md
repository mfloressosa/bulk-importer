# bulk-importer

Ejemplo de script para ímportación BULK hecho con NodeJS + SQL Server.

## Para setupear un ambiente de desarrollo:

Requisitos:

* NodeJS v13.13.0 o superior
* npm v6.13.6 o superior

Pasos:

1. Clonar el repositorio:
  ```
  git clone https://github.com/mfloressosa/bulk-importer.git
  ```

2. Parado en la carpeta del proyecto `bulk-importer` ejecutar para instalar las dependencias:
  ```
  npm install
  ```

3. Copiar un archivo a la carpeta `file/input/` desde donde se hará la improtación (se soporta archivos csv, xls y xlsx):

4. Ejecutar el script indicando el nombre del archivo a procesar:
  ```
  node app.server.dev.js [NOMBRE_ARCHIVO]
  ```

5. Luego de terminar el procesamiento, el archivo se copiará a la carpeta `file/output/`.

6. Los parámetros de configuración del proceso se pueden modificar en:
  ```
  config/app.config.js
  ```

5. También se puede iniciar (y hacer debug) dentro de Visual Studio Code (ya está el launch.json configurado para esto).

6. Los logs de ejecución quedan en la carpeta `logs` del proyecto.

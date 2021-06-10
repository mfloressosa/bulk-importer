# web-service-example

Ejemplo de Web Service REST hecho con NodeJS + Express + SQL Server.

## Para setupear un ambiente de desarrollo:

Requisitos:

* NodeJS v13.13.0 o superior
* npm v6.13.6 o superior

Pasos:

1. Clonar el repositorio:
  ```
  git clone https://github.com/mfloressosa/web-service-example.git
  ```

2. Parado en la carpeta del proyecto `web-service-example` ejecutar para instalar las dependencias:
  ```
  npm install
  ```

3. Para iniciar una instancia del servicio por consola, ejecutar (http://[IP_SERVIDOR]:9000/):
  ```
  node app.server.dev.js
  ```

4. También se puede iniciar (y hacer debug) dentro de Visual Studio Code (ya está el launch.json configurado para esto).

5. Los logs de ejecución quedan en la carpeta `logs` del proyecto.

6. Para iniciarlo como demonio usando [pm2](http://pm2.keymetrics.io/), se debe instalar primero este servicio:
  ```
  npm install pm2@latest -g
  ```

7. Iniciar el backend una vez y configurar los scripts para que inicie al bootear el SO:
  ```
  pm2 start app.server.js --name "web-service-example" --instances 5
  pm2 startup
  pm2 save
  ```

8. Comandos utiles:
  ```
  pm2 start web-service-example --> Inicia todas las instancias del procesos.
  pm2 stop web-service-example --> Detiene todas las instancias del procesos.
  pm2 restart web-service-example --> Reinicia todas las instancias del procesos.
  pm2 reload web-service-example --> Reinicio controlado de todos los procesos (esperando que no estén en uso).
  pm2 list --> Lista los procesos configurados y su status actual.
  pm2 monit --> Monitoreo en tiempo real del CPU y memoria de cada instancia en ejecución.
  ```

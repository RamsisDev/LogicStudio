# Pasos para ejecutar el proytecto.

## 1.  Frontend
El proyecto ubicado en la carpeta Front está listo para desplegarse usando Docker.
Para ejecutarlo:

docker build -t angular-inventario .

docker run -p 4200:4200 angular-inventario

Asegúrate de tener Docker instalado y funcionando correctamente.

## 2. Base de Datos
Se debe crear una base de datos SQL Server 2022.
Dentro de la carpeta DB se encuentran los scripts iniciales necesarios para la creación de la base.
El frontend mostrará una instrucción adicional al iniciar, relacionada con esta base de datos.

## 3. Backend
Desde la carpeta correspondiente al backend, se debe ejecutar el proyecto ProductService.

Nota: Este servicio originalmente iba a correr también en Docker, al igual que el de transacciones.
Sin embargo, por motivos de tiempo, el microservicio de transacciones solo quedó como instancia local.

## 4. Verificación
Si el backend está levantado correctamente y el contenedor del frontend está funcionando, el sistema debería cumplir con varios de los requerimientos funcionales básicos.
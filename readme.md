# Serempre Tod List
Serempre Todo List es una aplicación que permite loguearse y, de acuerdo a un rol de usuario, realizar operaciones dentro de la misma: consulta, creación, edición y eliminación de tareas. En el login, valida los campos y en caso de error de logueo redirige a una página especifica; de lo contario, se redirige al home. La aplicación funciona realtime, de manera que cuando un usuario realice una operación dentro de su sesión,los demás la visualizaran en tiempo real (usar sesiones en equipos y/o navegadores diferentes). Predeterminadamente, existe ya en la Base de datos un usuario administrador `user: admin password: admin` y un usuario con menos permisos `user: user password: user`.

## Tecnologías usadas

* NodeJS 6.11.1
* NPM 3.10.10
* HTML5
* CSS3 (Boostrap Material Design)
* VUEJS (Framework Javascript)
* GIT
* GITHUB
* Mongo DB
* Modulos de NodeJS: Socket io, Express, Express-session, Mongoose

## Despliegue
Al usar `NPM`, se tiene un archivo `package.json` con todas las dependencias de la aplicación. `npm install && npm start` instala dependencias e inicia el servidor

## Estrutura
La aplicación consta de un Frontend y un Backend (views y back) y un archivo .JS como lanzador de la aplicación. A continuación se describe cada parte:
* `back/config`: Contiene un archivo de configuración con datos globales (conexión a BD Mongo).
* `back/models`: En este directorio se encuentran los modelos de datos de los usuarios (login) y las tareas para que el módulo Mongoose interactue con la Base de Datos.
* `back/controllers`: Contiene 2 archivos: uno que contiene el CRUD de operaciones sobre la Base de Datos de Mongo y el otro contiene un controlador para el login.
* `views`: Contiene las vistas HTML5, los componentes .js y los estilos de la aplicación.
* `server.js`: Es el archivo `main` de la aplicación que integra todo lo mencionado anteriormente.
* `createUsers.js`: Es un archivo adicional que permite crear usuarios para el login en la colección `User`de la Base de Datos. 
* `package.json`: Este archivo contiene las dependencias de la aplicación. Es un archivo gestionado por `NPM`

Para ver en funcionamiento puede ir [aquí](https://serempretodolist.herokuapp.com/index/).

## Agradecimientos

Estos son los sitios Web en los cuales se basó el proyecto para el diseño de la interfaz Web HTML5.

* Diseño todo list [https://codepen.io/oddvalue/full/dpBGpj/](https://codepen.io/oddvalue/full/dpBGpj/)
* Modal VueJS [https://vuejs.org/v2/examples/modal.html](https://vuejs.org/v2/examples/modal.html)
* Formulario Material Design [https://codepen.io/uzielweb/pen/vyXqpx](https://codepen.io/uzielweb/pen/vyXqpx)
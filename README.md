Backend Primer Entrega

Este proyecto es parte del backend de una tienda en línea llamada AnimeStore. Proporciona la funcionalidad para agregar productos a la tienda y gestionar los carritos de los clientes.

Instalación

Clona este repositorio en tu máquina local utilizando el siguiente comando:
git clone https://github.com/BotWaifu/BackendPrimerEntrega.git

Navega hasta el directorio del proyecto:
cd BackendPrimerEntrega

Instala las dependencias del proyecto ejecutando:
npm install

Inicia el servidor:
npm start

Uso

Una vez que el servidor esté en funcionamiento, puedes acceder a la API para agregar productos y gestionar carritos.

Agregar Producto

Envía una solicitud POST a la siguiente URL para agregar un nuevo producto:

POST http://localhost:8080/api/products

El cuerpo de la solicitud debe contener los siguientes campos:

title: El nombre del producto.

description: La descripción del producto.

price: El precio del producto.

thumbnail: La imagen del producto.

code: El código del producto.

stock: La cantidad disponible en stock.

Ver Carrito

Envía una solicitud GET a la siguiente URL para ver el contenido del carrito:

GET http://localhost:8080/api/cart

Contacto

Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con nosotros a través de correo electrónico.

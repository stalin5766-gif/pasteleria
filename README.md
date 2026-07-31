# Dulce Encanto — tienda web de pasteles

Sitio web responsive creado con HTML, CSS y JavaScript puro.

## Cómo usarlo

1. Descomprime la carpeta.
2. Abre `index.html` con Google Chrome, Edge o Firefox.
3. Para publicarlo, sube todos los archivos a GitHub Pages, Netlify, Vercel o tu hosting.

## Cambios importantes

### Número de WhatsApp

Abre `app.js` y cambia:

```js
const WHATSAPP_NUMBER = "593999999999";
```

Escribe el número con código de país, sin `+`, espacios ni guiones.

### Productos y precios

En `app.js`, edita la lista `products`. Cada producto tiene:

- `name`: nombre
- `category`: pasteles, bocaditos o postres
- `price`: precio en dólares
- `unit`: presentación
- `badge`: etiqueta visible
- `description`: descripción
- `image`: enlace de imagen

### Nombre y datos del negocio

En `index.html`, reemplaza:

- Dulce Encanto
- teléfono
- correo
- país o ciudad
- horario

## Funciones incluidas

- Diseño moderno y adaptable a celulares.
- Filtro por categorías.
- Buscador de productos.
- Vista rápida de cada producto.
- Carrito persistente con LocalStorage.
- Cantidades y notas personalizadas.
- Pedido completo enviado por WhatsApp.
- Formulario para cotizar pasteles personalizados.
- Menú móvil y animaciones.

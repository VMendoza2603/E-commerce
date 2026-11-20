# NÓRD — Store

Tienda de moda con estética editorial, hecha con **HTML, CSS y JavaScript puro**, sin frameworks.
Tiene cinco páginas: inicio, colección, novedades, ofertas y acerca de.

## Funcionalidades

- Catálogo con filtros por categoría y tarjetas animadas.
- **Carrito** lateral que se conserva entre páginas y recargas (`localStorage`).
- **Pago de demostración** con selección de método de pago (no se realizan cobros reales).
- Favoritos, contador de ofertas en tiempo real, marquesina y cursor personalizado.
- Navbar reutilizable que se carga en las páginas internas con `fetch`.
- **Responsive**: menú móvil, grillas adaptables y tablas con desplazamiento en pantallas pequeñas.
- Accesibilidad: etiquetas ARIA en los botones de iconos, foco visible y respeto por
  `prefers-reduced-motion`. En pantallas táctiles se desactiva el cursor personalizado.

## Estructura

```
├── index.html          # Inicio
├── pages/              # Colección, novedades, ofertas y acerca de
├── components/         # Navbar reutilizable
├── style.css           # Estilos base
├── pages.css           # Estilos de las páginas internas
├── responsive.css      # Adaptación a tablet y móvil
└── main.js             # Productos, carrito, pago demo, menú móvil
```

## Ejecución local

Las páginas internas cargan el navbar con `fetch`, así que se necesita un servidor local:

```bash
npx serve .
```

## Despliegue

Es un sitio estático: en Vercel se importa el repositorio sin configuración adicional.
`vercel.json` agrega las cabeceras de seguridad.

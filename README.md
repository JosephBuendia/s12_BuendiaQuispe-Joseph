# Serenazgo Alerta Huancayo — Frontend (React + Vite)

Plataforma web de la Subgerencia de Serenazgo de Huancayo: los vecinos conocen los servicios, reportan incidentes y contactan a la central. Este repositorio contiene **solo el frontend**; consume la API del backend (Node + Express + Neon).

## Cómo ejecutarlo

```bash
npm install
npm run dev        # http://localhost:5173 (las llamadas a /api van al backend en :3000)
npm run build      # genera dist/ para publicar
```

Variables de entorno (ver `.env.example`): `VITE_API_URL` = URL del backend publicado en Render, terminada en `/api`.
El archivo `.env` nunca se sube a GitHub.

## Arquitectura

```
src/
├── main.jsx        Punto de entrada: monta React con BrowserRouter y AuthProvider
├── App.jsx         Tabla de rutas: qué página se muestra para cada URL
├── pages/          Una página por ruta (InicioPage, ServiciosPage, ReportarPage...)
├── components/     Piezas reutilizables que reciben props (IncidenteCard, Campo, Carrusel...)
├── hooks/          Lógica con estado reutilizable (useCarrusel, useModal, useCambioDeRuta)
├── context/        Sesión del usuario compartida por toda la app (AuthContext)
├── api/            Único lugar que habla con el backend (client.js + *.api.js)
├── utils/          Funciones puras: validaciones, tarifa, formato de soles
├── data/           Contenido estático de las páginas
└── styles/         CSS: base.css global y una hoja por página
```

**Cómo llega una URL a la pantalla:** el navegador pide `/reportar` → `main.jsx` ya montó `BrowserRouter` → `App.jsx` busca la ruta `/reportar` dentro del `Layout` → renderiza `ReportarPage` en el `<Outlet />` entre la cabecera y el pie → la página llama a `api/incidencias.api.js`, que usa `api/client.js` para hacer el `fetch` al backend.

## Migración de HTML/JS nativo a React

| Antes (parcial) | Ahora (React) |
|---|---|
| Tres bloques HTML casi iguales para los tipos de incidente | `IncidenteCard` dibujada con `INCIDENTES.map()` |
| Carrusel con `setInterval` y `classList.add('active')` | `Carrusel` + hook `useCarrusel`: el estado `activo` decide la clase |
| Contadores con `IntersectionObserver` sobre el DOM | `Contador` con `useState` + `useEffect` |
| Modal que se abría con `querySelector` y `classList` | `DetalleModal`: se muestra según el estado `detalle` |
| Header y footer copiados en cada `.html` | Un solo `Layout` con `Header`, `Footer` y `<Outlet />` |
| `fetch` repetido en cada script | `api/client.js` centraliza URL, token y errores |
| Validaciones dentro de cada manejador de evento | Funciones puras en `utils/validaciones.js` |

## Props, estado y efectos (ejemplos)

- **Props:** `IncidenteCard({ incidente, onVer })` recibe los datos y la acción; no sabe nada del resto de la página.
- **Estado:** en `ReportarPage`, `useState` guarda los valores del formulario (`f`), los errores, si está enviando y el reporte registrado.
- **Efectos:** `useCarrusel` usa `useEffect` para avanzar la imagen cada 4,5 s y limpia el temporizador al salir; `useModal` bloquea el scroll y escucha Escape mientras hay un modal abierto.

## Funcionalidad y validaciones

Flujo principal: **iniciar sesión → reportar incidente → recibir código del reporte**. Si la persona no tiene sesión, se abre el modal de acceso.

Validaciones conservadas del parcial: celular peruano (9 dígitos, empieza con 9), DNI de 8 dígitos, correo, longitudes mínimas, tarifa de resguardo (S/ 50 por hora + S/ 20 por efectivo adicional; la alerta de auxilio no se cobra).

Validaciones mejoradas en la migración:
- Cada campo muestra su propio mensaje de error y el foco va al primer campo inválido.
- Los campos se limpian mientras se escribe (solo dígitos en el celular, máximo de caracteres en la descripción).
- `validarReporte` es una función pura, fácil de probar en consola.
- Los inputs llevan `aria-invalid` y `aria-describedby` para lectores de pantalla.
- El monto mostrado es una vista previa: el servidor siempre recalcula el valor oficial.

## Seguridad

- El frontend **no se conecta a la base de datos**: toda consulta pasa por la API.
- Ninguna credencial vive en el código; la URL del backend se lee de `VITE_API_URL`.
- `node_modules`, `dist` y `.env` están en `.gitignore`.

## Pendiente

`/actualizar`, `/caja` y `/panel` (vistas por rol: cliente, cajero, administrador) siguen como página «Pendiente».

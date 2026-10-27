# Arquitectura del frontend

El frontend está desarrollado con React y Vite. Sus páginas componen la interfaz, los componentes compartidos encapsulan comportamientos visuales y `src/services/` concentra la comunicación HTTP con la API. El cliente utiliza JavaScript con JSX.

## 1. Services y cliente HTTP centralizado

### ¿Por qué centralizar las llamadas?

Si cada componente construyera sus propias llamadas `axios.get` y `axios.post`, la URL base, la autenticación, el tratamiento de errores y los formatos de las operaciones quedarían repetidos por toda la interfaz. Al concentrar HTTP en `src/services/`:

- cada servicio expresa operaciones del dominio (`getBooks`, `createBook`, `remove`);
- el cliente común establece una sola URL base y cabeceras;
- un interceptor puede adjuntar el JWT a todas las solicitudes;
- las respuestas `401` se manejan de manera uniforme;
- las páginas y componentes se enfocan en estado e interacción, no en detalles de transporte.

### Cliente Axios e interceptor

`src/services/api.js` crea una instancia de Axios con `baseURL: API_URL` y `Content-Type: application/json`. En el interceptor de solicitud se valida que la URL no esté vacía ni contenga `"undefined"` y se lee el token de `localStorage`. Si existe, se añade la cabecera habitual:

```js
config.headers.Authorization = `Bearer ${token}`;
```

Así, un componente puede llamar a `api.get("/books")` y el interceptor adjunta la credencial sin que el componente tenga que repetir esa lógica.

El interceptor de respuesta también observa los `401`. Si la solicitud rechazada no era el login, elimina las claves de sesión y emite el evento global `auth:unauthorized`. `AuthContext` escucha ese evento para limpiar su estado, y `ProtectedRoute` conduce al usuario no autenticado hacia el login. Un `401` del login, en cambio, representa credenciales incorrectas y no se trata como una sesión previa vencida.

`getErrorMessage` traduce errores de red, `403` y errores JSON de la API en mensajes que los componentes pueden mostrar.

### Servicios de dominio

`books.service.js` ofrece operaciones específicas para libros. Por ejemplo, `getBooks` elimina filtros vacíos antes de enviarlos como query params, y `createBook` devuelve `data.data`, es decir, la carga útil de negocio dentro del sobre de respuesta de la API.

Para catálogos, `crud.service.js` expone `createCrudService(basePath)`, que crea `getAll`, `getById`, `create`, `update` y `remove`. Los módulos de autores, géneros, estantes y sagas pueden reutilizar esa forma REST con su propia ruta, mientras los componentes de gestión permanecen genéricos.

```text
Página / componente
        │ llama operaciones de dominio
        ▼
books.service.js / authors.service.js / crud.service.js
        │ usa la instancia compartida
        ▼
api.js (base URL + interceptores Axios)
        │ HTTP con Authorization si hay token
        ▼
API Express
```

## 2. Constantes del frontend

`src/constants/index.js` concentra valores compartidos por rutas, servicios y autenticación:

- `API_URL`: usa `import.meta.env.VITE_API_URL` y, si no está definida, el fallback `http://localhost:8000/api`;
- `STORAGE_KEYS`: nombres de localStorage (`library_token`, `library_user`);
- `ROUTES`: rutas del navegador (`/login`, `/books`, `/management`, entre otras);
- `ENDPOINTS`: endpoints de la API, como `/auth/login`, `/auth/me` y `/books`;
- `AUTH_EVENTS`: nombre del evento global de sesión inválida;
- `MESSAGES`: textos comunes de error y validación.

Una única fuente para estos valores evita que las mismas rutas o claves se escriban con variantes diferentes en varios archivos, y simplifica cambios posteriores.

**Diferencia de puertos a revisar en la configuración actual:** el backend tiene `PORT` por defecto `3000`, mientras el fallback del frontend apunta al puerto `8000`. El backend también permite CORS para `http://localhost:5173`. Para que frontend y backend se comuniquen, se debe configurar `VITE_API_URL` con la URL real de la API, por ejemplo `http://localhost:3000/api` si se mantiene el puerto predeterminado del backend. CORS corresponde al origen del navegador (frontend) y la URL base corresponde al destino de Axios (backend); no son el mismo valor.

## 3. Componentes reutilizables

El inventario corresponde a los archivos que existen actualmente en `frontend/src/components/`. Se usa composición: por ejemplo, `BookFormModal` contiene un `Modal` y un `EntityForm`; `CatalogTab` reutiliza tabla, formularios, alertas, carga y confirmación de borrado.

| Componente | Responsabilidad |
|---|---|
| **`Alert.jsx`** | Presenta avisos de error, éxito o información. Puede mostrar un botón de cierre cuando recibe `onClose`. |
| **`BookDetailModal.jsx`** | Muestra la ficha de un libro ya cargado con relaciones: año, autor y nacionalidad, género, saga y ubicación física del estante. Se apoya en `Modal`. |
| **`BookFilter.jsx`** | Mantiene los filtros de autor, género y año; valida con `bookFilterSchema` y entrega al padre números o valores `undefined`. También permite limpiar y reaplicar sin filtros. |
| **`BookFormModal.jsx`** | Alta y edición de libros. Construye los campos de los catálogos, valida con Yup, convierte los nombres de campos del formulario (`authorId`, etc.) al contrato del backend (`autorId`, etc.) y llama al servicio de libros. |
| **`CatalogTab.jsx`** | Implementa el ciclo CRUD genérico para una pestaña de catálogo a partir de una configuración. Carga registros, muestra tabla, crea/edita mediante `EntityForm`, confirma borrados y presenta errores y avisos. |
| **`ConfirmModal.jsx`** | Solicita confirmación antes de una acción destructiva. Controla el estado ocupado y muestra errores de servidor —por ejemplo, un `409` si el registro está en uso— dentro del diálogo. |
| **`EntityForm.jsx`** | Formulario reutilizable guiado por una lista de campos y un esquema Yup. Administra valores, valida, entrega datos ya limpios a `onSubmit` y presenta errores locales o del servidor. |
| **`FormField.jsx`** | Envuelve un input o select con su etiqueta y, si existe, el mensaje de error del campo. |
| **`Layout.jsx`** | Marco compartido de las páginas privadas. Incluye la barra superior con enlaces, nombre de usuario y cierre de sesión; renderiza la página hija con `<Outlet />`. |
| **`Loading.jsx`** | Muestra un mensaje de carga accesible como estado (`role="status"`). |
| **`Modal.jsx`** | Diálogo visual reutilizable. Recibe título y contenido, y permite cerrar con Escape, el botón de cerrar o un clic en el fondo. |
| **`ProtectedRoute.jsx`** | Consulta el estado de autenticación; mientras valida muestra carga, y si no hay sesión redirige al login conservando la ruta intentada. Si está autenticado, renderiza las rutas hijas mediante `<Outlet />`. |
| **`Table.jsx`** | Tabla configurable por columnas y datos. Permite render personalizado por celda, acciones por fila y mensaje cuando no hay registros. |

### Aclaración sobre `Navbar`

No existe actualmente un archivo `Navbar.jsx` en `src/components/`. La barra de navegación está implementada directamente dentro de `Layout.jsx`, incluyendo el nombre de usuario y el botón de cerrar sesión. Por eso, al describir la estructura actual conviene nombrar `Layout` como responsable de la barra y el marco de las páginas privadas, no atribuir la función a un componente separado que no está en el repositorio.

### Protección de páginas y persistencia de sesión

`App.jsx` declara `/login` como pública. El resto de las páginas se anida dentro de `ProtectedRoute` y `Layout`. `AuthContext` centraliza el usuario, el token y las acciones de login/logout; al iniciar la app, si encuentra un token, consulta `GET /auth/me` para verificarlo contra el backend. `ProtectedRoute` no sustituye la protección de la API: un usuario podría intentar llamar directamente a un endpoint, por lo que el backend también exige el token en sus rutas privadas.

## 4. JavaScript, JSX y React Router

Los componentes están escritos en `.jsx` y los módulos auxiliares en `.js`; Vite procesa estos archivos sin que el proyecto necesite tipado TypeScript en el frontend. JSX permite expresar la estructura de UI junto a los componentes React. Elegir JavaScript mantiene esa capa ligera y consistente con la implementación existente; la validación de datos se realiza en tiempo de ejecución con Yup, no mediante tipos estáticos.

El proyecto declara `react-router` versión 7 y los imports observados son, por ejemplo, `import { Routes, Route } from "react-router"` y `import { BrowserRouter } from "react-router"`. La defensa debe reflejar el paquete y el patrón usados por este repositorio, en lugar de asumir imports de una versión o configuración distinta. `App.jsx` organiza las rutas anidadas y `Outlet` permite que `ProtectedRoute` y `Layout` envuelvan las páginas hijas.

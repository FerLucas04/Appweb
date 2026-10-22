# 📚 Sistema de Gestión de Biblioteca

Aplicación Full Stack para administrar el catálogo, los socios y los préstamos de una biblioteca.

## Stack

| Capa     | Tecnologías                                                        |
|----------|--------------------------------------------------------------------|
| Backend  | Node.js, Express 5, TypeORM, MySQL (`mysql2`), TypeScript, ESM     |
| Seguridad| bcrypt (hash de contraseñas), JSON Web Tokens                      |
| Frontend | _A definir en pasos posteriores_                                   |

## Estructura del repositorio

```
.
├── backend/    # API REST
└── frontend/   # Cliente web (pendiente)
```

### Estructura del backend

```
backend/src/
├── constants/     # Constantes, variables de entorno tipadas, códigos de error
├── database/      # Configuración de TypeORM (AppDataSource)
├── middlewares/   # Manejo de errores y logging de peticiones
├── utils/         # Logger y helpers (asyncHandler)
└── index.ts       # Punto de entrada del servidor
```

## Requisitos previos

- Node.js >= 20
- MySQL 8.x en ejecución

## Puesta en marcha

```bash
cd backend
npm install
cp .env.example .env     # Completar con tus valores reales
```

Crear la base de datos:

```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Scripts (dentro de `backend/`)

| Comando             | Descripción                                          |
|---------------------|------------------------------------------------------|
| `npm run dev`       | Servidor con recarga automática (`tsx watch`)        |
| `npm start`         | Servidor sin recarga                                 |
| `npm run typecheck` | Verifica los tipos de TypeScript sin generar código  |

## Verificación

Con el servidor corriendo: `GET http://localhost:3000/api/health`

## Formato de errores

Todas las respuestas de error tienen la misma forma:

```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Ruta no encontrada: GET /x" }
}
```

## Notas técnicas

- Todos los imports internos llevan extensión `.js` (requisito de ESM con `NodeNext`).
- `tsx` usa esbuild, que **no soporta `emitDecoratorMetadata`**. En las entidades de TypeORM hay que declarar el tipo de cada columna explícitamente (`@Column({ type: "varchar" })`).
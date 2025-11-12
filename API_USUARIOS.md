# Configuración de Base de Datos

Puedes inicializar la base de datos MongoDB de dos maneras: usando Docker Compose o una instalación local de Mongo.

## 1. Usando Docker Compose (recomendado)

Archivo: `docker-compose.yml` ya incluido.

Pasos:
1. Copia `.env.example` a `.env` y ajusta valores si es necesario.
2. Levanta los servicios:
  ```bash
  docker compose up -d --build
  ```
3. La API quedará disponible en `http://localhost:3000` y Mongo en el puerto `27017`.

El script `mongo-init.js` se ejecuta automáticamente dentro del contenedor y crea:
- Colecciones: `personas`, `usuarios`
- Índices únicos en `email` para ambas colecciones
- Índice compuesto `{ rol: 1, activo: 1 }` en `usuarios`

## 2. Instalación local de Mongo + script

1. Instala MongoDB y `mongosh` (https://www.mongodb.com/try/download/community y shell).
2. Asegúrate de que el servicio Mongo esté corriendo (por defecto puerto 27017).
3. Ejecuta:
  ```powershell
  # En Windows PowerShell
  ./init-mongo.ps1
  # O con una URI personalizada (por ejemplo si tienes auth):
  ./init-mongo.ps1 -MongoUri "mongodb://actuser:actpass@localhost:27017/actmongo?authSource=admin"
  ```
4. Verifica índices:
  ```bash
  mongosh actmongo --eval "db.usuarios.getIndexes()"
  mongosh actmongo --eval "db.personas.getIndexes()"
  ```

## Variables de Entorno

Archivo `.env` (ejemplo):
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/actmongo
```
Si usas Docker (con usuario y clave):
```
MONGO_URI=mongodb://actuser:actpass@localhost:27017/actmongo?authSource=admin
```

## Esquemas (resumen)

`usuarios`:
```json
{
  "nombre": "String (req)",
  "email": "String (req, unique, lowercase)",
  "password": "String (req, >=6) - almacenado hasheado",
  "rol": "enum(admin|usuario|moderador) default usuario",
  "activo": "Boolean default true",
  "ultimoLogin": "Date|null",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

`personas`:
```json
{
  "nombre": "String (req)",
  "edad": "Number (req)",
  "email": "String (req, unique)"
}
```

## Rutas Principales

- `POST /api/usuarios` crear usuario
- `GET /api/usuarios` listar usuarios
- `GET /api/usuarios/:id` obtener usuario
- `PUT /api/usuarios/:id` actualizar
- `DELETE /api/usuarios/:id` eliminar
- `PATCH /api/usuarios/:id/login` actualizar `ultimoLogin`

- `POST /api/personas` crear persona
- `GET /api/personas` listar personas
- `GET /api/personas/:id` obtener persona
- `PUT /api/personas/:id` actualizar
- `DELETE /api/personas/:id` eliminar

## Flujo de Inicio Rápido

```bash
cp .env.example .env
docker compose up -d --build
# o si local:
# ./init-mongo.ps1  (Windows)
npm run dev
```

Frontend (si configurado con Vite):
```bash
cd frontend
npm run dev
```

Listo. El frontend consume `http://localhost:3000/api/*` vía proxy.

# API de Usuarios - Pruebas

## Endpoints Disponibles

Base URL: `http://localhost:3000/api/usuarios`

### 1. Crear Usuario (POST)
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "activo": true
  }'
```

### 2. Obtener Todos los Usuarios (GET)
```bash
curl http://localhost:3000/api/usuarios
```

### 3. Obtener Usuario por ID (GET)
```bash
curl http://localhost:3000/api/usuarios/{id}
```

### 4. Actualizar Usuario (PUT)
```bash
curl -X PUT http://localhost:3000/api/usuarios/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez Actualizado",
    "email": "juan.nuevo@example.com",
    "activo": false
  }'
```

### 5. Actualizar Último Login (PATCH)
```bash
curl -X PATCH http://localhost:3000/api/usuarios/{id}/login
```

### 6. Eliminar Usuario (DELETE)
```bash
curl -X DELETE http://localhost:3000/api/usuarios/{id}
```

## Modelo de Usuario

```javascript
{
  nombre: String (requerido),
  email: String (requerido, único, formato email),
  password: String (requerido, mínimo 6 caracteres),
  activo: Boolean (opcional, por defecto true),
  ultimoLogin: Date (opcional, null por defecto),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

## Notas de Seguridad

⚠️ **IMPORTANTE**: Esta implementación NO incluye encriptación de contraseñas. Para producción, deberías:
- Usar `bcryptjs` para hashear contraseñas antes de guardarlas
- Implementar autenticación con JWT
- Agregar middleware de autenticación en las rutas protegidas

## Validaciones

- **Nombre**: No puede estar vacío
- **Email**: Debe ser un email válido y único en la base de datos
- **Password**: Mínimo 6 caracteres
- **Activo**: Debe ser un boolean (true/false)
- **UltimoLogin**: Debe ser una fecha válida en formato ISO8601

## Respuestas

El endpoint siempre excluye el campo `password` en las respuestas por seguridad.

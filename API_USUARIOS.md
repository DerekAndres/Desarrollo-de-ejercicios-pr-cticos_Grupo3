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

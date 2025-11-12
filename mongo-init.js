// Archivo de inicialización para ejecutarse dentro del contenedor o manualmente con: mongosh mongodb://localhost:27017/actmongo mongo-init.js
// Crea índices únicos en email para colecciones personas y usuarios

const dbName = 'actmongo';
const db = db.getSiblingDB(dbName);

// Crear colecciones explícitamente (Mongo las crea al primer insert, pero así garantizamos índices)
if (!db.getCollectionNames().includes('personas')) {
  db.createCollection('personas');
}
if (!db.getCollectionNames().includes('usuarios')) {
  db.createCollection('usuarios');
}

// Índice único en email (personas)
try {
  db.personas.createIndex({ email: 1 }, { unique: true, name: 'uniq_email_persona' });
  print('Índice uniq_email_persona creado');
} catch (e) { print('Error creando índice personas:', e); }

// Índice único en email (usuarios)
try {
  db.usuarios.createIndex({ email: 1 }, { unique: true, name: 'uniq_email_usuario' });
  print('Índice uniq_email_usuario creado');
} catch (e) { print('Error creando índice usuarios:', e); }

// Índice adicional por rol + activo para consultas futuras
try {
  db.usuarios.createIndex({ rol: 1, activo: 1 }, { name: 'rol_activo' });
  print('Índice rol_activo creado');
} catch (e) { print('Error creando índice rol_activo:', e); }

print('Inicialización Mongo completada');

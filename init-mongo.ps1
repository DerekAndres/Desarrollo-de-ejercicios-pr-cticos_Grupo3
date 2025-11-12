# Inicializa la base de datos MongoDB para este proyecto
# Requisitos: mongosh instalado y en PATH (https://www.mongodb.com/try/download/shell)
# Uso:
#   .\init-mongo.ps1                   # usa la URI por defecto
#   .\init-mongo.ps1 -MongoUri "mongodb://localhost:27017/actmongo"
#   .\init-mongo.ps1 -MongoUri "mongodb://actuser:actpass@localhost:27017/actmongo?authSource=admin"

param(
  [string]$MongoUri = "mongodb://localhost:27017/actmongo"
)

Write-Host "Inicializando Mongo en $MongoUri" -ForegroundColor Cyan

# Verifica mongosh
$mongosh = Get-Command mongosh -ErrorAction SilentlyContinue
if (-not $mongosh) {
  Write-Error "mongosh no está instalado o no está en el PATH. Instálalo desde https://www.mongodb.com/try/download/shell"
  exit 1
}

# Construir script JS en memoria (mismo contenido que mongo-init.js)
$script = @'
const dbName = "actmongo";
const uri = (typeof __mongoUri !== 'undefined' && __mongoUri) ? __mongoUri : undefined;

// Si el usuario pasó otra base en la URI, respetaremos esa, pero por defecto usamos actmongo
const targetDb = db.getSiblingDB(dbName);

if (!targetDb.getCollectionNames().includes('personas')) {
  targetDb.createCollection('personas');
}
if (!targetDb.getCollectionNames().includes('usuarios')) {
  targetDb.createCollection('usuarios');
}

try { targetDb.personas.createIndex({ email: 1 }, { unique: true, name: 'uniq_email_persona' }); } catch (e) { print(e); }
try { targetDb.usuarios.createIndex({ email: 1 }, { unique: true, name: 'uniq_email_usuario' }); } catch (e) { print(e); }
try { targetDb.usuarios.createIndex({ rol: 1, activo: 1 }, { name: 'rol_activo' }); } catch (e) { print(e); }

print('Inicialización completada en DB: ' + targetDb.getName());
'@

# Escribir a archivo temporal para ejecutar
$tmp = New-TemporaryFile
Set-Content -Path $tmp -Value $script -NoNewline

try {
  & mongosh --quiet "$MongoUri" $tmp.FullName
  if ($LASTEXITCODE -ne 0) { throw "mongosh devolvió código $LASTEXITCODE" }
  Write-Host "✔ Mongo inicializado correctamente" -ForegroundColor Green
}
catch {
  Write-Error "Fallo al inicializar Mongo: $_"
  exit 1
}
finally {
  Remove-Item $tmp.FullName -ErrorAction SilentlyContinue
}

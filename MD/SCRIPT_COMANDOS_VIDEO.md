# 🎬 SCRIPT DE COMANDOS PARA VIDEO DEMOSTRACIÓN

## 📋 COMANDOS PREPARADOS PARA COPIAR Y PEGAR

### 🚀 **1. INICIAR SERVIDOR**
```powershell
# Cambiar al directorio del proyecto
cd "c:\Users\pc\Documents\Proyectos\hackless-backend"

# Iniciar servidor
node app.js
```

### 🧪 **2. PRUEBAS DE BACKEND (En orden)**

#### **Prueba de Conectividad**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/test" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"mensaje":"Demostración para el profesor"}'
```

#### **Registro de Usuario Empleado**
```powershell
$empleado = '{"nombre":"Usuario Demo","correo_electronico":"demo.empleado@hackless.com","password":"DemoPass123!","confirm_password":"DemoPass123!","rol":"empleado"}'
Invoke-RestMethod -Uri "http://localhost:3000/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $empleado
```

#### **Registro de Usuario Administrador**
```powershell
$admin = '{"nombre":"Admin Demo","correo_electronico":"admin.demo@hackless.com","password":"AdminDemo123!","confirm_password":"AdminDemo123!","rol":"administrador"}'
Invoke-RestMethod -Uri "http://localhost:3000/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $admin
```

#### **Login de Usuario Empleado**
```powershell
$loginEmpleado = '{"correo_electronico":"demo.empleado@hackless.com","password":"DemoPass123!"}'
Invoke-RestMethod -Uri "http://localhost:3000/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $loginEmpleado
```

#### **Login de Administrador**
```powershell
$loginAdmin = '{"correo_electronico":"admin.demo@hackless.com","password":"AdminDemo123!"}'
Invoke-RestMethod -Uri "http://localhost:3000/admin-login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $loginAdmin
```

#### **Lista de Usuarios**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET
```

#### **Lista de Documentos**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/documents" -Method GET
```

#### **Solicitud de Demo**
```powershell
$solicitudDemo = '{"nombre":"Cliente Interesado","empresa":"Universidad XYZ","email":"profesor@universidad.edu","telefono":"+123456789","mensaje":"Solicitud de demo para evaluación académica"}'
Invoke-RestMethod -Uri "http://localhost:3000/solicitar-demo" -Method POST -Headers @{"Content-Type"="application/json"} -Body $solicitudDemo
```

### 🌐 **3. URLs PARA NAVEGADOR (En pestañas separadas)**

#### **Páginas Principales**
```
http://localhost:3000/index.html
http://localhost:3000/registro.html
http://localhost:3000/login.html
```

#### **Interfaces Administrativas**
```
http://localhost:3000/escritorio.html
http://localhost:3000/nomina.html
http://localhost:3000/documents.html
http://localhost:3000/solicitudes-demo.html
```

#### **Módulos Específicos**
```
http://localhost:3000/capacitacion.html
http://localhost:3000/hallazgos.html
http://localhost:3000/participacion-capacitaciones.html
```

#### **Páginas de Seguridad**
```
http://localhost:3000/forgot-password.html
http://localhost:3000/reset-password.html
```

### 📊 **4. DATOS DE PRUEBA PARA FORMULARIOS**

#### **Usuario de Prueba - Registro**
```
Nombre: Juan Pérez Demo
Correo: juan.demo@hackless.com
Contraseña: JuanDemo123!
Confirmar: JuanDemo123!
Rol: empleado
```

#### **Usuario Administrador - Registro**
```
Nombre: María Admin
Correo: maria.admin@hackless.com
Contraseña: MariaAdmin123!
Confirmar: MariaAdmin123!
Rol: administrador
```

#### **Solicitud de Demo**
```
Nombre: Profesor Evaluador
Empresa: Universidad Ejemplo
Email: evaluador@universidad.edu
Teléfono: +56987654321
Mensaje: Solicitud de demostración para evaluación de proyecto académico
```

### 🔍 **5. COMANDOS DE VERIFICACIÓN**

#### **Verificar Estado del Servidor**
```powershell
Get-Process -Name "node" | Format-Table
```

#### **Verificar Puerto 3000**
```powershell
netstat -an | findstr :3000
```

#### **Ver Total de Usuarios**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET
Write-Host "Total de usuarios: $($response.total)"
```

### 🎯 **6. FRASES CLAVE PARA EL VIDEO**

#### **Al mostrar código:**
> "Como pueden observar, utilizo las mejores prácticas de desarrollo con validaciones robustas y manejo de errores completo."

#### **Al probar API:**
> "El backend responde correctamente con mensajes claros y datos estructurados en formato JSON profesional."

#### **Al navegar frontend:**
> "La interfaz es completamente responsiva y funcional, con validaciones en tiempo real y experiencia de usuario intuitiva."

#### **Al mostrar seguridad:**
> "El sistema implementa seguridad de nivel empresarial con encriptación de contraseñas, autenticación 2FA y gestión de sesiones."

### ⚡ **7. COMANDOS DE EMERGENCIA**

#### **Si el servidor se cuelga:**
```powershell
taskkill /f /im node.exe
node app.js
```

#### **Si hay problemas de permisos:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Verificar que todo funciona:**
```powershell
curl http://localhost:3000/test
```

---

## 🎬 ORDEN SUGERIDO PARA EL VIDEO

### **Secuencia Óptima:**
1. **Mostrar VS Code** con estructura del proyecto
2. **Ejecutar `node app.js`** en terminal
3. **Probar APIs** con comandos PowerShell
4. **Abrir navegador** con interfaces
5. **Demostrar registro** y login
6. **Recorrer módulos** administrativos
7. **Mostrar código** destacable
8. **Conclusión** con reporte de pruebas

### **Tips para Video Fluido:**
- Tener todas las pestañas abiertas previamente
- Comandos copiados en un bloc de notas
- Datos de prueba preparados
- Servidor ejecutándose desde el inicio
- Grabación en pantalla completa HD

---

**🎯 RESULTADO ESPERADO:** Video profesional de 8-12 minutos demostrando competencias técnicas completas del sistema Hackless.

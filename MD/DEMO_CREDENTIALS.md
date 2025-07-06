# 🎯 Credenciales de Demo - Hackless

## 👤 Usuarios Administradores para Demo

### Admin Principal
- **Email:** admin@hackless.com
- **Contraseña:** AdminPass123!
- **Rol:** admin
- **Uso:** Usuario principal para demostraciones

### Admin Demo
- **Email:** demo@hackless.com
- **Contraseña:** DemoPass123!
- **Rol:** admin
- **Uso:** Usuario específico para demos y presentaciones

### Super Administrador
- **Email:** superadmin@hackless.com
- **Contraseña:** SuperPass123!
- **Rol:** admin
- **Uso:** Usuario con máximos privilegios para pruebas

### Admin Seguridad
- **Email:** security@hackless.com
- **Contraseña:** SecurePass123!
- **Rol:** admin
- **Uso:** Usuario enfocado en temas de seguridad

### Administrador Sistemas
- **Email:** sistemas@hackless.com
- **Contraseña:** SisPass123!
- **Rol:** admin
- **Uso:** Usuario para gestión de sistemas

---

## 🚀 Cómo generar los usuarios

### Opción 1: Solo Administradores
```bash
node seedAdmins.js
```

### Opción 2: Todos los usuarios (incluyendo admins)
```bash
node seedUsers.js
```

### Opción 3: Usuarios aleatorios
```bash
node seedUsersRandom.js
```

---

## 🎬 Para la Demostración en Video

1. **Usar:** `demo@hackless.com` / `DemoPass123!`
2. **Explicar:** Roles y permisos diferenciados
3. **Mostrar:** Funcionalidades admin vs usuario regular
4. **Navegar:** Entre diferentes módulos del sistema

---

## 🔧 URLs de Acceso

- **Página Principal:** http://localhost:3000/index.html
- **Login:** http://localhost:3000/login.html
- **Dashboard Admin:** http://localhost:3000/escritorio.html
- **Solicitudes Demo:** http://localhost:3000/solicitudes-demo.html
- **Nómina:** http://localhost:3000/nomina.html
- **Documentos:** http://localhost:3000/documents.html
- **Guía Demo:** http://localhost:3000/demo-guia.html

---

## ⚠️ Notas Importantes

- Todas las contraseñas cumplen con los requisitos de seguridad del sistema
- Los usuarios se crean con rol 'admin' para acceso completo
- Si un usuario ya existe, el script lo omitirá automáticamente
- Mantén estas credenciales seguras y solo úsalas para demos/desarrollo

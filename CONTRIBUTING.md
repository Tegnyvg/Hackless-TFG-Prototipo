# 🤝 Guía de Contribución - Hackless

¡Gracias por tu interés en contribuir a Hackless! Este documento establece las pautas para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Contribuir?](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Pruebas](#pruebas)
- [Documentación](#documentación)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Funcionalidades](#solicitar-funcionalidades)

## 🌟 Código de Conducta

Este proyecto se adhiere a un código de conducta profesional y académico:

- **Respeto**: Trata a todos los colaboradores con respeto y cortesía
- **Profesionalismo**: Mantén un tono profesional en todas las interacciones
- **Constructividad**: Las críticas deben ser constructivas y orientadas a la mejora
- **Inclusión**: Fomenta un ambiente inclusivo y accesible para todos

## 🔧 ¿Cómo Contribuir?

### Reportar Problemas

1. **Busca issues existentes** antes de crear uno nuevo
2. **Usa el template** de issue apropiado
3. **Incluye información detallada**:
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla si aplica
   - Información del entorno

### Solicitar Funcionalidades

1. **Describe el problema** que la funcionalidad resolvería
2. **Explica la solución propuesta**
3. **Considera alternativas**
4. **Evalúa el impacto** en el proyecto

### Enviar Cambios

1. **Fork** el repositorio
2. **Crea una rama** para tu funcionalidad (`git checkout -b feature/AmazingFeature`)
3. **Realiza los cambios** siguiendo los estándares de código
4. **Añade pruebas** para nueva funcionalidad
5. **Ejecuta las pruebas** (`npm test`)
6. **Commit** los cambios (`git commit -m 'Add AmazingFeature'`)
7. **Push** a la rama (`git push origin feature/AmazingFeature`)
8. **Abre un Pull Request**

## 🛠️ Proceso de Desarrollo

### Configuración del Entorno

```bash
# Clonar el repositorio
git clone https://github.com/Tegnyvg/Hackless-TFG-Prototipo.git
cd Hackless-TFG-Prototipo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

### Workflow de Branches

- **main**: Rama principal (producción)
- **develop**: Rama de desarrollo
- **feature/**: Nuevas funcionalidades
- **fix/**: Corrección de bugs
- **hotfix/**: Correcciones urgentes

### Convenciones de Commit

Utiliza el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(ámbito): descripción

[cuerpo opcional]

[pie opcional]
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Cambios de formato
- `refactor`: Refactorización
- `test`: Pruebas
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```
feat(auth): add two-factor authentication
fix(database): resolve connection timeout issue
docs(readme): update installation instructions
style(css): format employee management styles
refactor(api): simplify user controller logic
test(auth): add login endpoint tests
chore(deps): update dependencies to latest versions
```

## 📝 Estándares de Código

### JavaScript

- **ESLint**: Seguir la configuración definida en `.eslintrc.json`
- **Prettier**: Usar el formato definido en `.prettierrc.json`
- **Nomenclatura**: camelCase para variables y funciones, PascalCase para clases

```javascript
// ✅ Correcto
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// ❌ Incorrecto
const get_user_by_id = function(user_id) {
  var user = User.findById(user_id);
  return user;
}
```

### CSS

- **Arquitectura modular**: Seguir la estructura CSS existente
- **Variables CSS**: Usar variables definidas en `hackless-global.css`
- **Nomenclatura**: BEM methodology cuando sea apropiado

```css
/* ✅ Correcto */
.employee-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
}

.employee-card__title {
  color: var(--text-primary);
}

/* ❌ Incorrecto */
.employeeCard {
  background-color: #1e293b;
  border: 1px solid #334155;
}
```

### HTML

- **Semántica**: Usar elementos HTML semánticos apropiados
- **Accesibilidad**: Incluir atributos ARIA cuando sea necesario
- **Estructura**: Mantener consistencia con el diseño existente

## 🧪 Pruebas

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Pruebas en modo watch
npm run test:watch

# Pruebas con coverage
npm run test:coverage

# Pruebas de integración
npm run test:integration
```

### Escribir Pruebas

- **Ubicación**: `__tests__/` o archivos `*.test.js`
- **Nomenclatura**: Descriptiva y específica
- **Cobertura**: Apuntar a >80% de cobertura

```javascript
// Ejemplo de prueba
describe('User Authentication', () => {
  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## 📚 Documentación

### Comentarios en Código

```javascript
/**
 * Autentica un usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Usuario autenticado
 * @throws {Error} Si las credenciales son inválidas
 */
async function authenticateUser(email, password) {
  // Implementación...
}
```

### README y Documentación

- Mantener actualizada la documentación
- Incluir ejemplos de uso
- Documentar cambios importantes en CHANGELOG.md

## 🐛 Reportar Bugs

Al reportar un bug, incluye:

1. **Título descriptivo**
2. **Descripción detallada**
3. **Pasos para reproducir**
4. **Comportamiento esperado**
5. **Comportamiento actual**
6. **Capturas de pantalla**
7. **Información del entorno**
8. **Logs de error**

## 💡 Solicitar Funcionalidades

Para solicitar nuevas funcionalidades:

1. **Describe el problema** que resuelve
2. **Explica la solución propuesta**
3. **Considera alternativas**
4. **Evalúa el impacto** en el proyecto
5. **Incluye mockups** si es apropiado

## 🔍 Revisión de Código

### Criterios de Revisión

- **Funcionalidad**: ¿El código hace lo que debe hacer?
- **Calidad**: ¿Sigue los estándares de código?
- **Pruebas**: ¿Están incluidas las pruebas apropiadas?
- **Documentación**: ¿Está bien documentado?
- **Rendimiento**: ¿Hay consideraciones de rendimiento?
- **Seguridad**: ¿Hay vulnerabilidades potenciales?

### Proceso de Review

1. **Autorevisar** antes de enviar PR
2. **Solicitar revisión** a mantenedores
3. **Responder a comentarios** constructivamente
4. **Realizar cambios** solicitados
5. **Confirmar aprobación** antes de merge

## 🏆 Reconocimientos

Los contribuidores serán reconocidos en:

- README.md del proyecto
- CHANGELOG.md para cambios significativos
- Releases notes para funcionalidades importantes

## 📧 Contacto

Para preguntas sobre contribuciones:

- **Issues**: Usa GitHub Issues para preguntas técnicas
- **Email**: [contacto@example.com](mailto:contacto@example.com)
- **Discusiones**: Usa GitHub Discussions para preguntas generales

---

## 🎓 Contexto Académico

Este proyecto es un Trabajo Final de Grado (TFG) para la Tecnicatura en Informática. Las contribuciones son bienvenidas y valoradas como parte del proceso de aprendizaje colaborativo.

**Objetivos Académicos:**
- Aplicar conocimientos teóricos en un proyecto práctico
- Desarrollar habilidades de trabajo en equipo
- Implementar buenas prácticas de desarrollo
- Crear software de calidad profesional

---

¡Gracias por contribuir a Hackless! Tu participación ayuda a mejorar el proyecto y el aprendizaje de todos los involucrados. 🚀

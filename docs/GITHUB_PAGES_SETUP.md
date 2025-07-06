# 🌐 Guía para Configurar GitHub Pages

## 📋 Pasos para Activar GitHub Pages

### 1. **Subir Archivos a GitHub**
```bash
git add .
git commit -m "Agregar documentación para GitHub Pages"
git push origin main
```

### 2. **Configurar GitHub Pages**
1. Ve a tu repositorio en GitHub
2. Clic en **Settings** (Configuración)
3. Scroll hacia abajo hasta **Pages**
4. En **Source**, selecciona:
   - **Deploy from a branch**
   - Branch: `main`
   - Folder: `/docs`
5. Clic en **Save**

### 3. **Activar GitHub Actions (Opcional)**
Si quieres usar el workflow automático:
1. Ve a **Settings** > **Pages**
2. En **Source**, selecciona **GitHub Actions**
3. El workflow se ejecutará automáticamente

## 🎯 Resultado

- **URL de la documentación**: `https://tu-usuario.github.io/hackless-backend/`
- **Aplicación completa**: Sigue en Railway
- **Código fuente**: En el repositorio GitHub

## 📄 Contenido de GitHub Pages

La página de documentación incluye:
- ✅ Enlace directo a la demo en Railway
- ✅ Credenciales de acceso
- ✅ Descripción de funcionalidades
- ✅ Stack tecnológico
- ✅ Información del TFG
- ✅ Enlaces al código fuente

## 🔗 URLs del Proyecto

```
📄 Documentación:  https://tu-usuario.github.io/hackless-backend/
🚀 Aplicación:     https://hackless-backend-production.up.railway.app
📱 Código:         https://github.com/tu-usuario/hackless-backend
```

## 🎯 Estrategia Recomendada

1. **GitHub Pages**: Para documentación y presentación
2. **Railway**: Para la aplicación funcional
3. **GitHub**: Para código fuente y colaboración

Esta configuración te da:
- ✅ Aplicación completa funcionando (Railway)
- ✅ Documentación profesional (GitHub Pages)
- ✅ Código versionado y accesible (GitHub)
- ✅ URL presentable para evaluadores

## 📝 Comandos para Implementar

```bash
# 1. Agregar archivos de documentación
git add docs/
git add .github/

# 2. Commit con mensaje descriptivo
git commit -m "Agregar documentación GitHub Pages y workflow"

# 3. Subir a GitHub
git push origin main

# 4. Verificar en GitHub
# Settings > Pages > Configurar source como /docs
```

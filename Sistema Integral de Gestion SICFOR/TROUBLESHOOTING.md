# 🔧 Troubleshooting - Solución de Problemas

## ❌ La app no se abre

### Síntoma: Terminal muestra errores después de `npm run dev`

**Solución:**

```bash
# 1. Borra node_modules
rm -r node_modules          # Mac/Linux
rmdir /s /q node_modules    # Windows

# 2. Borra package-lock.json
rm package-lock.json        # Mac/Linux
del package-lock.json       # Windows

# 3. Reinstala
npm install

# 4. Intenta de nuevo
npm run dev
```

---

## ❌ Error: "Cannot find module 'vite'"

**Solución:**
```bash
npm install
npm run dev
```

---

## ❌ Error: "main.js not found"

**Verificar:**
1. Que exista el archivo `src/main.js`
2. Que `index.html` tenga: `<script type="module" src="/src/main.js"></script>`

**Si falta:**
```bash
# Recrear src/main.js
mkdir -p src/js
# Copiar contenido de la documentación
```

---

## ❌ Error: "Cannot read property 'getElementById' of null"

**Causa:** El DOM no está listo

**Solución:** El código ya lo maneja. Si persiste:
- Verifica que `index.html` tenga: `<div id="root"></div>`
- Que esté ANTES del script

---

## ❌ Los datos no se guardan

**Verificar:**
1. Que localStorage esté habilitado
2. Abre DevTools (F12) → Application → Local Storage

**Para habilitar:**
```javascript
// En la consola
localStorage.setItem('test', 'test');
localStorage.getItem('test'); // Debe retornar 'test'
```

---

## ❌ CSS no carga

**Verificar:**
1. Que `src/App.css` exista
2. Que esté importado en `src/main.js`:
   ```javascript
   import './App.css'
   ```
3. Abre DevTools (F12) → Network → Busca App.css

**Si falta:**
```bash
# Copia los estilos de CONVERSION_SUMMARY.md
# Y pega en src/App.css
```

---

## ❌ Botones no funcionan

**Verificar:**
1. Que `app.js` esté correctamente importado
2. Que los botones tengan `data-action`:
   ```html
   <button data-action="crear">Crear</button>
   ```

**Debug:**
```javascript
// En la consola
document.querySelectorAll('[data-action]').length
// Debe retornar número > 0
```

---

## ❌ Tabla no muestra tickets

**Causa:** No hay tickets o no se están renderizando

**Verificar:**
```javascript
// En consola
ticketStore.tickets           // Debe mostrar array
ticketStore.obtenerTicketsPorEstado('Abiertos') // Debe mostrar tickets
```

**Si está vacío:**
```javascript
// Crea un ticket de prueba
const ticket = ticketStore.crearTicket({
  asunto: 'Test',
  categoria: 'Técnico',
  prioridad: 'Alta',
  descripcion: 'Ticket de prueba'
});
console.log(ticket);
```

---

## ❌ La navegación no funciona

**Verificar:**
1. Abre DevTools (F12)
2. Consola: No debe haber errores rojos
3. Click en botón y verifica:
   ```javascript
   currentPage  // Debe cambiar
   ```

**Si no cambia:**
- Verifica que handleAction esté siendo llamado
- Que navigate(page) sea ejecutado

---

## ❌ Error: "ticketStore is not defined"

**Causa:** No está siendo importado correctamente

**Verificar en `src/js/app.js`:**
```javascript
import { ticketStore } from './ticketStore.js'  // ✅ Debe estar
```

---

## ❌ En móvil se ve roto

**Verificar:**
1. Viewport meta tag en `index.html`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. Que los media queries estén en `src/App.css`:
   ```css
   @media (max-width: 768px) { ... }
   ```

---

## ❌ Necesito ver los errores

**Abre DevTools (F12):**

1. **Console tab** - Errores JavaScript
2. **Network tab** - Cargas de archivos
3. **Application tab** → Local Storage - Datos guardados
4. **Elements tab** - HTML renderizado

---

## ❌ ¿Cómo resetear datos?

**En la consola del navegador:**
```javascript
localStorage.removeItem('sicfor-tickets');
location.reload();  // Recarga la página
```

---

## ❌ Build para producción no funciona

**Intenta:**
```bash
npm run build
npm run preview
```

**Si da error:**
```bash
# Borra dist
rm -r dist          # Mac/Linux
rmdir /s /q dist    # Windows

# Intenta de nuevo
npm run build
```

---

## ✅ Verificación rápida

Ejecuta esto en la consola y verifica todo retorne datos:

```javascript
// 1. Estado global
console.log('Tickets:', ticketStore.tickets);
console.log('Usuario:', ticketStore.currentUser);

// 2. Métodos disponibles
console.log('Métodos:', {
  crearTicket: typeof ticketStore.crearTicket,
  obtenerTicket: typeof ticketStore.obtenerTicket,
  actualizarTicket: typeof ticketStore.actualizarTicket,
  eliminarTicket: typeof ticketStore.eliminarTicket
});

// 3. Página actual
console.log('Página:', currentPage);

// 4. DOM
console.log('Root:', document.getElementById('root'));

// 5. localStorage
console.log('Datos guardados:', localStorage.getItem('sicfor-tickets'));
```

---

## 📞 Checklist de Debug

- [ ] `npm install` corrió sin errores
- [ ] `npm run dev` está ejecutándose
- [ ] http://localhost:3000 se abre
- [ ] DevTools no muestra errores rojos
- [ ] Tabla de tickets se ve
- [ ] Puedo crear un ticket
- [ ] Puedo ver el detalle
- [ ] Puedo editar
- [ ] Datos persisten en localStorage

---

## 🆘 Si nada funciona

**Opción 1: Reset completo**
```bash
# 1. Borra todo
rm -r node_modules package-lock.json dist

# 2. Reinstala
npm install

# 3. Ejecuta
npm run dev
```

**Opción 2: Verifica versión de Node**
```bash
node --version  # Debe ser 16+
npm --version   # Debe ser 7+
```

**Opción 3: Crea reporte de errores**
1. Screenshot de error
2. Resultado de `node --version`
3. Resultado de `npm --version`
4. Error exacto de consola

---

## 🎓 Comando útiles para debug

```bash
# Ver versiones
node --version
npm --version
npm list vite

# Ver qué hay en node_modules
ls node_modules | grep vite

# Ver si funciona npm
npm whoami

# Ver scripts disponibles
npm run

# Ver logs más detallados
npm run dev -- --debug

# Limpiar caché de npm
npm cache clean --force

# Auditar seguridad
npm audit

# Ver archivos que van a produción
npm run build -- --manifest
```

---

## 💡 Trucos útiles

**Para ver request en tiempo real:**
```bash
npm run dev -- --host 0.0.0.0
# Accede desde otro dispositivo: http://[tu-ip]:3000
```

**Para ver el build final:**
```bash
npm run build
npm run preview
# Se abre en http://localhost:4173
```

**Para ver dependencias en árbol:**
```bash
npm ls
```

---

## ❓ Preguntas comunes

**P: ¿Dónde pongo console.log para debug?**
R: En cualquier función JavaScript. Aparecerá en DevTools → Console

**P: ¿Cómo veo qué está pasando en ticketStore?**
R: 
```javascript
// En app.js, agrega al inicio de render()
console.log('Renderizando:', currentPage);
console.log('Tickets:', ticketStore.tickets);
```

**P: ¿Cómo sé si localStorage está funcionando?**
R:
```javascript
// En consola
localStorage.setItem('test', '123');
localStorage.getItem('test');  // Debe retornar '123'
```

---

## 📊 Información importante

- Node.js requerido: v16+
- npm requerido: v7+
- Navegadores soportados: Todos modernos (Chrome, Firefox, Safari, Edge)
- Tamaño build: ~50 KB

---

**Última actualización**: 29 Nov 2025
**Versión**: 1.0.0

¿Aún hay problemas? Revisa:
1. QUICKSTART.md - Pasos básicos
2. README_JS.md - Documentación completa
3. ARCHITECTURE.md - Entender el código

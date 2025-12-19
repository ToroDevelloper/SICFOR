# 🚀 GUÍA RÁPIDA - Mesa de Ayuda SICFOR

## En 3 pasos, tu app funcionará:

### 1️⃣ Instalar dependencias (solo Vite)
```bash
npm install
```

### 2️⃣ Ejecutar en desarrollo
```bash
npm run dev
```

### 3️⃣ ¡Listo! Se abrirá automáticamente en http://localhost:3000

---

## 📱 ¿Qué puedo hacer?

✅ **Crear Ticket** → Botón azul "+ CREAR TICKET DE SOPORTE"
✅ **Ver Detalles** → Click en cualquier ticket
✅ **Editar** → Button "Ver / Editar" en el ticket
✅ **Eliminar** → Icon 🗑️ en la tabla
✅ **Responder** → En la sección de historial
✅ **Cerrar Ticket** → Button rojo "CERRAR TICKET"

---

## 🗂️ Estructura simplificada

```
src/
├── js/
│   ├── ticketStore.js   ← Datos y lógica
│   ├── views.js         ← HTML generado
│   └── app.js           ← Navegación y eventos
├── App.css              ← Todos los estilos
└── main.js              ← Punto de entrada
```

---

## 💾 ¿Dónde se guardan los datos?

En **localStorage** del navegador
- Abre DevTools (F12) → Application → Local Storage
- Busca: `sicfor-tickets`
- Persiste entre recargas ✅

---

## 🎨 ¿Cómo cambiar estilos?

Todos en `src/App.css`

Busca variables CSS al inicio:
```css
:root {
  --color-primary: #2563eb;  ← Color principal
  --shadow-md: 0 4px 6px;    ← Sombras
  --radius-lg: 0.75rem;      ← Bordes redondeados
}
```

---

## 🔧 Comandos principales

```bash
npm run dev      # Desarrollo (hot-reload)
npm run build    # Build optimizado
npm run preview  # Ver build de producción
```

---

## 📱 Funciona en:
- ✅ Desktop
- ✅ Tablet
- ✅ Móvil (responsive)

---

## ❓ Preguntas frecuentes

**P: ¿Dónde está React?**
R: ¡No está! Todo es JavaScript puro. Mucho más rápido 🚀

**P: ¿Se pierden los datos?**
R: No, están en localStorage. Se mantienen entre sesiones.

**P: ¿Puedo personalizarlo?**
R: ¡Claro! Todo es JavaScript vanilla. Modifica como necesites.

**P: ¿Cómo agrego más funciones?**
R: Edita los archivos en `src/js/` siguiendo el patrón existente.

---

## 🆘 Solución de problemas

**Si no funciona:**
1. Verifica que Node.js esté instalado: `node --version`
2. Borra `node_modules` y reinstala: `rm -r node_modules && npm install`
3. Limpia la caché: `npm cache clean --force`
4. Intenta de nuevo: `npm run dev`

**Si ves errores en consola:**
1. Abre DevTools (F12)
2. Ve a Console
3. Busca el error rojo
4. Revisa los archivos en `src/js/`

---

## 📞 Duda sobre el código?

Los archivos principales:
- `src/js/ticketStore.js` - ¿Cómo se guardan datos?
- `src/js/views.js` - ¿Cómo se ve cada página?
- `src/js/app.js` - ¿Cómo funciona la navegación?

---

**¡Ya estás listo para empezar! 🎉**

Lee `README_JS.md` para más detalles.
Lee `CONVERSION_SUMMARY.md` para entender la conversión.

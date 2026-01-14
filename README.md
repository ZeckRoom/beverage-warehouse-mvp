# 🍺 Beverage Warehouse MVP

Webapp de gestión de inventario para almacén de bebidas con funcionalidad de gemelo digital y **escáner de códigos de barras nativo**.

## 🚀 Características

- **Inventario en tiempo real**: Visualiza todos los productos del almacén
- **Registro de cambios**: Historial completo de movimientos
- **📸 Escáner de productos**: Añade/elimina productos escaneando códigos de barras **con la cámara**
  - Usa la **Barcode Detection API nativa** (sin librerías pesadas)
  - Soporta EAN-13, EAN-8, UPC, Code-128, QR
  - Escaneo continuo en tiempo real
  - Feedback haptic y sonoro
- **Estadísticas**: Visualiza métricas y análisis del inventario
- **Ajustes**: Configuración de la aplicación

## 📱 Compatibilidad del Escáner

✅ **Chrome/Edge en Android** (totalmente funcional)  
⚠️ **Safari iOS** (usa entrada manual o foto)  
🔧 **Chrome Desktop** (habilitar flag experimental)

[📖 Ver guía completa del escáner](./SCANNER.md)

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Deploy**: Vercel
- **Scanner**: Barcode Detection API (nativa del navegador)

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/ZeckRoom/beverage-warehouse-mvp.git
cd beverage-warehouse-mvp

# Instalar dependencias
npm install

# Configurar Firebase
# 1. Crear proyecto en Firebase Console
# 2. Copiar credenciales en src/lib/firebase.js

# Iniciar desarrollo
npm run dev
```

## 🔧 Configuración Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Activa Firestore Database
4. Activa Authentication (opcional)
5. Copia las credenciales a `src/lib/firebase.js`

[📖 Ver guía detallada de despliegue](./DEPLOY.md)

## 📱 Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

O conecta el repositorio directamente desde [vercel.com](https://vercel.com)

## 🗂️ Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn
│   ├── Inventory.jsx    # Vista de inventario
│   ├── Changes.jsx      # Historial de cambios
│   ├── Scanner.jsx      # Escáner de productos 🔥
│   ├── BarcodeCamera.jsx # Componente de cámara
│   ├── Stats.jsx        # Estadísticas
│   └── Settings.jsx     # Ajustes
├── hooks/
│   └── useBarcodeDetector.js # Hook para Barcode Detection API
├── lib/
│   ├── firebase.js      # Configuración Firebase
│   └── utils.js         # Utilidades
├── App.jsx              # Componente principal
└── main.jsx             # Punto de entrada
```

## 📝 Modelo de Datos (Firestore)

### Colección: `products`
```javascript
{
  id: string,
  name: string,
  barcode: string,           // EAN-13, UPC, etc.
  quantity: number,
  category: string,
  unit: string,              // 'botella', 'caja', 'paquete'
  minStock: number,
  lastUpdated: timestamp,
  updatedBy: string
}
```

### Colección: `changes`
```javascript
{
  id: string,
  productId: string,
  productName: string,
  type: string,              // 'add' | 'remove' | 'update'
  quantity: number,
  previousQuantity: number,
  newQuantity: number,
  timestamp: timestamp,
  user: string
}
```

## 📸 Uso del Escáner

### 1️⃣ Con Cámara (Recomendado)

1. Toca el botón central "Escanear"
2. Haz clic en "Cámara"
3. Permite el acceso a la cámara
4. Apunta al código de barras
5. ¡Se detecta automáticamente!

### 2️⃣ Entrada Manual

1. Escribe el código en el campo de texto
2. Pulsa Enter o "Buscar"

### 3️⃣ Desde Foto

1. Haz clic en el botón de imagen
2. Selecciona una foto con código de barras

## 🐞 Troubleshooting

### Escáner no disponible
- Usa Chrome o Edge en Android
- En desktop, habilita: `chrome://flags` → "Experimental Web Platform features"

### Error de permisos de cámara
- Configuración del navegador → Permisos del sitio → Cámara

### Firestore: Permission denied
- Revisa las reglas de Firestore
- Para desarrollo: `allow read, write: if true;`

## 🎨 Personalización

Modifica los colores en `src/index.css` cambiando las variables CSS:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Color principal */
  --secondary: 210 40% 96.1%;    /* Color secundario */
}
```

## 📚 Documentación Adicional

- [📸 SCANNER.md](./SCANNER.md) - Guía completa del escáner
- [🚀 DEPLOY.md](./DEPLOY.md) - Guía de despliegue paso a paso

## 🚀 Próximos Pasos

- [x] ✅ Escáner de cámara con Barcode Detection API
- [ ] 🔒 Autenticación de usuarios con Firebase Auth
- [ ] 📥 PWA con service worker para uso offline
- [ ] 🔔 Notificaciones push con FCM
- [ ] 📈 Gráficos de estadísticas
- [ ] 👥 Sistema de roles (admin/repartidor)
- [ ] 🔍 Búsqueda avanzada con filtros
- [ ] 📷 Fotos de productos
- [ ] 📦 Gestión de categorías
- [ ] 📊 Exportar datos a Excel/CSV

## 👏 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ para optimizar la gestión de almacenes de bebidas**

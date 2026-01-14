# 🍺 Beverage Warehouse MVP

Webapp de gestión de inventario para almacén de bebidas con funcionalidad de gemelo digital y diseño **Material Design 3**.

![Material Design](https://img.shields.io/badge/Material%20Design%203-1976D2?style=for-the-badge&logo=material-design&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🚀 Características

- **✨ Material Design 3**: Diseño moderno siguiendo las guías de Google
- **📦 Inventario en tiempo real**: Visualiza todos los productos del almacén
- **📜 Registro de cambios**: Historial completo de movimientos
- **📸 Escáner nativo**: Usa la **Barcode Detection API** del navegador (sin librerías externas)
- **📊 Estadísticas**: Visualiza métricas y análisis del inventario
- **⚙️ Ajustes**: Configuración de la aplicación
- **📱 Mobile-First**: Optimizado para dispositivos móviles

## 🎨 Diseño Material

La aplicación implementa Material Design 3 con:
- **Colores Material**: Paleta de colores oficial de Google
- **Elevaciones**: Sombras Material (shadow-material-1 a shadow-material-5)
- **Tipografía Roboto**: Sistema de tipos Material
- **Componentes Material**: Cards, buttons, inputs con estilos Material
- **Ripple effects**: Efectos de onda al hacer clic
- **Bottom Navigation**: Navegación inferior estilo Material

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **UI**: Material Design 3 + Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Deploy**: Vercel
- **Scanner**: Barcode Detection API (nativo del navegador)
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📸 Escáner de Códigos de Barras

### Barcode Detection API
La app usa la **Barcode Detection API nativa del navegador**, sin necesidad de librerías de terceros.

**Ventajas:**
- ✅ Sin dependencias externas
- ✅ Más rápido y ligero
- ✅ Menor consumo de batería
- ✅ Integración directa con la cámara

**Compatibilidad:**
- ✅ Chrome/Edge Android
- ✅ Chrome/Edge Desktop (con flag experimental)
- ⚠️ Safari/iOS (en desarrollo)

**Formatos soportados:**
- EAN-13, EAN-8
- UPC-A, UPC-E
- Code 128, Code 39
- Y más...

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

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

## 📱 Deploy en Vercel

### Opción 1: Desde la web
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `beverage-warehouse-mvp`
4. Deploy automático ✨

### Opción 2: CLI
```bash
npm i -g vercel
vercel login
vercel
```

## 🗂️ Estructura del Proyecto

```
src/
├── components/
│   ├── Inventory.jsx    # Vista de inventario con Material Cards
│   ├── Changes.jsx      # Historial con Material Timeline
│   ├── Scanner.jsx      # Escáner con Barcode Detection API
│   ├── Stats.jsx        # Estadísticas con Material Charts
│   └── Settings.jsx     # Ajustes con Material Switches
├── lib/
│   ├── firebase.js      # Configuración Firebase
│   └── utils.js         # Utilidades (cn, formatDate)
├── App.jsx              # App principal con Bottom Navigation
├── main.jsx             # Punto de entrada
└── index.css            # Estilos Material Design 3
```

## 📊 Modelo de Datos (Firestore)

### Colección: `products`
```javascript
{
  id: string,
  name: string,
  barcode: string,
  quantity: number,
  category: string,
  unit: string, // 'botella', 'caja', 'paquete'
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
  type: string, // 'add' | 'remove' | 'update'
  quantity: number,
  previousQuantity: number,
  newQuantity: number,
  timestamp: timestamp,
  user: string
}
```

## 🎨 Personalización de Colores Material

Modifica los colores en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#1976D2', // Cambia el color principal
    50: '#E3F2FD',
    // ...
  },
}
```

O usa las variables CSS en `src/index.css`.

## 📱 Uso del Escáner

1. Abre la app en un navegador compatible (Chrome Android recomendado)
2. Ve a la pestaña "Escanear" (botón central)
3. Haz clic en "Cámara"
4. Permite el acceso a la cámara
5. Apunta al código de barras
6. ¡Detección automática! ✨

**Nota**: Si tu navegador no soporta la API, usa la entrada manual.

## 🔍 Testing del Escáner

### En Chrome Android:
```bash
# Accede desde tu móvil
https://tu-app.vercel.app
```

### En Chrome Desktop (experimental):
1. Ve a `chrome://flags`
2. Busca "Experimental Web Platform features"
3. Activa el flag
4. Reinicia Chrome

## 🚀 Roadmap

- [x] Material Design 3
- [x] Barcode Detection API
- [x] Bottom Navigation
- [x] Firebase Firestore
- [ ] Firebase Authentication
- [ ] PWA (Service Worker)
- [ ] Offline Mode
- [ ] Push Notifications
- [ ] Multi-usuario con roles
- [ ] Exportar a Excel/PDF
- [ ] Gráficos avanzados

## 📚 Recursos

- [Material Design 3](https://m3.material.io/)
- [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev/)

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ usando Material Design 3**

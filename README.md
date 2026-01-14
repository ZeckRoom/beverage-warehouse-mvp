# 🍺 Beverage Warehouse MVP

Webapp de gestión de inventario para almacén de bebidas con funcionalidad de gemelo digital.

## 🚀 Características

- **Inventario en tiempo real**: Visualiza todos los productos del almacén
- **Registro de cambios**: Historial completo de movimientos
- **Escáner de productos**: Añade/elimina productos escaneando códigos de barras
- **Estadísticas**: Visualiza métricas y análisis del inventario
- **Ajustes**: Configuración de la aplicación

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Deploy**: Vercel
- **Scanner**: Barcode Detection API / ZXing

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
│   ├── ui/           # Componentes shadcn
│   ├── Inventory.jsx # Vista de inventario
│   ├── Changes.jsx   # Historial de cambios
│   ├── Scanner.jsx   # Escáner de productos
│   ├── Stats.jsx     # Estadísticas
│   └── Settings.jsx  # Ajustes
├── lib/
│   └── firebase.js   # Configuración Firebase
├── App.jsx           # Componente principal
└── main.jsx          # Punto de entrada
```

## 📝 Modelo de Datos (Firestore)

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

## 🎨 Personalización

Modifica los colores en `src/index.css` cambiando las variables CSS:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Color principal */
  --secondary: 210 40% 96.1%;    /* Color secundario */
}
```

## 📄 Licencia

MIT

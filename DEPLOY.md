# 🚀 Guía de Despliegue

## Paso 1: Configurar Firebase

### 1.1 Crear proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre: `beverage-warehouse-mvp`
4. Acepta los términos y crea el proyecto

### 1.2 Configurar Firestore
1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona **Modo de producción** (por ahora)
4. Elige la ubicación: **europe-west** (más cercano a España)

### 1.3 Configurar reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura a todos (solo para desarrollo)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE**: En producción, configura reglas de seguridad adecuadas.

### 1.4 Obtener credenciales
1. Ve a **Configuración del proyecto** (⛙️ icono al lado del nombre)
2. Scroll down hasta "Tus apps"
3. Haz clic en el icono `</>`  (Web)
4. Registra la app: `beverage-warehouse-web`
5. Copia las credenciales que aparecen

### 1.5 Configurar credenciales en el proyecto
Edita `src/lib/firebase.js` y reemplaza los valores:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "beverage-warehouse-mvp.firebaseapp.com",
  projectId: "beverage-warehouse-mvp",
  storageBucket: "beverage-warehouse-mvp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## Paso 2: Desplegar en Vercel

### 2.1 Desde la interfaz web (Más fácil)

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"Add New..." → "Project"**
4. Importa el repositorio `beverage-warehouse-mvp`
5. Configura:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Environment Variables** (opcional por ahora):
   - Puedes añadir las variables de Firebase aquí si quieres
7. Haz clic en **"Deploy"**

### 2.2 Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer login
vercel login

# Desplegar (desde el directorio del proyecto)
vercel

# Seguir las instrucciones:
# - Set up and deploy? Yes
# - Which scope? (tu cuenta)
# - Link to existing project? No
# - Project name? beverage-warehouse-mvp
# - In which directory? ./
# - Want to override settings? No
```

### 2.3 Configurar dominio (Opcional)
1. En el dashboard de Vercel, ve a tu proyecto
2. Ve a **Settings → Domains**
3. Añade un dominio personalizado si tienes uno

---

## Paso 3: Crear datos de prueba en Firestore

### 3.1 Manualmente desde Firebase Console

1. Ve a **Firestore Database**
2. Crea una colección `products`
3. Añade documentos de ejemplo:

**Documento 1:**
```json
{
  "name": "Coca-Cola 2L",
  "barcode": "8410052000010",
  "quantity": 50,
  "category": "Refrescos",
  "unit": "botella",
  "minStock": 20,
  "lastUpdated": [Firebase Timestamp - Now],
  "updatedBy": "Sistema"
}
```

**Documento 2:**
```json
{
  "name": "Agua Mineral 1.5L",
  "barcode": "8410199001234",
  "quantity": 100,
  "category": "Agua",
  "unit": "botella",
  "minStock": 30,
  "lastUpdated": [Firebase Timestamp - Now],
  "updatedBy": "Sistema"
}
```

**Documento 3:**
```json
{
  "name": "Cerveza Estrella Pack 6",
  "barcode": "8410793000124",
  "quantity": 15,
  "category": "Cerveza",
  "unit": "pack",
  "minStock": 10,
  "lastUpdated": [Firebase Timestamp - Now],
  "updatedBy": "Sistema"
}
```

4. Crea otra colección `changes` (puede estar vacía por ahora)

---

## Paso 4: Probar la aplicación
1. Abre la URL de Vercel en tu móvil
2. Prueba las 5 secciones del navbar
3. Intenta escanear un producto (usa entrada manual por ahora)
4. Añade/quita stock
5. Verifica que los cambios se reflejen en Firebase

---

## 🔧 Desarrollo local

```bash
# Clonar repo
git clone https://github.com/ZeckRoom/beverage-warehouse-mvp.git
cd beverage-warehouse-mvp

# Instalar dependencias
npm install

# Configurar Firebase (ver arriba)
# Editar src/lib/firebase.js

# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:5173
```

---

## 📱 Testing en móvil

### Opción 1: Desde la red local
```bash
npm run dev -- --host
# La terminal mostrará una URL tipo: http://192.168.1.X:5173
# Ábrela desde tu móvil (misma red WiFi)
```

### Opción 2: Desde Vercel
- Usa la URL de producción directamente
- Añade a la pantalla de inicio para experiencia PWA-like

---

## ✅ Checklist de despliegue

- [ ] Proyecto Firebase creado
- [ ] Firestore activado con reglas configuradas
- [ ] Credenciales de Firebase en `src/lib/firebase.js`
- [ ] Proyecto conectado con Vercel
- [ ] Primera deployment exitosa
- [ ] Datos de prueba en Firestore
- [ ] App probada desde móvil
- [ ] Todas las 5 secciones funcionan correctamente

---

## 🐞 Troubleshooting

### Error: Firebase not configured
- Verifica que las credenciales en `firebase.js` sean correctas
- Asegúrate de que el proyecto Firebase esté activo

### Error: Permission denied
- Revisa las reglas de Firestore
- Para desarrollo, usa `allow read, write: if true;`

### Build falla en Vercel
- Verifica que `package.json` tenga todas las dependencias
- Revisa los logs de build en el dashboard de Vercel

### App no funciona en móvil
- Abre las DevTools del navegador móvil
- Verifica que no haya errores de CORS
- Asegúrate de usar HTTPS (Vercel lo provee automáticamente)

---

## 🚀 Próximos pasos

1. **Autenticación**: Implementar Firebase Auth para usuarios
2. **Scanner de cámara**: Integrar Barcode Detection API o ZXing
3. **PWA**: Añadir manifest.json y service worker
4. **Offline**: Implementar Firestore offline persistence
5. **Notificaciones**: Añadir Firebase Cloud Messaging
6. **Roles**: Sistema de permisos para repartidores/administradores

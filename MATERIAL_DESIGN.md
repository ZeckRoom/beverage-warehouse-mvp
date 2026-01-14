# 🎨 Material Design 3 - Guía de Implementación

Esta aplicación implementa completamente **Material Design 3**, el sistema de diseño de Google.

## 🎯 Principios Material Design Implementados

### 1. **Color System**
Paleta de colores Material Design 3:

```javascript
// Primary (Azul Material)
primary-700: #1976D2  // Color principal
primary-600: #1E88E5
primary-500: #2196F3
primary-50:  #E3F2FD  // Tintes claros

// Secondary (Cyan)
secondary-700: #0097A7
secondary-600: #00ACC1

// System Colors
success: #4CAF50  // Verde
error:   #F44336  // Rojo
warning: #FF9800  // Naranja
```

### 2. **Elevation (Sombras Material)**

La app usa el sistema de elevaciones Material:

```css
shadow-material-1: /* Elevación baja - Cards en reposo */
shadow-material-2: /* Elevación media - Cards hover */
shadow-material-3: /* Elevación alta - Botones activos */
shadow-material-4: /* Elevación muy alta - Bottom Nav */
shadow-material-5: /* Elevación máxima - FAB hover */
```

**Dónde se usan:**
- `shadow-material-1`: Cards de productos, stats
- `shadow-material-2`: Cards en hover, inputs focus
- `shadow-material-3`: Botones pressed
- `shadow-material-4`: Bottom Navigation, Dialogs
- `shadow-material-5`: FAB Escanear en hover

### 3. **Tipografía**

Sistema de tipos Material:

```css
Font Family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI'

H1: text-2xl font-normal    /* 24px, 400 */
H2: text-xl font-medium     /* 20px, 500 */
H3: text-lg font-medium     /* 18px, 500 */
Body: text-base font-normal /* 16px, 400 */
Caption: text-sm           /* 14px */
```

### 4. **Border Radius Material**

```css
rounded-material:     4px  /* Inputs, chips */
rounded-material-lg:  8px  /* Cards pequeñas */
rounded-material-xl:  16px /* Cards grandes */
rounded-material-2xl: 28px /* Search bar */
```

### 5. **Componentes Material**

#### 📦 Cards
```jsx
<div className="card-material p-4">
  {/* Contenido */}
</div>
```
- Fondo blanco
- Sombra `shadow-material-1`
- Hover: `shadow-material-2`
- Bordes redondeados
- Transición suave

#### 🔘 Buttons

**Filled Button (Principal):**
```jsx
<button className="btn-material btn-filled ripple">
  Añadir
</button>
```

**Tonal Button:**
```jsx
<button className="bg-surface-variant hover:bg-gray-300 ripple">
  Cancelar
</button>
```

#### 📝 Inputs
```jsx
<input className="input-material" />
```
- Fondo `surface-variant`
- Sin bordes
- Focus ring en `primary-700`
- Padding generoso (touch-friendly)

#### 🔘 Switches (Toggle)
```jsx
<button className="inline-flex h-6 w-11 items-center rounded-full">
  <span className="h-5 w-5 rounded-full bg-white shadow-material-2" />
</button>
```

### 6. **Bottom Navigation**

Implementación Material:

```jsx
<nav className="fixed bottom-0 bg-white shadow-material-4">
  <button className={activeView === 'inventory' ? 'text-primary-700' : 'text-gray-600'}>
    <Icon className="w-6 h-6" />
    <span>Label</span>
    {active && <div className="w-16 h-1 bg-primary-700" />}
  </button>
</nav>
```

**Características:**
- Sombra elevada (`shadow-material-4`)
- Iconos 24dp (6 en Tailwind)
- Indicador activo (barra azul)
- Ripple effect en tap
- FAB central elevado

### 7. **Floating Action Button (FAB)**

Botón de escanear:

```jsx
<button className="bg-primary-700 rounded-full p-4 shadow-material-4 -mt-8">
  <ScanBarcode className="w-7 h-7 text-white" />
</button>
```

**Propiedades:**
- Circular
- Elevado (`-mt-8`)
- Sombra prominente
- Hover: `shadow-material-5`
- Tamaño 56dp (14 en Tailwind)

### 8. **Top App Bar**

```jsx
<header className="bg-primary-700 text-white shadow-material-2 sticky top-0">
  <h1 className="text-xl font-medium">Título</h1>
</header>
```

- Altura 64dp (16 en Tailwind)
- Sticky al scroll
- Sombra al hacer scroll

### 9. **Ripple Effect**

Efecto de onda Material:

```css
.ripple:focus:not(:active)::after {
  animation: ripple 0.6s ease-out;
}
```

Aplicado a:
- Todos los botones
- Items de navegación
- Cards interactivas
- List items

### 10. **Estados Interactivos**

**Hover:**
```css
hover:shadow-material-2  /* Cards */
hover:bg-primary-800    /* Buttons */
hover:bg-gray-300       /* Inputs */
```

**Focus:**
```css
focus:outline-none
focus:ring-2
focus:ring-primary-700
```

**Active/Pressed:**
```css
active:shadow-material-1
```

## 📱 Mobile-First

Implementaciones mobile:

1. **Touch Targets**: Mínimo 48x48px (12x12 en Tailwind)
2. **Bottom Navigation**: Fácil alcance del pulgar
3. **FAB posicionado**: Zona natural del pulgar
4. **Inputs grandes**: 48px de altura
5. **Spacing generoso**: Evita taps accidentales

## 🎨 Paleta de Colores Completa

### Primary (Blue)
```
50:  #E3F2FD
100: #BBDEFB
200: #90CAF9
300: #64B5F6
400: #42A5F5
500: #2196F3
600: #1E88E5
700: #1976D2 ⭐ Principal
800: #1565C0
900: #0D47A1
```

### Secondary (Cyan)
```
50:  #E0F7FA
100: #B2EBF2
200: #80DEEA
300: #4DD0E1
400: #26C6DA
500: #00BCD4
600: #00ACC1
700: #0097A7 ⭐ Principal
800: #00838F
900: #006064
```

### Success (Green)
```
light: #81C784
DEFAULT: #4CAF50
dark: #388E3C
```

### Error (Red)
```
light: #E57373
DEFAULT: #F44336
dark: #D32F2F
```

### Warning (Orange)
```
light: #FFB74D
DEFAULT: #FF9800
dark: #F57C00
```

### Surface
```
DEFAULT: #FFFFFF (blanco puro)
variant: #F5F5F5 (gris muy claro)
container: #FAFAFA (fondo de la app)
```

## 📐 Iconografía

- **Librería**: Lucide React (compatible con Material Icons)
- **Tamaño**: 24dp (w-6 h-6) para navegación
- **Tamaño**: 20dp (w-5 h-5) para inline
- **Estilo**: Outlined (predeterminado Material 3)

## 🖌️ Spacing System

Sistema de espaciado Material (8dp grid):

```
p-2:  8px
p-3:  12px
p-4:  16px ⭐ Padding principal de cards
p-5:  20px
p-6:  24px
gap-3: 12px ⭐ Gap entre elementos
gap-4: 16px
```

## ✅ Checklist Material Design 3

- [x] Color system implementado
- [x] Elevaciones (sombras) correctas
- [x] Tipografía Roboto
- [x] Border radius Material
- [x] Cards con elevación
- [x] Buttons con estados
- [x] Inputs Material
- [x] Bottom Navigation
- [x] FAB circular elevado
- [x] Top App Bar
- [x] Ripple effects
- [x] Touch targets 48px+
- [x] Spacing 8dp grid
- [x] Iconos 24dp
- [x] Estados hover/focus/active
- [x] Transiciones suaves
- [x] Mobile-first

## 📚 Referencias

- [Material Design 3](https://m3.material.io/)
- [Material Color System](https://m3.material.io/styles/color/overview)
- [Material Typography](https://m3.material.io/styles/typography/overview)
- [Material Components](https://m3.material.io/components)
- [Material Elevation](https://m3.material.io/styles/elevation/overview)

---

**✨ Diseño 100% Material Design 3 por Google**

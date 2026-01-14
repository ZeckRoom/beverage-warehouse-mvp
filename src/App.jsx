import { useState } from 'react'
import { Package, History, ScanBarcode, BarChart3, Settings } from 'lucide-react'
import Inventory from './components/Inventory'
import Changes from './components/Changes'
import Scanner from './components/Scanner'
import Stats from './components/Stats'
import SettingsView from './components/Settings'
import { Toaster } from 'sonner'

function App() {
  const [activeView, setActiveView] = useState('inventory')

  const renderView = () => {
    switch (activeView) {
      case 'inventory':
        return <Inventory />
      case 'changes':
        return <Changes />
      case 'scanner':
        return <Scanner />
      case 'stats':
        return <Stats />
      case 'settings':
        return <SettingsView />
      default:
        return <Inventory />
    }
  }

  const navItems = [
    { id: 'inventory', icon: Package, label: 'Inventario' },
    { id: 'changes', icon: History, label: 'Cambios' },
    { id: 'scanner', icon: ScanBarcode, label: 'Escanear' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ]

  return (
    <div className="flex flex-col h-screen bg-[rgb(var(--md-sys-color-background))]">
      {/* Material Top App Bar */}
      <header className="bg-[rgb(var(--md-sys-color-primary))] text-[rgb(var(--md-sys-color-on-primary))] elevation-2 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-medium tracking-wide">Inventario Almacén</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-screen-lg mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Material Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[rgb(var(--md-sys-color-surface))] elevation-3 z-20">
        <div className="flex items-center justify-around max-w-screen-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            const isScanner = item.id === 'scanner'

            if (isScanner) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className="relative flex flex-col items-center justify-center p-2 -mt-8 ripple-effect"
                >
                  <div className="bg-[rgb(var(--md-sys-color-primary-container))] rounded-2xl p-4 elevation-3 hover:elevation-4 transition-all duration-200">
                    <Icon className="w-8 h-8 text-[rgb(var(--md-sys-color-on-primary-container))]" />
                  </div>
                  <span className="text-xs mt-2 font-medium text-[rgb(var(--md-sys-color-on-surface))]">
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center py-3 px-4 min-w-[64px] transition-all duration-200 ripple-effect rounded-xl ${
                  isActive 
                    ? 'text-[rgb(var(--md-sys-color-on-surface))]' 
                    : 'text-[rgb(var(--md-sys-color-on-surface-variant))]'
                }`}
              >
                <div className={`transition-all duration-200 rounded-full p-1 ${
                  isActive ? 'bg-[rgb(var(--md-sys-color-secondary-container))]' : ''
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App

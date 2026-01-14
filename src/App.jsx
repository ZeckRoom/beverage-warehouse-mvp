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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold">Inventario Almacén</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            const isScanner = item.id === 'scanner'

            if (isScanner) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className="relative flex flex-col items-center justify-center p-2 -mt-8"
                >
                  <div className="bg-primary rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-700">
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center p-3 transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
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

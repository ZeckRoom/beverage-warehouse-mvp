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
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-mesh -z-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />
      
      {/* Header with glassmorphism */}
      <header className="glass-dark shadow-lg relative z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Inventario Almacén
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 font-medium">Gestión en tiempo real</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 relative z-0">
        {renderView()}
      </main>

      {/* Bottom Navigation with glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/40 shadow-2xl z-20">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            const isScanner = item.id === 'scanner'

            if (isScanner) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className="relative flex flex-col items-center justify-center p-2 -mt-10 group"
                >
                  <div className="gradient-primary rounded-full p-5 shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Icon className="w-7 h-7 text-white relative z-10" />
                  </div>
                  <span className="text-xs mt-2 font-semibold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center p-3 transition-all duration-200 rounded-xl ${
                  isActive 
                    ? 'text-indigo-600 scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                }`}
              >
                <Icon className={`w-6 h-6 transition-transform duration-200 ${
                  isActive ? 'animate-pulse-soft' : ''
                }`} />
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      <Toaster 
        position="top-center" 
        richColors 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
        }}
      />
    </div>
  )
}

export default App

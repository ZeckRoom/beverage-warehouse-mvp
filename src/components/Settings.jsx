import { useState } from 'react'
import { User, Bell, Database, LogOut, Info, Palette } from 'lucide-react'
import { toast } from 'sonner'

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [lowStockAlert, setLowStockAlert] = useState(true)

  const handleSync = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Sincronizando...',
        success: 'Datos sincronizados correctamente',
        error: 'Error al sincronizar'
      }
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="glass-card rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Ajustes
        </h2>
        <p className="text-sm text-gray-600 font-medium">Configuración de la aplicación</p>
      </div>

      <div className="space-y-3">
        {/* User Section */}
        <div className="glass-card rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Usuario
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                R
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Repartidor</p>
                <p className="text-sm text-gray-600 font-medium">repartidor@almacen.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-900">Notificaciones push</p>
                <p className="text-xs text-gray-600 mt-0.5 font-medium">Recibe alertas de la app</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors shadow-inner ${
                  notifications ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                    notifications ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-white/30 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-900">Alertas de stock bajo</p>
                <p className="text-xs text-gray-600 mt-0.5 font-medium">Aviso cuando el stock es bajo</p>
              </div>
              <button
                onClick={() => setLowStockAlert(!lowStockAlert)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors shadow-inner ${
                  lowStockAlert ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                    lowStockAlert ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Datos
            </h3>
          </div>
          <div className="p-6">
            <button
              onClick={handleSync}
              className="w-full gradient-primary text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5" />
              Sincronizar ahora
            </button>
            <p className="text-xs text-gray-600 mt-3 text-center font-medium">
              Última sincronización: hace 5 minutos
            </p>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-card rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Apariencia
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-2">
              <button className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold hover:shadow-lg transition-all">
                Morado
              </button>
              <button className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs font-bold hover:shadow-lg transition-all">
                Azul
              </button>
              <button className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs font-bold hover:shadow-lg transition-all">
                Rosa
              </button>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="glass-card rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5" />
              Información
            </h3>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Versión</span>
              <span className="font-bold text-gray-900 px-3 py-1 bg-white/50 rounded-lg">1.0.0 (MVP)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Última actualización</span>
              <span className="font-bold text-gray-900 px-3 py-1 bg-white/50 rounded-lg">14/01/2026</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => toast.info('Función de cerrar sesión en desarrollo')}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

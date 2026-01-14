import { useState } from 'react'
import { User, Bell, Database, LogOut, Info } from 'lucide-react'
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
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Ajustes</h2>
        <p className="text-sm text-gray-500 mt-1">Configuración de la aplicación</p>
      </div>

      <div className="space-y-3">
        {/* User Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Usuario
            </h3>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                R
              </div>
              <div>
                <p className="font-medium text-gray-900">Repartidor</p>
                <p className="text-sm text-gray-500">repartidor@almacen.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Notificaciones push</p>
                <p className="text-xs text-gray-500 mt-0.5">Recibe alertas de la app</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Alertas de stock bajo</p>
                <p className="text-xs text-gray-500 mt-0.5">Aviso cuando el stock es bajo</p>
              </div>
              <button
                onClick={() => setLowStockAlert(!lowStockAlert)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  lowStockAlert ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    lowStockAlert ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Datos
            </h3>
          </div>
          <div className="p-4">
            <button
              onClick={handleSync}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Sincronizar ahora
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Última sincronización: hace 5 minutos
            </p>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Información
            </h3>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Versión</span>
              <span className="font-medium text-gray-900">1.0.0 (MVP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Última actualización</span>
              <span className="font-medium text-gray-900">14/01/2026</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => toast.info('Función de cerrar sesión en desarrollo')}
          className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

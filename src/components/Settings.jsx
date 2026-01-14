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
        <h2 className="text-xl font-medium text-gray-900">Ajustes</h2>
        <p className="text-sm text-gray-600 mt-1">Configuración de la aplicación</p>
      </div>

      <div className="space-y-4">
        {/* User Section */}
        <div className="card-material overflow-hidden">
          <div className="p-4 bg-primary-50">
            <h3 className="font-medium text-gray-900 flex items-center gap-2 text-base">
              <User className="w-5 h-5" />
              Usuario
            </h3>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-700 text-white flex items-center justify-center text-xl font-medium shadow-material-2">
                R
              </div>
              <div>
                <p className="font-medium text-gray-900 text-base">Repartidor</p>
                <p className="text-sm text-gray-600">repartidor@almacen.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-material overflow-hidden">
          <div className="p-4 bg-primary-50">
            <h3 className="font-medium text-gray-900 flex items-center gap-2 text-base">
              <Bell className="w-5 h-5" />
              Notificaciones
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Notificaciones push</p>
                <p className="text-xs text-gray-600 mt-1">Recibe alertas de la app</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-inner ${
                  notifications ? 'bg-primary-700' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-material-2 transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Alertas de stock bajo</p>
                <p className="text-xs text-gray-600 mt-1">Aviso cuando el stock es bajo</p>
              </div>
              <button
                onClick={() => setLowStockAlert(!lowStockAlert)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-inner ${
                  lowStockAlert ? 'bg-primary-700' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-material-2 transition-transform ${
                    lowStockAlert ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card-material overflow-hidden">
          <div className="p-4 bg-primary-50">
            <h3 className="font-medium text-gray-900 flex items-center gap-2 text-base">
              <Database className="w-5 h-5" />
              Datos
            </h3>
          </div>
          <div className="p-5">
            <button
              onClick={handleSync}
              className="w-full btn-material btn-filled ripple"
            >
              Sincronizar ahora
            </button>
            <p className="text-xs text-gray-600 mt-3 text-center">
              Última sincronización: hace 5 minutos
            </p>
          </div>
        </div>

        {/* App Info */}
        <div className="card-material overflow-hidden">
          <div className="p-4 bg-primary-50">
            <h3 className="font-medium text-gray-900 flex items-center gap-2 text-base">
              <Info className="w-5 h-5" />
              Información
            </h3>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Versión</span>
              <span className="font-medium text-gray-900">1.0.0 (MVP)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Última actualización</span>
              <span className="font-medium text-gray-900">14/01/2026</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => toast.info('Función de cerrar sesión en desarrollo')}
          className="w-full bg-error-light/20 text-error-dark py-4 rounded-material-lg font-medium hover:bg-error-light/30 transition-colors flex items-center justify-center gap-2 ripple shadow-material-1"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

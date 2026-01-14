import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Clock, Plus, Minus, Edit } from 'lucide-react'
import { formatDate } from '../lib/utils'
import { toast } from 'sonner'

export default function Changes() {
  const [changes, setChanges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChanges()
  }, [])

  const loadChanges = async () => {
    try {
      const q = query(
        collection(db, 'changes'),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
      const querySnapshot = await getDocs(q)
      const changesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }))
      setChanges(changesData)
    } catch (error) {
      console.error('Error loading changes:', error)
      toast.error('Error al cargar el historial')
      // Demo data
      setChanges([
        {
          id: '1',
          productName: 'Coca-Cola 2L',
          type: 'add',
          quantity: 20,
          previousQuantity: 30,
          newQuantity: 50,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          user: 'Repartidor 1'
        },
        {
          id: '2',
          productName: 'Agua Mineral 1.5L',
          type: 'remove',
          quantity: 10,
          previousQuantity: 110,
          newQuantity: 100,
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          user: 'Repartidor 2'
        },
        {
          id: '3',
          productName: 'Cerveza Estrella Pack 6',
          type: 'add',
          quantity: 5,
          previousQuantity: 10,
          newQuantity: 15,
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          user: 'Repartidor 1'
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getChangeIcon = (type) => {
    switch (type) {
      case 'add':
        return <Plus className="w-4 h-4" />
      case 'remove':
        return <Minus className="w-4 h-4" />
      case 'update':
        return <Edit className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getChangeColor = (type) => {
    switch (type) {
      case 'add':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'remove':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'update':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getChangeLabel = (type) => {
    switch (type) {
      case 'add':
        return 'Añadido'
      case 'remove':
        return 'Retirado'
      case 'update':
        return 'Actualizado'
      default:
        return 'Cambio'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Historial de Cambios</h2>
        <p className="text-sm text-gray-500 mt-1">Últimos 50 movimientos</p>
      </div>

      <div className="space-y-2">
        {changes.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No hay cambios registrados</p>
          </div>
        ) : (
          changes.map((change) => (
            <div
              key={change.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${getChangeColor(change.type)}`}>
                  {getChangeIcon(change.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{change.productName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getChangeColor(change.type)}`}>
                      {getChangeLabel(change.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {change.type === 'add' ? '+' : change.type === 'remove' ? '-' : ''}{change.quantity} unidades
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(change.timestamp)}</span>
                    <span className="font-medium">{change.user}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Stock: {change.previousQuantity} → {change.newQuantity}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

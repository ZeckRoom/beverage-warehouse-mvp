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
        return <Plus className="w-5 h-5" />
      case 'remove':
        return <Minus className="w-5 h-5" />
      case 'update':
        return <Edit className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getChangeColor = (type) => {
    switch (type) {
      case 'add':
        return 'text-success bg-success-light/20'
      case 'remove':
        return 'text-error bg-error-light/20'
      case 'update':
        return 'text-primary-700 bg-primary-100'
      default:
        return 'text-gray-600 bg-gray-100'
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-700"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-medium text-gray-900">Historial de Cambios</h2>
        <p className="text-sm text-gray-600 mt-1">Últimos 50 movimientos</p>
      </div>

      <div className="space-y-3">
        {changes.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay cambios registrados</p>
          </div>
        ) : (
          changes.map((change) => (
            <div
              key={change.id}
              className="card-material p-4"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${getChangeColor(change.type)}`}>
                  {getChangeIcon(change.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-base">{change.productName}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-material ${getChangeColor(change.type)}`}>
                      {getChangeLabel(change.type)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {change.type === 'add' ? '+' : change.type === 'remove' ? '-' : ''}{change.quantity} unidades
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(change.timestamp)}</span>
                    <span className="font-medium text-gray-700">{change.user}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 bg-surface-variant px-3 py-2 rounded-material inline-block">
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

import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Clock, Plus, Minus, Edit, TrendingUp } from 'lucide-react'
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
        {
          id: '4',
          productName: 'Fanta Naranja 2L',
          type: 'remove',
          quantity: 8,
          previousQuantity: 43,
          newQuantity: 35,
          timestamp: new Date(Date.now() - 1000 * 60 * 180),
          user: 'Repartidor 3'
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

  const getChangeGradient = (type) => {
    switch (type) {
      case 'add':
        return 'from-green-500 to-emerald-600'
      case 'remove':
        return 'from-red-500 to-pink-600'
      case 'update':
        return 'from-blue-500 to-indigo-600'
      default:
        return 'from-gray-500 to-gray-600'
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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="glass-card rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Historial de Cambios
        </h2>
        <p className="text-sm text-gray-600 font-medium">Últimos 50 movimientos</p>
      </div>

      <div className="space-y-3">
        {changes.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay cambios registrados</p>
          </div>
        ) : (
          changes.map((change) => (
            <div
              key={change.id}
              className="glass-card rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getChangeGradient(change.type)} shadow-lg flex-shrink-0`}>
                  {getChangeIcon(change.type)}
                  <span className="sr-only">{getChangeLabel(change.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{change.productName}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getChangeGradient(change.type)} text-white shadow-sm`}>
                      {getChangeLabel(change.type)}
                    </span>
                    <span className="text-xs font-bold text-gray-600">
                      {change.type === 'add' ? '+' : change.type === 'remove' ? '-' : ''}{change.quantity} unidades
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(change.timestamp)}
                    </span>
                    <span className="font-bold text-indigo-600">{change.user}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg font-mono font-semibold text-gray-600">
                      {change.previousQuantity}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="px-2 py-1 bg-indigo-100 rounded-lg font-mono font-bold text-indigo-600">
                      {change.newQuantity}
                    </span>
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

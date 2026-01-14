import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { BarChart3, TrendingUp, TrendingDown, Package, Layers } from 'lucide-react'
import { toast } from 'sonner'

export default function Stats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUnits: 0,
    lowStockCount: 0,
    categoriesCount: 0,
    topProducts: [],
    categories: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0)
      const lowStock = products.filter(p => p.quantity <= p.minStock)
      const categories = [...new Set(products.map(p => p.category))]
      const topProducts = products
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      setStats({
        totalProducts: products.length,
        totalUnits,
        lowStockCount: lowStock.length,
        categoriesCount: categories.length,
        topProducts,
        categories: categories.map(cat => ({
          name: cat,
          count: products.filter(p => p.category === cat).length,
          units: products.filter(p => p.category === cat).reduce((acc, p) => acc + p.quantity, 0)
        }))
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('Error al cargar estadísticas')
      // Demo data
      setStats({
        totalProducts: 5,
        totalUnits: 208,
        lowStockCount: 1,
        categoriesCount: 4,
        topProducts: [
          { name: 'Agua Mineral 1.5L', quantity: 100, category: 'Agua' },
          { name: 'Coca-Cola 2L', quantity: 50, category: 'Refrescos' },
          { name: 'Fanta Naranja 2L', quantity: 35, category: 'Refrescos' },
          { name: 'Cerveza Estrella Pack 6', quantity: 15, category: 'Cerveza' },
          { name: 'Red Bull 250ml', quantity: 8, category: 'Energéticas' },
        ],
        categories: [
          { name: 'Agua', count: 1, units: 100 },
          { name: 'Refrescos', count: 2, units: 85 },
          { name: 'Cerveza', count: 1, units: 15 },
          { name: 'Energéticas', count: 1, units: 8 },
        ]
      })
    } finally {
      setLoading(false)
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

  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-green-500 to-emerald-600',
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Estadísticas
        </h2>
        <p className="text-sm text-gray-600 font-medium">Resumen del inventario</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Productos</p>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {stats.totalProducts}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Unidades</p>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {stats.totalUnits}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Stock Bajo</p>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {stats.lowStockCount}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Categorías</p>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {stats.categoriesCount}
          </p>
        </div>
      </div>

      {/* Top Products */}
      <div className="glass-card rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Top 5 Productos
        </h3>
        <div className="space-y-3">
          {stats.topProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white font-bold shadow-lg`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500 font-semibold">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="glass-card rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Por Categoría
        </h3>
        <div className="space-y-4">
          {stats.categories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">{category.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">{category.count} productos</span>
                  <span className="text-sm font-bold text-indigo-600">{category.units} unidades</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${gradients[index % gradients.length]} transition-all duration-500 shadow-lg`}
                  style={{ width: `${(category.units / stats.totalUnits) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

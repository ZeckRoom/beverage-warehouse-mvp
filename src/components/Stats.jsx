import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { BarChart3, TrendingUp, TrendingDown, Package } from 'lucide-react'
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
      setStats({
        totalProducts: 3,
        totalUnits: 165,
        lowStockCount: 1,
        categoriesCount: 3,
        topProducts: [
          { name: 'Agua Mineral 1.5L', quantity: 100, category: 'Agua' },
          { name: 'Coca-Cola 2L', quantity: 50, category: 'Refrescos' },
          { name: 'Cerveza Estrella Pack 6', quantity: 15, category: 'Cerveza' },
        ],
        categories: [
          { name: 'Agua', count: 1, units: 100 },
          { name: 'Refrescos', count: 1, units: 50 },
          { name: 'Cerveza', count: 1, units: 15 },
        ]
      })
    } finally {
      setLoading(false)
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
        <h2 className="text-xl font-medium text-gray-900">Estadísticas</h2>
        <p className="text-sm text-gray-600 mt-1">Resumen del inventario</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card-material p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary-100 rounded-full">
              <Package className="w-5 h-5 text-primary-700" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Productos</p>
          <p className="text-3xl font-normal text-primary-700 mt-1">{stats.totalProducts}</p>
        </div>
        <div className="card-material p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-success-light/30 rounded-full">
              <TrendingUp className="w-5 h-5 text-success-dark" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Unidades</p>
          <p className="text-3xl font-normal text-success-dark mt-1">{stats.totalUnits}</p>
        </div>
        <div className="card-material p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-warning-light/30 rounded-full">
              <TrendingDown className="w-5 h-5 text-warning-dark" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Stock Bajo</p>
          <p className="text-3xl font-normal text-warning-dark mt-1">{stats.lowStockCount}</p>
        </div>
        <div className="card-material p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-secondary-100 rounded-full">
              <BarChart3 className="w-5 h-5 text-secondary-700" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Categorías</p>
          <p className="text-3xl font-normal text-secondary-700 mt-1">{stats.categoriesCount}</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="card-material p-5 mb-4">
        <h3 className="font-medium text-gray-900 mb-4 text-base">Top 5 Productos</h3>
        <div className="space-y-3">
          {stats.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-normal text-primary-700">{product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="card-material p-5">
        <h3 className="font-medium text-gray-900 mb-4 text-base">Por Categoría</h3>
        <div className="space-y-4">
          {stats.categories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-600">{category.units} unidades</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-700 h-2 rounded-full transition-all"
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

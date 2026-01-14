import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Package, Search, AlertTriangle, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('name'))
      const querySnapshot = await getDocs(q)
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Error al cargar el inventario')
      // Demo data
      setProducts([
        { id: '1', name: 'Coca-Cola 2L', barcode: '1234567890', quantity: 50, category: 'Refrescos', unit: 'botella', minStock: 20 },
        { id: '2', name: 'Agua Mineral 1.5L', barcode: '0987654321', quantity: 100, category: 'Agua', unit: 'botella', minStock: 30 },
        { id: '3', name: 'Cerveza Estrella Pack 6', barcode: '1122334455', quantity: 15, category: 'Cerveza', unit: 'pack', minStock: 10 },
        { id: '4', name: 'Fanta Naranja 2L', barcode: '2233445566', quantity: 35, category: 'Refrescos', unit: 'botella', minStock: 15 },
        { id: '5', name: 'Red Bull 250ml', barcode: '3344556677', quantity: 8, category: 'Energéticas', unit: 'lata', minStock: 20 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock)

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
      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-1 shadow-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none text-gray-700 font-medium placeholder-gray-400"
          />
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border-l-4 border-orange-500 animate-pulse-soft">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                {lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''} con stock bajo
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {lowStockProducts.map(p => p.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Package className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Productos</p>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {products.length}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Unidades</p>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {products.reduce((acc, p) => acc + p.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {product.barcode}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-3xl font-bold ${
                    product.quantity <= product.minStock 
                      ? 'text-transparent bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text' 
                      : 'text-transparent bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text'
                  }`}>
                    {product.quantity}
                  </p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">{product.unit}s</p>
                </div>
              </div>
              {product.quantity <= product.minStock && (
                <div className="mt-3 flex items-center gap-2 text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold">Stock mínimo: {product.minStock}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

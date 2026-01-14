import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Package, Search, AlertTriangle } from 'lucide-react'
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
      // Demo data si Firebase no está configurado
      setProducts([
        { id: '1', name: 'Coca-Cola 2L', barcode: '1234567890', quantity: 50, category: 'Refrescos', unit: 'botella', minStock: 20 },
        { id: '2', name: 'Agua Mineral 1.5L', barcode: '0987654321', quantity: 100, category: 'Agua', unit: 'botella', minStock: 30 },
        { id: '3', name: 'Cerveza Estrella Pack 6', barcode: '1122334455', quantity: 15, category: 'Cerveza', unit: 'pack', minStock: 10 },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              {lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''} con stock bajo
            </p>
            <p className="text-xs text-orange-600 mt-0.5">
              {lowStockProducts.map(p => p.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Total Productos</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Total Unidades</p>
          <p className="text-2xl font-bold text-gray-900">
            {products.reduce((acc, p) => acc + p.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Código: {product.barcode} • {product.category}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-2xl font-bold ${
                    product.quantity <= product.minStock ? 'text-orange-500' : 'text-primary'
                  }`}>
                    {product.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{product.unit}s</p>
                </div>
              </div>
              {product.quantity <= product.minStock && (
                <div className="mt-2 flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Stock bajo (mín: {product.minStock})</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

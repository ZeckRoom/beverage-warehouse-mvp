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
      // Demo data
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-700"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Material Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-material-2xl shadow-material-1 focus:shadow-material-2 transition-shadow focus:outline-none"
          />
        </div>
      </div>

      {/* Low Stock Alert - Material Banner */}
      {lowStockProducts.length > 0 && (
        <div className="mb-4 bg-warning-light/20 rounded-material-lg p-4 flex items-start gap-3 shadow-material-1">
          <AlertTriangle className="w-5 h-5 text-warning-dark flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''} con stock bajo
            </p>
            <p className="text-xs text-gray-700 mt-1">
              {lowStockProducts.map(p => p.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card-material p-4">
          <p className="text-gray-600 text-sm font-medium">Total Productos</p>
          <p className="text-3xl font-normal text-primary-700 mt-1">{products.length}</p>
        </div>
        <div className="card-material p-4">
          <p className="text-gray-600 text-sm font-medium">Total Unidades</p>
          <p className="text-3xl font-normal text-primary-700 mt-1">
            {products.reduce((acc, p) => acc + p.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Products List - Material Cards */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-base">No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="card-material p-4 ripple cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-base">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.barcode} • {product.category}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-3xl font-normal ${
                    product.quantity <= product.minStock ? 'text-warning-dark' : 'text-primary-700'
                  }`}>
                    {product.quantity}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{product.unit}s</p>
                </div>
              </div>
              {product.quantity <= product.minStock && (
                <div className="mt-3 flex items-center gap-2 text-warning-dark bg-warning-light/20 px-3 py-2 rounded-material">
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

import { useState } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ScanBarcode, Plus, Minus, Camera } from 'lucide-react'
import { toast } from 'sonner'

export default function Scanner() {
  const [barcode, setBarcode] = useState('')
  const [scannedProduct, setScannedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleManualInput = async () => {
    if (!barcode.trim()) {
      toast.error('Introduce un código de barras')
      return
    }
    await searchProduct(barcode)
  }

  const searchProduct = async (code) => {
    setLoading(true)
    try {
      // Buscar producto por código de barras
      // Nota: En producción, usar query con where
      toast.info('Buscando producto...')
      
      // Demo: producto ficticio
      setTimeout(() => {
        setScannedProduct({
          id: '1',
          name: 'Coca-Cola 2L',
          barcode: code,
          quantity: 50,
          category: 'Refrescos',
          unit: 'botella',
          minStock: 20
        })
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error searching product:', error)
      toast.error('Error al buscar el producto')
      setLoading(false)
    }
  }

  const handleAddStock = async () => {
    if (!scannedProduct) return
    
    setLoading(true)
    try {
      const newQuantity = scannedProduct.quantity + quantity
      
      // Actualizar producto
      // await updateDoc(doc(db, 'products', scannedProduct.id), {
      //   quantity: newQuantity,
      //   lastUpdated: serverTimestamp()
      // })

      // Registrar cambio
      // await addDoc(collection(db, 'changes'), {
      //   productId: scannedProduct.id,
      //   productName: scannedProduct.name,
      //   type: 'add',
      //   quantity: quantity,
      //   previousQuantity: scannedProduct.quantity,
      //   newQuantity: newQuantity,
      //   timestamp: serverTimestamp(),
      //   user: 'Repartidor' // TODO: usar usuario autenticado
      // })

      toast.success(`Añadidas ${quantity} unidades de ${scannedProduct.name}`)
      setScannedProduct({ ...scannedProduct, quantity: newQuantity })
      setQuantity(1)
    } catch (error) {
      console.error('Error adding stock:', error)
      toast.error('Error al añadir stock')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveStock = async () => {
    if (!scannedProduct) return
    
    if (scannedProduct.quantity < quantity) {
      toast.error('No hay suficiente stock')
      return
    }

    setLoading(true)
    try {
      const newQuantity = scannedProduct.quantity - quantity
      
      toast.success(`Retiradas ${quantity} unidades de ${scannedProduct.name}`)
      setScannedProduct({ ...scannedProduct, quantity: newQuantity })
      setQuantity(1)
    } catch (error) {
      console.error('Error removing stock:', error)
      toast.error('Error al retirar stock')
    } finally {
      setLoading(false)
    }
  }

  const startCamera = () => {
    toast.info('Función de cámara en desarrollo. Usa entrada manual por ahora.')
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Escanear Producto</h2>
        
        {/* Manual Input */}
        <div className="space-y-3">
          <div className="relative">
            <ScanBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Introduce código de barras..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleManualInput}
              disabled={loading}
              className="bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Buscar
            </button>
            <button
              onClick={startCamera}
              className="bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Cámara
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Product */}
      {scannedProduct && (
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{scannedProduct.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {scannedProduct.category} • Código: {scannedProduct.barcode}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Stock actual:</span>
              <span className="text-2xl font-bold text-primary">{scannedProduct.quantity}</span>
              <span className="text-sm text-gray-500">{scannedProduct.unit}s</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center text-xl font-semibold py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddStock}
              disabled={loading}
              className="bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Añadir
            </button>
            <button
              onClick={handleRemoveStock}
              disabled={loading}
              className="bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Minus className="w-5 h-5" />
              Retirar
            </button>
          </div>
        </div>
      )}

      {!scannedProduct && (
        <div className="text-center py-12">
          <ScanBarcode className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Escanea o busca un producto</p>
        </div>
      )}
    </div>
  )
}

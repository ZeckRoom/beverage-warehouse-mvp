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
  const [scanning, setScanning] = useState(false)

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

  const startBarcodeScanner = async () => {
    try {
      // Check if Barcode Detection API is supported
      if (!('BarcodeDetector' in window)) {
        toast.error('Tu navegador no soporta el escáner de códigos de barras')
        return
      }

      setScanning(true)

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })

      // Create video element
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      // Create barcode detector
      const barcodeDetector = new BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e']
      })

      // Scan loop
      const scanFrame = async () => {
        if (!scanning) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        try {
          const barcodes = await barcodeDetector.detect(video)
          if (barcodes.length > 0) {
            const detectedCode = barcodes[0].rawValue
            setBarcode(detectedCode)
            await searchProduct(detectedCode)
            stream.getTracks().forEach(track => track.stop())
            setScanning(false)
            toast.success('¡Código detectado!')
            return
          }
        } catch (err) {
          console.error('Scan error:', err)
        }

        requestAnimationFrame(scanFrame)
      }

      scanFrame()

    } catch (error) {
      console.error('Camera error:', error)
      toast.error('No se pudo acceder a la cámara')
      setScanning(false)
    }
  }

  const stopScanning = () => {
    setScanning(false)
  }

  const handleAddStock = async () => {
    if (!scannedProduct) return
    
    setLoading(true)
    try {
      const newQuantity = scannedProduct.quantity + quantity
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

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Escanear Producto</h2>
        
        {/* Manual Input */}
        <div className="space-y-3">
          <div className="relative">
            <ScanBarcode className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Código de barras..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-material-lg shadow-material-1 focus:shadow-material-2 transition-shadow focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleManualInput}
              disabled={loading}
              className="btn-material btn-filled ripple disabled:opacity-50"
            >
              Buscar
            </button>
            <button
              onClick={scanning ? stopScanning : startBarcodeScanner}
              className={`btn-material ripple flex items-center justify-center gap-2 ${
                scanning ? 'bg-error text-white' : 'bg-surface-variant text-gray-900'
              }`}
            >
              <Camera className="w-5 h-5" />
              {scanning ? 'Detener' : 'Cámara'}
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Product - Material Card */}
      {scannedProduct && (
        <div className="card-material p-6">
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-900">{scannedProduct.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {scannedProduct.category} • {scannedProduct.barcode}
            </p>
            <div className="mt-4 bg-primary-50 rounded-material-lg p-4">
              <span className="text-sm text-gray-700">Stock actual</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-normal text-primary-700">{scannedProduct.quantity}</span>
                <span className="text-sm text-gray-600 uppercase tracking-wide">{scannedProduct.unit}s</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Cantidad</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center hover:bg-gray-300 transition-colors ripple"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center text-2xl font-normal py-3 bg-surface-variant rounded-material-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center hover:bg-gray-300 transition-colors ripple"
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
              className="bg-success text-white py-4 rounded-material-lg font-medium shadow-material-2 hover:shadow-material-3 hover:bg-success-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 ripple"
            >
              <Plus className="w-5 h-5" />
              Añadir
            </button>
            <button
              onClick={handleRemoveStock}
              disabled={loading}
              className="bg-error text-white py-4 rounded-material-lg font-medium shadow-material-2 hover:shadow-material-3 hover:bg-error-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 ripple"
            >
              <Minus className="w-5 h-5" />
              Retirar
            </button>
          </div>
        </div>
      )}

      {!scannedProduct && !scanning && (
        <div className="text-center py-16">
          <ScanBarcode className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base">Escanea o busca un producto</p>
        </div>
      )}

      {scanning && (
        <div className="text-center py-16">
          <div className="animate-pulse">
            <Camera className="w-20 h-20 text-primary-700 mx-auto mb-4" />
            <p className="text-gray-700 text-base font-medium">Buscando código de barras...</p>
            <p className="text-gray-500 text-sm mt-2">Apunta la cámara al código</p>
          </div>
        </div>
      )}
    </div>
  )
}

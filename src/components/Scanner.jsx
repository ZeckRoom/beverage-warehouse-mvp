import { useState, useRef, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ScanBarcode, Plus, Minus, Camera, Zap } from 'lucide-react'
import { toast } from 'sonner'

export default function Scanner() {
  const [barcode, setBarcode] = useState('')
  const [scannedProduct, setScannedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

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

  const startCamera = async () => {
    try {
      // Check if BarcodeDetector is available
      if (!('BarcodeDetector' in window)) {
        toast.error('Tu navegador no soporta el escáner de códigos de barras. Usa Chrome o Edge.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      
      setIsScanning(true)
      detectBarcode()
      toast.success('Cámara activada')
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('No se pudo acceder a la cámara')
    }
  }

  const detectBarcode = async () => {
    if (!videoRef.current || !isScanning) return

    try {
      const barcodeDetector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']
      })

      const detect = async () => {
        if (!isScanning || !videoRef.current) return

        const barcodes = await barcodeDetector.detect(videoRef.current)
        
        if (barcodes.length > 0) {
          const detectedCode = barcodes[0].rawValue
          setBarcode(detectedCode)
          toast.success(`Código detectado: ${detectedCode}`)
          stopCamera()
          await searchProduct(detectedCode)
        } else {
          requestAnimationFrame(detect)
        }
      }

      detect()
    } catch (error) {
      console.error('Error detecting barcode:', error)
      toast.error('Error al detectar código de barras')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
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
    <div className="p-4 space-y-4">
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Escanear Producto
        </h2>
        
        {/* Camera View */}
        {isScanning && (
          <div className="mb-4 relative rounded-2xl overflow-hidden">
            <video 
              ref={videoRef} 
              className="w-full h-64 object-cover bg-black"
              playsInline
            />
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-2xl pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />
            </div>
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg"
            >
              Detener
            </button>
          </div>
        )}

        {/* Manual Input */}
        <div className="space-y-3">
          <div className="relative">
            <ScanBarcode className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Código de barras..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleManualInput}
              disabled={loading}
              className="gradient-primary text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Buscar
            </button>
            <button
              onClick={isScanning ? stopCamera : startCamera}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              {isScanning ? 'Detener' : 'Cámara'}
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Product */}
      {scannedProduct && (
        <div className="glass-card rounded-2xl p-6 shadow-xl animate-float">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{scannedProduct.name}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold">
                {scannedProduct.category}
              </span>
              <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-mono font-semibold">
                {scannedProduct.barcode}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-sm text-gray-600 font-semibold">Stock actual:</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {scannedProduct.quantity}
              </span>
              <span className="text-sm text-gray-500 font-semibold">{scannedProduct.unit}s</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Cantidad</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:shadow-lg transition-all"
              >
                <Minus className="w-6 h-6 text-gray-700" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center text-3xl font-bold py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:shadow-lg transition-all"
              >
                <Plus className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddStock}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Añadir
            </button>
            <button
              onClick={handleRemoveStock}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Minus className="w-5 h-5" />
              Retirar
            </button>
          </div>
        </div>
      )}

      {!scannedProduct && !isScanning && (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
            <ScanBarcode className="w-16 h-16 text-indigo-600" />
          </div>
          <p className="text-gray-600 font-semibold text-lg">Escanea o busca un producto</p>
          <p className="text-gray-400 text-sm mt-2">Usa la cámara o introduce el código manualmente</p>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { db } from '../lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { ScanBarcode, Plus, Minus, Camera, X, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { useBarcodeDetector } from '../hooks/useBarcodeDetector'
import BarcodeCamera from './BarcodeCamera'

export default function Scanner() {
  const [barcode, setBarcode] = useState('')
  const [scannedProduct, setScannedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  
  const { isSupported, detect, detectFromImage } = useBarcodeDetector()
  const videoRef = useRef(null)
  const scanIntervalRef = useRef(null)
  const lastScannedRef = useRef(null)

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
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
      // Buscar producto por código de barras en Firebase
      const q = query(
        collection(db, 'products'),
        where('barcode', '==', code)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const productData = querySnapshot.docs[0].data()
        const productWithId = {
          id: querySnapshot.docs[0].id,
          ...productData
        }
        setScannedProduct(productWithId)
        toast.success(`Producto encontrado: ${productData.name}`)
      } else {
        // Si no se encuentra, usar datos de demo
        toast.warning('Producto no encontrado en la base de datos')
        setScannedProduct({
          id: 'demo',
          name: 'Producto Demo',
          barcode: code,
          quantity: 50,
          category: 'Sin categoría',
          unit: 'unidad',
          minStock: 20
        })
      }
    } catch (error) {
      console.error('Error searching product:', error)
      toast.error('Error al buscar el producto')
      // Demo fallback
      setScannedProduct({
        id: 'demo',
        name: 'Coca-Cola 2L',
        barcode: code,
        quantity: 50,
        category: 'Refrescos',
        unit: 'botella',
        minStock: 20
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = async () => {
    if (!scannedProduct) return
    
    setLoading(true)
    try {
      const newQuantity = scannedProduct.quantity + quantity
      
      if (scannedProduct.id !== 'demo') {
        // Actualizar en Firebase
        await updateDoc(doc(db, 'products', scannedProduct.id), {
          quantity: newQuantity,
          lastUpdated: serverTimestamp()
        })

        // Registrar cambio
        await addDoc(collection(db, 'changes'), {
          productId: scannedProduct.id,
          productName: scannedProduct.name,
          type: 'add',
          quantity: quantity,
          previousQuantity: scannedProduct.quantity,
          newQuantity: newQuantity,
          timestamp: serverTimestamp(),
          user: 'Repartidor' // TODO: usar usuario autenticado
        })
      }

      toast.success(`✅ Añadidas ${quantity} unidades de ${scannedProduct.name}`)
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
      
      if (scannedProduct.id !== 'demo') {
        // Actualizar en Firebase
        await updateDoc(doc(db, 'products', scannedProduct.id), {
          quantity: newQuantity,
          lastUpdated: serverTimestamp()
        })

        // Registrar cambio
        await addDoc(collection(db, 'changes'), {
          productId: scannedProduct.id,
          productName: scannedProduct.name,
          type: 'remove',
          quantity: quantity,
          previousQuantity: scannedProduct.quantity,
          newQuantity: newQuantity,
          timestamp: serverTimestamp(),
          user: 'Repartidor'
        })
      }

      toast.success(`✅ Retiradas ${quantity} unidades de ${scannedProduct.name}`)
      setScannedProduct({ ...scannedProduct, quantity: newQuantity })
      setQuantity(1)
    } catch (error) {
      console.error('Error removing stock:', error)
      toast.error('Error al retirar stock')
    } finally {
      setLoading(false)
    }
  }

  const startCameraScanning = () => {
    if (!isSupported) {
      toast.error('Tu navegador no soporta el escáner de códigos de barras. Usa Chrome/Edge en Android.')
      return
    }
    setIsCameraOpen(true)
  }

  const stopCameraScanning = () => {
    setIsCameraOpen(false)
    setIsScanning(false)
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
  }

  const handleCameraReady = (video) => {
    videoRef.current = video
    startDetection()
  }

  const startDetection = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }

    setIsScanning(true)
    
    // Escanear cada 300ms
    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        return
      }

      try {
        const barcodes = await detect(videoRef.current)
        
        if (barcodes.length > 0) {
          const barcode = barcodes[0]
          
          // Evitar escaneos duplicados consecutivos
          if (barcode.rawValue !== lastScannedRef.current) {
            lastScannedRef.current = barcode.rawValue
            
            // Vibración de feedback (si está disponible)
            if (navigator.vibrate) {
              navigator.vibrate(200)
            }
            
            // Sonido de feedback
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE')
            audio.play().catch(() => {})
            
            console.log('📱 Código escaneado:', barcode.rawValue, barcode.format)
            
            setBarcode(barcode.rawValue)
            stopCameraScanning()
            await searchProduct(barcode.rawValue)
            
            toast.success(`Código escaneado: ${barcode.rawValue}`)
          }
        }
      } catch (error) {
        console.error('Error durante detección:', error)
      }
    }, 300)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!isSupported) {
      toast.error('Tu navegador no soporta la detección de códigos de barras')
      return
    }

    setLoading(true)
    try {
      const barcodes = await detectFromImage(file)
      
      if (barcodes.length > 0) {
        const barcode = barcodes[0]
        setBarcode(barcode.rawValue)
        await searchProduct(barcode.rawValue)
        toast.success(`Código detectado: ${barcode.rawValue}`)
      } else {
        toast.error('No se detectó ningún código de barras en la imagen')
      }
    } catch (error) {
      console.error('Error processing image:', error)
      toast.error('Error al procesar la imagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Escanear Producto</h2>
        
        {!isCameraOpen ? (
          <div className="space-y-3">
            {/* Manual Input */}
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
            
            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleManualInput}
                disabled={loading}
                className="bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 col-span-3"
              >
                Buscar
              </button>
              
              {isSupported && (
                <>
                  <button
                    onClick={startCameraScanning}
                    className="bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 col-span-2"
                  >
                    <Camera className="w-5 h-5" />
                    Cámara
                  </button>
                  
                  <label className="bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <ImagePlus className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </>
              )}
              
              {!isSupported && (
                <div className="col-span-3 bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-orange-800">
                    ⚠️ Escáner de cámara no disponible en este navegador.
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Usa Chrome o Edge en Android para mejor compatibilidad.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Camera View */}
            <BarcodeCamera
              onScan={searchProduct}
              isScanning={isScanning}
              onCameraReady={handleCameraReady}
            />
            
            {/* Close Camera Button */}
            <button
              onClick={stopCameraScanning}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cerrar Cámara
            </button>
          </div>
        )}
      </div>

      {/* Scanned Product */}
      {scannedProduct && !isCameraOpen && (
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

      {!scannedProduct && !isCameraOpen && (
        <div className="text-center py-12">
          <ScanBarcode className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Escanea o busca un producto</p>
          {isSupported && (
            <p className="text-xs text-green-600 mt-2">✓ Escáner de cámara disponible</p>
          )}
        </div>
      )}
    </div>
  )
}

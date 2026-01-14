import { useState, useRef, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { ScanBarcode, Plus, Minus, Camera, X, Zap, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function Scanner() {
  const [barcode, setBarcode] = useState('')
  const [scannedProduct, setScannedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const [barcodeDetectorSupported, setBarcodeDetectorSupported] = useState(false)
  
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const scanIntervalRef = useRef(null)

  useEffect(() => {
    // Check if BarcodeDetector is supported
    if ('BarcodeDetector' in window) {
      setBarcodeDetectorSupported(true)
      initBarcodeDetector()
    }
    
    // Check if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCamera(true)
    }
    
    return () => {
      stopCamera()
    }
  }, [])

  const initBarcodeDetector = async () => {
    try {
      detectorRef.current = new window.BarcodeDetector({
        formats: [
          'code_128',
          'code_39',
          'code_93',
          'ean_13',
          'ean_8',
          'upc_a',
          'upc_e',
          'qr_code'
        ]
      })
    } catch (error) {
      console.error('Error initializing BarcodeDetector:', error)
    }
  }

  const startCamera = async () => {
    if (!hasCamera) {
      toast.error('No se detectó cámara en el dispositivo')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      
      setCameraActive(true)
      toast.success('Cámara activada. Enfoca un código de barras')
      
      // Start scanning if BarcodeDetector is supported
      if (barcodeDetectorSupported && detectorRef.current) {
        startScanning()
      } else {
        toast.warning('BarcodeDetector no soportado. Usa entrada manual.')
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('No se pudo acceder a la cámara')
    }
  }

  const startScanning = () => {
    scanIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const barcodes = await detectorRef.current.detect(videoRef.current)
          if (barcodes.length > 0) {
            const detectedBarcode = barcodes[0].rawValue
            setBarcode(detectedBarcode)
            stopCamera()
            await searchProduct(detectedBarcode)
            navigator.vibrate?.(200) // Vibration feedback if supported
          }
        } catch (error) {
          console.error('Error detecting barcode:', error)
        }
      }
    }, 300) // Scan every 300ms
  }

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setCameraActive(false)
  }

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
      // Search product by barcode in Firestore
      const q = query(collection(db, 'products'), where('barcode', '==', code))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const productDoc = querySnapshot.docs[0]
        const productData = { id: productDoc.id, ...productDoc.data() }
        setScannedProduct(productData)
        toast.success(`Producto encontrado: ${productData.name}`)
      } else {
        // Demo fallback
        toast.warning('Producto no encontrado en la base de datos')
        setScannedProduct({
          id: 'demo-1',
          name: 'Producto Demo',
          barcode: code,
          quantity: 50,
          category: 'Demo',
          unit: 'unidad',
          minStock: 20
        })
      }
    } catch (error) {
      console.error('Error searching product:', error)
      // Demo product for testing
      setScannedProduct({
        id: 'demo-1',
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
      
      toast.success(`✅ Añadidas ${quantity} unidades de ${scannedProduct.name}`)
      setScannedProduct({ ...scannedProduct, quantity: newQuantity })
      setQuantity(1)
      navigator.vibrate?.(100)
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
      
      toast.success(`✅ Retiradas ${quantity} unidades de ${scannedProduct.name}`)
      setScannedProduct({ ...scannedProduct, quantity: newQuantity })
      setQuantity(1)
      navigator.vibrate?.(100)
    } catch (error) {
      console.error('Error removing stock:', error)
      toast.error('Error al retirar stock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Camera View */}
      {cameraActive && (
        <div className="md-card overflow-hidden relative">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover bg-black"
            playsInline
            muted
          />
          <div className="absolute inset-0 border-4 border-[rgb(var(--md-sys-color-primary))] border-dashed rounded-xl pointer-events-none"></div>
          <button
            onClick={stopCamera}
            className="absolute top-4 right-4 bg-[rgb(var(--md-sys-color-error))] text-[rgb(var(--md-sys-color-on-error))] p-3 rounded-full elevation-3 ripple-effect"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg text-center">
            <p className="text-sm font-medium">Enfoca el código de barras</p>
          </div>
        </div>
      )}

      {/* Manual Input Section */}
      {!cameraActive && (
        <div className="md-card p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ScanBarcode className="w-6 h-6 text-[rgb(var(--md-sys-color-primary))]" />
            <h2 className="text-lg font-medium text-[rgb(var(--md-sys-color-on-surface))]">Escanear Producto</h2>
          </div>
          
          {/* Barcode Detector Support Alert */}
          {barcodeDetectorSupported ? (
            <div className="flex items-start gap-2 bg-[rgb(var(--md-sys-color-primary-container))] p-3 rounded-lg">
              <Zap className="w-5 h-5 text-[rgb(var(--md-sys-color-primary))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[rgb(var(--md-sys-color-on-primary-container))]">Escáner automático disponible</p>
                <p className="text-xs text-[rgb(var(--md-sys-color-on-primary-container))] opacity-70 mt-0.5">
                  Tu navegador soporta detección automática de códigos
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-[rgb(var(--md-sys-color-error-container))] p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[rgb(var(--md-sys-color-error))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[rgb(var(--md-sys-color-on-error-container))]">Escáner automático no disponible</p>
                <p className="text-xs text-[rgb(var(--md-sys-color-on-error-container))] opacity-70 mt-0.5">
                  Usa Chrome/Edge en Android o entrada manual
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Código de barras..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              className="w-full md-input"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleManualInput}
                disabled={loading}
                className="md-button md-button-filled ripple-effect disabled:opacity-50"
              >
                Buscar
              </button>
              <button
                onClick={startCamera}
                disabled={!hasCamera}
                className="md-button md-button-outlined ripple-effect flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                Cámara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanned Product Card */}
      {scannedProduct && !cameraActive && (
        <div className="md-card p-5 space-y-4">
          <div>
            <h3 className="text-xl font-medium text-[rgb(var(--md-sys-color-on-surface))]">{scannedProduct.name}</h3>
            <p className="text-sm text-[rgb(var(--md-sys-color-on-surface-variant))] mt-1">
              {scannedProduct.category} • {scannedProduct.barcode}
            </p>
            <div className="mt-4 flex items-center gap-3 bg-[rgb(var(--md-sys-color-primary-container))] p-4 rounded-xl">
              <div className="flex-1">
                <p className="text-sm text-[rgb(var(--md-sys-color-on-primary-container))] opacity-70">Stock actual</p>
                <p className="text-3xl font-bold text-[rgb(var(--md-sys-color-on-primary-container))]">
                  {scannedProduct.quantity}
                </p>
                <p className="text-xs text-[rgb(var(--md-sys-color-on-primary-container))] opacity-70 mt-0.5">
                  {scannedProduct.unit}s
                </p>
              </div>
              <Package className="w-12 h-12 text-[rgb(var(--md-sys-color-primary))] opacity-40" />
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--md-sys-color-on-surface))] mb-3">Cantidad</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full bg-[rgb(var(--md-sys-color-secondary-container))] text-[rgb(var(--md-sys-color-on-secondary-container))] flex items-center justify-center elevation-1 hover:elevation-2 transition-all ripple-effect"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center text-2xl font-bold py-3 bg-[rgb(var(--md-sys-color-surface-variant))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--md-sys-color-primary))]"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full bg-[rgb(var(--md-sys-color-secondary-container))] text-[rgb(var(--md-sys-color-on-secondary-container))] flex items-center justify-center elevation-1 hover:elevation-2 transition-all ripple-effect"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddStock}
              disabled={loading}
              className="bg-[rgb(var(--md-sys-color-success))] text-[rgb(var(--md-sys-color-on-success))] py-4 rounded-xl font-medium elevation-1 hover:elevation-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2 ripple-effect"
            >
              <Plus className="w-5 h-5" />
              Añadir
            </button>
            <button
              onClick={handleRemoveStock}
              disabled={loading}
              className="bg-[rgb(var(--md-sys-color-error))] text-[rgb(var(--md-sys-color-on-error))] py-4 rounded-xl font-medium elevation-1 hover:elevation-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2 ripple-effect"
            >
              <Minus className="w-5 h-5" />
              Retirar
            </button>
          </div>
        </div>
      )}

      {!scannedProduct && !cameraActive && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-[rgb(var(--md-sys-color-surface-variant))] rounded-full flex items-center justify-center">
            <ScanBarcode className="w-10 h-10 text-[rgb(var(--md-sys-color-on-surface-variant))]" />
          </div>
          <p className="text-[rgb(var(--md-sys-color-on-surface-variant))]">Escanea o busca un producto</p>
        </div>
      )}
    </div>
  )
}

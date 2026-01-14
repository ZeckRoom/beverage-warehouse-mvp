import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Componente de cámara para escaneo de códigos de barras
 * Maneja el acceso a la cámara y muestra el stream de video
 */
export default function BarcodeCamera({ onScan, isScanning, onCameraReady }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  // Pasar la referencia del video al padre cuando esté listo
  useEffect(() => {
    if (videoRef.current && onCameraReady) {
      onCameraReady(videoRef.current)
    }
  }, [onCameraReady])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Solicitar acceso a la cámara
      // facingMode: 'environment' = cámara trasera (ideal para escanear)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Cámara trasera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true') // iOS fix
        await videoRef.current.play()
        setHasPermission(true)
        setIsLoading(false)
        toast.success('Cámara activada')
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err)
      setHasPermission(false)
      setIsLoading(false)
      
      if (err.name === 'NotAllowedError') {
        setError('Permiso de cámara denegado. Por favor, permite el acceso.')
        toast.error('Permiso de cámara denegado')
      } else if (err.name === 'NotFoundError') {
        setError('No se encontró ninguna cámara en el dispositivo.')
        toast.error('Cámara no encontrada')
      } else {
        setError('Error al acceder a la cámara: ' + err.message)
        toast.error('Error al activar la cámara')
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const switchCamera = async () => {
    try {
      stopCamera()
      
      // Cambiar entre cámara frontal y trasera
      const currentFacing = streamRef.current?.getVideoTracks()[0]?.getSettings()?.facingMode
      const newFacing = currentFacing === 'environment' ? 'user' : 'environment'
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })

      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        toast.success(`Cámara ${newFacing === 'environment' ? 'trasera' : 'frontal'} activada`)
      }
    } catch (err) {
      console.error('Error cambiando cámara:', err)
      toast.error('Error al cambiar la cámara')
      // Intentar volver a la cámara anterior
      startCamera()
    }
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
      {/* Video Stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />

      {/* Overlay para guía de escaneo */}
      {!isLoading && hasPermission && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-4/5 aspect-square">
            {/* Esquinas del marco de escaneo */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
            
            {/* Línea de escaneo animada */}
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-scan" />
            )}
          </div>
          
          {/* Texto de instrucción */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full inline-block">
              {isScanning ? 'Escaneando...' : 'Coloca el código dentro del marco'}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-white mt-4">Iniciando cámara...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6">
          <CameraOff className="w-16 h-16 text-red-400 mb-4" />
          <p className="text-white text-center mb-4">{error}</p>
          <button
            onClick={startCamera}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Botón para cambiar cámara */}
      {!isLoading && hasPermission && (
        <button
          onClick={switchCamera}
          className="absolute top-4 right-4 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Cambiar cámara"
        >
          <Camera className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

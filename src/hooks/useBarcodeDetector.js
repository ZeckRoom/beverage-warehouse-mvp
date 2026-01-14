import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

/**
 * Hook personalizado para usar la Barcode Detection API nativa
 * Soporta múltiples formatos de códigos de barras
 */
export function useBarcodeDetector() {
  const [isSupported, setIsSupported] = useState(false)
  const [supportedFormats, setSupportedFormats] = useState([])
  const detectorRef = useRef(null)

  useEffect(() => {
    checkSupport()
  }, [])

  const checkSupport = async () => {
    try {
      if ('BarcodeDetector' in window) {
        setIsSupported(true)
        
        // Obtener formatos soportados
        const formats = await window.BarcodeDetector.getSupportedFormats()
        setSupportedFormats(formats)
        
        // Crear detector con formatos comunes para bebidas
        // EAN-13: Códigos de barras europeos estándar
        // EAN-8: Versión corta de EAN
        // UPC-A/E: Códigos estadounidenses
        // Code-128: Códigos industriales
        // QR: Códigos QR para productos nuevos
        const preferredFormats = [
          'ean_13',
          'ean_8', 
          'upc_a',
          'upc_e',
          'code_128',
          'qr_code'
        ]
        
        // Filtrar solo los formatos soportados por el navegador
        const availableFormats = preferredFormats.filter(format => 
          formats.includes(format)
        )
        
        detectorRef.current = new window.BarcodeDetector({
          formats: availableFormats
        })
        
        console.log('✅ Barcode Detection API inicializada')
        console.log('📋 Formatos disponibles:', availableFormats)
      } else {
        setIsSupported(false)
        console.warn('⚠️ Barcode Detection API no soportada en este navegador')
      }
    } catch (error) {
      console.error('Error inicializando Barcode Detection API:', error)
      setIsSupported(false)
    }
  }

  /**
   * Detecta códigos de barras en un elemento de video
   * @param {HTMLVideoElement} videoElement - Elemento de video a escanear
   * @returns {Promise<Array>} Array de códigos detectados
   */
  const detect = async (videoElement) => {
    if (!detectorRef.current || !videoElement) {
      return []
    }

    try {
      const barcodes = await detectorRef.current.detect(videoElement)
      return barcodes
    } catch (error) {
      console.error('Error detectando código de barras:', error)
      return []
    }
  }

  /**
   * Detecta códigos de barras desde una imagen (File o Blob)
   * @param {File|Blob} imageFile - Archivo de imagen
   * @returns {Promise<Array>} Array de códigos detectados
   */
  const detectFromImage = async (imageFile) => {
    if (!detectorRef.current) {
      toast.error('Detector no inicializado')
      return []
    }

    try {
      const imageBitmap = await createImageBitmap(imageFile)
      const barcodes = await detectorRef.current.detect(imageBitmap)
      return barcodes
    } catch (error) {
      console.error('Error detectando desde imagen:', error)
      toast.error('Error al procesar la imagen')
      return []
    }
  }

  return {
    isSupported,
    supportedFormats,
    detect,
    detectFromImage
  }
}

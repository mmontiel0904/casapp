import { ref, computed } from 'vue'
import { useFeedback } from './useFeedback'

// Define types locally to avoid circular dependencies
export interface EmailIngestionOptions {
  extractAttachments: boolean
  createCategories: boolean
  enhancedOcr: boolean
  accountingProcess: string
  processingSpeed: 'fast' | 'balanced' | 'quality'
}

interface UploadedFile {
  originalName: string
  base64Data: string
  size: number
  mimeType: string
  uploadId: string
}

interface N8nWebhookPayload {
  projectId: string
  screenshots: UploadedFile[]
  options: EmailIngestionOptions
  callbackUrl?: string
  timestamp: string
  source: string
  requestId: string
}

interface N8nResponse {
  success: boolean
  message: string
  requestId: string
  estimatedTime?: number
}

export function useEmailIngestion() {
  const feedback = useFeedback()
  
  // State
  const isProcessing = ref(false)
  const currentRequestId = ref<string>('')

  /**
   * Main function to process email screenshots
   */
  const processEmailScreenshots = async (
    projectId: string,
    screenshots: File[],
    options: EmailIngestionOptions
  ): Promise<N8nResponse> => {
    if (isProcessing.value) {
      throw new Error('Processing already in progress')
    }

    isProcessing.value = true
    currentRequestId.value = generateRequestId()

    try {
      // Convert files to base64 for direct sending to n8n
      const processedFiles = await convertFilesToBase64(screenshots)

      // Send directly to n8n webhook
      const n8nResponse = await sendToN8nWebhook({
        projectId,
        screenshots: processedFiles,
        options,
        timestamp: new Date().toISOString(),
        source: 'casapp-ui',
        requestId: currentRequestId.value
      })

      // Success - n8n webhook received the request
      feedback.success('Email Processing', 'Email screenshots sent to n8n successfully!')
      return n8nResponse

    } catch (error) {
      console.error('Email ingestion failed:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      feedback.error('Processing Failed', `Failed to send to n8n: ${errorMessage}`)
      throw error
      
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Convert files to base64 for direct sending to n8n
   */
  const convertFilesToBase64 = async (screenshots: File[]): Promise<UploadedFile[]> => {
    const conversionPromises = screenshots.map(async (file, index) => {
      const uploadId = `file-${index}-${Date.now()}`
      
      try {
        // Convert file to base64
        const base64Data = await fileToBase64(file)
        
        return {
          originalName: file.name,
          base64Data,
          size: file.size,
          mimeType: file.type,
          uploadId
        } satisfies UploadedFile

      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error)
        throw new Error(`Failed to process ${file.name}`)
      }
    })

    return Promise.all(conversionPromises)
  }

  /**
   * Convert a file to base64 string
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Send payload to n8n webhook
   */
  const sendToN8nWebhook = async (payload: N8nWebhookPayload): Promise<N8nResponse> => {
    const webhookUrl = import.meta.env.VITE_N8N_EMAIL_WEBHOOK_URL
    
    console.log('n8n webhook URL:', webhookUrl)
    
    if (!webhookUrl) {
      throw new Error('n8n webhook URL not configured. Please set VITE_N8N_EMAIL_WEBHOOK_URL in your .env.local file')
    }

    if (webhookUrl.includes('your-n8n-instance.com')) {
      throw new Error('Please update VITE_N8N_EMAIL_WEBHOOK_URL with your actual n8n webhook URL')
    }

    console.log('Sending payload to n8n:', { url: webhookUrl, payload })

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('n8n webhook response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('n8n webhook error response:', errorText)
        throw new Error(`n8n webhook failed (${response.status}): ${response.statusText}`)
      }

      const result = await response.json()
      console.log('n8n webhook success response:', result)
      
      // For now, assume success if we get any response
      // n8n might not return the exact format we expect
      const n8nResponse = {
        success: true,
        message: result.message || 'Processing started successfully',
        requestId: payload.requestId,
        estimatedTime: result.estimatedTime
      }

      return n8nResponse

    } catch (error) {
      console.error('Failed to send to n8n webhook:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to start AI processing: ${error.message}`)
      }
      throw new Error('Failed to start AI processing')
    }
  }

  // Utility functions
  const generateRequestId = (): string => {
    return `email-ingestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    // State
    isProcessing: readonly(isProcessing),
    currentRequestId: readonly(currentRequestId),

    // Methods
    processEmailScreenshots,

    // Utility methods for external use
    convertFilesToBase64,
    sendToN8nWebhook
  }
}

// Helper function to make refs readonly
function readonly<T>(ref: { value: T }) {
  return computed(() => ref.value)
}

// Export types for use in components
export type { UploadedFile, N8nWebhookPayload, N8nResponse }

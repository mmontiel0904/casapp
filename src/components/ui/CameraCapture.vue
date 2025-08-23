<template>
  <div class="camera-capture" ref="captureRoot">
    <!-- Camera Button -->
    <button 
      v-if="!isActive && !capturedImage" 
      @click="startCamera"
      class="btn btn-primary btn-sm gap-2"
      :disabled="!isSupported"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Take Photo
    </button>

    <!-- Not Supported Message -->
    <div v-if="!isSupported" class="text-xs text-warning mt-1">
      Camera not available in this browser
    </div>

    <!-- Camera View -->
    <div v-if="isActive" class="camera-view bg-base-300 rounded-lg overflow-hidden">
      <div class="relative">
        <!-- Video Stream -->
        <video 
          ref="videoElement"
          autoplay
          playsinline
          class="w-full h-64 bg-black object-cover"
        ></video>
        
        <!-- Camera Controls -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
          <!-- Capture Button -->
          <button 
            @click="capturePhoto"
            class="btn btn-circle btn-primary btn-lg"
            :disabled="!isReady"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <!-- Cancel Button -->
          <button 
            @click="stopCamera"
            class="btn btn-circle btn-ghost"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Camera Status -->
        <div v-if="!isReady && isActive" class="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div class="text-white text-center">
            <div class="loading loading-spinner loading-lg mb-2"></div>
            <p>Starting camera...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Captured Image Preview -->
    <div v-if="capturedImage" class="captured-image">
      <div class="relative bg-base-300 rounded-lg overflow-hidden">
        <img 
          :src="capturedImage" 
          alt="Captured photo"
          class="w-full h-64 object-cover"
        />
        
        <!-- Image Controls -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
          <!-- Use Photo Button -->
          <button 
            @click="usePhoto"
            class="btn btn-success btn-sm gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Use Photo
          </button>
          
          <!-- Retake Button -->
          <button 
            @click="retakePhoto"
            class="btn btn-ghost btn-sm gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="alert alert-error mt-4">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Emits {
  (e: 'photo-captured', file: File): void
}

const emit = defineEmits<Emits>()

// Refs
const videoElement = ref<HTMLVideoElement>()
const captureRoot = ref<HTMLElement>()
const isSupported = ref(false)
const isActive = ref(false)
const isReady = ref(false)
const capturedImage = ref<string>('')
const error = ref<string>('')
const stream = ref<MediaStream | null>(null)

// Orientation state
const orientation = ref<'portrait' | 'landscape'>('portrait')

function getOrientation() {
  if (window.screen && window.screen.orientation && window.screen.orientation.type) {
    return window.screen.orientation.type.startsWith('landscape') ? 'landscape' : 'portrait'
  }
  // Fallback for iOS
  if (typeof window.orientation === 'number') {
    return Math.abs(window.orientation as number) === 90 ? 'landscape' : 'portrait'
  }
  return 'portrait'
}

function updateOrientation() {
  orientation.value = getOrientation()
}

// Check if camera is supported
onMounted(() => {
  isSupported.value = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  updateOrientation()
  window.addEventListener('orientationchange', updateOrientation)
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', updateOrientation)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  stopCamera()
  window.removeEventListener('orientationchange', updateOrientation)
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.removeEventListener('change', updateOrientation)
  }
})

// Start camera
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const enterFullscreen = async () => {
  if (isMobile() && captureRoot.value && captureRoot.value.requestFullscreen) {
    try {
      await captureRoot.value.requestFullscreen()
    } catch (e) {
      // Ignore if not allowed
    }
  }
}

const exitFullscreen = async () => {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen()
    } catch (e) {}
  }
}

const startCamera = async () => {
  try {
    error.value = ''
    isActive.value = true
    isReady.value = false

    // Enter fullscreen on mobile
    await enterFullscreen()

    // Request camera access
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera if available
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    })

    // Set video source
    if (videoElement.value && stream.value) {
      videoElement.value.srcObject = stream.value

      // Wait for video to be ready
      videoElement.value.onloadedmetadata = () => {
        isReady.value = true
      }
    }
  } catch (err) {
    console.error('Error accessing camera:', err)
    error.value = 'Could not access camera. Please check permissions and try again.'
    isActive.value = false
    await exitFullscreen()
  }
}

// Stop camera
const stopCamera = async () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => {
      track.stop()
    })
    stream.value = null
  }

  if (videoElement.value) {
    videoElement.value.srcObject = null
  }

  isActive.value = false
  isReady.value = false
  await exitFullscreen()
}

// Capture photo
const capturePhoto = async () => {
  if (!videoElement.value || !isReady.value) return

  try {
    // Create canvas to capture frame
    let videoW = videoElement.value.videoWidth
    let videoH = videoElement.value.videoHeight
    let isLandscape = orientation.value === 'landscape'
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) throw new Error('Could not get canvas context')

    // If landscape, rotate canvas
    if (isLandscape) {
      canvas.width = videoH
      canvas.height = videoW
      context.save()
      context.translate(videoH, 0)
      context.rotate(Math.PI / 2)
      context.drawImage(videoElement.value, 0, 0, videoW, videoH)
      context.restore()
    } else {
      canvas.width = videoW
      canvas.height = videoH
      context.drawImage(videoElement.value, 0, 0, videoW, videoH)
    }

    // Convert to data URL
    capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)

    // Stop camera and exit fullscreen
    await stopCamera()
  } catch (err) {
    console.error('Error capturing photo:', err)
    error.value = 'Failed to capture photo. Please try again.'
  }
}

// Use the captured photo
const usePhoto = () => {
  if (!capturedImage.value) return
  
  try {
    // Convert data URL to blob
    fetch(capturedImage.value)
      .then(res => res.blob())
      .then(blob => {
        // Create file from blob
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        })
        
        // Emit the file
        emit('photo-captured', file)
        
        // Reset state
        capturedImage.value = ''
        error.value = ''
      })
      .catch(err => {
        console.error('Error converting photo to file:', err)
        error.value = 'Failed to process photo. Please try again.'
      })
  } catch (err) {
    console.error('Error using photo:', err)
    error.value = 'Failed to use photo. Please try again.'
  }
}

// Retake photo
const retakePhoto = () => {
  capturedImage.value = ''
  error.value = ''
  startCamera()
}
</script>

<style scoped>
/* Fullscreen/mobile camera styles */
.camera-capture {
  width: 100%;
}
.camera-capture:fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #111;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  border-radius: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.camera-view {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 100vw;
  max-height: 100vh;
  margin: 0 auto;
}
.camera-capture:fullscreen .camera-view {
  border-radius: 0;
  height: 100vh;
  max-height: 100vh;
}
.captured-image {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.camera-capture:fullscreen .captured-image {
  border-radius: 0;
  height: 100vh;
  max-height: 100vh;
}
video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>

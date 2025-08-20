// Quick test to verify environment variables are loading correctly
console.log('Environment variables test:')
console.log('VITE_N8N_EMAIL_WEBHOOK_URL:', import.meta.env.VITE_N8N_EMAIL_WEBHOOK_URL)
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('All VITE_ variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')))

export {}

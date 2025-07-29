import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { provideApolloClient } from './lib/apollo-provider'

// Import PivotUI CSS (using direct path due to package.json exports mismatch)
import '/node_modules/pivotui/dist/pivotui.css'

const app = createApp(App)
provideApolloClient(app)
app.mount('#app')

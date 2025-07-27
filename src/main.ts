import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { provideApolloClient } from './lib/apollo-provider'

const app = createApp(App)
provideApolloClient(app)
app.mount('#app')

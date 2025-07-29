import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { provideApolloClient } from './lib/apollo-provider'

const app = createApp(App)
app.use(router)
provideApolloClient(app)
app.mount('#app')
